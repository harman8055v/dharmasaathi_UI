"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import type { OnboardingData, OnboardingProfile } from "@/lib/types/onboarding"
import { VALID_VALUES, validateEnumField } from "@/lib/types/onboarding"
import StageIndicator from "./stage-indicator"
import NavigationButtons from "./navigation-buttons"
import LotusAnimation from "./lotus-animation"
import CompletionOverlay from "./completion-overlay"

// Dynamic imports for stages
import SeedStage from "./stages/seed-stage"
import StemStage from "./stages/stem-stage"
import LeavesStage from "./stages/leaves-stage"
import PetalsStage from "./stages/petals-stage"
import FullBloomStage from "./stages/full-bloom-stage"

interface OnboardingContainerProps {
  user: User | null
  profile: OnboardingProfile
  setProfile: (profile: OnboardingProfile) => void
}

// Removes keys with null/undefined or blank-string values
function sanitizePayload<T extends Record<string, any>>(data: T): Partial<T> {
  return Object.entries(data).reduce(
    (acc, [key, val]) => {
      if (val === null || val === undefined) return acc
      if (typeof val === "string" && val.trim() === "") return acc
      acc[key as keyof T] = val
      return acc
    },
    {} as Partial<T>,
  )
}

export default function OnboardingContainer({ user, profile, setProfile }: OnboardingContainerProps) {
  const [stage, setStage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Initialize form state with null for all enum/text fields and [] for arrays
  const [formData, setFormData] = useState<OnboardingData>({
    email_verified: false,
    gender: null,
    birthdate: null,
    city: null,
    state: null,
    country: null,
    mother_tongue: null,
    education: null,
    profession: null,
    annual_income: null,
    diet: null,
    temple_visit_freq: null,
    vanaprastha_interest: null,
    artha_vs_moksha: null,
    spiritual_org: [],
    daily_practices: [],
    user_photos: [],
    about_me: null,
    partner_expectations: null,
  })

  // Initialize form data from existing profile
  useEffect(() => {
    if (profile) {
      setFormData({
        email_verified: !!user?.email_confirmed_at || profile.email_verified || false,
        gender: profile.gender || null,
        birthdate: profile.birthdate || null,
        city: profile.city || null,
        state: profile.state || null,
        country: profile.country || null,
        mother_tongue: profile.mother_tongue || null,
        education: profile.education || null,
        profession: profile.profession || null,
        annual_income: profile.annual_income || null,
        diet: profile.diet || null,
        temple_visit_freq: profile.temple_visit_freq || null,
        vanaprastha_interest: profile.vanaprastha_interest || null,
        artha_vs_moksha: profile.artha_vs_moksha || null,
        spiritual_org: profile.spiritual_org || [],
        daily_practices: profile.daily_practices || [],
        user_photos: profile.user_photos || [],
        about_me: profile.about_me || null,
        partner_expectations: profile.partner_expectations || null,
      })

      // Determine current stage based on completed data
      if (!user?.email_confirmed_at && !profile.email_verified) {
        setStage(1)
      } else if (!profile.gender || !profile.birthdate) {
        setStage(2)
      } else if (!profile.education || !profile.profession) {
        setStage(3)
      } else if (!profile.diet) {
        setStage(4)
      } else if (!profile.about_me) {
        setStage(5)
      }
    }
  }, [profile, user])

  const handleFormChange = (updates: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
    setError(null) // Clear any previous errors
  }

  // Save and next handler
  async function handleSaveAndNext() {
    setIsLoading(true)
    setError(null)

    try {
      // Get current stage data
      const stageData = getStageData()

      // Validate stage data before saving
      if (Object.keys(stageData).length > 0) {
        validateStageData(stageData, stage)

        // Sanitize the payload - removes null/undefined/empty string values
        const payload = sanitizePayload(stageData)

        console.log("Original stage data:", stageData)
        console.log("Sanitized payload:", payload)

        // Only make the database call if we have data to save
        if (Object.keys(payload).length > 0) {
          const { error: saveError } = await supabase.from("users").upsert(
            {
              id: user?.id,
              email: user?.email || profile?.email, // Always include required fields
              ...payload,
            },
            { onConflict: "id", returning: "minimal" },
          )

          if (saveError) {
            console.error("Error saving stage data:", saveError)
            throw new Error(`Failed to save data: ${saveError.message}`)
          }

          console.log("Successfully saved data")

          // Update local profile state
          setProfile((prev) => ({ ...prev, ...payload }))
        }
      }

      // Move to next stage or complete
      if (stage < 5) {
        setStage(stage + 1)
      } else {
        // Mark onboarding as complete
        const { error: completeError } = await supabase
          .from("users")
          .update({ onboarding_completed: true })
          .eq("id", user?.id)

        if (completeError) {
          throw new Error(`Failed to complete onboarding: ${completeError.message}`)
        }

        setShowCompletion(true)
        setTimeout(() => {
          router.push("/dashboard")
        }, 3000)
      }
    } catch (err) {
      console.error("Error saving stage data:", err)
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const validateStageData = (stageData: Partial<OnboardingData>, currentStage: number) => {
    switch (currentStage) {
      case 2:
        // Validate gender
        if (stageData.gender !== undefined && !validateEnumField("gender", stageData.gender)) {
          throw new Error(
            `Invalid gender value. Must be one of: ${VALID_VALUES.gender.filter((v) => v !== null).join(", ")}`,
          )
        }

        // Required fields validation
        if (!stageData.gender) {
          throw new Error("Please select your gender before proceeding.")
        }
        if (!stageData.birthdate || !stageData.city || !stageData.state || !stageData.country) {
          throw new Error("Please fill in all required fields before proceeding.")
        }
        break
      case 3:
        if (!stageData.education || !stageData.profession) {
          throw new Error("Please fill in all required fields before proceeding.")
        }
        break
      case 4:
        // Validate enum fields
        if (stageData.diet !== undefined && !validateEnumField("diet", stageData.diet)) {
          throw new Error(
            `Invalid diet value. Must be one of: ${VALID_VALUES.diet.filter((v) => v !== null).join(", ")}`,
          )
        }
        if (
          stageData.temple_visit_freq !== undefined &&
          !validateEnumField("temple_visit_freq", stageData.temple_visit_freq)
        ) {
          throw new Error(
            `Invalid temple visit frequency. Must be one of: ${VALID_VALUES.temple_visit_freq.filter((v) => v !== null).join(", ")}`,
          )
        }
        if (
          stageData.vanaprastha_interest !== undefined &&
          !validateEnumField("vanaprastha_interest", stageData.vanaprastha_interest)
        ) {
          throw new Error(
            `Invalid vanaprastha interest. Must be one of: ${VALID_VALUES.vanaprastha_interest.filter((v) => v !== null).join(", ")}`,
          )
        }
        if (
          stageData.artha_vs_moksha !== undefined &&
          !validateEnumField("artha_vs_moksha", stageData.artha_vs_moksha)
        ) {
          throw new Error(
            `Invalid artha vs moksha preference. Must be one of: ${VALID_VALUES.artha_vs_moksha.filter((v) => v !== null).join(", ")}`,
          )
        }

        if (!stageData.diet) {
          throw new Error("Please select your diet preference before proceeding.")
        }
        break
      case 5:
        if (!stageData.about_me) {
          throw new Error("Please fill in the 'About Me' section before proceeding.")
        }
        break
    }
    return true
  }

  const handleBack = () => {
    if (stage > 1) {
      setStage(stage - 1)
    }
    setError(null)
  }

  const handleSkip = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // For skip, we don't save any data, just move to the next stage
      if (stage < 5) {
        setStage(stage + 1)
      } else {
        // If skipping the final stage, still mark onboarding as complete
        const { error: completeError } = await supabase
          .from("users")
          .update({ onboarding_completed: true })
          .eq("id", user?.id)

        if (completeError) {
          throw new Error(`Failed to complete onboarding: ${completeError.message}`)
        }

        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Error skipping stage:", error)
      setError(error.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getStageData = (): Partial<OnboardingData> => {
    switch (stage) {
      case 1:
        return {
          email_verified: formData.email_verified,
        }
      case 2:
        return {
          gender: formData.gender,
          birthdate: formData.birthdate,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          mother_tongue: formData.mother_tongue,
        }
      case 3:
        return {
          education: formData.education,
          profession: formData.profession,
          annual_income: formData.annual_income,
        }
      case 4:
        return {
          spiritual_org: formData.spiritual_org,
          daily_practices: formData.daily_practices,
          diet: formData.diet,
          temple_visit_freq: formData.temple_visit_freq,
          vanaprastha_interest: formData.vanaprastha_interest,
          artha_vs_moksha: formData.artha_vs_moksha,
        }
      case 5:
        return {
          about_me: formData.about_me,
          partner_expectations: formData.partner_expectations,
          user_photos: formData.user_photos,
        }
      default:
        return {}
    }
  }

  const renderCurrentStage = () => {
    const stageProps = {
      formData,
      onChange: handleFormChange,
      onNext: handleSaveAndNext,
      isLoading,
      error,
    }

    switch (stage) {
      case 1:
        return <SeedStage {...stageProps} user={user} />
      case 2:
        return <StemStage {...stageProps} />
      case 3:
        return <LeavesStage {...stageProps} />
      case 4:
        return <PetalsStage {...stageProps} />
      case 5:
        return <FullBloomStage {...stageProps} />
      default:
        return <SeedStage {...stageProps} user={user} />
    }
  }

  if (showCompletion) {
    return <CompletionOverlay profile={profile} />
  }

  const stageTitles = [
    "Verify your email to plant the seed",
    "Let's sprout your profile",
    "Name your strengths",
    "Choose your spiritual petals",
    "Your blossom is complete—add the finishing touches!",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
      {/* Background lotus animation */}
      <LotusAnimation currentStage={stage} />

      {/* Stage indicator */}
      <StageIndicator
        currentStage={stage}
        totalStages={5}
        stageName={["Seed", "Stem", "Leaves", "Petals", "Full Bloom"][stage - 1]}
      />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Stage title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{stageTitles[stage - 1]}</h1>
            <p className="text-gray-600">
              Welcome, {profile?.first_name || "Friend"}! Let's complete your spiritual profile.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Stage content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
            {renderCurrentStage()}
          </div>

          {/* Navigation */}
          <NavigationButtons
            currentStage={stage}
            totalStages={5}
            onBack={handleBack}
            onNext={handleSaveAndNext}
            onSkip={handleSkip}
            isLoading={isLoading}
            canProceed={true}
          />
        </div>
      </div>
    </div>
  )
}
