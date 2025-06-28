"use client"

import type React from "react"
import { useState } from "react"
import type { OnboardingProfile } from "@/lib/types/onboarding"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface LeavesStageProps {
  profile: OnboardingProfile
  updateProfile: (data: Partial<OnboardingProfile>) => void
  onNext: () => void
  onBack: () => void
}

export default function LeavesStage({ profile, updateProfile, onNext, onBack }: LeavesStageProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!profile.education) newErrors.education = "Education is required."
    if (!profile.profession) newErrors.profession = "Profession is required."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext()
    }
  }

  const canProceed = profile.education && profile.profession

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Professional Background</CardTitle>
        <CardDescription>
          Tell us about your education and career. This helps paint a fuller picture of you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Education */}
          <div className="space-y-2">
            <Label htmlFor="education">Highest Education *</Label>
            <Input
              id="education"
              placeholder="e.g., Bachelor's in Computer Science"
              value={profile.education || ""}
              onChange={(e) => updateProfile({ education: e.target.value })}
              className={errors.education ? "border-red-500" : ""}
            />
            {errors.education && <p className="text-sm text-red-500">{errors.education}</p>}
          </div>

          {/* Profession */}
          <div className="space-y-2">
            <Label htmlFor="profession">Profession *</Label>
            <Input
              id="profession"
              placeholder="e.g., Software Engineer"
              value={profile.profession || ""}
              onChange={(e) => updateProfile({ profession: e.target.value })}
              className={errors.profession ? "border-red-500" : ""}
            />
            {errors.profession && <p className="text-sm text-red-500">{errors.profession}</p>}
          </div>

          {/* Annual Income */}
          <div className="space-y-2">
            <Label htmlFor="annual_income">Annual Income (Optional)</Label>
            <Input
              id="annual_income"
              placeholder="e.g., $100,000"
              value={profile.annual_income || ""}
              onChange={(e) => updateProfile({ annual_income: e.target.value })}
            />
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
