"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import LocationSelector, { type LocationData, validateLocation } from "@/components/location-selector"

interface SeedStageProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onPrev: () => void
}

export default function SeedStage({ data, onUpdate, onNext, onPrev }: SeedStageProps) {
  const [location, setLocation] = useState<LocationData>({
    country_id: data.country_id || null,
    country_name: data.country_name || null,
    state_id: data.state_id || null,
    state_name: data.state_name || null,
    city_id: data.city_id || null,
    city_name: data.city_name || null,
  })

  const handleLocationChange = (newLocation: LocationData) => {
    setLocation(newLocation)
    onUpdate({
      ...data,
      country_id: newLocation.country_id,
      country_name: newLocation.country_name,
      state_id: newLocation.state_id,
      state_name: newLocation.state_name,
      city_id: newLocation.city_id,
      city_name: newLocation.city_name,
    })
  }

  const handleNext = () => {
    if (!validateLocation(location, true)) {
      alert("Please select your complete location")
      return
    }
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Plant Your Seed 🌱</h2>
        <p className="text-gray-600">Let's start with your basic information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={data.fullName || ""}
            onChange={(e) => onUpdate({ ...data, fullName: e.target.value })}
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label>Date of Birth *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.dateOfBirth && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.dateOfBirth ? format(new Date(data.dateOfBirth), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={data.dateOfBirth ? new Date(data.dateOfBirth) : undefined}
                onSelect={(date) => onUpdate({ ...data, dateOfBirth: date?.toISOString() })}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label>Gender *</Label>
          <Select value={data.gender || ""} onValueChange={(value) => onUpdate({ ...data, gender: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Height */}
        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={data.height || ""}
            onChange={(e) => onUpdate({ ...data, height: e.target.value })}
            placeholder="Enter height in cm"
          />
        </div>
      </div>

      {/* Location Selector */}
      <LocationSelector value={location} onChange={handleLocationChange} required={true} className="mt-6" />

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">About Me</Label>
        <Textarea
          id="bio"
          value={data.bio || ""}
          onChange={(e) => onUpdate({ ...data, bio: e.target.value })}
          placeholder="Tell us about yourself..."
          rows={4}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!data.fullName || !data.dateOfBirth || !data.gender || !validateLocation(location, true)}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
