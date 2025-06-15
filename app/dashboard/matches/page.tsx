"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, X, Star, MapPin, GraduationCap, Briefcase, Calendar, Sparkles, Lock } from "lucide-react"
import MobileNav from "@/components/dashboard/mobile-nav"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export default function MatchesPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading matches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 pb-20">
      <MobileNav userProfile={profile} />

      <main className="pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Spiritual Match 💕</h1>
            <p className="text-gray-600">Discover compatible souls on the same spiritual journey</p>
          </div>

          {/* Verification Required Notice */}
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Matches Available After Verification</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Your profile is currently under review. Once verified, you'll be able to see and connect with
                  compatible spiritual partners in our community.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Check Verification Status
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard/settings")}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    Complete Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Cards (Blurred) */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Preview: What You'll See After Verification</h2>

            {/* Sample Match Cards */}
            {[1, 2, 3].map((index) => (
              <Card key={index} className="relative overflow-hidden">
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">Available after verification</p>
                  </div>
                </div>
                <CardContent className="p-6 filter blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🧘‍♀️</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">Spiritual Seeker</h3>
                        <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          98% Match
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>25 years old</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>Mumbai, Maharashtra</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          <span>Masters in Psychology</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          <span>Yoga Instructor</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-3 text-sm">
                        "Seeking a spiritual companion to share life's journey. Love meditation, yoga, and exploring
                        ancient wisdom..."
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 mt-6">
                    <Button size="lg" variant="outline" className="rounded-full w-16 h-16 p-0">
                      <X className="w-6 h-6 text-gray-500" />
                    </Button>
                    <Button size="lg" className="rounded-full w-16 h-16 p-0 bg-gradient-to-r from-pink-500 to-red-500">
                      <Heart className="w-6 h-6 text-white" />
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-full w-16 h-16 p-0 border-yellow-300">
                      <Star className="w-6 h-6 text-yellow-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Preview */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-100 text-center">
              <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Matching</h3>
              <p className="text-gray-600 text-sm">
                AI-powered compatibility based on spiritual beliefs, values, and lifestyle
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-100 text-center">
              <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Super Likes</h3>
              <p className="text-gray-600 text-sm">
                Stand out with Super Likes to show genuine interest in special connections
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-100 text-center">
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Features</h3>
              <p className="text-gray-600 text-sm">
                Advanced filters, unlimited likes, and priority matching for serious seekers
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
