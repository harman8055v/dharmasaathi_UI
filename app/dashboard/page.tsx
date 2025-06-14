"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
  Heart,
  Settings,
  LogOut,
  Phone,
  Mail,
  Clock,
  Shield,
  CheckCircle,
  AlertCircle,
  Edit,
  Star,
  Zap,
} from "lucide-react"
import { ReferralProgram } from "@/components/dashboard/referral-program"
import type { User } from "@supabase/supabase-js"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
        setLoading(false)
      } catch (error) {
        console.error("Error in auth check:", error)
        router.push("/")
      }
    }

    getUser()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
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

    return nextTuesday.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const profileCompleteness = calculateProfileCompleteness()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <header className="bg-white/90 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">DharmaSaathi</h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:block text-gray-700">Welcome, {profile?.first_name}!</span>
              <span className="sm:hidden text-sm text-gray-700">Hi, {profile?.first_name}!</span>

              {/* Mobile menu button */}
              <div className="sm:hidden">
                <Button variant="outline" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>

              {/* Desktop buttons */}
              <div className="hidden sm:flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden border-t border-orange-100 py-3 bg-white/95 backdrop-blur-sm">
              <div className="flex flex-col gap-2">
                <Button variant="ghost" className="justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Verification Status Section */}
        <div className="mb-6 sm:mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Profile Under Verification</h3>
                <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full w-fit">
                  In Review
                </div>
                {profile?.fast_track_verification && (
                  <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full w-fit flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Fast Track
                  </div>
                )}
              </div>
              <p className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">
                Thank you for joining DharmaSaathi! Your profile is currently being reviewed by our team to ensure the
                safety and authenticity of our spiritual community.
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

              <div className="bg-white/70 rounded-lg p-3 sm:p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Profile Completeness</span>
                  <span className="text-xs sm:text-sm font-bold text-blue-600">{profileCompleteness}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${profileCompleteness}%` }}
                  ></div>
                </div>
              </div>

              {/* Fast Verification CTA */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3 sm:p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-purple-800 mb-1 text-sm sm:text-base">
                      Want to get verified faster? ⚡
                    </h4>
                    <p className="text-xs sm:text-sm text-purple-700 mb-2">
                      Boost your profile credibility and jump to the front of the verification queue with our referral
                      program below! Invite 4 friends and get <strong>priority verification</strong> plus{" "}
                      <strong>14 days of premium features</strong> absolutely free.
                    </p>
                    <button
                      onClick={() => {
                        const referralSection = document.querySelector("[data-referral-section]")
                        referralSection?.scrollIntoView({ behavior: "smooth", block: "center" })
                      }}
                      className="text-purple-600 hover:text-purple-700 font-medium text-sm underline decoration-2 underline-offset-2"
                    >
                      Check out referral program below ↓
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>
                    Next verification: <strong className="block sm:inline">{getNextTuesday()}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>Keeping our community safe & genuine</span>
                </div>
              </div>

              {profileCompleteness < 80 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-amber-800 mb-1 text-sm sm:text-base">
                        Speed up your verification!
                      </h4>
                      <p className="text-xs sm:text-sm text-amber-700 mb-3">
                        Complete profiles get verified faster. Add more details to help us review your profile quickly.
                      </p>
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto">
                        <Edit className="w-4 h-4 mr-2" />
                        Complete Profile
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-xs sm:text-sm text-gray-600 italic">
                🙏 Thank you for your patience and understanding as we work to maintain the highest standards for our
                spiritual community.
              </p>
            </div>
          </div>
        </div>

        {/* Referral Program Section */}
        <div className="mb-6 sm:mb-8" data-referral-section>
          <ReferralProgram userId={user?.id || ""} userProfile={profile} />
        </div>

        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Welcome to Your Spiritual Journey! 🌸
          </h2>
          <p className="text-base sm:text-xl text-gray-700 px-4">
            Your profile is being reviewed. Meanwhile, explore what DharmaSaathi has to offer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Find Matches</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Discover compatible spiritual partners</p>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-sm sm:text-base" disabled>
                Available After Verification
              </Button>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <Settings className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Edit Profile</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Update your spiritual preferences</p>
              <Button variant="outline" className="w-full text-sm sm:text-base">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <div className="text-center">
              <Star className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Premium Features</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Unlock advanced matching</p>
              <Button variant="outline" className="w-full text-sm sm:text-base">
                Learn More
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-8 shadow-lg border border-orange-100">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Your Profile Summary</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-base sm:text-lg">Basic Information</h4>
              <div className="space-y-3">
                <p className="text-sm sm:text-base text-gray-600">
                  <span className="font-medium">Name:</span> {profile?.first_name} {profile?.last_name}
                </p>
                {profile?.email ? (
                  <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="break-all">{profile.email}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <button
                      className="text-orange-600 hover:text-orange-700 font-medium underline"
                      onClick={() => {
                        console.log("Add email clicked")
                      }}
                    >
                      Add Email & Verify
                    </button>
                  </div>
                )}
                {profile?.mobile_number && (
                  <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{profile.mobile_number}</span>
                  </div>
                )}
                {profile?.city && (
                  <p className="text-sm sm:text-base text-gray-600">
                    <span className="font-medium">Location:</span> {profile.city}, {profile.state}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-base sm:text-lg">Spiritual Preferences</h4>
              <div className="space-y-3">
                {profile?.spiritual_org && profile.spiritual_org.length > 0 && (
                  <p className="text-sm sm:text-base text-gray-600">
                    <span className="font-medium">Organizations:</span> {profile.spiritual_org.join(", ")}
                  </p>
                )}
                {profile?.diet && (
                  <p className="text-sm sm:text-base text-gray-600">
                    <span className="font-medium">Diet:</span> {profile.diet}
                  </p>
                )}
                {profile?.temple_visit_freq && (
                  <p className="text-sm sm:text-base text-gray-600">
                    <span className="font-medium">Temple Visits:</span> {profile.temple_visit_freq}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
