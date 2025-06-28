"use client"
import { Loader2, Quote } from "lucide-react"
import type { OnboardingProfile } from "@/lib/types/onboarding"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import PhotoUploader from "@/components/onboarding/photo-uploader"

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
  const canProceed = profile.about_me && (profile.user_photos?.length ?? 0) > 0

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>This is what other members will see. Make it count!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Your Photos *</Label>
          <PhotoUploader
            userId={profile.id}
            initialPhotos={profile.user_photos || []}
            onUploadComplete={(newPhotoUrls) => updateProfile({ user_photos: newPhotoUrls })}
          />
          <p className="text-xs text-muted-foreground">Please upload at least one photo.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="about_me">About Me *</Label>
          <Textarea
            id="about_me"
            placeholder="Tell us about your values, passions, and what you're looking for in a partner..."
            value={profile.about_me || ""}
            onChange={(e) => updateProfile({ about_me: e.target.value })}
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="favorite_spiritual_quote" className="flex items-center gap-2">
            <Quote className="w-4 h-4 text-orange-500" />
            Favorite Spiritual Quote (Optional)
          </Label>
          <Textarea
            id="favorite_spiritual_quote"
            value={profile.favorite_spiritual_quote || ""}
            onChange={(e) => updateProfile({ favorite_spiritual_quote: e.target.value })}
            rows={3}
            placeholder="Share a spiritual quote that inspires you..."
            className="bg-gradient-to-r from-orange-50 to-amber-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="partner_expectations">Partner Expectations (Optional)</Label>
          <Textarea
            id="partner_expectations"
            value={profile.partner_expectations || ""}
            onChange={(e) => updateProfile({ partner_expectations: e.target.value })}
            rows={4}
            placeholder="Describe what you're looking for in a spiritual partner..."
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
            Back
          </Button>
          <Button onClick={onSubmit} disabled={!canProceed || isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Complete Profile"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
