"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface ProfessionalStepProps {
  onNext: (data: any) => void
  onSkip: () => void
  onBack: () => void
}

export default function ProfessionalStep({ onNext, onSkip, onBack }: ProfessionalStepProps) {
  const [education, setEducation] = useState("")
  const [profession, setProfession] = useState("")
  const [income, setIncome] = useState("")

  const handleSubmit = () => {
    onNext({ education, profession, income })
  }

  const educationLevels = ["10th", "12th", "Bachelor's", "Master's", "Doctorate", "Other"]
  const incomeRanges = ["<3L", "3-6L", "6-10L", "10-20L", "20L+", "Prefer not to say"]

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-light text-slate-900 dark:text-slate-100 mb-3">Professional & Education</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Worldly experience is as valuable as spiritual growth—share your background.
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <Label className="text-base font-medium text-slate-700 dark:text-slate-300">Education level</Label>
          <Select value={education} onValueChange={setEducation}>
            <SelectTrigger className="border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:ring-maroon-700">
              <SelectValue placeholder="Select your education level" />
            </SelectTrigger>
            <SelectContent>
              {educationLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="profession" className="text-base font-medium text-slate-700 dark:text-slate-300">
            Profession/Job Title
          </Label>
          <Input
            id="profession"
            type="text"
            placeholder="Enter your profession"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="border-slate-300 dark:border-slate-600 focus:border-maroon-700 dark:focus:border-maroon-500 ring-offset-background focus-visible:ring-maroon-700"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium text-slate-700 dark:text-slate-300">Annual Income (INR)</Label>
          <Select value={income} onValueChange={setIncome}>
            <SelectTrigger className="border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:ring-maroon-700">
              <SelectValue placeholder="Select your income range" />
            </SelectTrigger>
            <SelectContent>
              {incomeRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
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
