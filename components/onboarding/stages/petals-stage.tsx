"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { SPIRITUAL_ORGS } from "@/lib/constants/spiritual-orgs"
import { DAILY_PRACTICES } from "@/lib/constants/daily-practices"
import { VALID_VALUES } from "@/lib/types/onboarding"
import type { OnboardingProfile } from "@/lib/types/onboarding"

interface PetalsStageProps {
  profile: OnboardingProfile
  updateProfile: (data: Partial<OnboardingProfile>) => void
  onNext: () => void
  onPrev: () => void
}

export default function PetalsStage({ profile, updateProfile, onNext, onPrev }: PetalsStageProps) {
  const [formData, setFormData] = useState({
    diet: profile.diet || "",
    temple_visit_freq: profile.temple_visit_freq || "",
    vanaprastha_interest: profile.vanaprastha_interest || "",
    artha_vs_moksha: profile.artha_vs_moksha || "",
    spiritual_org: profile.spiritual_org || [],
    daily_practices: profile.daily_practices || [],
  })

  const handleSpiritualOrgChange = (org: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      spiritual_org: checked
        ? [...(prev.spiritual_org || []), org]
        : (prev.spiritual_org || []).filter((item) => item !== org),
    }))
  }

  const handleDailyPracticeChange = (practice: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      daily_practices: checked
        ? [...(prev.daily_practices || []), practice]
        : (prev.daily_practices || []).filter((item) => item !== practice),
    }))
  }

  const handleNext = () => {
    updateProfile(formData)
    onNext()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Spiritual Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Diet */}
        <div className="space-y-2">
          <Label>Diet Preference</Label>
          <Select value={formData.diet} onValueChange={(value) => setFormData((prev) => ({ ...prev, diet: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select your diet preference" />
            </SelectTrigger>
            <SelectContent>
              {VALID_VALUES.diet.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Temple Visit Frequency */}
        <div className="space-y-2">
          <Label>Temple Visit Frequency</Label>
          <Select
            value={formData.temple_visit_freq}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, temple_visit_freq: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="How often do you visit temples?" />
            </SelectTrigger>
            <SelectContent>
              {VALID_VALUES.temple_visit_freq.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Vanaprastha Interest */}
        <div className="space-y-2">
          <Label>Interest in Vanaprastha (Retirement to Spiritual Life)</Label>
          <Select
            value={formData.vanaprastha_interest}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, vanaprastha_interest: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Are you interested in Vanaprastha?" />
            </SelectTrigger>
            <SelectContent>
              {VALID_VALUES.vanaprastha_interest.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Artha vs Moksha */}
        <div className="space-y-2">
          <Label>Life Focus: Artha vs Moksha</Label>
          <Select
            value={formData.artha_vs_moksha}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, artha_vs_moksha: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="What is your life focus?" />
            </SelectTrigger>
            <SelectContent>
              {VALID_VALUES.artha_vs_moksha.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Spiritual Organizations */}
        <div className="space-y-3">
          <Label>Spiritual Organizations (Select all that apply)</Label>
          <div className="grid grid-cols-2 gap-3">
            {SPIRITUAL_ORGS.map((org) => (
              <div key={org} className="flex items-center space-x-2">
                <Checkbox
                  id={`org-${org}`}
                  checked={(formData.spiritual_org || []).includes(org)}
                  onCheckedChange={(checked) => handleSpiritualOrgChange(org, checked as boolean)}
                />
                <Label htmlFor={`org-${org}`} className="text-sm font-normal">
                  {org}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Practices */}
        <div className="space-y-3">
          <Label>Daily Spiritual Practices (Select all that apply)</Label>
          <div className="grid grid-cols-2 gap-3">
            {DAILY_PRACTICES.map((practice) => (
              <div key={practice} className="flex items-center space-x-2">
                <Checkbox
                  id={`practice-${practice}`}
                  checked={(formData.daily_practices || []).includes(practice)}
                  onCheckedChange={(checked) => handleDailyPracticeChange(practice, checked as boolean)}
                />
                <Label htmlFor={`practice-${practice}`} className="text-sm font-normal">
                  {practice}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPrev}>
            Previous
          </Button>
          <Button onClick={handleNext}>Next</Button>
        </div>
      </CardContent>
    </Card>
  )
}
