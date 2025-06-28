"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronDown, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useLocationData, type Country, type State, type City } from "@/lib/hooks/useLocationData"

interface LocationSelectorProps {
  value: {
    country_id?: string
    state_id?: string
    city_id?: string
  }
  onChange: (value: { country_id?: string; state_id?: string; city_id?: string }) => void
  defaultToIndia?: boolean
  className?: string
}

export default function LocationSelector({
  value,
  onChange,
  defaultToIndia = true,
  className = "",
}: LocationSelectorProps) {
  const { countries, states, cities, loading, loadStates, loadCities } = useLocationData()

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [selectedState, setSelectedState] = useState<State | null>(null)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  const [openCountry, setOpenCountry] = useState(false)
  const [openState, setOpenState] = useState(false)
  const [openCity, setOpenCity] = useState(false)

  const [hasSetDefault, setHasSetDefault] = useState(false)

  // Set India as default when countries load
  useEffect(() => {
    if (defaultToIndia && countries.length > 0 && !hasSetDefault && !value.country_id) {
      const india = countries.find((c) => c.name === "India")
      if (india) {
        setSelectedCountry(india)
        loadStates(india.id)
        onChange({ country_id: india.id, state_id: undefined, city_id: undefined })
        setHasSetDefault(true)
      }
    }
  }, [countries, defaultToIndia, hasSetDefault, value.country_id, loadStates, onChange])

  // Initialize selected values from props
  useEffect(() => {
    if (value.country_id && countries.length > 0) {
      const country = countries.find((c) => c.id === value.country_id)
      if (country && country !== selectedCountry) {
        setSelectedCountry(country)
        if (!states.length) {
          loadStates(country.id)
        }
      }
    }
  }, [value.country_id, countries, selectedCountry, states.length, loadStates])

  useEffect(() => {
    if (value.state_id && states.length > 0) {
      const state = states.find((s) => s.id === value.state_id)
      if (state && state !== selectedState) {
        setSelectedState(state)
        if (!cities.length) {
          loadCities(state.id)
        }
      }
    }
  }, [value.state_id, states, selectedState, cities.length, loadCities])

  useEffect(() => {
    if (value.city_id && cities.length > 0) {
      const city = cities.find((c) => c.id === value.city_id)
      if (city && city !== selectedCity) {
        setSelectedCity(city)
      }
    }
  }, [value.city_id, cities, selectedCity])

  const handleCountrySelect = useCallback(
    (country: Country) => {
      setSelectedCountry(country)
      setSelectedState(null)
      setSelectedCity(null)
      setOpenCountry(false)
      loadStates(country.id)
      onChange({ country_id: country.id, state_id: undefined, city_id: undefined })
    },
    [loadStates, onChange],
  )

  const handleStateSelect = useCallback(
    (state: State) => {
      setSelectedState(state)
      setSelectedCity(null)
      setOpenState(false)
      loadCities(state.id)
      onChange({
        country_id: selectedCountry?.id,
        state_id: state.id,
        city_id: undefined,
      })
    },
    [selectedCountry?.id, loadCities, onChange],
  )

  const handleCitySelect = useCallback(
    (city: City) => {
      setSelectedCity(city)
      setOpenCity(false)
      onChange({
        country_id: selectedCountry?.id,
        state_id: selectedState?.id,
        city_id: city.id,
      })
    },
    [selectedCountry?.id, selectedState?.id, onChange],
  )

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Country Selector */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Country *
        </Label>
        <Popover open={openCountry} onOpenChange={setOpenCountry}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openCountry}
              className="w-full justify-between h-11 bg-transparent"
              disabled={loading.countries}
            >
              {selectedCountry ? selectedCountry.name : "Select country..."}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search countries..." className="h-9" />
              <CommandList>
                <CommandEmpty>No countries found.</CommandEmpty>
                <CommandGroup>
                  {countries.map((country) => (
                    <CommandItem
                      key={country.id}
                      value={country.name}
                      onSelect={() => handleCountrySelect(country)}
                      className="cursor-pointer"
                    >
                      {country.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* State Selector */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">State/Province *</Label>
        <Popover open={openState} onOpenChange={setOpenState}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openState}
              className="w-full justify-between h-11 bg-transparent"
              disabled={!selectedCountry || loading.states}
            >
              {selectedState ? selectedState.name : "Select state..."}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search states..." className="h-9" />
              <CommandList>
                <CommandEmpty>No states found.</CommandEmpty>
                <CommandGroup>
                  {states.map((state) => (
                    <CommandItem
                      key={state.id}
                      value={state.name}
                      onSelect={() => handleStateSelect(state)}
                      className="cursor-pointer"
                    >
                      {state.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* City Selector */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">City *</Label>
        <Popover open={openCity} onOpenChange={setOpenCity}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openCity}
              className="w-full justify-between h-11 bg-transparent"
              disabled={!selectedState || loading.cities}
            >
              {selectedCity ? selectedCity.name : "Select city..."}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search cities..." className="h-9" />
              <CommandList>
                <CommandEmpty>No cities found.</CommandEmpty>
                <CommandGroup>
                  {cities.map((city) => (
                    <CommandItem
                      key={city.id}
                      value={city.name}
                      onSelect={() => handleCitySelect(city)}
                      className="cursor-pointer"
                    >
                      {city.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
