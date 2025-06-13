"use client"

import type React from "react"

import { useState } from "react"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"

interface FullBloomStageProps {
  profile: any
  onSubmit: (data: any) => void
  isSubmitting: boolean
}

export default function FullBloomStage({ profile, onSubmit, isSubmitting }: FullBloomStageProps) {
  const [formData, setFormData] = useState({
    about_me: profile.about_me || "",
    partner_expectations: profile.partner_expectations || "",
  })
  const [photos, setPhotos] = useState<File[]>([])
  const [photoUrls, setPhotoUrls] = useState<string[]>(profile.user_photos || [])
  const [uploading, setUploading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files)
      if (photoUrls.length + newPhotos.length <= 6) {
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
        const fileExt = photo.name.split(".").pop()
        const fileName = `${profile.id}/${Date.now()}.${fileExt}`

        // In a real app, you would upload to Supabase Storage
        // For this demo, we'll simulate it
        // const { data, error } = await supabase.storage
        //   .from('user-photos')
        //   .upload(fileName, photo)

        // if (error) throw error

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const uploadedPhotoUrls = await uploadPhotos()
      onSubmit({
        ...formData,
        user_photos: uploadedPhotoUrls,
      })
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Your blossom is complete—add the finishing touches!</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* About Me */}
          <div className="space-y-2">
            <label htmlFor="about_me" className="block text-sm font-medium text-foreground">
              About Me
            </label>
            <textarea
              id="about_me"
              name="about_me"
              value={formData.about_me}
              onChange={handleChange}
              rows={4}
              placeholder="Share your spiritual journey, interests, and what makes you unique..."
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          {/* Partner Expectations */}
          <div className="space-y-2">
            <label htmlFor="partner_expectations" className="block text-sm font-medium text-foreground">
              Partner Expectations
            </label>
            <textarea
              id="partner_expectations"
              name="partner_expectations"
              value={formData.partner_expectations}
              onChange={handleChange}
              rows={4}
              placeholder="Describe what you're looking for in a spiritual partner..."
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Upload Photos (Max 6)</label>

            {/* Photo Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {/* Existing Photos */}
              {photoUrls.map((url, index) => (
                <div key={`uploaded-${index}`} className="relative aspect-square bg-muted rounded-md overflow-hidden">
                  <Image
                    src={url || "/placeholder.svg"}
                    alt={`User photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveUploadedPhoto(url)}
                    className="absolute top-1 right-1 bg-background/80 p-1 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {/* New Photos */}
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

              {/* Upload Button */}
              {photoUrls.length + photos.length < 6 && (
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-input rounded-md cursor-pointer hover:bg-muted/50">
                  <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">Upload</span>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" multiple />
                </label>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || uploading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {uploading ? "Uploading photos..." : "Processing..."}
              </span>
            ) : (
              "Complete Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
