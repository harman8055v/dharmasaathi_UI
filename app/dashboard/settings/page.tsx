"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, User, Heart, Briefcase, Users, Activity, Target, Check } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MobileNav from "@/components/dashboard/mobile-nav"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LocationSelector, { type LocationFormState } from "@/components/location-selector"

const SPIRITUAL_ORGANIZATIONS = [
  "ISKCON",
  "Art of Living",
  "Isha Foundation",
  "Brahma Kumaris",
  "Chinmaya Mission",
  "Ramakrishna Mission",
  "Satsang Foundation",
  "Radha Soami",
  "Osho International",
  "Ananda Marga",
  "Self-Realization Fellowship",
  "Transcendental Meditation",
  "Vipassana Meditation",
  "Arya Samaj",
  "RSS",
  "VHP",
  "Bharat Sevashram Sangha",
]

const DAILY_PRACTICES = [
  "Morning Prayer",
  "Evening Prayer",
  "Meditation",
  "Yoga",
  "Pranayama",
  "Mantra Chanting",
  "Scripture Reading",
  "Kirtan/Bhajan",
  "Seva (Service)",
  "Fasting",
  "Pilgrimage",
  "Satsang",
  "Japa",
  "Aarti",
  "Puja",
]

const SCRIPTURES = [
  "Bhagavad Gita",
  "Ramayana",
  "Mahabharata",
  "Vedas",
  "Upanishads",
  "Puranas",
  "Yoga Sutras",
  "Brahma Sutra",
  "Guru Granth Sahib",
  "Tripitaka",
  "Agamas",
  "Tantras",
  "Bhagavata Purana",
]

const SPIRITUAL_GOALS = [
  "Self-Realization",
  "Moksha",
  "Inner Peace",
  "Spiritual Growth",
  "Service to Humanity",
  "Divine Love",
  "Wisdom",
  "Compassion",
  "Detachment",
  "Mindfulness",
  "God Realization",
  "Liberation",
]

const INTERESTS = [
  "Reading",
  "Music",
  "Dance",
  "Art",
  "Cooking",
  "Gardening",
  "Travel",
  "Photography",
  "Writing",
  "Sports",
  "Movies",
  "Nature",
  "Volunteering",
  "Learning Languages",
  "Philosophy",
  "History",
  "Science",
  "Technology",
]

const HOBBIES = [
  "Painting",
  "Singing",
  "Playing Instruments",
  "Crafts",
  "Collecting",
  "Board Games",
  "Puzzles",
  "Hiking",
  "Swimming",
  "Cycling",
  "Running",
  "Martial Arts",
  "Dancing",
  "Pottery",
  "Knitting",
  "Woodworking",
]

