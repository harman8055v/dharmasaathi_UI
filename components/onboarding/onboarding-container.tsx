"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase" // Corrected import path
import type { User } from "@supabase/supabase-js"
import dynamic from "next/dynamic"
import StageIndicator from "./stage-indicator"
import NavigationButtons from "./navigation-buttons"

// Dynamically import stage components for code splitting
const SeedStage = dynamic(() => import("./stages/seed-stage"))
const StemStage = dynamic(() => import("./stages/stem-stage"))
const LeavesStage = dynamic(() => import("./stages/leaves-stage"))
const PetalsStage = dynamic(() => import("./stages/petals-stage"))
const FullBloomStage = dynamic(() => import("./stages/full-bloom-stage"))
const CompletionOverlay = dynamic(() => import("./completion-overlay"))

// Lazy load the lotus animation
const LotusAnimation = dynamic(() => import("./lotus-animation"), {
  ssr: false,
  loading: () => <div className="h-32 w-32" />,
})

interface OnboardingContainerProps {
  user: User | null
  profile: any
  setProfile: (profile: any) => void
}

const stages = [
  { name: "Seed", component: SeedStage },
  { name: "Stem", component: StemStage },
  { name: "Leaves", component: LeavesStage },
  { name: "Petals", component: PetalsStage },
  { name: "Full Bloom", component: FullBloomStage },
]

export default function OnboardingContainer({ user, profile, setProfile }: OnboardingContainerProps) {
  const [currentStage, setCurrentStage] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [firstName, setFirstName] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Extract first name from profile or email
    if (profile) {
      if (profile.first_name) {
        setFirstName(profile.first_name)
      } else if (profile.email) {
        // Extract name from email as fallback
        const emailName = profile.email.split("@")[0]
        setFirstName(emailName.charAt(0).toUpperCase() + emailName.slice(1))
      }
    }
  }, [profile])

  const CurrentStageComponent = stages[currentStage].component

  const handleNext = async (data: any) => {
    try {
      setIsSubmitting(true)

      // Update profile state with new data
      const updatedProfile = { ...profile, ...data }
      setProfile(updatedProfile)

      // Save to Supabase
      const { error } = await supabase.from("users").upsert(updatedProfile, { onConflict: "id" })

      if (error) throw error

      // Move to next stage or complete
      if (currentStage < stages.length - 1) {
        setCurrentStage(currentStage + 1)
      } else {
        // Mark onboarding as complete
        await supabase.from("users").update({ onboarding_completed: true }).eq("id", profile.id)

        setShowCompletion(true)

        // Redirect after showing completion overlay
        setTimeout(() => {
          router.push("/dashboard")
        }, 3000)
      }
    } catch (error) {
      console.error("Error saving data:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1)
    }
  }

  const handleSkip = async () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1)
    } else {
      // Mark onboarding as complete even if skipped
      await supabase.from("users").update({ onboarding_completed: true }).eq("id", profile.id)

      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with lotus animation */}
      <header className="pt-6 px-4 flex flex-col items-center">
        <div className="w-32 h-32 mb-2">
          <LotusAnimation stage={currentStage} />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-center text-foreground">Welcome, {firstName}!</h1>
        <p className="text-center text-muted-foreground mt-2">Let's complete your profile</p>
      </header>

      {/* Floating stage indicator */}
      <StageIndicator currentStage={currentStage} totalStages={stages.length} stageName={stages[currentStage].name} />

      {/* Main content area */}
      <main className="flex-1 px-4 py-6 max-w-md mx-auto w-full">
        <CurrentStageComponent profile={profile} onSubmit={handleNext} isSubmitting={isSubmitting} />
      </main>

      {/* Navigation buttons */}
      <NavigationButtons
        currentStage={currentStage}
        isSubmitting={isSubmitting}
        onBack={handleBack}
        onSkip={handleSkip}
      />

      {/* Completion overlay */}
      {showCompletion && <CompletionOverlay />}
    </div>
  )
}
