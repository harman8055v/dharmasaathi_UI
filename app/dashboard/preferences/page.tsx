"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Heart, Users, MapPin } from "lucide-react"
import MobileNav from "@/components/dashboard/mobile-nav"
import { toast, Toaster } from "sonner"

export default function PartnerPreferencesPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const [preferences, setPreferences] = useState({
    preferred_age_min: "",
    preferred_age_max: "",
    preferred_location: "",
    preferred_education: "",
    preferred_profession: "",
    preferred_diet: "",
    preferred_spiritual_org: [] as string[],
    preferred_temple_visit_freq: "",
    preferred_height_min: "",
    preferred_height_max: "",
  })

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
        setPreferences({
          preferred_age_min: profileData.preferred_age_min?.toString() || "",
          preferred_age_max: profileData.preferred_age_max?.toString() || "",
          preferred_location: profileData.preferred_location || "",
          preferred_education: profileData.preferred_education || "",
          preferred_profession: profileData.preferred_profession || "",
          preferred_diet: profileData.preferred_diet || "",
          preferred_spiritual_org: profileData.preferred_spiritual_org || [],
          preferred_temple_visit_freq: profileData.preferred_temple_visit_freq || "",
          preferred_height_min: profileData.preferred_height_min?.toString() || "",
          preferred_height_max: profileData.preferred_height_max?.toString() || "",
        })
        setLoading(false)
      } catch (error) {
        console.error("Error:", error)
        router.push("/")
      }
    }

    getUser()
  }, [router])

  const handleSave = async () => {
    setSaving(true)
    try {
      const updateData = {
        ...preferences,
        preferred_age_min: preferences.preferred_age_min ? Number.parseInt(preferences.preferred_age_min) : null,
        preferred_age_max: preferences.preferred_age_max ? Number.parseInt(preferences.preferred_age_max) : null,
        preferred_height_min: preferences.preferred_height_min
          ? Number.parseInt(preferences.preferred_height_min)
          : null,
        preferred_height_max: preferences.preferred_height_max
          ? Number.parseInt(preferences.preferred_height_max)
          : null,
      }

      const { error } = await supabase.from("users").update(updateData).eq("id", user.id)

      if (error) throw error

      toast.success("Partner preferences updated successfully!")
      setProfile({ ...profile, ...updateData })
    } catch (error) {
      console.error("Error updating preferences:", error)
      toast.error("Failed to update partner preferences. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <MobileNav userProfile={profile} />

      <main className="pt-24 pb-40 px-4 min-h-screen">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Partner Preferences</h1>
              <p className="text-gray-600">Set your ideal partner criteria</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Basic Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Basic Preferences
                </CardTitle>
                <CardDescription>Define your basic partner requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Age Range</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="number"
                        placeholder="Min age"
                        value={preferences.preferred_age_min}
                        onChange={(e) => setPreferences({ ...preferences, preferred_age_min: e.target.value })}
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Max age"
                        value={preferences.preferred_age_max}
                        onChange={(e) => setPreferences({ ...preferences, preferred_age_max: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Height Range (cm)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="number"
                        placeholder="Min height"
                        value={preferences.preferred_height_min}
                        onChange={(e) => setPreferences({ ...preferences, preferred_height_min: e.target.value })}
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Max height"
                        value={preferences.preferred_height_max}
                        onChange={(e) => setPreferences({ ...preferences, preferred_height_max: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location & Background */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location & Background
                </CardTitle>
                <CardDescription>Specify location and educational preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="preferred_location">Preferred Location</Label>
                  <Input
                    id="preferred_location"
                    value={preferences.preferred_location}
                    onChange={(e) => setPreferences({ ...preferences, preferred_location: e.target.value })}
                    placeholder="City, State or Country"
                  />
                </div>

                <div>
                  <Label htmlFor="preferred_education">Education Level</Label>
                  <Select
                    value={preferences.preferred_education}
                    onValueChange={(value) => setPreferences({ ...preferences, preferred_education: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select education preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high_school">High School</SelectItem>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                      <SelectItem value="professional">Professional Degree</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="preferred_profession">Profession</Label>
                  <Input
                    id="preferred_profession"
                    value={preferences.preferred_profession}
                    onChange={(e) => setPreferences({ ...preferences, preferred_profession: e.target.value })}
                    placeholder="Preferred profession or field"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Spiritual Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Spiritual Preferences
                </CardTitle>
                <CardDescription>Define spiritual and lifestyle preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="preferred_diet">Diet Preference</Label>
                  <Select
                    value={preferences.preferred_diet}
                    onValueChange={(value) => setPreferences({ ...preferences, preferred_diet: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="non_vegetarian">Non-Vegetarian</SelectItem>
                      <SelectItem value="jain_vegetarian">Jain Vegetarian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="preferred_temple_visit_freq">Temple Visit Frequency</Label>
                  <Select
                    value={preferences.preferred_temple_visit_freq}
                    onValueChange={(value) => setPreferences({ ...preferences, preferred_temple_visit_freq: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select temple visit preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="occasionally">Occasionally</SelectItem>
                      <SelectItem value="festivals_only">Festivals Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </div>
      </main>
      <Toaster position="top-center" />
    </div>
  )
}
