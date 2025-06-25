"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, X, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import {
  uploadUserPhoto,
  deleteUserPhoto,
  getOptimizedImageUrl,
  getSignedUrlsForPhotosClient,
} from "@/lib/supabase-storage"
import Image from "next/image"

interface ProfileImageUploaderProps {
  userId: string
  currentImages: string[]
  onImagesUpdate: (images: string[]) => void
}

export default function ProfileImageUploader({ userId, currentImages, onImagesUpdate }: ProfileImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [signedUrls, setSignedUrls] = useState<string[]>([])

  useEffect(() => {
    async function loadUrls() {
      const urls = await getSignedUrlsForPhotosClient(currentImages)
      setSignedUrls(urls)
    }
    loadUrls()
  }, [currentImages])

  const uploadImage = async (file: File) => {
    try {
      setUploading(true)
      const photoIndex = currentImages.length
      setUploadingIndex(photoIndex)

      // Validate file
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file")
        return
      }

      // Upload to Supabase Storage
      const photoPath = await uploadUserPhoto(file, userId)

      if (!photoPath) {
        toast.error("Failed to upload image. Please try again.")
        return
      }

      const newImages = [...currentImages, photoPath]

      // Update user profile with new images
      const { error: updateError } = await supabase.from("users").update({ user_photos: newImages }).eq("id", userId)

      if (updateError) throw updateError

      onImagesUpdate(newImages)
      const urls = await getSignedUrlsForPhotosClient(newImages)
      setSignedUrls(urls)
      toast.success("Image uploaded successfully!")
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
      setUploadingIndex(null)
    }
  }

  const removeImage = async (imagePath: string, index: number) => {
    try {
      await deleteUserPhoto(imagePath)

      const newImages = currentImages.filter((img) => img !== imagePath)

      const { error } = await supabase.from("users").update({ user_photos: newImages }).eq("id", userId)

      if (error) throw error

      onImagesUpdate(newImages)
      const urls = await getSignedUrlsForPhotosClient(newImages)
      setSignedUrls(urls)
      toast.success("Image removed successfully!")
    } catch (error) {
      console.error("Error removing image:", error)
      toast.error("Failed to remove image. Please try again.")
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadImage(file)
    }
    // Reset input
    event.target.value = ""
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {signedUrls.map((url, index) => (
          <div key={index} className="relative group">
            <div className="relative w-full h-24 rounded-lg border-2 border-gray-200 overflow-hidden">
              <Image
                src={getOptimizedImageUrl(url, 200, 200) || "/placeholder.svg"}
                alt={`Profile ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100px, 200px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />
            </div>
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(currentImages[index], index)}
              >
                <X className="w-3 h-3" />
              </Button>
          </div>
        ))}

        {currentImages.length < 6 && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-600 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-xs">Add Photo</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-gray-500 text-center">
        Add up to 6 photos. First photo will be your main profile picture. Max 10MB per image.
      </p>
    </div>
  )
}
