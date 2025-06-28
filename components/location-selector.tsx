"use client"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, MapPin } from "lucide-react"
import { useCountries, useStates, useCities } from "@/lib/hooks/useLocationData"

export interface LocationFormState {
  country_id: number | null
  state_id: number | null
  city_id: number | null
}

interface LocationSelectorProps {
  value: LocationFormState
  onChange: (location: LocationFormState) => void
  disabled?: boolean
  required?: boolean
  showLabels?: boolean
  className?: string
}

export default function LocationSelector({
  value,
  onChange,
  disabled = false,
  required = false,
  showLabels = true,
  className = "",
}: LocationSelectorProps) {
  const { countries, loading: countriesLoading } = useCountries()
  const { states, loading: statesLoading } = useStates(value.country_id)
  const { cities, loading: citiesLoading } = useCities(value.state_id)

  const handleCountryChange = (countryId: string) => {
    // Reset dependent dropdowns when country changes
    onChange({
      country_id: Number.parseInt(countryId),
      state_id: null,
      city_id: null,
    })
  }

  const handleStateChange = (stateId: string) => {
    // Reset city when state changes
    onChange({
      ...value,
      state_id: Number.parseInt(stateId),
      city_id: null,
    })
  }

  const handleCityChange = (cityId: string) => {
    onChange({
      ...value,
      city_id: Number.parseInt(cityId),
    })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showLabels && (
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">Location</h3>
          {required && <span className="text-red-500">*</span>}
        </div>
      )}

      {/* Country Selection */}
      <div className="space-y-2">
        <Label htmlFor="country" className="text-gray-700 font-medium">
          Country {required && <span className="text-red-500">*</span>}
        </Label>
        <Select
          value={value.country_id?.toString() || ""}
          onValueChange={handleCountryChange}
          disabled={disabled || countriesLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={countriesLoading ? "Loading countries..." : "Select Country"} />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.id} value={country.id.toString()}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* State Selection */}
      <div className="space-y-2">
        <Label htmlFor="state" className="text-gray-700 font-medium">
          State {required && <span className="text-red-500">*</span>}
        </Label>
        <Select
          value={value.state_id?.toString() || ""}
          onValueChange={handleStateChange}
          disabled={disabled || !value.country_id || statesLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                !value.country_id ? "Select Country first" : statesLoading ? "Loading states..." : "Select State"
              }
            />
            {statesLoading && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem key={state.id} value={state.id.toString()}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City Selection */}
      <div className="space-y-2">
        <Label htmlFor="city" className="text-gray-700 font-medium">
          City {required && <span className="text-red-500">*</span>}
        </Label>
        <Select
          value={value.city_id?.toString() || ""}
          onValueChange={handleCityChange}
          disabled={disabled || !value.state_id || citiesLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={!value.state_id ? "Select State first" : citiesLoading ? "Loading cities..." : "Select City"}
            />
            {citiesLoading && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.id.toString()}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Validation Message */}
      {required && (!value.country_id || !value.state_id || !value.city_id) && (
        <p className="text-sm text-gray-500 mt-2">Please select your complete location (Country, State, and City)</p>
      )}
    </div>
  )
}

// Helper function to validate location data
export function validateLocation(location: LocationFormState, required = false): boolean {
  if (!required) return true
  return !!(location.country_id && location.state_id && location.city_id)
}
