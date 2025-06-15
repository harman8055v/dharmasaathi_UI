"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Camera, MapPin, Briefcase, Heart } from "lucide-react"
import MobileNav from "@/components/dashboard/mobile-nav"
import ProfileImageUploader from "@/components/dashboard/profile-image-uploader"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [userImages, setUserImages] = useState<string[]>([])

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
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600">View and manage your profile</p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/dashboard/settings")}
              className="bg-gradient-to-r from-orange-500 to-pink-500"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
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
        </div>
      </main>
    </div>
  )
}
