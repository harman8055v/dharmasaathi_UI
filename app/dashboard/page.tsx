"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Heart, Settings, LogOut, Phone, Mail, Clock, Shield, CheckCircle, AlertCircle, Edit, Star } from "lucide-react"
import type { User } from "@supabase/supabase-js"

export default function DashboardPage() {
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
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-900">DharmaSaathi</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {profile?.first_name}!</span>
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
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Verification Status Section */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900">Profile Under Verification</h3>
                <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  In Review
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Thank you for joining DharmaSaathi! Your profile is currently being reviewed by our team to ensure the
                safety and authenticity of our spiritual community.
                <span className="font-semibold text-blue-700">
                  {" "}
                  New verified profiles go live every Tuesday at 6:00 PM IST.
                </span>
              </p>

              <div className="bg-white/70 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Profile Completeness</span>
                  <span className="text-sm font-bold text-blue-600">{profileCompleteness}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${profileCompleteness}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
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
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-1">Speed up your verification!</h4>
                      <p className="text-sm text-amber-700 mb-2">
                        Complete profiles get verified faster. Add more details to help us review your profile quickly.
                      </p>
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                        <Edit className="w-4 h-4 mr-2" />
                        Complete Profile
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-600 italic">
                🙏 Thank you for your patience and understanding as we work to maintain the highest standards for our
                spiritual community.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Your Spiritual Journey! 🌸</h2>
          <p className="text-xl text-gray-700">
            Your profile is being reviewed. Meanwhile, explore what DharmaSaathi has to offer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-100">
            <div className="text-center">
              <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Matches</h3>
              <p className="text-gray-600 mb-4">Discover compatible spiritual partners</p>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500" disabled>
                Available After Verification
              </Button>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-100">
            <div className="text-center">
              <Settings className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Edit Profile</h3>
              <p className="text-gray-600 mb-4">Update your spiritual preferences</p>
              <Button variant="outline" className="w-full">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-100">
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

        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-orange-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Profile Summary</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Basic Information</h4>
              <div className="space-y-2">
                <p className="text-gray-600">
                  Name: {profile?.first_name} {profile?.last_name}
                </p>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{profile?.email}</span>
                </div>
                {profile?.mobile_number && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{profile.mobile_number}</span>
                  </div>
                )}
                {profile?.city && (
                  <p className="text-gray-600">
                    Location: {profile.city}, {profile.state}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Spiritual Preferences</h4>
              <div className="space-y-2">
                {profile?.spiritual_org && profile.spiritual_org.length > 0 && (
                  <p className="text-gray-600">Organizations: {profile.spiritual_org.join(", ")}</p>
                )}
                {profile?.diet && <p className="text-gray-600">Diet: {profile.diet}</p>}
                {profile?.temple_visit_freq && (
                  <p className="text-gray-600">Temple Visits: {profile.temple_visit_freq}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
