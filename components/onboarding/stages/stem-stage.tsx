"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { LocationSelector } from "@/components/location-selector"
import type { OnboardingProfile, LocationFormState } from "@/lib/types/onboarding"

interface StemStageProps {
  profile: OnboardingProfile
  updateProfile: (data: Partial<OnboardingProfile>) => void
  onNext: () => void
  onPrev: () => void
}

export default function StemStage({ profile, updateProfile, onNext, onPrev }: StemStageProps) {
  const [formData, setFormData] = useState({
    gender: profile.gender || "",
    birthdate: profile.birthdate ? new Date(profile.birthdate) : undefined,
    height: profile.height || "",
    country_id: profile.country_id || null,
    state_id: profile.state_id || null,
    city_id: profile.city_id || null,
  })

  const handleLocationChange = (locationData: LocationFormState) => {
    setFormData((prev) => ({
      ...prev,
      country_id: locationData.country_id,
      state_id: locationData.state_id,
      city_id: locationData.city_id,
    }))
  }

  const handleNext = () => {
    const updatedData: Partial<OnboardingProfile> = {
      gender: formData.gender as "Male" | "Female" | "Other" | null,
      birthdate: formData.birthdate ? formData.birthdate.toISOString().split("T")[0] : null,
      height: formData.height ? Number(formData.height) : null,
      country_id: formData.country_id,
      state_id: formData.state_id,
      city_id: formData.city_id,
    }
    updateProfile(updatedData)
    onNext()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.birthdate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.birthdate ? format(formData.birthdate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.birthdate}
                onSelect={(date) => setFormData((prev) => ({ ...prev, birthdate: date }))}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Height */}
        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            placeholder="Enter your height in cm"
            value={formData.height}
            onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value }))}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label>Location</Label>
          <LocationSelector
            value={{
              country_id: formData.country_id,
              state_id: formData.state_id,
              city_id: formData.city_id,
            }}
            onChange={handleLocationChange}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPrev}>
            Previous
          </Button>
          <Button onClick={handleNext}>Next</Button>
        </div>
      </CardContent>
    </Card>
  )
}
