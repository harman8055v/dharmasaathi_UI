"use client"
import { useState } from "react"
import { User, Calendar, Ruler } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import LocationSelector, { type LocationData, validateLocation } from "@/components/location-selector"

interface OnboardingData {
  gender?: string | null
  birthdate?: string | null
  height?: string | null
  country_id?: number | null
  country?: string | null
  state_id?: number | null
  state?: string | null
  city_id?: number | null
  city?: string | null
}

interface StemStageProps {
  formData: any
  onChange: (updates: any) => void
  onNext: (updates: Partial<OnboardingData>) => void
  isLoading: boolean
  error?: string | null
}

export default function StemStage({ formData, onChange, onNext, isLoading, error }: StemStageProps) {
  const [localError, setLocalError] = useState<string | null>(null)

  // Initialize location data from formData
  const [locationData, setLocationData] = useState<LocationData>({
    country_id: formData?.country_id || null,
    country_name: formData?.country || null,
    state_id: formData?.state_id || null,
    state_name: formData?.state || null,
    city_id: formData?.city_id || null,
    city_name: formData?.city || null,
  })

  const handleLocationChange = (newLocation: LocationData) => {
    setLocationData(newLocation)
    onChange({
      country_id: newLocation.country_id,
      country: newLocation.country_name,
      state_id: newLocation.state_id,
      state: newLocation.state_name,
      city_id: newLocation.city_id,
      city: newLocation.city_name,
    })
  }

  const handleNext = () => {
    setLocalError(null)

    // Validate required fields
    if (!formData?.gender) {
      setLocalError("Please select your gender")
      return
    }

    if (!formData?.birthdate) {
      setLocalError("Please enter your birth date")
      return
    }

    if (!formData?.height) {
      setLocalError("Please enter your height")
      return
    }

    if (!validateLocation(locationData, true)) {
      setLocalError("Please select your complete location (Country, State, and City)")
      return
    }

    // Proceed to next stage
    onNext({
      gender: formData.gender,
      birthdate: formData.birthdate,
      height: formData.height,
      country_id: locationData.country_id,
      country: locationData.country_name,
      state_id: locationData.state_id,
      state: locationData.state_name,
      city_id: locationData.city_id,
      city: locationData.city_name,
    })
  }

  const currentYear = new Date().getFullYear()
  const minDate = `${currentYear - 60}-01-01`
  const maxDate = `${currentYear - 18}-12-31`

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Growing Your Stem 🌱</h2>
        <p className="text-gray-600">Let's add your basic information to help you find your perfect match</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
        {(localError || error) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{localError || error}</p>
          </div>
        )}

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-gray-700 font-medium flex items-center gap-2">
            <User className="w-4 h-4" />
            Gender *
          </Label>
          <Select value={formData?.gender || ""} onValueChange={(value) => onChange({ gender: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Birth Date */}
        <div className="space-y-2">
          <Label htmlFor="birthdate" className="text-gray-700 font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date of Birth *
          </Label>
          <Input
            id="birthdate"
            type="date"
            value={formData?.birthdate || ""}
            onChange={(e) => onChange({ birthdate: e.target.value })}
            min={minDate}
            max={maxDate}
            className="w-full"
          />
          <p className="text-xs text-gray-500">You must be between 18 and 60 years old</p>
        </div>

        {/* Height */}
        <div className="space-y-2">
          <Label htmlFor="height" className="text-gray-700 font-medium flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            Height *
          </Label>
          <Input
            id="height"
            type="text"
            value={formData?.height || ""}
            onChange={(e) => onChange({ height: e.target.value })}
            placeholder="e.g., 5'8&quot; or 173 cm"
            className="w-full"
          />
          <p className="text-xs text-gray-500">Enter your height in feet/inches or centimeters</p>
        </div>

        {/* Location Selector */}
        <div className="space-y-2">
          <LocationSelector value={locationData} onChange={handleLocationChange} required={true} showLabels={true} />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center">
        <Button
          onClick={handleNext}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Growing your stem...
            </span>
          ) : (
            "Continue to Leaves Stage 🍃"
          )}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Your information is secure and will only be used to find compatible matches.
        </p>
      </div>
    </div>
  )
}
