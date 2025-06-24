"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getCurrentUser } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function AuthLoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const userId = searchParams.get("userId")
  const isNew = searchParams.get("isNew") === "true"

  useEffect(() => {
    checkUserAndRedirect()
  }, [userId, isNew])

  const checkUserAndRedirect = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get current user with dev mode support
      const { user, profile, error: userError } = await getCurrentUser()

      if (userError || !user) {
        console.error("User fetch error:", userError)
        router.push("/")
        return
      }

      if (!profile) {
        console.error("Profile not found")
        router.push("/")
        return
      }

      // Check onboarding status
      if (!profile.onboarding_completed) {
        router.push("/onboarding")
        return
      }

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Auth loading error:", error)
      setError(error.message || "An error occurred")
      setTimeout(() => router.push("/"), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <p className="text-gray-600">Redirecting to home...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {isNew ? "Setting up your profile..." : "Welcome back!"}
        </h2>
        <p className="text-gray-600">Please wait while we prepare your dashboard</p>
      </div>
    </div>
  )
}
