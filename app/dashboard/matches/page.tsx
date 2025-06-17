"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, X, Star, MapPin, GraduationCap, Briefcase, Calendar, MessageCircle, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import MobileNav from "@/components/dashboard/mobile-nav"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export default function MatchesPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
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
      mutual_likes: false,
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
      mutual_likes: false,
      last_active: "5 hours ago",
      user_photos: ["/abstract-spiritual-avatar-4.png"],
      spiritual_org: ["Brahma Kumaris", "Heartfulness"],
      about_me: "Helping people find inner peace through counseling and spiritual guidance.",
      match_date: "2024-01-12",
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
        }

        setLoading(false)
      } catch (error) {
        console.error("Error in auth check:", error)
        router.push("/")
      }
    }

    getUser()
  }, [router])

  const filteredMatches = matches.filter(
    (match) =>
      match.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.profession.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleMessage = (matchId: string) => {
    router.push(`/dashboard/messages?chat=${matchId}`)
  }

  const handleLike = (matchId: string) => {
    // Handle like action
    console.log("Liked match:", matchId)
  }

  const handlePass = (matchId: string) => {
    // Handle pass action
    setMatches(matches.filter((match) => match.id !== matchId))
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

              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search matches by name, city, or profession..."
                    className="pl-10 bg-white/80 backdrop-blur-sm border-orange-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="bg-white/80 backdrop-blur-sm border-orange-200">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Match Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-orange-100">
                  <div className="text-2xl font-bold text-pink-600">{matches.length}</div>
                  <div className="text-sm text-gray-600">Total Matches</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-orange-100">
                  <div className="text-2xl font-bold text-green-600">
                    {matches.filter((m) => m.mutual_likes).length}
                  </div>
                  <div className="text-sm text-gray-600">Mutual Likes</div>
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
                {filteredMatches.length > 0 ? (
                  filteredMatches.map((match) => (
                    <Card
                      key={match.id}
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm border-orange-100"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <img
                              src={match.user_photos[0] || "/placeholder.svg"}
                              alt={match.first_name}
                              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            {match.mutual_likes && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                                <Heart className="w-3 h-3 text-white fill-current" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold text-gray-900">
                                  {match.first_name} {match.last_name}
                                </h3>
                                <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                  {match.compatibility}% Match
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">Active {match.last_active}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{match.age} years old</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>
                                  {match.city}, {match.state}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />
                                <span>{match.profession}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <GraduationCap className="w-3 h-3" />
                                <span>{match.education}</span>
                              </div>
                            </div>

                            <p className="text-gray-700 text-sm mb-3 line-clamp-2">{match.about_me}</p>

                            <div className="flex flex-wrap gap-1 mb-4">
                              {match.spiritual_org.slice(0, 2).map((org, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                                >
                                  {org}
                                </span>
                              ))}
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handlePass(match.id)}
                                  className="rounded-full w-10 h-10 p-0 border-gray-300 hover:border-red-300 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleLike(match.id)}
                                  className="rounded-full w-10 h-10 p-0 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                                >
                                  <Heart className="w-4 h-4 text-white" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-full w-10 h-10 p-0 border-yellow-300 hover:border-yellow-400 hover:bg-yellow-50"
                                >
                                  <Star className="w-4 h-4 text-yellow-500" />
                                </Button>
                              </div>

                              {match.mutual_likes && (
                                <Button
                                  size="sm"
                                  onClick={() => handleMessage(match.id)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Message
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No matches found</h3>
                    <p className="text-gray-500">Try adjusting your search or check back later for new matches!</p>
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
