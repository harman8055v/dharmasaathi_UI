"use client"

import { useState, useEffect } from "react"

export interface Country {
  id: string
  name: string
  code: string
}

export interface State {
  id: string
  name: string
  country_id: string
}

export interface City {
  id: string
  name: string
  state_id: string
}

export function useLocationData() {
  const [countries, setCountries] = useState<Country[]>([])
  const [states, setStates] = useState<State[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState({
    countries: false,
    states: false,
    cities: false,
  })

  // Load countries on mount
  useEffect(() => {
    loadCountries()
  }, [])

  const loadCountries = async () => {
    setLoading((prev) => ({ ...prev, countries: true }))
    try {
      // Mock data for countries - in real app, this would come from Supabase
      const mockCountries: Country[] = [
        { id: "1", name: "India", code: "IN" },
        { id: "2", name: "United States", code: "US" },
        { id: "3", name: "United Kingdom", code: "GB" },
        { id: "4", name: "Canada", code: "CA" },
        { id: "5", name: "Australia", code: "AU" },
        { id: "6", name: "Germany", code: "DE" },
        { id: "7", name: "France", code: "FR" },
        { id: "8", name: "Japan", code: "JP" },
        { id: "9", name: "Singapore", code: "SG" },
        { id: "10", name: "United Arab Emirates", code: "AE" },
      ]
      setCountries(mockCountries)
    } catch (error) {
      console.error("Error loading countries:", error)
    } finally {
      setLoading((prev) => ({ ...prev, countries: false }))
    }
  }

  const loadStates = async (countryId: string) => {
    setLoading((prev) => ({ ...prev, states: true }))
    try {
      // Mock data for Indian states
      const mockStates: State[] =
        countryId === "1"
          ? [
              { id: "1", name: "Andhra Pradesh", country_id: "1" },
              { id: "2", name: "Arunachal Pradesh", country_id: "1" },
              { id: "3", name: "Assam", country_id: "1" },
              { id: "4", name: "Bihar", country_id: "1" },
              { id: "5", name: "Chhattisgarh", country_id: "1" },
              { id: "6", name: "Goa", country_id: "1" },
              { id: "7", name: "Gujarat", country_id: "1" },
              { id: "8", name: "Haryana", country_id: "1" },
              { id: "9", name: "Himachal Pradesh", country_id: "1" },
              { id: "10", name: "Jharkhand", country_id: "1" },
              { id: "11", name: "Karnataka", country_id: "1" },
              { id: "12", name: "Kerala", country_id: "1" },
              { id: "13", name: "Madhya Pradesh", country_id: "1" },
              { id: "14", name: "Maharashtra", country_id: "1" },
              { id: "15", name: "Manipur", country_id: "1" },
              { id: "16", name: "Meghalaya", country_id: "1" },
              { id: "17", name: "Mizoram", country_id: "1" },
              { id: "18", name: "Nagaland", country_id: "1" },
              { id: "19", name: "Odisha", country_id: "1" },
              { id: "20", name: "Punjab", country_id: "1" },
              { id: "21", name: "Rajasthan", country_id: "1" },
              { id: "22", name: "Sikkim", country_id: "1" },
              { id: "23", name: "Tamil Nadu", country_id: "1" },
              { id: "24", name: "Telangana", country_id: "1" },
              { id: "25", name: "Tripura", country_id: "1" },
              { id: "26", name: "Uttar Pradesh", country_id: "1" },
              { id: "27", name: "Uttarakhand", country_id: "1" },
              { id: "28", name: "West Bengal", country_id: "1" },
              { id: "29", name: "Delhi", country_id: "1" },
              { id: "30", name: "Jammu and Kashmir", country_id: "1" },
              { id: "31", name: "Ladakh", country_id: "1" },
              { id: "32", name: "Puducherry", country_id: "1" },
              { id: "33", name: "Chandigarh", country_id: "1" },
              { id: "34", name: "Dadra and Nagar Haveli and Daman and Diu", country_id: "1" },
              { id: "35", name: "Lakshadweep", country_id: "1" },
              { id: "36", name: "Andaman and Nicobar Islands", country_id: "1" },
            ]
          : []

      setStates(mockStates)
    } catch (error) {
      console.error("Error loading states:", error)
    } finally {
      setLoading((prev) => ({ ...prev, states: false }))
    }
  }

  const loadCities = async (stateId: string) => {
    setLoading((prev) => ({ ...prev, cities: true }))
    try {
      // Mock data for cities based on state
      const mockCities: City[] = []

      // Add cities based on state
      if (stateId === "14") {
        // Maharashtra
        mockCities.push(
          { id: "1", name: "Mumbai", state_id: "14" },
          { id: "2", name: "Pune", state_id: "14" },
          { id: "3", name: "Nagpur", state_id: "14" },
          { id: "4", name: "Nashik", state_id: "14" },
          { id: "5", name: "Aurangabad", state_id: "14" },
          { id: "6", name: "Solapur", state_id: "14" },
          { id: "7", name: "Kolhapur", state_id: "14" },
          { id: "8", name: "Sangli", state_id: "14" },
          { id: "9", name: "Thane", state_id: "14" },
          { id: "10", name: "Navi Mumbai", state_id: "14" },
        )
      } else if (stateId === "11") {
        // Karnataka
        mockCities.push(
          { id: "11", name: "Bangalore", state_id: "11" },
          { id: "12", name: "Mysore", state_id: "11" },
          { id: "13", name: "Hubli", state_id: "11" },
          { id: "14", name: "Mangalore", state_id: "11" },
          { id: "15", name: "Belgaum", state_id: "11" },
          { id: "16", name: "Gulbarga", state_id: "11" },
          { id: "17", name: "Davangere", state_id: "11" },
          { id: "18", name: "Bellary", state_id: "11" },
          { id: "19", name: "Bijapur", state_id: "11" },
          { id: "20", name: "Shimoga", state_id: "11" },
        )
      } else if (stateId === "29") {
        // Delhi
        mockCities.push(
          { id: "21", name: "New Delhi", state_id: "29" },
          { id: "22", name: "Central Delhi", state_id: "29" },
          { id: "23", name: "North Delhi", state_id: "29" },
          { id: "24", name: "South Delhi", state_id: "29" },
          { id: "25", name: "East Delhi", state_id: "29" },
          { id: "26", name: "West Delhi", state_id: "29" },
          { id: "27", name: "North East Delhi", state_id: "29" },
          { id: "28", name: "North West Delhi", state_id: "29" },
          { id: "29", name: "South East Delhi", state_id: "29" },
          { id: "30", name: "South West Delhi", state_id: "29" },
        )
      } else {
        // Generic cities for other states
        mockCities.push(
          { id: `${stateId}01`, name: "City 1", state_id: stateId },
          { id: `${stateId}02`, name: "City 2", state_id: stateId },
          { id: `${stateId}03`, name: "City 3", state_id: stateId },
        )
      }

      setCities(mockCities)
    } catch (error) {
      console.error("Error loading cities:", error)
    } finally {
      setLoading((prev) => ({ ...prev, cities: false }))
    }
  }

  return {
    countries,
    states,
    cities,
    loading,
    loadStates,
    loadCities,
  }
}
