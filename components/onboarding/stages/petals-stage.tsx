"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"
import type { OnboardingProfile } from "@/lib/types/onboarding"
import { VALID_VALUES } from "@/lib/types/onboarding"
import { SPIRITUAL_ORGS } from "@/lib/constants/spiritual-orgs"
import { DAILY_PRACTICES } from "@/lib/constants/daily-practices"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface PetalsStageProps {
  profile: OnboardingProfile
  updateProfile: (data: Partial<OnboardingProfile>) => void
  onNext: () => void
  onBack: () => void
}

export default function PetalsStage({ profile, updateProfile, onNext, onBack }: PetalsStageProps) {
  // Destructure with null defaults
  const {
    spiritual_org = [],
    daily_practices = [],
    diet = null,
    temple_visit_freq = null,
    vanaprastha_interest = null,
    artha_vs_moksha = null,
  } = profile

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    updateProfile({ ...profile, [name]: value || null })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleMultiSelect = (
    name: keyof Pick<OnboardingProfile, "spiritual_org" | "daily_practices">,
    value: string,
  ) => {
    const currentValues = profile[name] || []

    if (currentValues.includes(value)) {
      updateProfile({
        ...profile,
        [name]: currentValues.filter((v) => v !== value),
      })
    } else {
      updateProfile({
        ...profile,
        [name]: [...currentValues, value],
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!diet) {
      newErrors.diet = "Please select your diet preference"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext() // Trigger next stage
    }
  }

  const handleSkip = () => {
    const dataToSave: Partial<OnboardingProfile> = {
      diet: null,
      temple_visit_freq: null,
      vanaprastha_interest: null,
      artha_vs_moksha: null,
    }
    updateProfile(dataToSave) // Update local form data
    onNext() // Trigger next stage
  }

  const spiritualOrgs = [...SPIRITUAL_ORGS]

  const dailyPractices = [...DAILY_PRACTICES]

  const dietOptions = VALID_VALUES.diet.filter((d) => d !== null)
  const templeFreqOptions = VALID_VALUES.temple_visit_freq.filter((t) => t !== null)
  const vanaprasthaOptions = VALID_VALUES.vanaprastha_interest.filter((v) => v !== null)
  const arthaMokshaOptions = VALID_VALUES.artha_vs_moksha.filter((a) => a !== null)

  const canProceed = profile.diet

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spiritual & Lifestyle</CardTitle>
        <CardDescription>Share some of your spiritual practices and preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Spiritual Organizations */}
        <div className="space-y-2">
          <Label className="block text-sm font-medium text-foreground">
            Spiritual Organizations (Select all that apply)
          </Label>
          <div className="flex flex-wrap gap-2">
            {spiritualOrgs.map((org) => (
              <button
                key={org}
                type="button"
                onClick={() => handleMultiSelect("spiritual_org", org)}
                className={`px-3 py-1 text-sm rounded-full ${
                  spiritual_org.includes(org) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {org}
              </button>
            ))}
          </div>
          {spiritual_org.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {spiritual_org.map((org) => (
                <span
                  key={org}
                  className="inline-flex items-center bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs"
                >
                  {org}
                  <button
                    type="button"
                    onClick={() => handleMultiSelect("spiritual_org", org)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Daily Practices */}
        <div className="space-y-2">
          <Label className="block text-sm font-medium text-foreground">
            Daily Spiritual Practices (Select all that apply)
          </Label>
          <div className="flex flex-wrap gap-2">
            {dailyPractices.map((practice) => (
              <button
                key={practice}
                type="button"
                onClick={() => handleMultiSelect("daily_practices", practice)}
                className={`px-3 py-1 text-sm rounded-full ${
                  daily_practices.includes(practice)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {practice}
              </button>
            ))}
          </div>
          {daily_practices.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {daily_practices.map((practice) => (
                <span
                  key={practice}
                  className="inline-flex items-center bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs"
                >
                  {practice}
                  <button
                    type="button"
                    onClick={() => handleMultiSelect("daily_practices", practice)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Diet */}
        <div>
          <Label htmlFor="diet">Diet</Label>
          <Input id="diet" value={diet || ""} onChange={(e) => updateProfile({ diet: e.target.value })} />
        </div>

        {/* Temple Visit Frequency */}
        <div className="space-y-2">
          <Label htmlFor="temple_visit_freq" className="block text-sm font-medium text-foreground">
            Temple Visit Frequency
          </Label>
          <select
            id="temple_visit_freq"
            name="temple_visit_freq"
            value={temple_visit_freq || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select frequency</option>
            {templeFreqOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Vanaprastha Interest */}
        <div className="space-y-2">
          <Label htmlFor="vanaprastha_interest" className="block text-sm font-medium text-foreground">
            Interest in Vanaprastha (Spiritual Retirement)
          </Label>
          <select
            id="vanaprastha_interest"
            name="vanaprastha_interest"
            value={vanaprastha_interest || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select interest level</option>
            {vanaprasthaOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Artha vs Moksha */}
        <div className="space-y-2">
          <Label htmlFor="artha_vs_moksha" className="block text-sm font-medium text-foreground">
            Balance between Material Prosperity (Artha) and Spiritual Liberation (Moksha)
          </Label>
          <select
            id="artha_vs_moksha"
            name="artha_vs_moksha"
            value={artha_vs_moksha || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select your preference</option>
            {arthaMokshaOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Display any server errors */}
        {/* {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )} */}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={!canProceed}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
