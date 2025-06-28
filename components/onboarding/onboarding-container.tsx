"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { debugLog } from "@/lib/logger"
import { toast } from "sonner"
import type { User } from "@supabase/supabase-js"
import type { OnboardingProfile, OnboardingData } from "@/lib/types/onboarding"

// Import all stage components
import SeedStage from "./stages/seed-stage"
import StemStage from "./stages/stem-stage"
import LeavesStage from "./stages/leaves-stage"
import PetalsStage from "./stages/petals-stage"
import FullBloomStage from "./stages/full-bloom-stage"

// Import UI components
import ProgressBar from "./progress-bar"
import StageIndicator from "./stage-indicator"
import NavigationButtons from "./navigation-buttons"
import CompletionOverlay from "./completion-overlay"
import FullScreenLoading from "@/components/full-screen-loading"

interface OnboardingContainerProps {
  user: User
  profile: OnboardingProfile
  setProfile: (profile: OnboardingProfile) => void
}

const STAGES = [
  { id: "seed", name: "Seed", component: SeedStage },
  { id: "stem", name: "Stem", component: StemStage },
  { id: "leaves", name: "Leaves", component: LeavesStage },
  { id: "petals", name: "Petals", component: PetalsStage },
  { id: "full-bloom", name: "Full Bloom", component: FullBloomStage },
]

export default function OnboardingContainer({ user, profile, setProfile }: OnboardingContainerProps) {
  const [currentStage, setCurrentStage] = useState(0)
  const [formData, setFormData] = useState<OnboardingData>({
    // Initialize with profile data
    gender: profile.gender,
    birthdate: profile.birthdate,
    country_id: profile.country_id,
    state_id: profile.state_id,
    city_id: profile.city_id,
    mother_tongue: profile.mother_tongue,
    education: profile.education,
    profession: profile.profession,
    annual_income: profile.annual_income,
    diet: profile.diet,
    temple_visit_freq: profile.temple_visit_freq,
    vanaprastha_interest: profile.vanaprastha_interest,
    artha_vs_moksha: profile.artha_vs_moksha,
    spiritual_org: profile.spiritual_org || [],
    daily_practices: profile.daily_practices || [],
    user_photos: profile.user_photos || [],
    about_me: profile.about_me,
    partner_expectations: profile.partner_expectations,
    favorite_spiritual_quote: profile.favorite_spiritual_quote,
    mobile_number: profile.mobile_number,
    mobile_verified: profile.mobile_verified,
    email_verified: profile.email_verified,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const updateFormData = (updates: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
    setError(null)
  }

  const goToNextStage = () => {
    if (currentStage < STAGES.length - 1) {
      setCurrentStage((prev) => prev + 1)
    }
  }

  const goToPreviousStage = () => {
    if (currentStage > 0) {
      setCurrentStage((prev) => prev - 1)
    }
  }

  const submitUserProfile = async (): Promise<boolean> => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Get current user to ensure we have the latest session
      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !currentUser) {
        throw new Error("Authentication session expired. Please sign in again.")
      }

      debugLog("Submitting profile for user:", currentUser.id)

      // Prepare the complete profile data
      const profileData = {
        id: currentUser.id,
        email: currentUser.email,
        // Basic info
        gender: formData.gender,
        birthdate: formData.birthdate,
        // Location
        country_id: formData.country_id,
        state_id: formData.state_id,
        city_id: formData.city_id,
        mother_tongue: formData.mother_tongue,
        // Professional
        education: formData.education,
        profession: formData.profession,
        annual_income: formData.annual_income,
        // Spiritual
        diet: formData.diet,
        temple_visit_freq: formData.temple_visit_freq,
        vanaprastha_interest: formData.vanaprastha_interest,
        artha_vs_moksha: formData.artha_vs_moksha,
        spiritual_org: formData.spiritual_org,
        daily_practices: formData.daily_practices,
        // Profile content
        user_photos: formData.user_photos,
        about_me: formData.about_me,
        partner_expectations: formData.partner_expectations,
        favorite_spiritual_quote: formData.favorite_spiritual_quote,
        // Verification
        mobile_number: formData.mobile_number,
        mobile_verified: formData.mobile_verified,
        email_verified: formData.email_verified,
        // Completion
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      }

      debugLog("Profile data to submit:", profileData)

      // Use upsert to handle both insert and update cases
      const { data: updatedProfile, error: submitError } = await supabase
        .from("users")
        .upsert(profileData, {
          onConflict: "id",
          ignoreDuplicates: false,
        })
        .select()
        .single()

      if (submitError) {
        console.error("Profile submission error:", submitError)

        // Handle specific error types
        if (submitError.code === "42501") {
          throw new Error("Permission denied. Please ensure you're signed in with the correct account.")
        } else if (submitError.code === "23505") {
          throw new Error("A profile with this information already exists.")
        } else if (submitError.code === "23502") {
          throw new Error("Required information is missing. Please check all fields.")
        } else {
          throw new Error(submitError.message || "Failed to save profile. Please try again.")
        }
      }

      debugLog("Profile submitted successfully:", updatedProfile)

      // Update local state
      setProfile(updatedProfile)

      // Show completion overlay
      setShowCompletion(true)

      // Redirect to dashboard after a delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)

      return true
    } catch (err: any) {
      console.error("Error submitting profile:", err)
      setError(err.message)
      toast.error(err.message)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStageSubmit = async (stageData: Partial<OnboardingData>) => {
    updateFormData(stageData)

    if (currentStage === STAGES.length - 1) {
      // Final stage - submit everything
      const success = await submitUserProfile()
      if (!success) {
        return // Stay on current stage if submission failed
      }
    } else {
      // Move to next stage
      goToNextStage()
    }
  }

  const CurrentStageComponent = STAGES[currentStage].component
  const progress = ((currentStage + 1) / STAGES.length) * 100

  if (showCompletion) {
    return <CompletionOverlay />
  }

  if (isSubmitting) {
    return (
      <FullScreenLoading message="Completing your spiritual profile..." subMessage="Encrypting your data securely" />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress indicators */}
        <div className="mb-8">
          <ProgressBar progress={progress} />
          <StageIndicator stages={STAGES.map((s) => s.name)} currentStage={currentStage} />
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Current stage */}
        <div className="max-w-4xl mx-auto">
          <CurrentStageComponent
            formData={formData}
            onChange={updateFormData}
            onNext={handleStageSubmit}
            isLoading={isSubmitting}
            user={user}
            error={error}
          />
        </div>

        {/* Navigation */}
        <div className="mt-8 max-w-4xl mx-auto">
          <NavigationButtons
            currentStage={currentStage}
            totalStages={STAGES.length}
            onPrevious={goToPreviousStage}
            onNext={() => handleStageSubmit({})}
            isLoading={isSubmitting}
            canProceed={true} // You can add validation logic here
          />
        </div>
      </div>
    </div>
  )
}
