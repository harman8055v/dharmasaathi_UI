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
import ProgressBar from "./progress-bar"

interface OnboardingContainerProps {
  user: User
  profile: OnboardingProfile
  setProfile: (profile: OnboardingProfile) => void
}

const STAGES = ["seed", "stem", "leaves", "petals", "full-bloom"]

export default function OnboardingContainer({ user, profile, setProfile }: OnboardingContainerProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const router = useRouter()

  const updateProfileData = (data: Partial<OnboardingProfile>) => {
    setProfile({ ...profile, ...data })
  }

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

  const submitFinalProfile = async () => {
    setIsSubmitting(true)
    debugLog("Starting final profile submission...")

    const finalProfileData = {
      ...profile,
      id: user.id,
      onboarding_completed: true,
      verification_status: "pending" as const,
      updated_at: new Date().toISOString(),
    }

    try {
      const { error } = await supabase.from("users").upsert(finalProfileData).select().single()

      if (error) throw error

      debugLog("Profile submitted successfully!")
      setShowCompletion(true)
      setTimeout(() => router.push("/dashboard"), 3000)
    } catch (err: any) {
      console.error("Submission failed:", err)
      toast.error(err.message || "An unexpected error occurred during final submission.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const stageComponents: { [key: string]: React.ComponentType<any> } = {
    seed: SeedStage,
    stem: StemStage,
    leaves: LeavesStage,
    petals: PetalsStage,
    "full-bloom": FullBloomStage,
  }

  const CurrentStageComponent = stageComponents[STAGES[currentStageIndex]]
  const progress = ((currentStageIndex + 1) / STAGES.length) * 100

  return (
    <>
      <Toaster richColors position="top-center" />
      {isSubmitting && <FullScreenLoading message="Finalizing your profile..." />}
      {showCompletion && <CompletionOverlay />}
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4">
        <header className="w-full max-w-4xl mx-auto">
          <StageIndicator stages={STAGES} currentStageIndex={currentStageIndex} progress={progress} />
          <ProgressBar progress={progress} />
        </header>
        <main className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <CurrentStageComponent
              profile={profile}
              updateProfile={updateProfileData}
              onNext={handleNext}
              onBack={handleBack}
              onSubmit={submitFinalProfile}
              isSubmitting={isSubmitting}
              user={user}
            />
          </div>
        </main>
      </div>
    </>
  )
}
