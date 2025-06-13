"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import OnboardingContainer from "@/components/onboarding/onboarding-container"
import LoadingScreen from "@/components/onboarding/loading-screen"
import type { User } from "@supabase/supabase-js"
import "./onboarding.css" // Import critical CSS

export default function OnboardingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/")
          return
        }

        setUser(user)

        // Fetch user profile data
        const { data: profileData, error } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching user profile:", error)
        }

        // If user has completed onboarding, redirect to dashboard
        if (profileData?.onboarding_completed) {
          router.push("/dashboard")
          return
        }

        setProfile(profileData || { id: user.id, email: user.email })
        setLoading(false)
      } catch (error) {
        console.error("Error in auth check:", error)
        router.push("/")
      }
    }

    getUser()
  }, [router])

  if (loading) {
    return <LoadingScreen />
  }

  return <OnboardingContainer user={user} profile={profile} setProfile={setProfile} />
}