// Multi-Selection Component
const MultiSelectCard = ({
  options,
  values = [],
  onChange,
  className = "",
  maxHeight = "max-h-48",
}: {
  options: string[]
  values: string[]
  onChange: (values: string[]) => void
  className?: string
  maxHeight?: string
}) => {
  const toggleItem = (item: string) => {
    const newValues = values.includes(item) ? values.filter((v) => v !== item) : [...values, item]
    onChange(newValues)
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-3 gap-2 overflow-y-auto border rounded-lg p-3",
        maxHeight,
        className,
      )}
    >
      {options.map((option) => (
        <div
          key={option}
          onClick={() => toggleItem(option)}
          className={cn(
            "cursor-pointer rounded-md px-3 py-2 text-sm transition-all hover:shadow-sm",
            values.includes(option)
              ? "bg-orange-100 border border-orange-300 text-orange-800"
              : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="truncate">{option}</span>
            {values.includes(option) && <Check className="w-3 h-3 text-orange-600 ml-1 flex-shrink-0" />}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  // Location state
  const [locationState, setLocationState] = useState<LocationFormState>({
    country_id: null,
    state_id: null,
    city_id: null,
  })

  useEffect(() => {
    async function getProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/")
          return
        }

        // Fetch from users table using session user id
        const { data: profileData, error } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (error) {
          console.error("Error fetching profile:", error)
          return
        }

        setProfile(profileData)

        // Set location state from profile data
        setLocationState({
          country_id: profileData.country_id || null,
          state_id: profileData.state_id || null,
          city_id: profileData.city_id || null,
        })

        setLoading(false)
      } catch (error) {
        console.error("Error:", error)
        router.push("/")
      }
    }

    getProfile()
  }, [router])

  const handleSave = async () => {
    if (!profile) return

    setSaving(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Update users table with location IDs
      const { error } = await supabase
        .from("users")
        .update({
          ...profile,
          country_id: locationState.country_id,
          state_id: locationState.state_id,
          city_id: locationState.city_id,
        })
        .eq("id", user.id)

      if (error) {
        console.error("Error updating profile:", error)
        alert("Error updating profile. Please try again.")
      } else {
        alert("Profile updated successfully!")
        router.push("/dashboard/profile")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error updating profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const updateProfile = (field: string, value: any) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleLocationChange = (newLocation: LocationFormState) => {
    setLocationState(newLocation)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <MobileNav userProfile={profile} />

      <main className="pt-24 pb-40 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Profile</h1>
                <p className="text-sm text-gray-600">Update your profile information</p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-orange-500 to-pink-500">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="spiritual">Spiritual</TabsTrigger>
              <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
              <TabsTrigger value="interests">Interests</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={profile?.first_name || ""}
                        onChange={(e) => updateProfile("first_name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={profile?.last_name || ""}
                        onChange={(e) => updateProfile("last_name", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="birthdate">Date of Birth</Label>
                      <Input
                        id="birthdate"
                        type="date"
                        value={profile?.birthdate || ""}
                        onChange={(e) => updateProfile("birthdate", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <Select value={profile?.gender || ""} onValueChange={(value) => updateProfile("gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        placeholder="e.g., 5'8&quot;"
                        value={profile?.height || ""}
                        onChange={(e) => updateProfile("height", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mother_tongue">Mother Tongue</Label>
                      <Input
                        id="mother_tongue"
                        value={profile?.mother_tongue || ""}
                        onChange={(e) => updateProfile("mother_tongue", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Location Section */}
                  <div className="pt-4 border-t">
                    <LocationSelector
                      value={locationState}
                      onChange={handleLocationChange}
                      required={false}
                      showLabels={true}
                    />
                  </div>

                  {/* Family & Background */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Family & Background
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Marital Status</Label>
                        <Select
                          value={profile?.marital_status || ""}
                          onValueChange={(value) => updateProfile("marital_status", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select marital status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Never Married">Never Married</SelectItem>
                            <SelectItem value="Divorced">Divorced</SelectItem>
                            <SelectItem value="Widowed">Widowed</SelectItem>
                            <SelectItem value="Separated">Separated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Family Type</Label>
                        <Select
                          value={profile?.family_type || ""}
                          onValueChange={(value) => updateProfile("family_type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select family type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Joint Family">Joint Family</SelectItem>
                            <SelectItem value="Nuclear Family">Nuclear Family</SelectItem>
                            <SelectItem value="Extended Family">Extended Family</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Family Values</Label>
                        <Select
                          value={profile?.family_values || ""}
                          onValueChange={(value) => updateProfile("family_values", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select family values" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Traditional">Traditional</SelectItem>
                            <SelectItem value="Moderate">Moderate</SelectItem>
                            <SelectItem value="Liberal">Liberal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="caste">Caste</Label>
                          <Input
                            id="caste"
                            value={profile?.caste || ""}
                            onChange={(e) => updateProfile("caste", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="gotra">Gotra</Label>
                          <Input
                            id="gotra"
                            value={profile?.gotra || ""}
                            onChange={(e) => updateProfile("gotra", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Professional Information
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="education">Education</Label>
                        <Input
                          id="education"
                          value={profile?.education || ""}
                          onChange={(e) => updateProfile("education", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="profession">Profession</Label>
                        <Input
                          id="profession"
                          value={profile?.profession || ""}
                          onChange={(e) => updateProfile("profession", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Annual Income</Label>
                      <Select
                        value={profile?.annual_income || ""}
                        onValueChange={(value) => updateProfile("annual_income", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select annual income" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Below 3 Lakhs">Below ₹3 Lakhs</SelectItem>
                          <SelectItem value="3-5 Lakhs">₹3-5 Lakhs</SelectItem>
                          <SelectItem value="5-10 Lakhs">₹5-10 Lakhs</SelectItem>
                          <SelectItem value="10-15 Lakhs">₹10-15 Lakhs</SelectItem>
                          <SelectItem value="15-25 Lakhs">₹15-25 Lakhs</SelectItem>
                          <SelectItem value="25-50 Lakhs">₹25-50 Lakhs</SelectItem>
                          <SelectItem value="Above 50 Lakhs">Above ₹50 Lakhs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="about_me">About Me</Label>
                    <Textarea
                      id="about_me"
                      rows={4}
                      value={profile?.about_me || ""}
                      onChange={(e) => updateProfile("about_me", e.target.value)}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Spiritual Information */}
            <TabsContent value="spiritual">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Spiritual Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Spiritual Preferences */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Diet Preference</Label>
                      <Select value={profile?.diet || ""} onValueChange={(value) => updateProfile("diet", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select diet preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="Vegan">Vegan</SelectItem>
                          <SelectItem value="Eggetarian">Eggetarian</SelectItem>
                          <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Temple Visit Frequency</Label>
                      <Select
                        value={profile?.temple_visit_freq || ""}
                        onValueChange={(value) => updateProfile("temple_visit_freq", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Daily">Daily</SelectItem>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Rarely">Rarely</SelectItem>
                          <SelectItem value="Never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Multi-select sections */}
                  <div>
                    <Label>Spiritual Organizations</Label>
                    <MultiSelectCard
                      options={SPIRITUAL_ORGANIZATIONS}
                      values={profile?.spiritual_org || []}
                      onChange={(values) => updateProfile("spiritual_org", values)}
                    />
                  </div>

                  <div>
                    <Label>Daily Spiritual Practices</Label>
                    <MultiSelectCard
                      options={DAILY_PRACTICES}
                      values={profile?.daily_practices || []}
                      onChange={(values) => updateProfile("daily_practices", values)}
                    />
                  </div>

                  <div>
                    <Label>Favorite Scriptures</Label>
                    <MultiSelectCard
                      options={SCRIPTURES}
                      values={profile?.favorite_scriptures || []}
                      onChange={(values) => updateProfile("favorite_scriptures", values)}
                    />
                  </div>

                  <div>
                    <Label>Spiritual Goals</Label>
                    <MultiSelectCard
                      options={SPIRITUAL_GOALS}
                      values={profile?.spiritual_goals || []}
                      onChange={(values) => updateProfile("spiritual_goals", values)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Lifestyle */}
            <TabsContent value="lifestyle">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Lifestyle & Habits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Smoking</Label>
                      <Select value={profile?.smoking || ""} onValueChange={(value) => updateProfile("smoking", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select smoking habit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Never">Never</SelectItem>
                          <SelectItem value="Occasionally">Occasionally</SelectItem>
                          <SelectItem value="Regularly">Regularly</SelectItem>
                          <SelectItem value="Trying to Quit">Trying to Quit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Drinking</Label>
                      <Select
                        value={profile?.drinking || ""}
                        onValueChange={(value) => updateProfile("drinking", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select drinking habit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Never">Never</SelectItem>
                          <SelectItem value="Socially">Socially</SelectItem>
                          <SelectItem value="Occasionally">Occasionally</SelectItem>
                          <SelectItem value="Regularly">Regularly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Interests & Hobbies */}
            <TabsContent value="interests">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Interests & Hobbies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Interests</Label>
                    <MultiSelectCard
                      options={INTERESTS}
                      values={profile?.interests || []}
                      onChange={(values) => updateProfile("interests", values)}
                    />
                  </div>

                  <div>
                    <Label>Hobbies</Label>
                    <MultiSelectCard
                      options={HOBBIES}
                      values={profile?.hobbies || []}
                      onChange={(values) => updateProfile("hobbies", values)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Partner Preferences */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Partner Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="partner_expectations">What are you looking for in a partner?</Label>
                    <Textarea
                      id="partner_expectations"
                      rows={6}
                      value={profile?.partner_expectations || ""}
                      onChange={(e) => updateProfile("partner_expectations", e.target.value)}
                      placeholder="Describe your ideal partner and what you're looking for in a relationship..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Bottom Save Button */}
          <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 h-12 text-lg font-semibold"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? "Saving Changes..." : "Save All Changes"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
