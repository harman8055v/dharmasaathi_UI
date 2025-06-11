"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { indianLanguages } from "@/lib/indian-languages"

interface LifestyleStepProps {
  onNext: (data: any) => void
  onSkip: () => void
  onBack: () => void
}

export default function LifestyleStep({ onNext, onSkip, onBack }: LifestyleStepProps) {
  const [diet, setDiet] = useState("")
  const [smoking, setSmoking] = useState("")
  const [drinking, setDrinking] = useState("")
  const [templeVisits, setTempleVisits] = useState("")
  const [motherTongue, setMotherTongue] = useState("")
  const [otherMotherTongue, setOtherMotherTongue] = useState("")

  const handleSubmit = () => {
    onNext({
      diet,
      smoking,
      drinking,
      templeVisits,
      motherTongue: motherTongue === "Other" ? otherMotherTongue : motherTongue,
    })
  }

  const commonRadioGroup = (
    options: { value: string; label: string }[],
    groupName: string,
    stateVal: string,
    setStateVal: Function,
    title: string,
  ) => (
    <div className="space-y-4">
      <Label className="text-base font-medium text-slate-700 dark:text-slate-300">{title}</Label>
      <RadioGroup value={stateVal} onValueChange={(val) => setStateVal(val)} className="flex flex-col space-y-3">
        {options.map((opt) => (
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
        ))}
      </RadioGroup>
    </div>
  )

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-light text-slate-900 dark:text-slate-100 mb-3">Lifestyle & Habits</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Simple choices shape our daily lives. Your lifestyle details help us find someone whose rhythm matches yours.
        </p>
      </div>

      <div className="space-y-8">
        {commonRadioGroup(
          [
            { value: "vegetarian", label: "Vegetarian" },
            { value: "vegan", label: "Vegan" },
            { value: "eggetarian", label: "Eggetarian" },
            { value: "non-vegetarian", label: "Non-Vegetarian" },
          ],
          "diet",
          diet,
          setDiet,
          "Dietary preference",
        )}

        {commonRadioGroup(
          [
            { value: "never", label: "Never" },
            { value: "occasionally", label: "Occasionally" },
            { value: "regularly", label: "Regularly" },
          ],
          "smoking",
          smoking,
          setSmoking,
          "Do you smoke?",
        )}

        {commonRadioGroup(
          [
            { value: "never", label: "Never" },
            { value: "occasionally", label: "Occasionally" },
            { value: "regularly", label: "Regularly" },
          ],
          "drinking",
          drinking,
          setDrinking,
          "Do you drink?",
        )}

        {commonRadioGroup(
          [
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
            { value: "monthly", label: "Monthly" },
            { value: "rarely", label: "Rarely" },
            { value: "never", label: "Never" },
          ],
          "temple",
          templeVisits,
          setTempleVisits,
          "How often do you visit a temple/ashram?",
        )}

        <div className="space-y-3">
          <Label className="text-base font-medium text-slate-700 dark:text-slate-300">Mother tongue</Label>
          <Select value={motherTongue} onValueChange={setMotherTongue}>
            <SelectTrigger className="border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:ring-maroon-700">
              <SelectValue placeholder="Select your mother tongue" />
            </SelectTrigger>
            <SelectContent>
              {indianLanguages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          {motherTongue === "Other" && (
            <Input
              type="text"
              placeholder="Please specify your mother tongue"
              value={otherMotherTongue}
              onChange={(e) => setOtherMotherTongue(e.target.value)}
              className="mt-3 border-slate-300 dark:border-slate-600 focus:border-maroon-700 dark:focus:border-maroon-500 ring-offset-background focus-visible:ring-maroon-700"
            />
          )}
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
