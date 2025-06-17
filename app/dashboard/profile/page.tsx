"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Edit,
  Camera,
  MapPin,
  Briefcase,
  Heart,
  Eye,
  Users,
  Activity,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import MobileNav from "@/components/dashboard/mobile-nav"
import ProfileImageUploader from "@/components/dashboard/profile-image-uploader"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [userImages, setUserImages] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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

        const { data: profileData, error } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (error) {
          console.error("Error fetching profile:", error)
          return
        }

        setProfile(profileData)
        setUserImages(profileData.user_photos || [])
        setLoading(false)
      } catch (error) {
        console.error("Error:", error)
        router.push("/")
      }
    }

    getUser()
  }, [router])

  useEffect(() => {
    if (showPreview) {
      setCurrentImageIndex(0)
    }
  }, [showPreview])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  const calculateAge = (birthdate: string) => {
    if (!birthdate) return "N/A"
    const today = new Date()
    const birth = new Date(birthdate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <MobileNav userProfile={profile} />

      {/* Main Content with proper spacing to avoid overlap */}
      <main className="pt-24 pb-40 px-4 min-h-screen">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>
                <p className="text-sm text-gray-600">View and manage your profile</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowPreview(true)}
                variant="outline"
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={() => router.push("/dashboard/settings")}
                className="bg-gradient-to-r from-orange-500 to-pink-500"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    {userImages.length > 0 ? (
                      <img
                        src={userImages[0] || "/placeholder.svg"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-orange-200"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {profile?.first_name?.[0]}
                        {profile?.last_name?.[0]}
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {profile?.first_name} {profile?.last_name}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {calculateAge(profile?.birthdate)} years • {profile?.gender}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {profile?.city}, {profile?.state}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photo Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Profile Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileImageUploader
                  userId={user?.id || ""}
                  currentImages={userImages}
                  onImagesUpdate={setUserImages}
                />
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">
                      {profile?.birthdate ? new Date(profile.birthdate).toLocaleDateString() : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Height</p>
                    <p className="font-medium">{profile?.height || "Not specified"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mother Tongue</p>
                  <p className="font-medium">{profile?.mother_tongue || "Not specified"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Education</p>
                  <p className="font-medium">{profile?.education || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Profession</p>
                  <p className="font-medium">{profile?.profession || "Not specified"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Spiritual Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Spiritual Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Diet</p>
                  <p className="font-medium">{profile?.diet || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Temple Visit Frequency</p>
                  <p className="font-medium">{profile?.temple_visit_freq || "Not specified"}</p>
                </div>
                {profile?.spiritual_org && profile.spiritual_org.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Spiritual Organizations</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.spiritual_org.map((org: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">
                          {org}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* About Me */}
            {profile?.about_me && (
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{profile.about_me}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Family & Background */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Family & Background
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Marital Status</p>
                  <p className="font-medium">{profile?.marital_status || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Family Type</p>
                  <p className="font-medium">{profile?.family_type || "Not specified"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Family Values</p>
                  <p className="font-medium">{profile?.family_values || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Caste</p>
                  <p className="font-medium">{profile?.caste || "Not specified"}</p>
                </div>
              </div>
              {profile?.gotra && (
                <div>
                  <p className="text-sm text-gray-500">Gotra</p>
                  <p className="font-medium">{profile.gotra}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lifestyle & Habits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Lifestyle & Habits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Smoking</p>
                  <p className="font-medium">{profile?.smoking || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Drinking</p>
                  <p className="font-medium">{profile?.drinking || "Not specified"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Exercise</p>
                  <p className="font-medium">{profile?.exercise_frequency || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sleep Schedule</p>
                  <p className="font-medium">{profile?.sleep_schedule || "Not specified"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Spiritual Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Detailed Spiritual Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Meditation Practice</p>
                  <p className="font-medium">{profile?.meditation_frequency || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Yoga Practice</p>
                  <p className="font-medium">{profile?.yoga_frequency || "Not specified"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Scripture Study</p>
                  <p className="font-medium">{profile?.scripture_study || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pilgrimage Interest</p>
                  <p className="font-medium">{profile?.pilgrimage_interest || "Not specified"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Vanaprastha Interest</p>
                  <p className="font-medium">{profile?.vanaprastha_interest || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Life Philosophy</p>
                  <p className="font-medium">{profile?.artha_vs_moksha || "Not specified"}</p>
                </div>
              </div>
              {profile?.favorite_scriptures && profile.favorite_scriptures.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Favorite Scriptures</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profile.favorite_scriptures.map((scripture: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                        {scripture}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile?.spiritual_goals && profile.spiritual_goals.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Spiritual Goals</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profile.spiritual_goals.map((goal: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interests & Hobbies */}
          {(profile?.interests && profile.interests.length > 0) ||
            (profile?.hobbies && profile.hobbies.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Interests & Hobbies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile?.interests && profile.interests.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {profile?.hobbies && profile.hobbies.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Hobbies</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.hobbies.map((hobby: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                            {hobby}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

          {/* Partner Preferences */}
          {profile?.partner_expectations && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Partner Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{profile.partner_expectations}</p>
              </CardContent>
            </Card>
          )}

          {/* Profile Preview Modal */}
          {showPreview && (
            <div className="fixed inset-0 bg-black/50 z-[100000]" onClick={() => setShowPreview(false)}>
              <div className="w-full h-screen bg-white overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button
                  onClick={() => setShowPreview(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/20 rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors z-30"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="pb-32">
                  {/* Photo Gallery */}
                  {userImages && userImages.length > 0 && (
                    <div className="relative h-[50vh] bg-gray-100 overflow-hidden">
                      <div className="flex h-full">
                        <div className="w-full h-full relative">
                          <img
                            src={userImages[currentImageIndex] || "/placeholder.svg"}
                            alt={`${profile?.first_name} ${profile?.last_name}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Navigation Arrows */}
                          {userImages.length > 1 && (
                            <>
                              <button
                                onClick={() =>
                                  setCurrentImageIndex((prev) => (prev === 0 ? userImages.length - 1 : prev - 1))
                                }
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors z-20"
                              >
                                <ChevronLeft className="w-6 h-6" />
                              </button>
                              <button
                                onClick={() =>
                                  setCurrentImageIndex((prev) => (prev === userImages.length - 1 ? 0 : prev + 1))
                                }
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors z-20"
                              >
                                <ChevronRight className="w-6 h-6" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Photo Navigation Dots */}
                      {userImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
                          {userImages.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-3 h-3 rounded-full transition-all ${
                                idx === currentImageIndex ? "bg-white scale-125" : "bg-white/60 hover:bg-white/80"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    {/* Profile Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden">
                        <img
                          src={userImages[0] || "/placeholder.svg"}
                          alt={`${profile?.first_name} ${profile?.last_name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {profile?.first_name} {profile?.last_name}
                        </h3>
                        <p className="text-gray-600">{calculateAge(profile?.birthdate)} years old</p>
                      </div>
                    </div>

                    {/* About Section */}
                    {profile?.about_me && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">About Me</h4>
                        <p className="text-gray-700 leading-relaxed">{profile.about_me}</p>
                      </div>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      {profile?.city && profile?.state && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium">
                              {profile.city}, {profile.state}
                            </p>
                          </div>
                        </div>
                      )}

                      {profile?.profession && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Briefcase className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Profession</p>
                            <p className="font-medium">{profile.profession}</p>
                          </div>
                        </div>
                      )}

                      {profile?.education && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-5 h-5 text-gray-500">🎓</div>
                          <div>
                            <p className="text-sm text-gray-500">Education</p>
                            <p className="font-medium">{profile.education}</p>
                          </div>
                        </div>
                      )}

                      {profile?.diet && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Sparkles className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Diet</p>
                            <p className="font-medium">{profile.diet}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Spiritual Practices */}
                    {profile?.daily_practices && profile.daily_practices.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Daily Practices</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.daily_practices.map((practice, index) => (
                            <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                              {practice}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Spiritual Organizations */}
                    {profile?.spiritual_org && profile.spiritual_org.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Spiritual Organizations</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.spiritual_org.map((org, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                              {org}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Family & Background */}
                    {(profile?.family_type || profile?.family_values || profile?.caste) && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Family & Background</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {profile?.family_type && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Users className="w-5 h-5 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-500">Family Type</p>
                                <p className="font-medium">{profile.family_type}</p>
                              </div>
                            </div>
                          )}
                          {profile?.family_values && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Heart className="w-5 h-5 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-500">Family Values</p>
                                <p className="font-medium">{profile.family_values}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Interests & Hobbies */}
                    {((profile?.interests && profile.interests.length > 0) ||
                      (profile?.hobbies && profile.hobbies.length > 0)) && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Interests & Hobbies</h4>
                        {profile?.interests && profile.interests.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2">Interests</p>
                            <div className="flex flex-wrap gap-2">
                              {profile.interests.map((interest, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {profile?.hobbies && profile.hobbies.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-500 mb-2">Hobbies</p>
                            <div className="flex flex-wrap gap-2">
                              {profile.hobbies.map((hobby, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                  {hobby}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Partner Preferences */}
                    {profile?.partner_expectations && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Looking For</h4>
                        <p className="text-gray-700 leading-relaxed">{profile.partner_expectations}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
