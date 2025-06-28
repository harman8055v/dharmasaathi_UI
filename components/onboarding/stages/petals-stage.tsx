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
  const [error, setError] = useState<string | null>(null)

  const handleSelectChange = (name: keyof OnboardingProfile) => (value: string) => {
    updateProfile({ [name]: value })
    if (error) setError(null)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile.diet) {
      setError("Diet preference is required to proceed.")
      return
    }
    setError(null)
    onNext()
  }

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
          <div className="space-y-2">
            <Label htmlFor="diet">Diet Preference *</Label>
            <Select name="diet" value={profile.diet || ""} onValueChange={handleSelectChange("diet")}>
              <SelectTrigger id="diet" className={error ? "border-red-500" : ""}>
                <SelectValue placeholder="Select your diet" />
              </SelectTrigger>
              <SelectContent>
                {VALID_VALUES.diet.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="space-y-2">
            <Label>Spiritual Organizations (Optional)</Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/50">
              {SPIRITUAL_ORGS.map((org) => (
                <button
                  key={org}
                  type="button"
                  onClick={() => handleMultiSelect("spiritual_org", org)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    profile.spiritual_org?.includes(org)
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-background hover:bg-primary/10"
                  }`}
                >
                  {org}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Daily Spiritual Practices (Optional)</Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/50">
              {DAILY_PRACTICES.map((practice) => (
                <button
                  key={practice}
                  type="button"
                  onClick={() => handleMultiSelect("daily_practices", practice)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    profile.daily_practices?.includes(practice)
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-background hover:bg-primary/10"
                  }`}
                >
                  {practice}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBack} type="button">
              Back
            </Button>
            <Button type="submit">Next</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
