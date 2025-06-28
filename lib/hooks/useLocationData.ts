"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface Country {
  id: number
  name: string
}

interface State {
  id: number
  name: string
  country_id: number
}

interface City {
  id: number
  name: string
  state_id: number
}

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCountries() {
      try {
        setLoading(true)
        const { data, error } = await supabase.from("countries").select("id, name").order("name")

        if (error) throw error
        setCountries(data || [])
      } catch (err) {
        console.error("Error fetching countries:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch countries")
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  return { countries, loading, error }
}

export function useStates(countryId: number | null) {
  const [states, setStates] = useState<State[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!countryId) {
      setStates([])
      return
    }

    async function fetchStates() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("states")
          .select("id, name, country_id")
          .eq("country_id", countryId)
          .order("name")

        if (error) throw error
        setStates(data || [])
      } catch (err) {
        console.error("Error fetching states:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch states")
      } finally {
        setLoading(false)
      }
    }

    fetchStates()
  }, [countryId])

  return { states, loading, error }
}

export function useCities(stateId: number | null) {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!stateId) {
      setCities([])
      return
    }

    async function fetchCities() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("cities")
          .select("id, name, state_id")
          .eq("state_id", stateId)
          .order("name")

        if (error) throw error
        setCities(data || [])
      } catch (err) {
        console.error("Error fetching cities:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch cities")
      } finally {
        setLoading(false)
      }
    }

    fetchCities()
  }, [stateId])

  return { cities, loading, error }
}

// Helper function to get India's ID
export async function getIndiaCountryId(): Promise<number | null> {
  try {
    const { data, error } = await supabase.from("countries").select("id").eq("name", "India").single()

    if (error) throw error
    return data?.id || null
  } catch (err) {
    console.error("Error fetching India country ID:", err)
    return null
  }
}
