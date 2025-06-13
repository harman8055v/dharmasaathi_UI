"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Heart, Settings, LogOut } from "lucide-react"
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
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Your Spiritual Journey! 🌸</h2>
          <p className="text-xl text-gray-700">Your profile is complete. Start connecting with like-minded souls.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-100">
            <div className="text-center">
              <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Matches</h3>
              <p className="text-gray-600 mb-4">Discover compatible spiritual partners</p>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500">Start Matching</Button>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-100">
            <div className="text-center">
              <Settings className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Edit Profile</h3>
              <p className="text-gray-600 mb-4">Update your spiritual preferences</p>
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-100">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Messages</h3>
              <p className="text-gray-600 mb-4">Connect with your matches</p>
              <Button variant="outline" className="w-full">
                View Messages
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-orange-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Profile Summary</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Basic Information</h4>
              <p className="text-gray-600">
                Name: {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-gray-600">Email: {profile?.email}</p>
              {profile?.city && (
                <p className="text-gray-600">
                  Location: {profile.city}, {profile.state}
                </p>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Spiritual Preferences</h4>
              {profile?.spiritual_org && <p className="text-gray-600">Organization: {profile.spiritual_org}</p>}
              {profile?.diet && <p className="text-gray-600">Diet: {profile.diet}</p>}
              {profile?.temple_visit_freq && (
                <p className="text-gray-600">Temple Visits: {profile.temple_visit_freq}</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
