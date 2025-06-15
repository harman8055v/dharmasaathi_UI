"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import type { OnboardingData, OnboardingProfile } from "@/lib/types/onboarding"
import { VALID_VALUES, validateEnumField } from "@/lib/types/onboarding"
import ProgressBar from "./progress-bar"
import NavigationButtons from "./navigation-buttons"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card" // Import Card components

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
    mobile_verified: false,
    mobile_number: null, // Add this line
    gender: null,
    birthdate: null,
    city: null,
    state: null,
    country: "India", // Default to India
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
        mobile_verified: !!user?.phone_confirmed_at || profile.mobile_verified || false,
        mobile_number: profile.mobile_number || null, // Add this line
        gender: profile.gender || null,
        birthdate: profile.birthdate || null,
        city: profile.city || null,
        state: profile.state || null,
        country: profile.country || "India", // Default to India if not set
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
      // First stage is now mobile verification
      if (!user?.phone_confirmed_at && !profile.mobile_verified) {
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
  async function handleSaveAndNext(stagePayload: Partial<OnboardingData>) {
    setIsLoading(true)
    setError(null)

    try {
      const stageData = stagePayload // Use the payload passed directly from the stage

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
      case 1: // Mobile Verification Stage
        if (!stageData.mobile_verified) {
          throw new Error("Please verify your mobile number before proceeding.")
        }
        break
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

  const stageNames = [
    "Mobile Verification",
    "Personal Info",
    "Professional Info",
    "Spiritual Preferences",
    "About You & Photos",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Progress bar */}
          <ProgressBar currentStage={stage} totalStages={5} stageName={stageNames[stage - 1]} />

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-2xl mx-auto">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Stage content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 max-w-2xl mx-auto">
            {/* Render current stage based on state */}
            {stage === 1 && (
              <SeedStage
                formData={formData}
                onChange={handleFormChange}
                onNext={handleSaveAndNext}
                isLoading={isLoading}
                user={user}
                error={error}
              />
            )}
            {stage === 2 && (
              <StemStage
                formData={formData}
                onChange={handleFormChange}
                onNext={handleSaveAndNext}
                isLoading={isLoading}
                error={error}
              />
            )}
            {stage === 3 && (
              <LeavesStage
                formData={formData}
                onChange={handleFormChange}
                onNext={handleSaveAndNext}
                isLoading={isLoading}
                error={error}
              />
            )}
            {stage === 4 && (
              <PetalsStage
                formData={formData}
                onChange={handleFormChange}
                onNext={handleSaveAndNext}
                isLoading={isLoading}
                error={error}
              />
            )}
            {stage === 5 && (
              <FullBloomStage
                formData={formData}
                onChange={handleFormChange}
                onNext={handleSaveAndNext}
                isLoading={isLoading}
                error={error}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="max-w-2xl mx-auto">
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

          {/* Trust Section at the bottom */}
          <Card className="mt-8 max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Image src="/logo.png" alt="DharmaSaathi Logo" width={120} height={40} className="mb-4" />
              <p className="text-sm text-gray-600">
                {
                  "Your data is safe with DharmaSaathi. We are committed to protecting your privacy and ensuring a secure experience."
                }
              </p>
              <p className="text-xs text-gray-500 mt-2">{"Learn more about our privacy policy."}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
