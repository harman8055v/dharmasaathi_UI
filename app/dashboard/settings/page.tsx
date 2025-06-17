"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, User, Heart, Briefcase, Users, Activity, Target } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import MobileNav from "@/components/dashboard/mobile-nav"

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

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

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

        const { data: profileData, error } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (error) {
          console.error("Error fetching profile:", error)
          return
        }

        setProfile(profileData)
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
      const { error } = await supabase.from("users").update(profile).eq("id", profile.id)

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

  const toggleArrayItem = (field: string, item: string) => {
    setProfile((prev: any) => {
      const currentArray = prev[field] || []
      const newArray = currentArray.includes(item)
        ? currentArray.filter((i: string) => i !== item)
        : [...currentArray, item]
      return { ...prev, [field]: newArray }
    })
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
                <CardContent className="space-y-4">
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
                      <Label htmlFor="gender">Gender</Label>
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

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={profile?.city || ""}
                        onChange={(e) => updateProfile("city", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={profile?.state || ""}
                        onChange={(e) => updateProfile("state", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={profile?.country || ""}
                        onChange={(e) => updateProfile("country", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Family & Background */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Family & Background
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="marital_status">Marital Status</Label>
                        <Select
                          value={profile?.marital_status || ""}
                          onValueChange={(value) => updateProfile("marital_status", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
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
                        <Label htmlFor="family_type">Family Type</Label>
                        <Select
                          value={profile?.family_type || ""}
                          onValueChange={(value) => updateProfile("family_type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Joint Family">Joint Family</SelectItem>
                            <SelectItem value="Nuclear Family">Nuclear Family</SelectItem>
                            <SelectItem value="Extended Family">Extended Family</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="family_values">Family Values</Label>
                        <Select
                          value={profile?.family_values || ""}
                          onValueChange={(value) => updateProfile("family_values", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select values" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Traditional">Traditional</SelectItem>
                            <SelectItem value="Moderate">Moderate</SelectItem>
                            <SelectItem value="Liberal">Liberal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="caste">Caste</Label>
                        <Input
                          id="caste"
                          value={profile?.caste || ""}
                          onChange={(e) => updateProfile("caste", e.target.value)}
                        />
                      </div>
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
                      <Label htmlFor="annual_income">Annual Income</Label>
                      <Select
                        value={profile?.annual_income || ""}
                        onValueChange={(value) => updateProfile("annual_income", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select income range" />
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="diet">Diet Preference</Label>
                      <Select value={profile?.diet || ""} onValueChange={(value) => updateProfile("diet", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select diet" />
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
                      <Label htmlFor="temple_visit_freq">Temple Visit Frequency</Label>
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

                  {/* Advanced Spiritual Practices */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="meditation_frequency">Meditation Practice</Label>
                      <Select
                        value={profile?.meditation_frequency || ""}
                        onValueChange={(value) => updateProfile("meditation_frequency", value)}
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
                    <div>
                      <Label htmlFor="yoga_frequency">Yoga Practice</Label>
                      <Select
                        value={profile?.yoga_frequency || ""}
                        onValueChange={(value) => updateProfile("yoga_frequency", value)}
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="scripture_study">Scripture Study</Label>
                      <Select
                        value={profile?.scripture_study || ""}
                        onValueChange={(value) => updateProfile("scripture_study", value)}
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
                    <div>
                      <Label htmlFor="pilgrimage_interest">Pilgrimage Interest</Label>
                      <Select
                        value={profile?.pilgrimage_interest || ""}
                        onValueChange={(value) => updateProfile("pilgrimage_interest", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select interest" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Very High">Very High</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="None">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vanaprastha_interest">Vanaprastha Interest</Label>
                      <Select
                        value={profile?.vanaprastha_interest || ""}
                        onValueChange={(value) => updateProfile("vanaprastha_interest", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select interest" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="open">Open to Discussion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="artha_vs_moksha">Life Philosophy</Label>
                      <Select
                        value={profile?.artha_vs_moksha || ""}
                        onValueChange={(value) => updateProfile("artha_vs_moksha", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select philosophy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Artha-focused">Artha-focused (Material)</SelectItem>
                          <SelectItem value="Moksha-focused">Moksha-focused (Spiritual)</SelectItem>
                          <SelectItem value="Balance">Balanced Approach</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Spiritual Organizations */}
                  <div>
                    <Label>Spiritual Organizations</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                      {SPIRITUAL_ORGANIZATIONS.map((org) => (
                        <div key={org} className="flex items-center space-x-2">
                          <Checkbox
                            id={`org-${org}`}
                            checked={profile?.spiritual_org?.includes(org) || false}
                            onCheckedChange={() => toggleArrayItem("spiritual_org", org)}
                          />
                          <Label htmlFor={`org-${org}`} className="text-sm">
                            {org}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Daily Practices */}
                  <div>
                    <Label>Daily Spiritual Practices</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                      {DAILY_PRACTICES.map((practice) => (
                        <div key={practice} className="flex items-center space-x-2">
                          <Checkbox
                            id={`practice-${practice}`}
                            checked={profile?.daily_practices?.includes(practice) || false}
                            onCheckedChange={() => toggleArrayItem("daily_practices", practice)}
                          />
                          <Label htmlFor={`practice-${practice}`} className="text-sm">
                            {practice}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Favorite Scriptures */}
                  <div>
                    <Label>Favorite Scriptures</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                      {SCRIPTURES.map((scripture) => (
                        <div key={scripture} className="flex items-center space-x-2">
                          <Checkbox
                            id={`scripture-${scripture}`}
                            checked={profile?.favorite_scriptures?.includes(scripture) || false}
                            onCheckedChange={() => toggleArrayItem("favorite_scriptures", scripture)}
                          />
                          <Label htmlFor={`scripture-${scripture}`} className="text-sm">
                            {scripture}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Spiritual Goals */}
                  <div>
                    <Label>Spiritual Goals</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                      {SPIRITUAL_GOALS.map((goal) => (
                        <div key={goal} className="flex items-center space-x-2">
                          <Checkbox
                            id={`goal-${goal}`}
                            checked={profile?.spiritual_goals?.includes(goal) || false}
                            onCheckedChange={() => toggleArrayItem("spiritual_goals", goal)}
                          />
                          <Label htmlFor={`goal-${goal}`} className="text-sm">
                            {goal}
                          </Label>
                        </div>
                      ))}
                    </div>
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
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smoking">Smoking</Label>
                      <Select value={profile?.smoking || ""} onValueChange={(value) => updateProfile("smoking", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
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
                      <Label htmlFor="drinking">Drinking</Label>
                      <Select
                        value={profile?.drinking || ""}
                        onValueChange={(value) => updateProfile("drinking", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="exercise_frequency">Exercise Frequency</Label>
                      <Select
                        value={profile?.exercise_frequency || ""}
                        onValueChange={(value) => updateProfile("exercise_frequency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Daily">Daily</SelectItem>
                          <SelectItem value="4-6 times a week">4-6 times a week</SelectItem>
                          <SelectItem value="2-3 times a week">2-3 times a week</SelectItem>
                          <SelectItem value="Once a week">Once a week</SelectItem>
                          <SelectItem value="Rarely">Rarely</SelectItem>
                          <SelectItem value="Never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="sleep_schedule">Sleep Schedule</Label>
                      <Select
                        value={profile?.sleep_schedule || ""}
                        onValueChange={(value) => updateProfile("sleep_schedule", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select schedule" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Early Bird (Before 10 PM)">Early Bird (Before 10 PM)</SelectItem>
                          <SelectItem value="Regular (10 PM - 12 AM)">Regular (10 PM - 12 AM)</SelectItem>
                          <SelectItem value="Night Owl (After 12 AM)">Night Owl (After 12 AM)</SelectItem>
                          <SelectItem value="Irregular">Irregular</SelectItem>
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
                  {/* Interests */}
                  <div>
                    <Label>Interests</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                      {INTERESTS.map((interest) => (
                        <div key={interest} className="flex items-center space-x-2">
                          <Checkbox
                            id={`interest-${interest}`}
                            checked={profile?.interests?.includes(interest) || false}
                            onCheckedChange={() => toggleArrayItem("interests", interest)}
                          />
                          <Label htmlFor={`interest-${interest}`} className="text-sm">
                            {interest}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hobbies */}
                  <div>
                    <Label>Hobbies</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                      {HOBBIES.map((hobby) => (
                        <div key={hobby} className="flex items-center space-x-2">
                          <Checkbox
                            id={`hobby-${hobby}`}
                            checked={profile?.hobbies?.includes(hobby) || false}
                            onCheckedChange={() => toggleArrayItem("hobbies", hobby)}
                          />
                          <Label htmlFor={`hobby-${hobby}`} className="text-sm">
                            {hobby}
                          </Label>
                        </div>
                      ))}
                    </div>
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
