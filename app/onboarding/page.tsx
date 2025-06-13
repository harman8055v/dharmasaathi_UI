"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import OnboardingContainer from "@/components/onboarding/onboarding-container"
import LoadingScreen from "@/components/onboarding/loading-screen"
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
    async function getUser() {
      try {
        // Get the current user session
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          console.error("Auth error:", userError)
          setError("Authentication error. Please try signing in again.")
          setTimeout(() => router.push("/"), 3000)
          return
        }

        if (!user) {
          console.log("No authenticated user found, redirecting to homepage")
          router.push("/")
          return
        }

        console.log("Authenticated user found:", user.id)
        setUser(user)

        // Fetch user profile data
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileError) {
          if (profileError.code === "PGRST116") {
            // No profile found, create one with required fields
            console.log("No profile found, creating new profile")
            const newProfile: Partial<OnboardingProfile> = {
              id: user.id,
              email: user.email!, // Email is required and comes from auth
              first_name: user.user_metadata?.first_name || null,
              last_name: user.user_metadata?.last_name || null,
              mobile_number: user.user_metadata?.mobile_number || null,
              onboarding_completed: false,
              // Initialize all enum fields as null
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
              email_verified: !!user.email_confirmed_at, // Set based on auth status
            }

            const { data: insertedProfile, error: insertError } = await supabase
              .from("users")
              .insert(newProfile)
              .select()
              .single()

            if (insertError) {
              console.error("Error creating profile:", insertError)
              // Use the local profile if insert fails, but ensure email is set
              setProfile({ ...newProfile, email: user.email! } as OnboardingProfile)
            } else {
              setProfile(insertedProfile)
            }
          } else {
            console.error("Error fetching user profile:", profileError)
            setError("Error loading profile. Please try again.")
            setTimeout(() => router.push("/"), 3000)
            return
          }
        } else {
          // Profile found
          console.log("Profile found:", profileData)

          // If user has completed onboarding, redirect to dashboard
          if (profileData?.onboarding_completed) {
            console.log("Onboarding already completed, redirecting to dashboard")
            router.push("/dashboard")
            return
          }

          // Ensure email is set (it should be from the database)
          if (!profileData.email) {
            profileData.email = user.email!
          }

          // Ensure email_verified is set based on auth status if not already set
          if (profileData.email_verified === null || profileData.email_verified === undefined) {
            profileData.email_verified = !!user.email_confirmed_at
          }

          setProfile(profileData)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error in auth check:", error)
        setError("An unexpected error occurred. Please try again.")
        setTimeout(() => router.push("/"), 3000)
      }
    }

    getUser()
  }, [router])

  if (loading) {
    return <LoadingScreen />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500">Redirecting you back to the homepage...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="text-center p-8">
          <div className="text-orange-500 text-6xl mb-4">🔄</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Setting up your profile...</h1>
          <p className="text-gray-600">Please wait while we prepare your onboarding experience.</p>
        </div>
      </div>
    )
  }

  return <OnboardingContainer user={user} profile={profile} setProfile={setProfile} />
}
