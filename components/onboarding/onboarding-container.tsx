"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { debugLog } from "@/lib/logger"
import { Toaster, toast } from "sonner"
import type { User } from "@supabase/supabase-js"
import type { OnboardingProfile } from "@/lib/types/onboarding"

import StageIndicator from "./stage-indicator"
import SeedStage from "./stages/seed-stage"
import StemStage from "./stages/stem-stage"
import LeavesStage from "./stages/leaves-stage"
import PetalsStage from "./stages/petals-stage"
import FullBloomStage from "./stages/full-bloom-stage"
import CompletionOverlay from "./completion-overlay"
import FullScreenLoading from "../full-screen-loading"

interface OnboardingContainerProps {
  user: User
  profile: OnboardingProfile
  setProfile: (profile: OnboardingProfile) => void
}

const STAGES = ["seed", "stem", "leaves", "petals", "full-bloom"]

export default function OnboardingContainer({ user, profile, setProfile }: OnboardingContainerProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [showCompletion, setShowCompletion] = useState(false)
  const router = useRouter()

  const handleNext = () => {
    if (currentStageIndex < STAGES.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1)
    }
  }

  const handleBack = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(currentStageIndex - 1)
    }
  }

  const updateProfile = (data: Partial<OnboardingProfile>) => {
    setProfile({ ...profile, ...data })
  }

  const submitUserProfile = async () => {
    setIsSubmitting(true)
    setSubmissionError(null)
    debugLog("Starting final profile submission...")

    const finalProfileData = {
      ...profile,
      id: user.id, // Ensure user ID is always present for RLS
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    }

    debugLog("Final profile data for upsert:", finalProfileData)

    try {
      const { error } = await supabase
        .from("users")
        .upsert(finalProfileData, {
          onConflict: "id",
        })
        .select()
        .single()

      if (error) {
        console.error("Supabase upsert error:", error)
        if (error.code === "42501") {
          // RLS violation
          throw new Error("You don't have permission to update this profile. Please sign in again.")
        }
        throw new Error(`An error occurred while saving your profile: ${error.message}`)
      }

      debugLog("Profile submitted successfully!")
      setShowCompletion(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (err: any) {
      console.error("Submission failed:", err)
      const errorMessage = err.message || "An unexpected error occurred."
      setSubmissionError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentStage = STAGES[currentStageIndex]
  const progress = ((currentStageIndex + 1) / STAGES.length) * 100

  const stageComponents: { [key: string]: React.ReactNode } = {
    seed: <SeedStage profile={profile} updateProfile={updateProfile} onNext={handleNext} user={user} />,
    stem: <StemStage profile={profile} updateProfile={updateProfile} onNext={handleNext} onBack={handleBack} />,
    leaves: <LeavesStage profile={profile} updateProfile={updateProfile} onNext={handleNext} onBack={handleBack} />,
    petals: <PetalsStage profile={profile} updateProfile={updateProfile} onNext={handleNext} onBack={handleBack} />,
    "full-bloom": (
      <FullBloomStage
        profile={profile}
        updateProfile={updateProfile}
        onBack={handleBack}
        onSubmit={submitUserProfile}
        isSubmitting={isSubmitting}
      />
    ),
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      {isSubmitting && <FullScreenLoading message="Finalizing your profile..." />}
      {showCompletion && <CompletionOverlay />}
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <header className="p-4">
          <StageIndicator stages={STAGES} currentStageIndex={currentStageIndex} progress={progress} />
        </header>
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">{stageComponents[currentStage]}</div>
        </main>
      </div>
    </>
  )
}
