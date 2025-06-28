"use client"
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
  const canProceed = profile.education && profile.profession

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Life</CardTitle>
        <CardDescription>Tell us about your education and career.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="education">Education</Label>
          <Input
            id="education"
            value={profile.education || ""}
            onChange={(e) => updateProfile({ education: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="profession">Profession</Label>
          <Input
            id="profession"
            value={profile.profession || ""}
            onChange={(e) => updateProfile({ profession: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="income">Annual Income</Label>
          <Input
            id="income"
            value={profile.annual_income || ""}
            onChange={(e) => updateProfile({ annual_income: e.target.value })}
          />
        </div>
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
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
