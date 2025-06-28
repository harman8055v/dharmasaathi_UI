"use client"

import type React from "react"
import { useState } from "react"
import type { OnboardingProfile } from "@/lib/types/onboarding"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface StemStageProps {
  profile: OnboardingProfile
  updateProfile: (data: Partial<OnboardingProfile>) => void
  onNext: () => void
  onBack: () => void
}

export default function StemStage({ profile, updateProfile, onNext, onBack }: StemStageProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!profile.gender) newErrors.gender = "Gender is required."
    if (!profile.birthdate) newErrors.birthdate = "Date of birth is required."
    if (!profile.height) newErrors.height = "Height is required."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext()
    }
  }

  const canProceed = profile.gender && profile.birthdate && profile.height

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Let's get to know you a little better. This information is essential for finding matches.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                name="gender"
                value={profile.gender || ""}
                onValueChange={(value) => updateProfile({ gender: value as OnboardingProfile["gender"] })}
              >
                <SelectTrigger id="gender" className={errors.gender ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
            </div>

            {/* Birthdate */}
            <div className="space-y-2">
              <Label htmlFor="birthdate">Date of Birth *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !profile.birthdate && "text-muted-foreground",
                      errors.birthdate && "border-red-500",
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
                    onSelect={(date) => updateProfile({ birthdate: date?.toISOString() })}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={1950}
                    toYear={new Date().getFullYear() - 18}
                  />
                </PopoverContent>
              </Popover>
              {errors.birthdate && <p className="text-sm text-red-500">{errors.birthdate}</p>}
            </div>
          </div>

          {/* Height */}
          <div className="space-y-2">
            <Label htmlFor="height">Height (in cm) *</Label>
            <Input
              id="height"
              type="number"
              placeholder="e.g., 175"
              value={profile.height || ""}
              onChange={(e) => updateProfile({ height: e.target.value ? Number.parseInt(e.target.value, 10) : null })}
              className={errors.height ? "border-red-500" : ""}
            />
            {errors.height && <p className="text-sm text-red-500">{errors.height}</p>}
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
