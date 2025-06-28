"use client"

import type React from "react"
import { useState } from "react"
import { Loader2, Upload, X, Quote } from "lucide-react"
import Image from "next/image"
import type { OnboardingProfile } from "@/lib/types/onboarding"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

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
  const canProceed = profile.about_me

  const [photos, setPhotos] = useState<File[]>([])
  const [photoUrls, setPhotoUrls] = useState<string[]>(profile.user_photos || [])
  const [uploading, setUploading] = useState(false)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files)
      if (photoUrls.length + photos.length + newPhotos.length <= 6) {
        setPhotos((prev) => [...prev, ...newPhotos])
      } else {
        alert("You can upload a maximum of 6 photos")
      }
    }
  }

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveUploadedPhoto = (url: string) => {
    setPhotoUrls((prev) => prev.filter((photoUrl) => photoUrl !== url))
  }

  const uploadPhotos = async () => {
    if (photos.length === 0) return photoUrls

    setUploading(true)
    const uploadedUrls = [...photoUrls]

    try {
      for (const photo of photos) {
        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Simulate URL generation
        const url = URL.createObjectURL(photo)
        uploadedUrls.push(url)
      }

      return uploadedUrls
    } catch (error) {
      console.error("Error uploading photos:", error)
      return photoUrls
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!canProceed) {
      return
    }

    try {
      const uploadedPhotoUrls = await uploadPhotos()

      const dataToSave: Partial<OnboardingProfile> = {
        about_me: profile.about_me,
        user_photos: uploadedPhotoUrls,
      }

      updateProfile(dataToSave)
      onSubmit()
    } catch (error) {
      console.error("Error submitting form:", error)
      // You might want to set a local error state here if photo upload fails
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>About You</CardTitle>
        <CardDescription>This is your space to shine. Tell potential partners about yourself.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="about_me">Your Bio</Label>
          <Textarea
            id="about_me"
            value={profile.about_me || ""}
            onChange={(e) => updateProfile({ about_me: e.target.value })}
            rows={6}
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
            placeholder="Share a spiritual quote that inspires you... (e.g., from Bhagavad Gita, Upanishads, or your spiritual teacher)"
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-gradient-to-r from-orange-50 to-amber-50"
          />
          <p className="text-xs text-gray-500">
            This will be beautifully displayed on your profile to inspire potential matches
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="partner_expectations">Partner Expectations (Optional)</Label>
          <Textarea
            id="partner_expectations"
            value={profile.partner_expectations || ""}
            onChange={(e) => updateProfile({ partner_expectations: e.target.value })}
            rows={4}
            placeholder="Describe what you're looking for in a spiritual partner..."
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <Label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-input rounded-md cursor-pointer hover:bg-muted/50">
            <Upload className="h-6 w-6 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Upload</span>
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" multiple />
          </Label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {photoUrls.map((url, index) => (
              <div key={`uploaded-${index}`} className="relative aspect-square bg-muted rounded-md overflow-hidden">
                <Image src={url || "/placeholder.svg"} alt={`User photo ${index + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveUploadedPhoto(url)}
                  className="absolute top-1 right-1 bg-background/80 p-1 rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {photos.map((photo, index) => (
              <div key={`new-${index}`} className="relative aspect-square bg-muted rounded-md overflow-hidden">
                <Image
                  src={URL.createObjectURL(photo) || "/placeholder.svg"}
                  alt={`New photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-1 right-1 bg-background/80 p-1 rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={!canProceed || isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Complete Profile"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
