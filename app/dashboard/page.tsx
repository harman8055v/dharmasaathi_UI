"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { debugLog } from "@/lib/logger"
import { Button } from "@/components/ui/button"
import { Heart, Settings, User, Shield, Users, Clock, CheckCircle, AlertCircle, Edit, Star, Zap } from "lucide-react"
import { ReferralProgram } from "@/components/dashboard/referral-program"
import MobileNav from "@/components/dashboard/mobile-nav"
import SettingsCard from "@/components/dashboard/settings-card"
import SwipeStack from "@/components/dashboard/swipe-stack"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import WelcomeSection from "@/components/dashboard/welcome-section"

export default function DashboardPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [profiles, setProfiles] = useState<any[]>([])
  const [swipeStats, setSwipeStats] = useState<any>(null)
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

        if (error) {
          console.error("Error fetching user profile:", error)
          router.push("/onboarding")
          return
        }

        // If user hasn't completed onboarding, redirect to onboarding
        if (!profileData?.onboarding_completed) {
          router.push("/onboarding")
          return
        }

        setProfile(profileData)

        // Add debugging
        console.log("Profile data:", profileData)
        console.log("Verification status:", profileData?.verification_status)
        console.log("Account status:", profileData?.account_status)

        // If verified, fetch profiles and swipe stats
        if (profileData?.verification_status === "verified" || profileData?.account_status === "active") {
          fetchProfiles()
          fetchSwipeStats()
        }

        setLoading(false)
      } catch (error) {
        console.error("Error in auth check:", error)
        router.push("/")
      }
    }

    getUser()
  }, [router])

  const fetchProfiles = async () => {
    try {
      const response = await fetch("/api/profiles/discover")
      if (response.ok) {
        const data = await response.json()
        setProfiles(data.profiles || [])
      }
    } catch (error) {
      console.error("Error fetching profiles:", error)
    }
  }

  const fetchSwipeStats = async () => {
    try {
      const response = await fetch("/api/swipe/stats")
      if (response.ok) {
        const stats = await response.json()
        setSwipeStats(stats)
      }
    } catch (error) {
      console.error("Error fetching swipe stats:", error)
    }
  }

  const calculateProfileCompleteness = () => {
    if (!profile) return 0

    const fields = [
      "first_name",
      "last_name",
      "mobile_number",
      "gender",
      "birthdate",
      "city",
      "state",
      "country",
      "mother_tongue",
      "education",
      "profession",
      "diet",
      "about_me",
    ]

    const arrayFields = ["spiritual_org", "daily_practices", "user_photos"]

    let completed = 0
    const total = fields.length + arrayFields.length

    fields.forEach((field) => {
      if (profile[field] && profile[field].toString().trim() !== "") {
        completed++
      }
    })

    arrayFields.forEach((field) => {
      if (profile[field] && Array.isArray(profile[field]) && profile[field].length > 0) {
        completed++
      }
    })

    return Math.round((completed / total) * 100)
  }

  const getNextTuesday = () => {
    const now = new Date()
    const nextTuesday = new Date()
    const daysUntilTuesday = (2 - now.getDay() + 7) % 7 || 7 // 2 = Tuesday
    nextTuesday.setDate(now.getDate() + daysUntilTuesday)
    nextTuesday.setHours(18, 0, 0, 0) // 6 PM

    return (
      nextTuesday.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }) + " at 6:00 PM IST"
    )
  }

  const handleSwipe = (direction: "left" | "right" | "superlike", profileId: string) => {
    debugLog(`Swiped ${direction} on profile ${profileId}`)
    // Refresh stats after swipe
    fetchSwipeStats()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const profileCompleteness = calculateProfileCompleteness()
  const isVerified =
    profile?.verification_status === "verified" ||
    profile?.account_status === "active"
  console.log("Is verified:", isVerified)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Mobile Navigation */}
      <MobileNav userProfile={profile} />

      {/* Main Content */}
      {isVerified ? (
        // Verified User - Swipe Interface
        <main className="h-screen pb-24">
          <SwipeStack profiles={profiles} onSwipe={handleSwipe} />
        </main>
      ) : (
        // Non-verified User - Original Dashboard with header
        <main className="pt-16 pb-32 min-h-screen flex flex-col">
          <div className="px-4 space-y-6 max-w-4xl mx-auto">
            {/* Welcome Section */}
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {profile?.first_name}! 🌸
              </h1>
              <p className="text-gray-600">Your spiritual journey continues here</p>
            </div>

            {/* Welcome Section */}
            <div>
              <WelcomeSection profile={profile} />
            </div>

            {/* Verification Status Section */}
            <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl p-6 shadow-xl shadow-orange-500/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">Profile Under Verification</h3>
                    <div className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full w-fit">
                      In Review
                    </div>
                    {profile?.fast_track_verification && (
                      <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full w-fit flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Fast Track
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Thank you for joining DharmaSaathi! Your profile is currently being reviewed by our team to ensure
                    the safety and authenticity of our spiritual community.
                    <span className="font-semibold text-blue-700">
                      {" "}
                      New verified profiles go live every Tuesday at 6:00 PM IST.
                    </span>
                    {profile?.fast_track_verification && (
                      <span className="font-semibold text-green-700">
                        {" "}
                        Your profile is in the fast-track queue for priority review!
                      </span>
                    )}
                  </p>

                  <div className="bg-white/70 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Profile Completeness</span>
                      <span className="text-sm font-bold text-blue-600">{profileCompleteness}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${profileCompleteness}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Fast Verification CTA */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-purple-800 mb-1">Want to get verified faster? ⚡</h4>
                        <p className="text-sm text-purple-700 mb-2">
                          Boost your profile credibility and jump to the front of the verification queue with our
                          referral program below! Invite <strong>4 friends</strong> and get{" "}
                          <strong>priority verification</strong>.
                        </p>
                        <button
                          onClick={() => {
                            const referralSection = document.querySelector("[data-referral-section]")
                            referralSection?.scrollIntoView({ behavior: "smooth", block: "center" })
                          }}
                          className="text-purple-600 hover:text-purple-700 font-medium text-sm underline decoration-2 underline-offset-2 transition-colors duration-200"
                        >
                          Check out referral program below ↓
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>
                        Next verification: <strong>{getNextTuesday()}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Shield className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span>Keeping our community safe & genuine</span>
                    </div>
                  </div>

                  {profileCompleteness < 80 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-amber-800 mb-1">Speed up your verification!</h4>
                          <p className="text-sm text-amber-700 mb-3">
                            Complete profiles get verified faster. Add more details to help us review your profile
                            quickly.
                          </p>
                          <Button
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700 text-white transition-all duration-200"
                            onClick={() => router.push("/dashboard/settings")}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Complete Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Referral Program Section */}
            <div data-referral-section>
              <ReferralProgram userId={user?.id || ""} userProfile={profile} />
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SettingsCard
                  title="Account Settings"
                  description="Update your personal information"
                  icon={<Settings className="w-5 h-5" />}
                  onClick={() => router.push("/dashboard/settings")}
                />
                <SettingsCard
                  title="Partner Preferences"
                  description="Set your ideal partner criteria"
                  icon={<Heart className="w-5 h-5" />}
                  onClick={() => router.push("/dashboard/preferences")}
                />
                <SettingsCard
                  title="My Profile"
                  description="View and manage your profile"
                  icon={<User className="w-5 h-5" />}
                  onClick={() => router.push("/dashboard/profile")}
                />
                <SettingsCard
                  title="Privacy & Safety"
                  description="Manage your privacy settings"
                  icon={<Shield className="w-5 h-5" />}
                  onClick={() => router.push("/dashboard/privacy")}
                />
              </div>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-orange-100 hover:shadow-2xl transition-all duration-300">
                <div className="text-center">
                  <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Matches</h3>
                  <p className="text-gray-600 mb-4">Discover compatible spiritual partners</p>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500" disabled>
                    Available After Verification
                  </Button>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-orange-100 hover:shadow-2xl transition-all duration-300">
                <div className="text-center">
                  <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
                  <p className="text-gray-600 mb-4">Connect with like-minded souls</p>
                  <Button variant="outline" className="w-full" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-orange-100 hover:shadow-2xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
                <div className="text-center">
                  <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Features</h3>
                  <p className="text-gray-600 mb-4">Unlock advanced matching</p>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}
