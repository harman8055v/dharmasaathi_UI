"use client"
import type { OnboardingProfile } from "@/lib/types/onboarding"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import LocationSelector from "@/components/location-selector"

interface StemStageProps {
  profile: OnboardingProfile
  updateProfile: (data: Partial<OnboardingProfile>) => void
  onNext: () => void
  onBack: () => void
}

export default function StemStage({ profile, updateProfile, onNext, onBack }: StemStageProps) {
  const canProceed = profile.gender && profile.birthdate && profile.height && profile.city_id

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Let's get to know you a little better.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Input id="gender" value={profile.gender || ""} onChange={(e) => updateProfile({ gender: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="birthdate">Birthdate</Label>
          <Input
            id="birthdate"
            type="date"
            value={profile.birthdate || ""}
            onChange={(e) => updateProfile({ birthdate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="height">Height (in cm)</Label>
          <Input
            id="height"
            type="number"
            value={profile.height || ""}
            onChange={(e) => updateProfile({ height: Number.parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label>Location</Label>
          <LocationSelector
            onLocationChange={(loc) =>
              updateProfile({ country_id: loc.country, state_id: loc.state, city_id: loc.city })
            }
            initialLocation={{ country: profile.country_id, state: profile.state_id, city: profile.city_id }}
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
