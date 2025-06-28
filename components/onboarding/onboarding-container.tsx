"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { debugLog } from "@/lib/logger"
import type { User } from "@supabase/supabase-js"
import type { OnboardingData, OnboardingProfile } from "@/lib/types/onboarding"
import ProgressBar from "./progress-bar"
import NavigationButtons from "./navigation-buttons"
import FullScreenLoading from "@/components/full-screen-loading"
import SeedStage from "./stages/seed-stage"
import StemStage from "./stages/stem-stage"
import LeavesStage from "./stages/leaves-stage"
import PetalsStage from "./stages/petals-stage"
import FullBloomStage from "./stages/full-bloom-stage"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface OnboardingContainerProps {
  user: User
  profile: OnboardingProfile
  setProfile: (profile: OnboardingProfile) => void
}

export default function OnboardingContainer({ user, profile, setProfile }: OnboardingContainerProps) {
  const [stage, setStage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState<OnboardingData>(() => ({
    ...profile,
    email_verified: !!user?.email_confirmed_at || profile.email_verified || false,
    mobile_verified: !!user?.phone_confirmed_at || profile.mobile_verified || false,
  }))

  useEffect(() => {
    // Determine starting stage based on profile completeness
    if (!formData.mobile_verified) setStage(1)
    else if (!formData.gender || !formData.birthdate || !formData.height) setStage(2)
    else if (!formData.education || !formData.profession) setStage(3)
    else if (!formData.diet) setStage(4)
    else if (!formData.about_me || (formData.user_photos || []).length === 0) setStage(5)
    else setStage(5) // Default to last stage if everything else is filled
  }, [formData])

  const handleFormChange = (updates: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
    setError(null)
  }

  // This is the definitive, RLS-safe upsert function.
  async function submitUserProfile(profileData: Partial<OnboardingData>) {
    // Always use the user ID from the authenticated session.
    if (!user?.id) {
      throw new Error("Authentication session expired. Please log in again.")
    }

    // Prepare the data for upsert. The `id` is crucial for RLS.
    const dataToUpsert = {
      ...profileData,
      id: user.id, // This ensures the RLS policy `auth.uid() = id` passes.
      updated_at: new Date().toISOString(),
    }

    debugLog("Upserting data to 'users' table:", dataToUpsert)

    const { data, error: upsertError } = await supabase.from("users").upsert(dataToUpsert).select().single()

    if (upsertError) {
      console.error("FATAL: Supabase upsert error:", upsertError)
      // Provide a clear, user-friendly error for RLS violations.
      if (upsertError.code === "42501") {
        throw new Error(
          "Security policy violation. You do not have permission to edit this profile. Please re-authenticate and try again.",
        )
      }
      // Provide a generic but helpful error for other database issues.
      throw new Error(`A database error occurred: ${upsertError.message}. Please try again.`)
    }

    debugLog("Upsert successful:", data)
    return data as OnboardingProfile
  }

  const handleSaveAndNext = async (stagePayload: Partial<OnboardingData>) => {
    setIsLoading(true)
    setError(null)

    try {
      // Submit the data from the current stage.
      const updatedProfile = await submitUserProfile(stagePayload)
      // Update the local profile state with the confirmed data from the database.
      setProfile(updatedProfile)
      setFormData(updatedProfile)

      if (stage < 5) {
        setStage(stage + 1)
      } else {
        // Final submission on the last stage.
        await submitUserProfile({ onboarding_completed: true, verification_status: "pending" })
        setShowCompletion(true)
        setTimeout(() => router.push("/dashboard"), 4000)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    if (stage > 1) setStage(stage - 1)
  }

  const stageComponents: { [key: number]: React.ComponentType<any> } = {
    1: SeedStage,
    2: StemStage,
    3: LeavesStage,
    4: PetalsStage,
    5: FullBloomStage,
  }
  const CurrentStageComponent = stageComponents[stage]

  if (showCompletion) {
    return (
      <FullScreenLoading
        title="Profile Complete!"
        subtitle="Your spiritual journey is ready to begin."
        messages={[
          "Finalizing your sacred profile...",
          "Encrypting your personal data...",
          "Preparing your spiritual matches...",
          "Welcome to your dharma journey!",
        ]}
      />
    )
  }

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <ProgressBar currentStage={stage} totalStages={5} />

        {error && (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-4">
          <CurrentStageComponent
            formData={formData}
            onChange={handleFormChange}
            onNext={handleSaveAndNext}
            isLoading={isLoading}
            user={user}
            error={error}
          />
        </div>

        <NavigationButtons
          currentStage={stage}
          totalStages={5}
          onBack={handleBack}
          // The 'onNext' for the button is a no-op because each stage's primary button now triggers its own submission.
          // This is a placeholder to satisfy the component's prop requirements.
          onNext={() => {}}
          isLoading={isLoading}
          canProceed={true} // Logic for this can be handled within each stage if needed.
        />
      </div>
    </div>
  )
}
