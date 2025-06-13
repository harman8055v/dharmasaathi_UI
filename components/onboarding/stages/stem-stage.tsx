"use client"

import type React from "react"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import type { OnboardingData } from "@/lib/types/onboarding"
import { VALID_VALUES } from "@/lib/types/onboarding"

interface StemStageProps {
  formData: OnboardingData
  onChange: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  isLoading: boolean
  error?: string | null
}

export default function StemStage({ formData, onChange, onNext, isLoading, error }: StemStageProps) {
  // Destructure with null defaults
  const { gender = null, birthdate = null, city = null, state = null, country = null, mother_tongue = null } = formData

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validGenderOptions = VALID_VALUES.gender.filter((g) => g !== null) as Array<"Male" | "Female" | "Other">

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Special handling for gender to ensure it matches valid values
    if (name === "gender") {
      const genderValue = value as OnboardingData["gender"]
      onChange({ ...formData, [name]: genderValue || null })
    } else {
      onChange({ ...formData, [name]: value || null })
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!gender) {
      newErrors.gender = "Please select your gender"
    }

    if (!birthdate) {
      newErrors.birthdate = "Please enter your birthdate"
    } else {
      const birthDate = new Date(birthdate)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 18) {
        newErrors.birthdate = "You must be at least 18 years old"
      }
      if (age > 100) {
        newErrors.birthdate = "Please enter a valid birthdate"
      }
    }

    if (!city?.trim()) {
      newErrors.city = "Please enter your city"
    }

    if (!state?.trim()) {
      newErrors.state = "Please enter your state"
    }

    if (!country?.trim()) {
      newErrors.country = "Please enter your country"
    }

    if (!mother_tongue?.trim()) {
      newErrors.mother_tongue = "Please enter your mother tongue"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext()
    }
  }

  const handleSkip = () => {
    // Set skipped fields to null
    onChange({
      ...formData,
      gender: null,
      birthdate: null,
      city: null,
      state: null,
      country: null,
      mother_tongue: null,
    })
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-4xl mb-4">🌱</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's sprout your profile</h2>
        <p className="text-gray-600">Tell us about yourself to help us find your perfect match</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Gender Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">Gender *</label>
          <div className="grid grid-cols-3 gap-3">
            {validGenderOptions.map((option) => (
              <label
                key={option}
                className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  gender === option ? "border-orange-500 bg-orange-50" : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  checked={gender === option}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className={`text-sm font-medium ${gender === option ? "text-orange-600" : "text-gray-700"}`}>
                  {option}
                </span>
                {gender === option && <div className="ml-2 w-2 h-2 bg-orange-600 rounded-full"></div>}
              </label>
            ))}
          </div>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
        </div>

        {/* Birthdate */}
        <div className="space-y-2">
          <label htmlFor="birthdate" className="block text-sm font-semibold text-gray-700">
            Date of Birth *
          </label>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            value={birthdate || ""}
            onChange={handleChange}
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
              errors.birthdate ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.birthdate && <p className="text-red-500 text-sm">{errors.birthdate}</p>}
        </div>

        {/* City */}
        <div className="space-y-2">
          <label htmlFor="city" className="block text-sm font-semibold text-gray-700">
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={city || ""}
            onChange={handleChange}
            placeholder="Enter your city"
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
              errors.city ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        </div>

        {/* State */}
        <div className="space-y-2">
          <label htmlFor="state" className="block text-sm font-semibold text-gray-700">
            State/Province *
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={state || ""}
            onChange={handleChange}
            placeholder="Enter your state or province"
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
              errors.state ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
        </div>

        {/* Country */}
        <div className="space-y-2">
          <label htmlFor="country" className="block text-sm font-semibold text-gray-700">
            Country *
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={country || ""}
            onChange={handleChange}
            placeholder="Enter your country"
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
              errors.country ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
        </div>

        {/* Mother Tongue */}
        <div className="space-y-2">
          <label htmlFor="mother_tongue" className="block text-sm font-semibold text-gray-700">
            Mother Tongue *
          </label>
          <input
            type="text"
            id="mother_tongue"
            name="mother_tongue"
            value={mother_tongue || ""}
            onChange={handleChange}
            placeholder="Enter your mother tongue"
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
              errors.mother_tongue ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.mother_tongue && <p className="text-red-500 text-sm">{errors.mother_tongue}</p>}
        </div>

        {/* Display any server errors */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-4 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </span>
            ) : (
              "Continue to Next Stage"
            )}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            disabled={isLoading}
            className="px-6 py-4 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Skip
          </button>
        </div>
      </form>
    </div>
  )
}
