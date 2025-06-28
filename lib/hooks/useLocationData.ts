"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export interface Country {
  id: number
  name: string
  code: string
}

export interface State {
  id: number
  name: string
  state_code: string
  country_id: number
}

export interface City {
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
        const { data, error } = await supabase.from("countries").select("id, name, code").order("name")

        if (error) throw error
        setCountries(data || [])
      } catch (err: any) {
        setError(err.message)
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
          .select("id, name, state_code, country_id")
          .eq("country_id", countryId)
          .order("name")

        if (error) throw error
        setStates(data || [])
      } catch (err: any) {
        setError(err.message)
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
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCities()
  }, [stateId])

  return { cities, loading, error }
}
