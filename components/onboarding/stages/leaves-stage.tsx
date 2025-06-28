"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MOTHER_TONGUES } from "@/lib/constants/mother-tongues"
import type { OnboardingProfile } from "@/lib/types/onboarding"

interface LeavesStageProps {
  profile: OnboardingProfile
  updateProfile: (data: Partial<OnboardingProfile>) => void
  onNext: () => void
  onPrev: () => void
}

export default function LeavesStage({ profile, updateProfile, onNext, onPrev }: LeavesStageProps) {
  const [formData, setFormData] = useState({
    mother_tongue: profile.mother_tongue || "",
    education: profile.education || "",
    profession: profile.profession || "",
    annual_income: profile.annual_income || "",
  })

  const handleNext = () => {
    updateProfile(formData)
    onNext()
  }

  const educationOptions = [
    "High School",
    "Diploma",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD",
    "Professional Degree",
    "Other",
  ]

  const incomeOptions = [
    "Below ₹3 Lakhs",
    "₹3-5 Lakhs",
    "₹5-10 Lakhs",
    "₹10-15 Lakhs",
    "₹15-25 Lakhs",
    "₹25-50 Lakhs",
    "Above ₹50 Lakhs",
    "Prefer not to say",
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Professional & Educational Background</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mother Tongue */}
        <div className="space-y-2">
          <Label htmlFor="mother_tongue">Mother Tongue</Label>
          <Select
            value={formData.mother_tongue}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, mother_tongue: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your mother tongue" />
            </SelectTrigger>
            <SelectContent>
              {MOTHER_TONGUES.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Education */}
        <div className="space-y-2">
          <Label htmlFor="education">Education</Label>
          <Select
            value={formData.education}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, education: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your education level" />
            </SelectTrigger>
            <SelectContent>
              {educationOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Profession */}
        <div className="space-y-2">
          <Label htmlFor="profession">Profession</Label>
          <Input
            id="profession"
            placeholder="Enter your profession"
            value={formData.profession}
            onChange={(e) => setFormData((prev) => ({ ...prev, profession: e.target.value }))}
          />
        </div>

        {/* Annual Income */}
        <div className="space-y-2">
          <Label htmlFor="annual_income">Annual Income</Label>
          <Select
            value={formData.annual_income}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, annual_income: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your income range" />
            </SelectTrigger>
            <SelectContent>
              {incomeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
