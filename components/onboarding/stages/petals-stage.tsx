"use client"
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
  const handleSelectChange = (name: keyof OnboardingProfile) => (value: string) => {
    updateProfile({ [name]: value || null })
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

  const canProceed = !!profile.diet

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Spiritual & Lifestyle</CardTitle>
        <CardDescription>
          Share your spiritual practices and preferences. This helps us find a truly compatible match.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="diet">Diet Preference *</Label>
          <Select name="diet" value={profile.diet || ""} onValueChange={handleSelectChange("diet")}>
            <SelectTrigger id="diet">
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
              {VALID_VALUES.temple_visit_freq.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vanaprastha_interest">Interest in Vanaprastha</Label>
          <Select
            name="vanaprastha_interest"
            value={profile.vanaprastha_interest || ""}
            onValueChange={handleSelectChange("vanaprastha_interest")}
          >
            <SelectTrigger id="vanaprastha_interest">
              <SelectValue placeholder="Select interest level" />
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

        <div className="space-y-2">
          <Label htmlFor="artha_vs_moksha">Artha vs. Moksha Balance</Label>
          <Select
            name="artha_vs_moksha"
            value={profile.artha_vs_moksha || ""}
            onValueChange={handleSelectChange("artha_vs_moksha")}
          >
            <SelectTrigger id="artha_vs_moksha">
              <SelectValue placeholder="Select your preference" />
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

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack} type="button">
            Back
          </Button>
          <Button onClick={onNext} disabled={!canProceed}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
