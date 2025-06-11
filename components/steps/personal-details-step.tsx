"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface PersonalDetailsStepProps {
  onNext: (data: any) => void
  onSkip: () => void
  onBack: () => void
}

export default function PersonalDetailsStep({ onNext, onSkip, onBack }: PersonalDetailsStepProps) {
  const [height, setHeight] = useState("")
  const [minPartnerAge, setMinPartnerAge] = useState<string>("")
  const [maxPartnerAge, setMaxPartnerAge] = useState<string>("")
  const [locationPref, setLocationPref] = useState("")
  const [spiritualOpenness, setSpiritualOpenness] = useState("")
  const [vanaprastha, setVanaprastha] = useState("")
  const [lifeFocus, setLifeFocus] = useState("")

  const handleSubmit = () => {
    onNext({
      height,
      partnerAgeRange: {
        min: minPartnerAge ? Number.parseInt(minPartnerAge) : undefined,
        max: maxPartnerAge ? Number.parseInt(maxPartnerAge) : undefined,
      },
      partnerLocation: locationPref,
      spiritualOpenness,
      vanaprastha,
      lifeFocus,
    })
  }

  const heightOptions = Array.from({ length: 71 }, (_, i) => {
    const cm = 140 + i
    const feet = Math.floor(cm / 30.48)
    const inches = Math.round((cm / 2.54) % 12)
    return { value: `${cm}`, label: `${feet}'${inches}" (${cm} cm)` }
  })

  const commonOptions = (options: { value: string; label: string }[], groupName: string) =>
    options.map((opt) => (
      <div key={opt.value} className="flex items-center space-x-3">
        <RadioGroupItem
          value={opt.value}
          id={`${groupName}-${opt.value}`}
          className="border-slate-300 dark:border-slate-600 data-[state=checked]:border-maroon-700 data-[state=checked]:bg-maroon-700 dark:data-[state=checked]:border-maroon-500 dark:data-[state=checked]:bg-maroon-500"
        />
        <Label htmlFor={`${groupName}-${opt.value}`} className="text-slate-700 dark:text-slate-300 cursor-pointer">
          {opt.label}
        </Label>
      </div>
    ))

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-light text-slate-900 dark:text-slate-100 mb-3">Personal Details & Preferences</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Share your preferences—not to limit, but to help us guide you to the right souls.
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <Label className="text-base font-medium text-slate-700 dark:text-slate-300">Height</Label>
          <Select value={height} onValueChange={setHeight}>
            <SelectTrigger className="border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:ring-maroon-700">
              <SelectValue placeholder="Select your height" />
            </SelectTrigger>
            <SelectContent>
              {heightOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium text-slate-700 dark:text-slate-300">Partner Age Range</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minPartnerAge" className="text-sm text-slate-600 dark:text-slate-400">
                Min Age
              </Label>
              <Input
                id="minPartnerAge"
                type="number"
                placeholder="e.g., 25"
                value={minPartnerAge}
                onChange={(e) => setMinPartnerAge(e.target.value)}
                min="18"
                max="99"
                className="border-slate-300 dark:border-slate-600 focus:border-maroon-700 dark:focus:border-maroon-500 ring-offset-background focus-visible:ring-maroon-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPartnerAge" className="text-sm text-slate-600 dark:text-slate-400">
                Max Age
              </Label>
              <Input
                id="maxPartnerAge"
                type="number"
                placeholder="e.g., 40"
                value={maxPartnerAge}
                onChange={(e) => setMaxPartnerAge(e.target.value)}
                min="18"
                max="99"
                className="border-slate-300 dark:border-slate-600 focus:border-maroon-700 dark:focus:border-maroon-500 ring-offset-background focus-visible:ring-maroon-700"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="locationPref" className="text-base font-medium text-slate-700 dark:text-slate-300">
            Partner Location Preference
          </Label>
          <Input
            id="locationPref"
            type="text"
            placeholder="e.g., Bangalore, Delhi or 'Open to any'"
            value={locationPref}
            onChange={(e) => setLocationPref(e.target.value)}
            className="border-slate-300 dark:border-slate-600 focus:border-maroon-700 dark:focus:border-maroon-500 ring-offset-background focus-visible:ring-maroon-700"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium text-slate-700 dark:text-slate-300">
            Spiritual Openness (in partner)
          </Label>
          <RadioGroup
            value={spiritualOpenness}
            onValueChange={setSpiritualOpenness}
            className="flex flex-col space-y-3"
          >
            {commonOptions(
              [
                { value: "essential", label: "Essential" },
                { value: "preferred", label: "Preferred" },
                { value: "open", label: "Open" },
              ],
              "openness",
            )}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium text-slate-700 dark:text-slate-300">
            Interest in Vanaprastha (retreat/ashram life)
          </Label>
          <RadioGroup value={vanaprastha} onValueChange={setVanaprastha} className="flex flex-col space-y-3">
            {commonOptions(
              [
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "open", label: "Open" },
              ],
              "vanaprastha",
            )}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium text-slate-700 dark:text-slate-300">
            Artha vs Moksha (life focus)
          </Label>
          <RadioGroup value={lifeFocus} onValueChange={setLifeFocus} className="flex flex-col space-y-3">
            {commonOptions(
              [
                { value: "artha", label: "Artha-focused (Material prosperity)" },
                { value: "moksha", label: "Moksha-focused (Spiritual liberation)" },
                { value: "balanced", label: "Balanced" },
              ],
              "lifefocus",
            )}
          </RadioGroup>
        </div>

        <div className="flex flex-col space-y-4 pt-6">
          <Button
            onClick={handleSubmit}
            className="bg-maroon-800 hover:bg-maroon-700 dark:bg-maroon-700 dark:hover:bg-maroon-600 text-white py-3 rounded-xl font-medium text-base"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <div className="flex justify-between">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              onClick={onSkip}
              variant="ghost"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
