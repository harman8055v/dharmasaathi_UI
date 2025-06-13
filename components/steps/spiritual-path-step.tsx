"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

const spiritualPathsOptions = [
  { id: "isha", label: "Isha Foundation (Sadhguru)" },
  { id: "aol", label: "Art of Living (Sri Sri Ravi Shankar)" },
  { id: "vipassana", label: "Vipassana (Goenka)" },
  { id: "iskcon", label: "ISKCON / Bhakti" },
  { id: "osho", label: "Osho / Zen / Buddhism" },
  { id: "vedanta", label: "Hindu Vedanta" },
  { id: "self", label: "Self-guided/Independent" },
]

const practicesOptions = [
  { id: "meditation", label: "Meditation" },
  { id: "yoga", label: "Hatha Yoga/Asana" },
  { id: "pranayama", label: "Pranayama" },
  { id: "kriya", label: "Kriya Yoga" },
  { id: "chanting", label: "Chanting/Mantra" },
  { id: "mindfulness", label: "Mindfulness" },
  { id: "seva", label: "Seva/Service" },
  { id: "reading", label: "Reading Scriptures" },
  { id: "none", label: "None yet" },
]

interface SpiritualPathStepProps {
  onNext: (data: any) => void
  onSkip: () => void
  onBack: () => void
}

export default function SpiritualPathStep({ onNext, onSkip, onBack }: SpiritualPathStepProps) {
  const [selectedPaths, setSelectedPaths] = useState<string[]>([])
  const [otherPath, setOtherPath] = useState("")
  const [showOtherPathInput, setShowOtherPathInput] = useState(false)

  const [selectedPractices, setSelectedPractices] = useState<string[]>([])
  const [otherPractice, setOtherPractice] = useState("")
  const [showOtherPracticeInput, setShowOtherPracticeInput] = useState(false)

  const [yearsOnPath, setYearsOnPath] = useState("")
  const [error, setError] = useState<string | null>(null)

  const validateForm = () => {
    // This step is optional, so we don't need to validate
    return true
  }

  const handleCheckboxChange = (
    id: string,
    currentSelection: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onNext({
        spiritualPaths: selectedPaths,
        otherSpiritualPath: showOtherPathInput ? otherPath : undefined,
        dailyPractices: selectedPractices,
        otherDailyPractice: showOtherPracticeInput ? otherPractice : undefined,
        yearsOnPath,
      })
    }
  }

  const renderCheckboxGroup = (
    options: { id: string; label: string }[],
    selectedItems: string[],
    onChange: (id: string) => void,
    otherInputState: boolean,
    setOtherInputState: React.Dispatch<React.SetStateAction<boolean>>,
    otherInputValue: string,
    setOtherInputValue: React.Dispatch<React.SetStateAction<string>>,
    otherLabel: string,
    otherPlaceholder: string,
  ) => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {options.map((opt) => (
          <div key={opt.id} className="flex items-center space-x-3">
            <Checkbox
              id={`${otherLabel.toLowerCase()}-${opt.id}`}
              checked={selectedItems.includes(opt.id)}
              onCheckedChange={() => onChange(opt.id)}
              className="border-slate-300 dark:border-slate-600 data-[state=checked]:border-maroon-700 data-[state=checked]:bg-maroon-700 dark:data-[state=checked]:border-maroon-500 dark:data-[state=checked]:bg-maroon-500"
            />
            <Label
              htmlFor={`${otherLabel.toLowerCase()}-${opt.id}`}
              className="text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              {opt.label}
            </Label>
          </div>
        ))}
        <div className="flex items-center space-x-3">
          <Checkbox
            id={`${otherLabel.toLowerCase()}-other-checkbox`}
            checked={otherInputState}
            onCheckedChange={(checked) => setOtherInputState(!!checked)}
            className="border-slate-300 dark:border-slate-600 data-[state=checked]:border-maroon-700 data-[state=checked]:bg-maroon-700 dark:data-[state=checked]:border-maroon-500 dark:data-[state=checked]:bg-maroon-500"
          />
          <Label
            htmlFor={`${otherLabel.toLowerCase()}-other-checkbox`}
            className="text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Other
          </Label>
        </div>
      </div>
      {otherInputState && (
        <Input
          type="text"
          placeholder={otherPlaceholder}
          value={otherInputValue}
          onChange={(e) => setOtherInputValue(e.target.value)}
          className="mt-3 border-slate-300 dark:border-slate-600 focus:border-maroon-700 dark:focus:border-maroon-500 ring-offset-background focus-visible:ring-maroon-700"
        />
      )}
    </>
  )

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-light text-slate-900 dark:text-slate-100 mb-3">Your Spiritual Path</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Sharing your spiritual journey helps us connect you with those on a similar path.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        <div className="space-y-4">
          <Label className="text-base font-medium text-slate-700 dark:text-slate-300">
            Which spiritual paths/organizations have inspired you?
          </Label>
          {renderCheckboxGroup(
            spiritualPathsOptions,
            selectedPaths,
            (id) => handleCheckboxChange(id, selectedPaths, setSelectedPaths),
            showOtherPathInput,
            setShowOtherPathInput,
            otherPath,
            setOtherPath,
            "Path",
            "Specify other path",
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium text-slate-700 dark:text-slate-300">
            Which daily practices are part of your life?
          </Label>
          {renderCheckboxGroup(
            practicesOptions,
            selectedPractices,
            (id) => handleCheckboxChange(id, selectedPractices, setSelectedPractices),
            showOtherPracticeInput,
            setShowOtherPracticeInput,
            otherPractice,
            setOtherPractice,
            "Practice",
            "Specify other practice",
          )}
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium text-slate-700 dark:text-slate-300">
            How many years on your spiritual path?
          </Label>
          <Select value={yearsOnPath} onValueChange={setYearsOnPath}>
            <SelectTrigger className="border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:ring-maroon-700">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="less-than-1">Less than 1 year</SelectItem>
              <SelectItem value="1-3">1-3 years</SelectItem>
              <SelectItem value="3-5">3-5 years</SelectItem>
              <SelectItem value="5+">5+ years</SelectItem>
              <SelectItem value="lifelong">Lifelong</SelectItem>
            </SelectContent>
          </Select>
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
