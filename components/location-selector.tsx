"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { LocationFormState } from "@/lib/types/onboarding"

// Import the location data
import statesData from "@/lib/data/india_states.json"
import citiesData from "@/lib/data/india_cities.json"

interface LocationSelectorProps {
  value: LocationFormState
  onChange: (value: LocationFormState) => void
}

export function LocationSelector({
  value = { country_id: null, state_id: null, city_id: null },
  onChange,
}: LocationSelectorProps) {
  const [states, setStates] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])

  // For now, we'll assume India (country_id: 1) since we have Indian states/cities data
  const INDIA_COUNTRY_ID = 1

  useEffect(() => {
    // Set India as default country and load states
    if (!value.country_id) {
      onChange({
        ...value,
        country_id: INDIA_COUNTRY_ID,
      })
    }
    setStates(statesData)
  }, [])

  useEffect(() => {
    if (value.state_id) {
      // Filter cities by selected state
      const stateCities = citiesData.filter((city: any) => city.state_id === value.state_id)
      setCities(stateCities)
    } else {
      setCities([])
    }
  }, [value.state_id])

  const handleStateChange = (stateId: string) => {
    const newStateId = Number.parseInt(stateId)
    onChange({
      ...value,
      state_id: newStateId,
      city_id: null, // Reset city when state changes
    })
  }

  const handleCityChange = (cityId: string) => {
    const newCityId = Number.parseInt(cityId)
    onChange({
      ...value,
      city_id: newCityId,
    })
  }

  return (
    <div className="space-y-4">
      {/* Country (Fixed to India for now) */}
      <div className="space-y-2">
        <Label>Country</Label>
        <Select value="1" disabled>
          <SelectTrigger>
            <SelectValue placeholder="India" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">India</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* State */}
      <div className="space-y-2">
        <Label>State</Label>
        <Select value={value.state_id?.toString() || ""} onValueChange={handleStateChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            {states.map((state: any) => (
              <SelectItem key={state.id} value={state.id.toString()}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label>City</Label>
        <Select value={value.city_id?.toString() || ""} onValueChange={handleCityChange} disabled={!value.state_id}>
          <SelectTrigger>
            <SelectValue placeholder={value.state_id ? "Select a city" : "Select a state first"} />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city: any) => (
              <SelectItem key={city.id} value={city.id.toString()}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
