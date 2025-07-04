"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Shield, Eye, Lock, Users, Globe } from "lucide-react"
import MobileNav from "@/components/dashboard/mobile-nav"
import { toast } from "sonner"
import { Toaster } from "sonner"

export default function PrivacyPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const [privacySettings, setPrivacySettings] = useState({
    profile_visibility: true,
    show_online_status: true,
    allow_messages_from_matches_only: false,
    show_distance: true,
    show_last_active: true,
    allow_profile_screenshots: false,
    show_verification_badge: true,
    allow_search_by_phone: false,
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

        // Load privacy settings if they exist
        if (profileData.privacy_settings) {
          setPrivacySettings({ ...privacySettings, ...profileData.privacy_settings })
        }

        setLoading(false)
      } catch (error) {
        console.error("Error:", error)
        router.push("/")
      }
    }

    getUser()
  }, [router])

  const handleSettingChange = (key: string, value: boolean) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from("users")
        .update({
          privacy_settings: privacySettings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      toast.success("Privacy settings updated successfully!")
    } catch (error) {
      console.error("Error updating privacy settings:", error)
      toast.error("Failed to update privacy settings. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading privacy settings...</p>
        </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Privacy & Safety</h1>
              <p className="text-gray-600">Control who can see your information</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Profile Visibility */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Profile Visibility
                </CardTitle>
                <CardDescription>Control how your profile appears to others</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Make profile visible</h4>
                    <p className="text-sm text-gray-600">Allow others to discover your profile</p>
                  </div>
                  <Switch
                    checked={privacySettings.profile_visibility}
                    onCheckedChange={(checked) => handleSettingChange("profile_visibility", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Show verification badge</h4>
                    <p className="text-sm text-gray-600">Display verification status on your profile</p>
                  </div>
                  <Switch
                    checked={privacySettings.show_verification_badge}
                    onCheckedChange={(checked) => handleSettingChange("show_verification_badge", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Show distance</h4>
                    <p className="text-sm text-gray-600">Display your distance from other users</p>
                  </div>
                  <Switch
                    checked={privacySettings.show_distance}
                    onCheckedChange={(checked) => handleSettingChange("show_distance", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Activity & Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Activity & Status
                </CardTitle>
                <CardDescription>Manage your online presence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Show online status</h4>
                    <p className="text-sm text-gray-600">Let others see when you're active</p>
                  </div>
                  <Switch
                    checked={privacySettings.show_online_status}
                    onCheckedChange={(checked) => handleSettingChange("show_online_status", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Show last active</h4>
                    <p className="text-sm text-gray-600">Display when you were last online</p>
                  </div>
                  <Switch
                    checked={privacySettings.show_last_active}
                    onCheckedChange={(checked) => handleSettingChange("show_last_active", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Communication */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Communication
                </CardTitle>
                <CardDescription>Control who can contact you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Messages from matches only</h4>
                    <p className="text-sm text-gray-600">Only allow messages from mutual matches</p>
                  </div>
                  <Switch
                    checked={privacySettings.allow_messages_from_matches_only}
                    onCheckedChange={(checked) => handleSettingChange("allow_messages_from_matches_only", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Allow search by phone number</h4>
                    <p className="text-sm text-gray-600">Let others find you using your phone number</p>
                  </div>
                  <Switch
                    checked={privacySettings.allow_search_by_phone}
                    onCheckedChange={(checked) => handleSettingChange("allow_search_by_phone", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security
                </CardTitle>
                <CardDescription>Protect your profile and content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Prevent profile screenshots</h4>
                    <p className="text-sm text-gray-600">Block screenshot notifications (limited protection)</p>
                  </div>
                  <Switch
                    checked={privacySettings.allow_profile_screenshots}
                    onCheckedChange={(checked) => handleSettingChange("allow_profile_screenshots", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Shield className="w-5 h-5" />
                  Safety Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Never share personal information like your address or financial details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Meet in public places for your first few dates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Trust your instincts - if something feels wrong, it probably is</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Report any suspicious or inappropriate behavior immediately</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              {saving ? "Saving..." : "Save Privacy Settings"}
            </Button>
          </div>
        </div>
      </main>
      <Toaster position="top-center" />
    </div>
  )
}
