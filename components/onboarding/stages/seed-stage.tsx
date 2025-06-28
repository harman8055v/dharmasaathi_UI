"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { User, Briefcase } from "lucide-react"
import LocationSelector, { type LocationData, validateLocation } from "@/components/location-selector"

interface SeedStageProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onPrev: () => void
}

export default function SeedStage({ data, onUpdate, onNext, onPrev }: SeedStageProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleLocationChange = (location: LocationData) => {
    onUpdate({
      ...data,
      country_id: location.country_id,
      country: location.country_name,
      state_id: location.state_id,
      state: location.state_name,
      city_id: location.city_id,
      city: location.city_name,
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!data.gender) newErrors.gender = "Please select your gender"
    if (!data.birthdate) newErrors.birthdate = "Please enter your birth date"
    if (!data.height) newErrors.height = "Please enter your height"

    const locationData: LocationData = {
      country_id: data.country_id,
      country_name: data.country,
      state_id: data.state_id,
      state_name: data.state,
      city_id: data.city_id,
      city_name: data.city,
    }

    if (!validateLocation(locationData, true)) {
      newErrors.location = "Please select your complete location"
    }

    if (!data.mother_tongue) newErrors.mother_tongue = "Please enter your mother tongue"
    if (!data.education) newErrors.education = "Please enter your education"
    if (!data.profession) newErrors.profession = "Please enter your profession"
    if (!data.annual_income) newErrors.annual_income = "Please select your annual income"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  const currentYear = new Date().getFullYear()
  const minYear = currentYear - 60
  const maxYear = currentYear - 18

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Tell us about yourself to help us find your perfect match</p>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select value={data.gender || ""} onValueChange={(value) => onUpdate({ ...data, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-sm text-red-600 mt-1">{errors.gender}</p>}
              </div>

              <div>
                <Label htmlFor="birthdate">Date of Birth *</Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={data.birthdate || ""}
                  onChange={(e) => onUpdate({ ...data, birthdate: e.target.value })}
                  min={`${minYear}-01-01`}
                  max={`${maxYear}-12-31`}
                />
                {errors.birthdate && <p className="text-sm text-red-600 mt-1">{errors.birthdate}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height *</Label>
                <Input
                  id="height"
                  placeholder="e.g., 5'8&quot; or 173 cm"
                  value={data.height || ""}
                  onChange={(e) => onUpdate({ ...data, height: e.target.value })}
                />
                {errors.height && <p className="text-sm text-red-600 mt-1">{errors.height}</p>}
              </div>

              <div>
                <Label htmlFor="mother_tongue">Mother Tongue *</Label>
                <Input
                  id="mother_tongue"
                  placeholder="e.g., Hindi, English, Tamil"
                  value={data.mother_tongue || ""}
                  onChange={(e) => onUpdate({ ...data, mother_tongue: e.target.value })}
                />
                {errors.mother_tongue && <p className="text-sm text-red-600 mt-1">{errors.mother_tongue}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardContent className="pt-6">
            <LocationSelector
              value={{
                country_id: data.country_id || null,
                country_name: data.country || null,
                state_id: data.state_id || null,
                state_name: data.state || null,
                city_id: data.city_id || null,
                city_name: data.city || null,
              }}
              onChange={handleLocationChange}
              required={true}
            />
            {errors.location && <p className="text-sm text-red-600 mt-2">{errors.location}</p>}
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Professional Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="education">Education *</Label>
                <Input
                  id="education"
                  placeholder="e.g., Bachelor's in Engineering"
                  value={data.education || ""}
                  onChange={(e) => onUpdate({ ...data, education: e.target.value })}
                />
                {errors.education && <p className="text-sm text-red-600 mt-1">{errors.education}</p>}
              </div>

              <div>
                <Label htmlFor="profession">Profession *</Label>
                <Input
                  id="profession"
                  placeholder="e.g., Software Engineer"
                  value={data.profession || ""}
                  onChange={(e) => onUpdate({ ...data, profession: e.target.value })}
                />
                {errors.profession && <p className="text-sm text-red-600 mt-1">{errors.profession}</p>}
              </div>
            </div>

            <div>
              <Label>Annual Income *</Label>
              <Select
                value={data.annual_income || ""}
                onValueChange={(value) => onUpdate({ ...data, annual_income: value })}
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
              {errors.annual_income && <p className="text-sm text-red-600 mt-1">{errors.annual_income}</p>}
            </div>
          </CardContent>
        </Card>

        {/* About Me */}
        <Card>
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="about_me">Tell us about yourself</Label>
            <Textarea
              id="about_me"
              rows={4}
              placeholder="Share something about your personality, interests, and what makes you unique..."
              value={data.about_me || ""}
              onChange={(e) => onUpdate({ ...data, about_me: e.target.value })}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button onClick={handleNext} className="bg-gradient-to-r from-orange-500 to-pink-500">
          Continue
        </Button>
      </div>
    </div>
  )
}
