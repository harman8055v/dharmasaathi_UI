"use client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { OnboardingProfile, LocationFormState } from "@/lib/types/onboarding"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Let's get to know you a little better. This information is essential for finding matches.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select
              name="gender"
              value={profile.gender || ""}
              onValueChange={(value) => updateProfile({ gender: value as OnboardingProfile["gender"] })}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthdate">Date of Birth *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !profile.birthdate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {profile.birthdate ? format(new Date(profile.birthdate), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={profile.birthdate ? new Date(profile.birthdate) : undefined}
                  onSelect={(date) => updateProfile({ birthdate: date?.toISOString().split("T")[0] })}
                  initialFocus
                  captionLayout="dropdown-buttons"
                  fromYear={1950}
                  toYear={new Date().getFullYear() - 18}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Height (in cm) *</Label>
          <Input
            id="height"
            type="number"
            placeholder="e.g., 175"
            value={profile.height || ""}
            onChange={(e) => updateProfile({ height: e.target.value ? Number.parseInt(e.target.value, 10) : null })}
          />
        </div>
        <div className="space-y-2">
          <Label>Location *</Label>
          <LocationSelector
            value={{
              country_id: profile.country_id || null,
              state_id: profile.state_id || null,
              city_id: profile.city_id || null,
            }}
            onChange={(location: LocationFormState) => {
              updateProfile({
                country_id: location.country_id,
                state_id: location.state_id,
                city_id: location.city_id,
              })
            }}
            required={true}
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
