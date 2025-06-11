"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface StepButtonsProps {
  onNext?: () => void
  onSkip?: () => void
  onBack?: () => void
  nextLabel?: string
  showSkip?: boolean
  isLastStep?: boolean
}

export default function StepButtons({
  onNext,
  onSkip,
  onBack,
  nextLabel = "Continue",
  showSkip = true,
  isLastStep = false,
}: StepButtonsProps) {
  return (
    <div className="flex flex-col space-y-3 mt-8">
      <Button onClick={onNext} className="bg-maroon-800 hover:bg-maroon-900 text-white">
        {nextLabel} {!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>

      <div className="flex justify-between w-full">
        {onBack && (
          <Button onClick={onBack} variant="ghost" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        )}

        {showSkip && onSkip && (
          <Button onClick={onSkip} variant="link" className="text-gray-500 hover:text-gray-700 ml-auto">
            Skip for now
          </Button>
        )}
      </div>
    </div>
  )
}
