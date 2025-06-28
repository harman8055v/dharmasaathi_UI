"use client"

import type React from "react"

import { useState } from "react"
import type { OnboardingProfile } from "@/lib/types/onboarding"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import PhotoUploader from "../photo-uploader" // Assuming this component exists and works

interface FullBloomStageProps {
  profile: OnboardingProfile
  updateProfile: (data: Partial<OnboardingProfile>) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
}

export default function FullBloomStage({
  profile,
  updateProfile,
  onSubmit,
  onBack,
  isSubmitting,
}: FullBloomStageProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!profile.about_me || profile.about_me.length < 50) {
      newErrors.about_me = "Please write at least 50 characters about yourself."
    }
    if (!profile.user_photos || profile.user_photos.length === 0) {
      newErrors.user_photos = "Please upload at least one photo."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit()
    }
  }

  const canProceed = profile.about_me && (profile.user_photos?.length ?? 0) > 0

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>This is what other members will see. Make it count!</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Uploader */}
          <div className="space-y-2">
            <Label>Your Photos *</Label>
            <PhotoUploader
              userId={profile.id}
              initialPhotos={profile.user_photos || []}
              onUploadComplete={(newPhotoUrls) => updateProfile({ user_photos: newPhotoUrls })}
            />
            {errors.user_photos && <p className="text-sm text-red-500">{errors.user_photos}</p>}
          </div>

          {/* About Me */}
          <div className="space-y-2">
            <Label htmlFor="about_me">About Me *</Label>
            <Textarea
              id="about_me"
              placeholder="Tell us about your values, passions, and what you're looking for in a partner..."
              value={profile.about_me || ""}
              onChange={(e) => updateProfile({ about_me: e.target.value })}
              className={`min-h-[120px] ${errors.about_me ? "border-red-500" : ""}`}
            />
            <p className="text-sm text-muted-foreground">{profile.about_me?.length || 0} / 50 characters minimum</p>
            {errors.about_me && <p className="text-sm text-red-500">{errors.about_me}</p>}
          </div>

          {/* Partner Expectations */}
          <div className="space-y-2">
            <Label htmlFor="partner_expectations">Partner Expectations (Optional)</Label>
            <Textarea
              id="partner_expectations"
              placeholder="Describe the qualities you're seeking in a partner..."
              value={profile.partner_expectations || ""}
              onChange={(e) => updateProfile({ partner_expectations: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBack} type="button" disabled={isSubmitting}>
              Back
            </Button>
            <Button type="submit" disabled={!canProceed || isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Finish & Submit Profile
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
