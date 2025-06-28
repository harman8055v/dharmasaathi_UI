"use client"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { User, Bell, Shield, Heart, Trash2 } from "lucide-react"
import LocationSelector, { type LocationData, getLocationDisplayString } from "@/components/location-selector"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
            {values.includes(option) && <Trash2 className="w-3 h-3 text-orange-600 ml-1 flex-shrink-0" />}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const [userLocation, setUserLocation] = useState<LocationData>({
    country_id: null,
    country_name: null,
    state_id: null,
    state_name: null,
    city_id: null,
    city_name: null,
  })

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    bio: "",
    height: "",
    occupation: "",
    education: "",
    // Add other fields as needed
  })

  const [notifications, setNotifications] = useState({
    matches: true,
    messages: true,
    likes: true,
    marketing: false,
  })

  const [privacy, setPrivacy] = useState({
    showOnline: true,
    showDistance: true,
    showAge: true,
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

        const { data: profileData, error } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (error) {
          console.error("Error fetching profile:", error)
          return
        }

        setProfile(profileData)
        setFormData({
          fullName: profileData.first_name + " " + profileData.last_name,
          email: profileData.email,
          bio: profileData.about_me,
          height: profileData.height,
          occupation: profileData.profession,
          education: profileData.education,
        })
        setUserLocation({
          country_id: profileData.country_id,
          country_name: profileData.country,
          state_id: profileData.state_id,
          state_name: profileData.state,
          city_id: profileData.city_id,
          city_name: profileData.city,
        })
        setNotifications({
          matches: profileData.matches_notifications,
          messages: profileData.messages_notifications,
          likes: profileData.likes_notifications,
          marketing: profileData.marketing_notifications,
        })
        setPrivacy({
          showOnline: profileData.show_online,
          showDistance: profileData.show_distance,
          showAge: profileData.show_age,
        })
        setLoading(false)
      } catch (error) {
        console.error("Error:", error)
        router.push("/")
      }
    }

    getProfile()
  }, [router])

  const handleSavePersonal = async () => {
    if (!profile) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from("users")
        .update({
          first_name: formData.fullName.split(" ")[0],
          last_name: formData.fullName.split(" ")[1],
          email: formData.email,
          about_me: formData.bio,
          height: formData.height,
          profession: formData.occupation,
          education: formData.education,
          country_id: userLocation.country_id,
          country: userLocation.country_name,
          state_id: userLocation.state_id,
          state: userLocation.state_name,
          city_id: userLocation.city_id,
          city: userLocation.city_name,
        })
        .eq("id", profile.id)

      if (error) {
        console.error("Error updating profile:", error)
        toast.error("Failed to update personal information")
      } else {
        toast.success("Personal information updated successfully!")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to update personal information")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    if (!profile) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from("users")
        .update({
          matches_notifications: notifications.matches,
          messages_notifications: notifications.messages,
          likes_notifications: notifications.likes,
          marketing_notifications: notifications.marketing,
        })
        .eq("id", profile.id)

      if (error) {
        console.error("Error updating notifications:", error)
        toast.error("Failed to update notification preferences")
      } else {
        toast.success("Notification preferences updated!")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to update notification preferences")
    } finally {
      setSaving(false)
    }
  }

  const handleSavePrivacy = async () => {
    if (!profile) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from("users")
        .update({
          show_online: privacy.showOnline,
          show_distance: privacy.showDistance,
          show_age: privacy.showAge,
        })
        .eq("id", profile.id)

      if (error) {
        console.error("Error updating privacy:", error)
        toast.error("Failed to update privacy settings")
      } else {
        toast.success("Privacy settings updated!")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to update privacy settings")
    } finally {
      setSaving(false)
    }
  }

  const updateProfile = (field: string, value: any) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleLocationChange = (location: LocationData) => {
    setProfile((prev: any) => ({
      ...prev,
      country_id: location.country_id,
      country: location.country_name,
      state_id: location.state_id,
      state: location.state_name,
      city_id: location.city_id,
      city: location.city_name,
    }))
    setUserLocation(location)
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
                <Trash2 className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Profile</h1>
                <p className="text-sm text-gray-600">Update your profile information</p>
              </div>
            </div>
            <Button
              onClick={handleSavePersonal}
              disabled={saving}
              className="bg-gradient-to-r from-orange-500 to-pink-500"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Personal
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Preferences
              </TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your personal details and profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={formData.fullName.split(" ")[0] || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value + " " + formData.fullName.split(" ")[1] })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={formData.fullName.split(" ")[1] || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: formData.fullName.split(" ")[0] + " " + e.target.value })
                        }
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
                        value={formData.height || ""}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
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
                    <LocationSelector value={userLocation} onChange={handleLocationChange} required={false} />
                    <div className="text-sm text-gray-500">
                      Current location: {getLocationDisplayString(userLocation)}
                    </div>
                  </div>

                  {/* Family & Background */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Trash2 className="w-5 h-5" />
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
                      <Trash2 className="w-5 h-5" />
                      Professional Information
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="education">Education</Label>
                        <Input
                          id="education"
                          value={formData.education || ""}
                          onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="profession">Profession</Label>
                        <Input
                          id="profession"
                          value={formData.occupation || ""}
                          onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
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
                      value={formData.bio || ""}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what notifications you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="matches">New Matches</Label>
                        <p className="text-sm text-gray-500">Get notified when you have new matches</p>
                      </div>
                      <Switch
                        id="matches"
                        checked={notifications.matches}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, matches: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="messages">Messages</Label>
                        <p className="text-sm text-gray-500">Get notified when you receive new messages</p>
                      </div>
                      <Switch
                        id="messages"
                        checked={notifications.messages}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, messages: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="likes">Likes</Label>
                        <p className="text-sm text-gray-500">Get notified when someone likes your profile</p>
                      </div>
                      <Switch
                        id="likes"
                        checked={notifications.likes}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, likes: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketing">Marketing</Label>
                        <p className="text-sm text-gray-500">Receive updates about new features and promotions</p>
                      </div>
                      <Switch
                        id="marketing"
                        checked={notifications.marketing}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveNotifications} disabled={saving}>
                    {saving ? "Saving..." : "Save Preferences"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control what information is visible to other users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="showOnline">Show Online Status</Label>
                        <p className="text-sm text-gray-500">Let others see when you're online</p>
                      </div>
                      <Switch
                        id="showOnline"
                        checked={privacy.showOnline}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, showOnline: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="showDistance">Show Distance</Label>
                        <p className="text-sm text-gray-500">Display your distance from other users</p>
                      </div>
                      <Switch
                        id="showDistance"
                        checked={privacy.showDistance}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, showDistance: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="showAge">Show Age</Label>
                        <p className="text-sm text-gray-500">Display your age on your profile</p>
                      </div>
                      <Switch
                        id="showAge"
                        checked={privacy.showAge}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, showAge: checked })}
                      />
                    </div>
                  </div>

                  <Button onClick={handleSavePrivacy} disabled={saving}>
                    {saving ? "Saving..." : "Save Settings"}
                  </Button>
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

                  {/* Advanced Spiritual Practices */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Meditation Practice</Label>
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
                      <Label>Yoga Practice</Label>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Scripture Study</Label>
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
                      <Label>Pilgrimage Interest</Label>
                      <Select
                        value={profile?.pilgrimage_interest || ""}
                        onValueChange={(value) => updateProfile("pilgrimage_interest", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select interest level" />
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Vanaprastha Interest</Label>
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
                      <Label>Life Philosophy</Label>
                      <Select
                        value={profile?.artha_vs_moksha || ""}
                        onValueChange={(value) => updateProfile("artha_vs_moksha", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select philosophy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Artha-focused">Artha-focused</SelectItem>
                          <SelectItem value="Moksha-focused">Moksha-focused</SelectItem>
                          <SelectItem value="Balance">Balanced Approach</SelectItem>
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

            {/* Interests & Hobbies */}
            <TabsContent value="interests">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trash2 className="w-5 h-5" />
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

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Match Preferences</CardTitle>
                  <CardDescription>Set your preferences for potential matches</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Match preferences will be implemented here...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Bottom Save Button */}
          <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-4">
            <Button
              onClick={handleSavePersonal}
              disabled={saving}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 h-12 text-lg font-semibold"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              {saving ? "Saving Changes..." : "Save All Changes"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
