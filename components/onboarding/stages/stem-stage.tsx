"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Calendar, Ruler } from "lucide-react"
import LocationSelector, { type LocationData, validateLocation } from "@/components/location-selector"

interface StemStageProps {
  data: {
    gender?: string
    birthdate?: string
    height?: string
    country_id?: number | null
    state_id?: number | null
    city_id?: number | null
  }
  onUpdate: (data: any) => void
  onNext: () => void
  onPrev: () => void
}

export default function StemStage({ data, onUpdate, onNext, onPrev }: StemStageProps) {
  const [location, setLocation] = useState<LocationData>({
    country_id: data.country_id || null,
    state_id: data.state_id || null,
    city_id: data.city_id || null,
  })

  const handleLocationChange = (newLocation: LocationData) => {
    setLocation(newLocation)
    onUpdate({
      country_id: newLocation.country_id,
      state_id: newLocation.state_id,
      city_id: newLocation.city_id,
    })
  }

  const handleNext = () => {
    // Validate required fields
    if (!data.gender || !data.birthdate || !validateLocation(location, true)) {
      alert("Please fill in all required fields including your complete location.")
      return
    }
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600">Tell us a bit about yourself</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-gray-700 font-medium">
              Gender <span className="text-red-500">*</span>
            </Label>
            <Select value={data.gender || ""} onValueChange={(value) => onUpdate({ gender: value })}>
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
            <Label htmlFor="birthdate" className="text-gray-700 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date of Birth <span className="text-red-500">*</span>
            </Label>
            <Input
              id="birthdate"
              type="date"
              value={data.birthdate || ""}
              onChange={(e) => onUpdate({ birthdate: e.target.value })}
              max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
            />
          </div>

          {/* Height */}
          <div className="space-y-2">
            <Label htmlFor="height" className="text-gray-700 font-medium flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Height
            </Label>
            <Input
              id="height"
              placeholder="e.g., 5'8&quot; or 173 cm"
              value={data.height || ""}
              onChange={(e) => onUpdate({ height: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Location Selection */}
      <Card>
        <CardContent className="pt-6">
          <LocationSelector value={location} onChange={handleLocationChange} required={true} showLabels={true} />
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button
          onClick={handleNext}
          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
