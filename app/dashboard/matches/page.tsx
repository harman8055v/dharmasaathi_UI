"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Star, MapPin, Briefcase, Calendar, MessageCircle, Lock } from "lucide-react"
import MobileNav from "@/components/dashboard/mobile-nav"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export default function MatchesPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState<any[]>([])
  const [likesReceived, setLikesReceived] = useState<any[]>([])
  const [superlikesReceived, setSuperlikesReceived] = useState<any[]>([])
  const router = useRouter()

  // Mock matches data for verified users
  const mockMatches = [
    {
      id: "1",
      first_name: "Priya",
      last_name: "Sharma",
      age: 28,
      city: "Mumbai",
      state: "Maharashtra",
      profession: "Software Engineer",
      education: "B.Tech Computer Science",
      diet: "Vegetarian",
      compatibility: 98,
      mutual_likes: true,
      last_active: "2 hours ago",
      user_photos: ["/abstract-spiritual-avatar-1.png"],
      spiritual_org: ["Art of Living", "Isha Foundation"],
      about_me: "Passionate about spirituality and technology. Love practicing yoga and meditation daily.",
      match_date: "2024-01-15",
    },
    {
      id: "2",
      first_name: "Ananya",
      last_name: "Reddy",
      age: 29,
      city: "Hyderabad",
      state: "Telangana",
      profession: "Teacher",
      education: "M.Ed",
      diet: "Vegan",
      compatibility: 95,
      mutual_likes: true,
      last_active: "1 day ago",
      user_photos: ["/abstract-spiritual-avatar-2.png"],
      spiritual_org: ["Osho International", "Vipassana"],
      about_me: "Teaching is my passion, and I believe in nurturing young minds with spiritual values.",
      match_date: "2024-01-14",
    },
    {
      id: "3",
      first_name: "Kavya",
      last_name: "Nair",
      age: 26,
      city: "Kochi",
      state: "Kerala",
      profession: "Yoga Instructor",
      education: "B.A. Philosophy",
      diet: "Vegetarian",
      compatibility: 92,
      mutual_likes: true,
      last_active: "3 hours ago",
      user_photos: ["/abstract-spiritual-avatar-3.png"],
      spiritual_org: ["Sivananda Yoga", "Ramana Maharshi Foundation"],
      about_me: "Dedicated to spreading the ancient wisdom of yoga and meditation.",
      match_date: "2024-01-13",
    },
    {
      id: "4",
      first_name: "Meera",
      last_name: "Gupta",
      age: 27,
      city: "Delhi",
      state: "Delhi",
      profession: "Counselor",
      education: "M.A. Psychology",
      diet: "Vegetarian",
      compatibility: 89,
      mutual_likes: true,
      last_active: "5 hours ago",
      user_photos: ["/abstract-spiritual-avatar-4.png"],
      spiritual_org: ["Brahma Kumaris", "Heartfulness"],
      about_me: "Helping people find inner peace through counseling and spiritual guidance.",
      match_date: "2024-01-12",
    },
  ]

  // Mock likes received data
  const mockLikesReceived = [
    {
      id: "like1",
      first_name: "Arjun",
      age: 30,
      city: "Bangalore",
      user_photos: ["/abstract-spiritual-avatar-1.png"],
      liked_at: "2024-01-16",
    },
    {
      id: "like2",
      first_name: "Rohit",
      age: 32,
      city: "Pune",
      user_photos: ["/abstract-spiritual-avatar-2.png"],
      liked_at: "2024-01-15",
    },
    {
      id: "like3",
      first_name: "Vikram",
      age: 29,
      city: "Chennai",
      user_photos: ["/abstract-spiritual-avatar-3.png"],
      liked_at: "2024-01-14",
    },
  ]

  // Mock superlikes received data
  const mockSuperlikesReceived = [
    {
      id: "super1",
      first_name: "Karan",
      age: 31,
      city: "Mumbai",
      user_photos: ["/abstract-spiritual-avatar-4.png"],
      superliked_at: "2024-01-16",
    },
    {
      id: "super2",
      first_name: "Aditya",
      age: 28,
      city: "Delhi",
      user_photos: ["/abstract-spiritual-avatar-1.png"],
      superliked_at: "2024-01-15",
    },
  ]

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

        // Set matches based on verification status
        if (profileData?.verification_status === "verified") {
          setMatches(mockMatches)
          setLikesReceived(mockLikesReceived)
          setSuperlikesReceived(mockSuperlikesReceived)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error in auth check:", error)
        router.push("/")
      }
    }

    getUser()
  }, [router])

  const handleMessage = (matchId: string) => {
    router.push(`/dashboard/messages?chat=${matchId}`)
  }

  const canSeeWhoLikes = () => {
    const plan = profile?.account_status || "drishti"
    return ["sangam", "samarpan", "elite"].includes(plan)
  }

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

  const isVerified = profile?.verification_status === "verified"

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <MobileNav userProfile={profile} />

      <main className="pt-24 pb-40 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {isVerified ? (
            // Verified User - Full Matches Interface
            <>
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900 mb-1">Your Matches</h1>
                <p className="text-sm text-gray-600">Connect with compatible spiritual souls</p>
              </div>

              {/* Likes & Superlikes Received Section */}
              <div className="mb-8 space-y-6">
                {/* Likes Received */}
                <Card className="bg-white/90 backdrop-blur-sm border-pink-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Heart className="w-5 h-5 text-pink-500" />
                      <span>Likes Received ({likesReceived.length})</span>
                      {!canSeeWhoLikes() && <Lock className="w-4 h-4 text-gray-400" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {canSeeWhoLikes() ? (
                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {likesReceived.map((like) => (
                          <div key={like.id} className="flex-shrink-0 text-center">
                            <div className="relative">
                              <img
                                src={like.user_photos[0] || "/placeholder.svg"}
                                alt={like.first_name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-pink-200"
                              />
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                                <Heart className="w-3 h-3 text-white fill-current" />
                              </div>
                            </div>
                            <p className="text-sm font-medium text-gray-900 mt-2">{like.first_name}</p>
                            <p className="text-xs text-gray-500">
                              {like.age}, {like.city}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="flex gap-4 overflow-x-auto pb-2 blur-sm">
                          {likesReceived.map((like) => (
                            <div key={like.id} className="flex-shrink-0 text-center">
                              <div className="relative">
                                <img
                                  src={like.user_photos[0] || "/placeholder.svg"}
                                  alt="Blurred profile"
                                  className="w-16 h-16 rounded-full object-cover border-2 border-pink-200"
                                />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                                  <Heart className="w-3 h-3 text-white fill-current" />
                                </div>
                              </div>
                              <p className="text-sm font-medium text-gray-900 mt-2">???</p>
                              <p className="text-xs text-gray-500">??, ???</p>
                            </div>
                          ))}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
                          <div className="text-center p-4">
                            <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-900 mb-2">Upgrade to see who likes you</p>
                            <Button
                              size="sm"
                              onClick={() => router.push("/dashboard/store")}
                              className="bg-pink-600 hover:bg-pink-700"
                            >
                              Upgrade Plan
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Superlikes Received */}
                <Card className="bg-white/90 backdrop-blur-sm border-yellow-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span>Super Likes Received ({superlikesReceived.length})</span>
                      {!canSeeWhoLikes() && <Lock className="w-4 h-4 text-gray-400" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {canSeeWhoLikes() ? (
                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {superlikesReceived.map((superlike) => (
                          <div key={superlike.id} className="flex-shrink-0 text-center">
                            <div className="relative">
                              <img
                                src={superlike.user_photos[0] || "/placeholder.svg"}
                                alt={superlike.first_name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-yellow-200"
                              />
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                                <Star className="w-3 h-3 text-white fill-current" />
                              </div>
                            </div>
                            <p className="text-sm font-medium text-gray-900 mt-2">{superlike.first_name}</p>
                            <p className="text-xs text-gray-500">
                              {superlike.age}, {superlike.city}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="flex gap-4 overflow-x-auto pb-2 blur-sm">
                          {superlikesReceived.map((superlike) => (
                            <div key={superlike.id} className="flex-shrink-0 text-center">
                              <div className="relative">
                                <img
                                  src={superlike.user_photos[0] || "/placeholder.svg"}
                                  alt="Blurred profile"
                                  className="w-16 h-16 rounded-full object-cover border-2 border-yellow-200"
                                />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                                  <Star className="w-3 h-3 text-white fill-current" />
                                </div>
                              </div>
                              <p className="text-sm font-medium text-gray-900 mt-2">???</p>
                              <p className="text-xs text-gray-500">??, ???</p>
                            </div>
                          ))}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
                          <div className="text-center p-4">
                            <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-900 mb-2">Upgrade to see who super liked you</p>
                            <Button
                              size="sm"
                              onClick={() => router.push("/dashboard/store")}
                              className="bg-yellow-600 hover:bg-yellow-700"
                            >
                              Upgrade Plan
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Match Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-orange-100">
                  <div className="text-2xl font-bold text-pink-600">{matches.length}</div>
                  <div className="text-sm text-gray-600">Total Matches</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-orange-100">
                  <div className="text-2xl font-bold text-green-600">{likesReceived.length}</div>
                  <div className="text-sm text-gray-600">Likes Received</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-orange-100">
                  <div className="text-2xl font-bold text-blue-600">
                    {matches.filter((m) => m.last_active.includes("hour")).length}
                  </div>
                  <div className="text-sm text-gray-600">Active Today</div>
                </div>
              </div>

              {/* Matches List */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Matches</h2>
                {matches.length > 0 ? (
                  <div className="grid gap-4">
                    {matches.map((match) => (
                      <Card
                        key={match.id}
                        className="overflow-hidden hover:shadow-md transition-all duration-200 bg-white/95 backdrop-blur-sm border-0 shadow-sm"
                      >
                        <CardContent className="p-0">
                          <div className="flex items-center gap-4 p-4">
                            {/* Profile Image */}
                            <div className="relative flex-shrink-0">
                              <img
                                src={match.user_photos[0] || "/placeholder.svg"}
                                alt={match.first_name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                              />
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                  {match.first_name} {match.last_name}
                                </h3>
                                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                  Active {match.last_active}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {match.age}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {match.city}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-3 h-3" />
                                  {match.profession}
                                </span>
                              </div>

                              <p className="text-sm text-gray-700 line-clamp-1 mb-3">{match.about_me}</p>

                              {/* Spiritual Organizations */}
                              <div className="flex flex-wrap gap-1 mb-3">
                                {match.spiritual_org.slice(0, 2).map((org, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full border border-orange-100"
                                  >
                                    {org}
                                  </span>
                                ))}
                                {match.spiritual_org.length > 2 && (
                                  <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-100">
                                    +{match.spiritual_org.length - 2} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Chat Button - Full Width */}
                          <div className="border-t border-gray-100">
                            <Button
                              onClick={() => handleMessage(match.id)}
                              className="w-full h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-none rounded-b-lg font-medium"
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Start Conversation
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-10 h-10 text-pink-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No matches yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      Keep swiping to discover your perfect spiritual companion. Your journey to meaningful connections
                      starts with each swipe!
                    </p>
                    <Button
                      onClick={() => router.push("/dashboard")}
                      className="mt-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                    >
                      Start Swiping
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Non-verified User - Original content
            <>
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900 mb-1">Your Matches</h1>
                <p className="text-sm text-gray-600">Discover compatible souls on the same spiritual journey</p>
              </div>

              {/* Verification Required Notice */}
              <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
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
            </>
          )}
        </div>
      </main>
    </div>
  )
}
