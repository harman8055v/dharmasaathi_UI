"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface JourneyStepProps {
  onNext: (data: any) => void
  onSkip: () => void
  onBack: () => void
}

export default function JourneyStep({ onNext, onSkip, onBack }: JourneyStepProps) {
  const [aboutMe, setAboutMe] = useState("")
  const [lookingFor, setLookingFor] = useState("")

  const handleSubmit = () => {
    onNext({
      aboutMe,
      lookingFor,
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-light text-slate-900 dark:text-slate-100 mb-3">Share your story</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Your journey, in your words—this is your canvas. Profiles with heartfelt stories get 3x more responses.
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <Label htmlFor="aboutMe" className="text-base font-medium text-slate-700 dark:text-slate-300">
            About Me / Spiritual Journey
          </Label>
          <Textarea
            id="aboutMe"
            placeholder="Share a bit about your spiritual journey, interests, and what makes you unique..."
            className="min-h-[120px] border-slate-300 dark:border-slate-600 focus:border-maroon-700 dark:focus:border-maroon-500 resize-none ring-offset-background focus-visible:ring-maroon-700"
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="lookingFor" className="text-base font-medium text-slate-700 dark:text-slate-300">
            What are you looking for in your DharmaSaathi?
          </Label>
          <Textarea
            id="lookingFor"
            placeholder="Describe the qualities, values, and connection you're seeking in a partner..."
            className="min-h-[120px] border-slate-300 dark:border-slate-600 focus:border-maroon-700 dark:focus:border-maroon-500 resize-none ring-offset-background focus-visible:ring-maroon-700"
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
          />
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
