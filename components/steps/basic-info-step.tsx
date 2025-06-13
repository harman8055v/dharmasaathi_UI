"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { indianStatesAndUTs } from "@/lib/indian-states"

interface BasicInfoStepProps {
  onNext: (data: any) => void
  onSkip: () => void
}

export default function BasicInfoStep({ onNext, onSkip }: BasicInfoStepProps) {
  const [gender, setGender] = useState("")
  const [birthdate, setBirthdate] = useState<Date>()
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [errors, setErrors] = useState<{ gender?: string; birthdate?: string; city?: string; state?: string } | null>(
    null,
  )

  const validateForm = () => {
    const newErrors: { gender?: string; birthdate?: string; city?: string; state?: string } = {}
    let isValid = true

    if (!gender) {
      newErrors.gender = "Please select your gender"
      isValid = false
    }

    if (!birthdate) {
      newErrors.birthdate = "Please select your date of birth"
      isValid = false
    }

    if (!city.trim()) {
      newErrors.city = "Please enter your city"
      isValid = false
    }

    if (!state) {
      newErrors.state = "Please select your state"
      isValid = false
    }

    setErrors(isValid ? null : newErrors)
    return isValid
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onNext({
        gender,
        birthdate,
        city,
        state,
        country: "India",
      })
    }
  }

  const currentYear = new Date().getFullYear()

  const handleDateSelect = (date: Date | undefined) => {
    setBirthdate(date)
    setIsDatePickerOpen(false) // Close date picker on select
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-light text-slate-900 dark:text-slate-100 mb-3">Let's start with the basics</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Tell us a little about yourself—this helps us introduce you to people who share your vibe and values.
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <Label className="text-base font-medium text-slate-700 dark:text-slate-300">
            Gender <span className="text-maroon-700 dark:text-maroon-400">*</span>
          </Label>
          <RadioGroup value={gender} onValueChange={setGender} className="flex flex-col space-y-3">
            {["Male", "Female", "Other"].map((option) => (
              <div key={option} className="flex items-center space-x-3">
                <RadioGroupItem
                  value={option.toLowerCase()}
                  id={option.toLowerCase()}
                  className="border-slate-300 dark:border-slate-600 data-[state=checked]:border-maroon-700 data-[state=checked]:bg-maroon-700 dark:data-[state=checked]:border-maroon-500 dark:data-[state=checked]:bg-maroon-500"
                />
                <Label htmlFor={option.toLowerCase()} className="text-slate-700 dark:text-slate-300 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors?.gender && <p className="text-sm text-red-600 dark:text-red-400">{errors.gender}</p>}
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium text-slate-700 dark:text-slate-300">
            Date of birth <span className="text-maroon-700 dark:text-maroon-400">*</span>
          </Label>
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500",
                  !birthdate && "text-slate-500 dark:text-slate-400",
                  errors?.birthdate && "border-red-500 dark:border-red-500",
                )}
              >
                {birthdate ? format(birthdate, "PPP") : <span>Select your date of birth</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-slate-200 dark:border-slate-700" align="start">
              <div className="p-3">
                <Calendar
                  mode="single"
                  captionLayout="dropdown-buttons"
                  fromYear={currentYear - 100}
                  toYear={currentYear - 18}
                  selected={birthdate}
                  onSelect={handleDateSelect}
                  disabled={(date) =>
                    date > new Date(currentYear - 18, 11, 31) || date < new Date(currentYear - 100, 0, 1)
                  }
                  initialFocus
                  classNames={{
                    caption_dropdowns: "flex gap-2 items-center justify-center my-2",
                    dropdown_month: "relative",
                    dropdown_year: "relative",
                    dropdown:
                      "appearance-none w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-sm leading-tight focus:outline-none focus:ring-2 focus:ring-maroon-700 dark:focus:ring-maroon-500 focus:border-maroon-700 dark:focus:border-maroon-500 cursor-pointer",
                    caption_label: "hidden", // Hide default label when dropdowns are used
                    nav_button: "hidden", // Hide the navigation buttons (arrows)
                  }}
                />
              </div>
            </PopoverContent>
          </Popover>
          {errors?.birthdate && <p className="text-sm text-red-600 dark:text-red-400">{errors.birthdate}</p>}
        </div>

        <div className="space-y-3">
          <Label htmlFor="city" className="text-base font-medium text-slate-700 dark:text-slate-300">
            City <span className="text-maroon-700 dark:text-maroon-400">*</span>
          </Label>
          <Input
            id="city"
            type="text"
            placeholder="Enter your city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`border-slate-300 dark:border-slate-600 focus:border-maroon-700 dark:focus:border-maroon-500 ring-offset-background focus-visible:ring-maroon-700 ${errors?.city ? "border-red-500 dark:border-red-500" : ""}`}
          />
          {errors?.city && <p className="text-sm text-red-600 dark:text-red-400">{errors.city}</p>}
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium text-slate-700 dark:text-slate-300">
            State <span className="text-maroon-700 dark:text-maroon-400">*</span>
          </Label>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger
              className={`border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:ring-maroon-700 ${errors?.state ? "border-red-500 dark:border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent>
              {indianStatesAndUTs.map((stateOption) => (
                <SelectItem key={stateOption} value={stateOption}>
                  {stateOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.state && <p className="text-sm text-red-600 dark:text-red-400">{errors.state}</p>}
        </div>

        <div className="flex flex-col space-y-4 pt-6">
          <Button
            onClick={handleSubmit}
            className="bg-maroon-800 hover:bg-maroon-700 dark:bg-maroon-700 dark:hover:bg-maroon-600 text-white py-3 rounded-xl font-medium text-base"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
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
  )
}
