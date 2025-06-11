"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface PhotosStepProps {
  onNext: (data: any) => void
  onSkip: () => void
  onBack: () => void
}

export default function PhotosStep({ onNext, onSkip, onBack }: PhotosStepProps) {
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([])

  const handleSubmit = () => {
    onNext({
      hasProfilePhoto: !!profilePreview,
      additionalPhotosCount: additionalPreviews.length,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isProfilePhoto: boolean) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (isProfilePhoto) {
      const file = files[0]
      const reader = new FileReader()
      reader.onloadend = () => setProfilePreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      const newPreviews: string[] = []
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviews.push(reader.result as string)
          if (newPreviews.length === files.length) {
            setAdditionalPreviews((prev) => [...prev, ...newPreviews].slice(0, 6))
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeProfilePhoto = () => setProfilePreview(null)
  const removeAdditionalPhoto = (index: number) => setAdditionalPreviews((prev) => prev.filter((_, i) => i !== index))

  const commonUploadBox = (
    id: string,
    onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void,
    title: string,
    subtitle: string,
    isMultiple = false,
  ) => (
    <label
      htmlFor={id}
      className="flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:border-maroon-700 dark:hover:border-maroon-500 hover:bg-maroon-50 dark:hover:bg-maroon-900/20 transition-colors"
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <Upload className="w-8 h-8 mb-4 text-maroon-700 dark:text-maroon-500 opacity-70" />
        <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-maroon-800 dark:text-maroon-300">{title}</span>
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
      <input id={id} type="file" className="hidden" accept="image/*" multiple={isMultiple} onChange={onChangeHandler} />
    </label>
  )

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-light text-slate-900 dark:text-slate-100 mb-3">Add your photos</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Show your authentic self with photos that represent who you are.
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <Label className="text-base font-medium text-slate-700 dark:text-slate-300">Profile Photo</Label>
          {!profilePreview ? (
            commonUploadBox(
              "profilePhotoUpload",
              (e) => handleFileChange(e, true),
              "Click to upload",
              "PNG, JPG or WEBP (MAX. 5MB)",
            )
          ) : (
            <div className="relative w-40 h-40 sm:w-48 sm:h-48">
              <img
                src={profilePreview || "/placeholder.svg"}
                alt="Profile preview"
                className="w-full h-full object-cover rounded-xl shadow-md"
              />
              <button
                type="button"
                onClick={removeProfilePhoto}
                className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-lg"
                aria-label="Remove profile photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium text-slate-700 dark:text-slate-300">
            Additional Photos <span className="text-slate-500 dark:text-slate-400">(up to 6)</span>
          </Label>
          {commonUploadBox(
            "additionalPhotosUpload",
            (e) => handleFileChange(e, false),
            "Add more photos",
            "Showcase your personality",
            true,
          )}
          {additionalPreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4">
              {additionalPreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt={`Additional photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg shadow"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalPhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors shadow-md"
                    aria-label={`Remove additional photo ${index + 1}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-4 pt-6">
          <Button
            onClick={handleSubmit}
            className="bg-maroon-800 hover:bg-maroon-700 dark:bg-maroon-700 dark:hover:bg-maroon-600 text-white py-3 rounded-xl font-medium text-base"
          >
            Save and continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="flex justify-between">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              onClick={onSkip}
              variant="ghost"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
