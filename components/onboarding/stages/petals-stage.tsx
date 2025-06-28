"use client"

import type React from "react"
import { useState } from "react"
import type { OnboardingProfile } from "@/lib/types/onboarding"
import { VALID_VALUES } from "@/lib/types/onboarding"
import { SPIRITUAL_ORGS } from "@/lib/constants/spiritual-orgs"
import { DAILY_PRACTICES } from "@/lib/constants/daily-practices"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PetalsStageProps {
  profile: OnboardingProfile
  updateProfile: (data: Partial<OnboardingProfile>) => void
  onNext: () => void
  onBack: () => void
}

export default function PetalsStage({ profile, updateProfile, onNext, onBack }: PetalsStageProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSelectChange = (name: keyof OnboardingProfile) => (value: string) => {
    updateProfile({ [name]: value || null })
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleMultiSelect = (
    name: keyof Pick<OnboardingProfile, "spiritual_org" | "daily_practices">,
    value: string,
  ) => {
    const currentValues = profile[name] || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]
    updateProfile({ [name]: newValues })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!profile.diet) {
      newErrors.diet = "Please select your diet preference."
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

  const canProceed = !!profile.diet

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Spiritual & Lifestyle</CardTitle>
        <CardDescription>
          Share your spiritual practices and preferences. This helps us find a truly compatible match.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Diet */}
          <div className="space-y-2">
            <Label htmlFor="diet">Diet Preference *</Label>
            <Select name="diet" value={profile.diet || ""} onValueChange={handleSelectChange("diet")}>
              <SelectTrigger id="diet" className={errors.diet ? "border-red-500" : ""}>
                <SelectValue placeholder="Select your diet" />
              </SelectTrigger>
              <SelectContent>
                {VALID_VALUES.diet.filter(Boolean).map((option) => (
                  <SelectItem key={option} value={option!}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.diet && <p className="text-sm text-red-500">{errors.diet}</p>}
          </div>

          {/* Spiritual Organizations */}
          <div className="space-y-2">
            <Label>Spiritual Organizations (Select all that apply)</Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              {SPIRITUAL_ORGS.map((org) => (
                <button
                  key={org}
                  type="button"
                  onClick={() => handleMultiSelect("spiritual_org", org)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    profile.spiritual_org?.includes(org)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {org}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Practices */}
          <div className="space-y-2">
            <Label>Daily Spiritual Practices (Select all that apply)</Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              {DAILY_PRACTICES.map((practice) => (
                <button
                  key={practice}
                  type="button"
                  onClick={() => handleMultiSelect("daily_practices", practice)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    profile.daily_practices?.includes(practice)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {practice}
                </button>
              ))}
            </div>
          </div>

          {/* Temple Visit Frequency */}
          <div className="space-y-2">
            <Label htmlFor="temple_visit_freq">Temple Visit Frequency</Label>
            <Select
              name="temple_visit_freq"
              value={profile.temple_visit_freq || ""}
              onValueChange={handleSelectChange("temple_visit_freq")}
            >
              <SelectTrigger id="temple_visit_freq">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {VALID_VALUES.temple_visit_freq.filter(Boolean).map((option) => (
                  <SelectItem key={option} value={option!}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Vanaprastha Interest */}
          <div className="space-y-2">
            <Label htmlFor="vanaprastha_interest">Interest in Vanaprastha (Spiritual Retirement)</Label>
            <Select
              name="vanaprastha_interest"
              value={profile.vanaprastha_interest || ""}
              onValueChange={handleSelectChange("vanaprastha_interest")}
            >
              <SelectTrigger id="vanaprastha_interest">
                <SelectValue placeholder="Select interest level" />
              </SelectTrigger>
              <SelectContent>
                {VALID_VALUES.vanaprastha_interest.filter(Boolean).map((option) => (
                  <SelectItem key={option} value={option!}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Artha vs Moksha */}
          <div className="space-y-2">
            <Label htmlFor="artha_vs_moksha">Balance between Artha (Prosperity) and Moksha (Liberation)</Label>
            <Select
              name="artha_vs_moksha"
              value={profile.artha_vs_moksha || ""}
              onValueChange={handleSelectChange("artha_vs_moksha")}
            >
              <SelectTrigger id="artha_vs_moksha">
                <SelectValue placeholder="Select your preference" />
              </SelectTrigger>
              <SelectContent>
                {VALID_VALUES.artha_vs_moksha.filter(Boolean).map((option) => (
                  <SelectItem key={option} value={option!}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBack} type="button">
              Back
            </Button>
            <Button type="submit" disabled={!canProceed}>
              Next
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
