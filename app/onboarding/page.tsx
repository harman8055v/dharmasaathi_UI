"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { debugLog } from "@/lib/logger"
import OnboardingContainer from "@/components/onboarding/onboarding-container"
import LoadingScreen from "@/components/onboarding/loading-screen"
import { AlertCircle } from "lucide-react" // CORRECTED IMPORT
import { Button } from "@/components/ui/button"
import type { User } from "@supabase/supabase-js"
import type { OnboardingProfile } from "@/lib/types/onboarding"
import "./onboarding.css"

export default function OnboardingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<OnboardingProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const initializeOnboarding = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
          debugLog("Authentication failed or no user found, redirecting.", authError)
          router.push("/")
          return
        }

        debugLog("Authenticated user found:", user.id)
        setUser(user)

        // Attempt to fetch the user's profile.
        const { data: existingProfile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileError && profileError.code !== "PGRST116") {
          // 'PGRST116' is "exact one row not found"
          console.error("Error fetching profile:", profileError)
          throw new Error("Could not load your profile. Please try again.")
        }

        if (existingProfile) {
          if (existingProfile.onboarding_completed) {
            debugLog("Onboarding already complete. Redirecting to dashboard.")
            router.push("/dashboard")
            return
          }
          debugLog("Existing profile found.", existingProfile)
          setProfile(existingProfile)
        } else {
          // CRITICAL FIX: If no profile exists, create one immediately.
          // This prevents errors in later stages that assume a profile row exists.
          debugLog("No profile found. Creating a new one to prevent errors.")
          const newProfileData = {
            id: user.id, // Essential for RLS
            email: user.email, // Pre-fill email
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          const { data: newProfile, error: createError } = await supabase
            .from("users")
            .upsert(newProfileData)
            .select()
            .single()

          if (createError) {
            console.error("Failed to create initial profile:", createError)
            throw new Error("Could not initialize your profile. Please try again.")
          }
          debugLog("New profile created successfully.", newProfile)
          setProfile(newProfile)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    initializeOnboarding()
  }, [router])

  if (loading) {
    return <LoadingScreen />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 max-w-md mx-auto">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">An Error Occurred</h1>
          <p className="mt-2 text-gray-600">{error}</p>
          <Button onClick={() => router.push("/")} className="mt-6">
            Go to Homepage
          </Button>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    // This state should ideally not be reached due to the logic above, but it's a safe fallback.
    return <LoadingScreen />
  }

  return <OnboardingContainer user={user} profile={profile} setProfile={setProfile} />
}
