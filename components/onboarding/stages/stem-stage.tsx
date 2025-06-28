"use client"

import { useState, useCallback } from "react"
import { Calendar, MapPin, Briefcase, GraduationCap, Heart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import LocationSelector from "@/components/location-selector"
import type { OnboardingData } from "@/lib/types/onboarding"

interface StemStageProps {
  data: OnboardingData
  onChange: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onPrev: () => void
}

export default function StemStage({ data, onChange, onNext, onPrev }: StemStageProps) {
  const [localData, setLocalData] = useState({
    dateOfBirth: data.dateOfBirth || "",
    gender: data.gender || "",
    height: data.height || "",
    occupation: data.occupation || "",
    education: data.education || "",
    bio: data.bio || "",
    country_id: data.country_id || "",
    state_id: data.state_id || "",
    city_id: data.city_id || "",
    motherTongue: data.motherTongue || "",
    relationshipStatus: data.relationshipStatus || "",
    hasChildren: data.hasChildren || "",
    wantsChildren: data.wantsChildren || "",
    smokingHabits: data.smokingHabits || "",
    drinkingHabits: data.drinkingHabits || "",
    dietaryPreferences: data.dietaryPreferences || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateField = useCallback(
    (field: string, value: string) => {
      setLocalData((prev) => ({ ...prev, [field]: value }))
      onChange({ [field]: value })

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }))
      }
    },
    [onChange, errors],
  )

  const handleLocationChange = useCallback(
    (locationData: { country_id?: string; state_id?: string; city_id?: string }) => {
      setLocalData((prev) => ({
        ...prev,
        country_id: locationData.country_id || "",
        state_id: locationData.state_id || "",
        city_id: locationData.city_id || "",
      }))
      onChange(locationData)

      // Clear location errors
      setErrors((prev) => ({
        ...prev,
        country_id: "",
        state_id: "",
        city_id: "",
      }))
    },
    [onChange],
  )

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!localData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
    if (!localData.gender) newErrors.gender = "Gender is required"
    if (!localData.height) newErrors.height = "Height is required"
    if (!localData.occupation) newErrors.occupation = "Occupation is required"
    if (!localData.education) newErrors.education = "Education is required"
    if (!localData.country_id) newErrors.country_id = "Country is required"
    if (!localData.state_id) newErrors.state_id = "State is required"
    if (!localData.city_id) newErrors.city_id = "City is required"
    if (!localData.motherTongue) newErrors.motherTongue = "Mother tongue is required"
    if (!localData.relationshipStatus) newErrors.relationshipStatus = "Relationship status is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Details</h2>
        <p className="text-gray-600">Tell us about yourself to help us find your perfect match</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              Basic Information
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date of Birth *
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={localData.dateOfBirth}
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                  className={`mt-1 ${errors.dateOfBirth ? "border-red-500" : ""}`}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
                />
                {errors.dateOfBirth && <p className="mt-1 text-xs text-red-600">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Gender *</Label>
                <Select value={localData.gender} onValueChange={(value) => updateField("gender", value)}>
                  <SelectTrigger className={`mt-1 ${errors.gender ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender}</p>}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Height *</Label>
                <Select value={localData.height} onValueChange={(value) => updateField("height", value)}>
                  <SelectTrigger className={`mt-1 ${errors.height ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select height" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="below-5ft">Below 5'0"</SelectItem>
                    <SelectItem value="5ft-5ft3">5'0" - 5'3"</SelectItem>
                    <SelectItem value="5ft4-5ft7">5'4" - 5'7"</SelectItem>
                    <SelectItem value="5ft8-5ft11">5'8" - 5'11"</SelectItem>
                    <SelectItem value="6ft-6ft3">6'0" - 6'3"</SelectItem>
                    <SelectItem value="above-6ft3">Above 6'3"</SelectItem>
                  </SelectContent>
                </Select>
                {errors.height && <p className="mt-1 text-xs text-red-600">{errors.height}</p>}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Mother Tongue *</Label>
                <Select value={localData.motherTongue} onValueChange={(value) => updateField("motherTongue", value)}>
                  <SelectTrigger className={`mt-1 ${errors.motherTongue ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select mother tongue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="bengali">Bengali</SelectItem>
                    <SelectItem value="telugu">Telugu</SelectItem>
                    <SelectItem value="marathi">Marathi</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                    <SelectItem value="gujarati">Gujarati</SelectItem>
                    <SelectItem value="urdu">Urdu</SelectItem>
                    <SelectItem value="kannada">Kannada</SelectItem>
                    <SelectItem value="malayalam">Malayalam</SelectItem>
                    <SelectItem value="punjabi">Punjabi</SelectItem>
                    <SelectItem value="assamese">Assamese</SelectItem>
                    <SelectItem value="odia">Odia</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.motherTongue && <p className="mt-1 text-xs text-red-600">{errors.motherTongue}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-orange-500" />
              Professional Details
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="occupation" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Occupation *
                </Label>
                <Input
                  id="occupation"
                  type="text"
                  value={localData.occupation}
                  onChange={(e) => updateField("occupation", e.target.value)}
                  className={`mt-1 ${errors.occupation ? "border-red-500" : ""}`}
                  placeholder="e.g., Software Engineer, Teacher, Doctor"
                />
                {errors.occupation && <p className="mt-1 text-xs text-red-600">{errors.occupation}</p>}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Education *
                </Label>
                <Select value={localData.education} onValueChange={(value) => updateField("education", value)}>
                  <SelectTrigger className={`mt-1 ${errors.education ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="diploma">Diploma</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="professional">Professional Degree</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.education && <p className="mt-1 text-xs text-red-600">{errors.education}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            Location
          </h3>
          <LocationSelector
            value={{
              country_id: localData.country_id,
              state_id: localData.state_id,
              city_id: localData.city_id,
            }}
            onChange={handleLocationChange}
            defaultToIndia={true}
          />
          {(errors.country_id || errors.state_id || errors.city_id) && (
            <p className="mt-2 text-xs text-red-600">Please select your complete location</p>
          )}
        </CardContent>
      </Card>

      {/* Relationship Information */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-orange-500" />
            Relationship & Lifestyle
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Relationship Status *</Label>
              <Select
                value={localData.relationshipStatus}
                onValueChange={(value) => updateField("relationshipStatus", value)}
              >
                <SelectTrigger className={`mt-1 ${errors.relationshipStatus ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never-married">Never Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                  <SelectItem value="separated">Separated</SelectItem>
                </SelectContent>
              </Select>
              {errors.relationshipStatus && <p className="mt-1 text-xs text-red-600">{errors.relationshipStatus}</p>}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Do you have children?</Label>
              <Select value={localData.hasChildren} onValueChange={(value) => updateField("hasChildren", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes-living-with-me">Yes, living with me</SelectItem>
                  <SelectItem value="yes-not-living-with-me">Yes, not living with me</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Do you want children?</Label>
              <Select value={localData.wantsChildren} onValueChange={(value) => updateField("wantsChildren", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="maybe">Maybe</SelectItem>
                  <SelectItem value="open-to-discussion">Open to discussion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Smoking Habits</Label>
              <Select value={localData.smokingHabits} onValueChange={(value) => updateField("smokingHabits", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="occasionally">Occasionally</SelectItem>
                  <SelectItem value="regularly">Regularly</SelectItem>
                  <SelectItem value="trying-to-quit">Trying to quit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Drinking Habits</Label>
              <Select value={localData.drinkingHabits} onValueChange={(value) => updateField("drinkingHabits", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="occasionally">Occasionally</SelectItem>
                  <SelectItem value="socially">Socially</SelectItem>
                  <SelectItem value="regularly">Regularly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Dietary Preferences</Label>
              <Select
                value={localData.dietaryPreferences}
                onValueChange={(value) => updateField("dietaryPreferences", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="non-vegetarian">Non-vegetarian</SelectItem>
                  <SelectItem value="jain-vegetarian">Jain Vegetarian</SelectItem>
                  <SelectItem value="eggetarian">Eggetarian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About You</h3>
          <div>
            <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
              Bio (Optional)
            </Label>
            <Textarea
              id="bio"
              value={localData.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              className="mt-1"
              placeholder="Tell us a bit about yourself, your interests, and what you're looking for..."
              rows={4}
              maxLength={500}
            />
            <p className="mt-1 text-xs text-gray-500">{localData.bio.length}/500 characters</p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev} className="px-8 bg-transparent">
          Previous
        </Button>
        <Button
          onClick={handleNext}
          className="px-8 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
