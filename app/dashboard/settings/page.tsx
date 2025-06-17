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

// Custom Selection Component
const SelectionCard = ({
  options,
  value,
  onChange,
  className = "",
}: {
  options: { value: string; label: string; description?: string }[]
  value: string
  onChange: (value: string) => void
  className?: string
}) => {
  return (
    <div className={cn("grid gap-3", className)}>
      {options.map((option) => (
        <div
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "relative cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md",
            value === option.value
              ? "border-orange-500 bg-orange-50 shadow-sm"
              : "border-gray-200 bg-white hover:border-gray-300",
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-medium text-gray-900">{option.label}</div>
              {option.description && <div className="text-sm text-gray-600 mt-1">{option.description}</div>}
            </div>
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                value === option.value ? "border-orange-500 bg-orange-500" : "border-gray-300",
              )}
            >
              {value === option.value && <Check className="w-3 h-3 text-white" />}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

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
                      <SelectionCard
                        options={[
                          { value: "Male", label: "Male" },
                          { value: "Female", label: "Female" },
                          { value: "Other", label: "Other" },
                        ]}
                        value={profile?.gender || ""}
                        onChange={(value) => updateProfile("gender", value)}
                        className="grid-cols-1"
                      />
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Marital Status</Label>
                        <SelectionCard
                          options={[
                            { value: "Never Married", label: "Never Married" },
                            { value: "Divorced", label: "Divorced" },
                            { value: "Widowed", label: "Widowed" },
                            { value: "Separated", label: "Separated" },
                          ]}
                          value={profile?.marital_status || ""}
                          onChange={(value) => updateProfile("marital_status", value)}
                          className="grid-cols-1"
                        />
                      </div>
                      <div>
                        <Label>Family Type</Label>
                        <SelectionCard
                          options={[
                            { value: "Joint Family", label: "Joint Family" },
                            { value: "Nuclear Family", label: "Nuclear Family" },
                            { value: "Extended Family", label: "Extended Family" },
                          ]}
                          value={profile?.family_type || ""}
                          onChange={(value) => updateProfile("family_type", value)}
                          className="grid-cols-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Family Values</Label>
                        <SelectionCard
                          options={[
                            { value: "Traditional", label: "Traditional", description: "Strong cultural values" },
                            { value: "Moderate", label: "Moderate", description: "Balanced approach" },
                            { value: "Liberal", label: "Liberal", description: "Open-minded values" },
                          ]}
                          value={profile?.family_values || ""}
                          onChange={(value) => updateProfile("family_values", value)}
                          className="grid-cols-1"
                        />
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
                      <SelectionCard
                        options={[
                          { value: "Below 3 Lakhs", label: "Below ₹3 Lakhs" },
                          { value: "3-5 Lakhs", label: "₹3-5 Lakhs" },
                          { value: "5-10 Lakhs", label: "₹5-10 Lakhs" },
                          { value: "10-15 Lakhs", label: "₹10-15 Lakhs" },
                          { value: "15-25 Lakhs", label: "₹15-25 Lakhs" },
                          { value: "25-50 Lakhs", label: "₹25-50 Lakhs" },
                          { value: "Above 50 Lakhs", label: "Above ₹50 Lakhs" },
                        ]}
                        value={profile?.annual_income || ""}
                        onChange={(value) => updateProfile("annual_income", value)}
                        className="grid-cols-2 md:grid-cols-3"
                      />
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
                      <SelectionCard
                        options={[
                          { value: "Vegetarian", label: "Vegetarian" },
                          { value: "Vegan", label: "Vegan" },
                          { value: "Eggetarian", label: "Eggetarian" },
                          { value: "Non-Vegetarian", label: "Non-Vegetarian" },
                        ]}
                        value={profile?.diet || ""}
                        onChange={(value) => updateProfile("diet", value)}
                        className="grid-cols-1"
                      />
                    </div>
                    <div>
                      <Label>Temple Visit Frequency</Label>
                      <SelectionCard
                        options={[
                          { value: "Daily", label: "Daily" },
                          { value: "Weekly", label: "Weekly" },
                          { value: "Monthly", label: "Monthly" },
                          { value: "Rarely", label: "Rarely" },
                          { value: "Never", label: "Never" },
                        ]}
                        value={profile?.temple_visit_freq || ""}
                        onChange={(value) => updateProfile("temple_visit_freq", value)}
                        className="grid-cols-1"
                      />
                    </div>
                  </div>

                  {/* Advanced Spiritual Practices */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Meditation Practice</Label>
                      <SelectionCard
                        options={[
                          { value: "Daily", label: "Daily" },
                          { value: "Weekly", label: "Weekly" },
                          { value: "Monthly", label: "Monthly" },
                          { value: "Rarely", label: "Rarely" },
                          { value: "Never", label: "Never" },
                        ]}
                        value={profile?.meditation_frequency || ""}
                        onChange={(value) => updateProfile("meditation_frequency", value)}
                        className="grid-cols-1"
                      />
                    </div>
                    <div>
                      <Label>Yoga Practice</Label>
                      <SelectionCard
                        options={[
                          { value: "Daily", label: "Daily" },
                          { value: "Weekly", label: "Weekly" },
                          { value: "Monthly", label: "Monthly" },
                          { value: "Rarely", label: "Rarely" },
                          { value: "Never", label: "Never" },
                        ]}
                        value={profile?.yoga_frequency || ""}
                        onChange={(value) => updateProfile("yoga_frequency", value)}
                        className="grid-cols-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Scripture Study</Label>
                      <SelectionCard
                        options={[
                          { value: "Daily", label: "Daily" },
                          { value: "Weekly", label: "Weekly" },
                          { value: "Monthly", label: "Monthly" },
                          { value: "Rarely", label: "Rarely" },
                          { value: "Never", label: "Never" },
                        ]}
                        value={profile?.scripture_study || ""}
                        onChange={(value) => updateProfile("scripture_study", value)}
                        className="grid-cols-1"
                      />
                    </div>
                    <div>
                      <Label>Pilgrimage Interest</Label>
                      <SelectionCard
                        options={[
                          { value: "Very High", label: "Very High" },
                          { value: "High", label: "High" },
                          { value: "Moderate", label: "Moderate" },
                          { value: "Low", label: "Low" },
                          { value: "None", label: "None" },
                        ]}
                        value={profile?.pilgrimage_interest || ""}
                        onChange={(value) => updateProfile("pilgrimage_interest", value)}
                        className="grid-cols-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Vanaprastha Interest</Label>
                      <SelectionCard
                        options={[
                          { value: "yes", label: "Yes", description: "Interested in spiritual retirement" },
                          { value: "no", label: "No", description: "Not interested" },
                          { value: "open", label: "Open to Discussion", description: "Willing to consider" },
                        ]}
                        value={profile?.vanaprastha_interest || ""}
                        onChange={(value) => updateProfile("vanaprastha_interest", value)}
                        className="grid-cols-1"
                      />
                    </div>
                    <div>
                      <Label>Life Philosophy</Label>
                      <SelectionCard
                        options={[
                          { value: "Artha-focused", label: "Artha-focused", description: "Material prosperity" },
                          { value: "Moksha-focused", label: "Moksha-focused", description: "Spiritual liberation" },
                          { value: "Balance", label: "Balanced Approach", description: "Both material & spiritual" },
                        ]}
                        value={profile?.artha_vs_moksha || ""}
                        onChange={(value) => updateProfile("artha_vs_moksha", value)}
                        className="grid-cols-1"
                      />
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
                      <SelectionCard
                        options={[
                          { value: "Never", label: "Never" },
                          { value: "Occasionally", label: "Occasionally" },
                          { value: "Regularly", label: "Regularly" },
                          { value: "Trying to Quit", label: "Trying to Quit" },
                        ]}
                        value={profile?.smoking || ""}
                        onChange={(value) => updateProfile("smoking", value)}
                        className="grid-cols-1"
                      />
                    </div>
                    <div>
                      <Label>Drinking</Label>
                      <SelectionCard
                        options={[
                          { value: "Never", label: "Never" },
                          { value: "Socially", label: "Socially" },
                          { value: "Occasionally", label: "Occasionally" },
                          { value: "Regularly", label: "Regularly" },
                        ]}
                        value={profile?.drinking || ""}
                        onChange={(value) => updateProfile("drinking", value)}
                        className="grid-cols-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Exercise Frequency</Label>
                      <SelectionCard
                        options={[
                          { value: "Daily", label: "Daily" },
                          { value: "4-6 times a week", label: "4-6 times a week" },
                          { value: "2-3 times a week", label: "2-3 times a week" },
                          { value: "Once a week", label: "Once a week" },
                          { value: "Rarely", label: "Rarely" },
                          { value: "Never", label: "Never" },
                        ]}
                        value={profile?.exercise_frequency || ""}
                        onChange={(value) => updateProfile("exercise_frequency", value)}
                        className="grid-cols-1"
                      />
                    </div>
                    <div>
                      <Label>Sleep Schedule</Label>
                      <SelectionCard
                        options={[
                          { value: "Early Bird (Before 10 PM)", label: "Early Bird", description: "Before 10 PM" },
                          { value: "Regular (10 PM - 12 AM)", label: "Regular", description: "10 PM - 12 AM" },
                          { value: "Night Owl (After 12 AM)", label: "Night Owl", description: "After 12 AM" },
                          { value: "Irregular", label: "Irregular" },
                        ]}
                        value={profile?.sleep_schedule || ""}
                        onChange={(value) => updateProfile("sleep_schedule", value)}
                        className="grid-cols-1"
                      />
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
