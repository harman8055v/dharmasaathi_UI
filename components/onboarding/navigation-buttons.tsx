"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface NavigationButtonsProps {
  currentStage: number
  totalStages: number
  onPrevious: () => void
  onNext: () => void
  isLoading: boolean
  canProceed: boolean
}

export default function NavigationButtons({
  currentStage,
  totalStages,
  onPrevious,
  onNext,
  isLoading,
  canProceed,
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between mt-8">
      <Button variant="outline" onClick={onPrevious} disabled={currentStage === 0 || isLoading}>
        Back
      </Button>
      <Button onClick={onNext} disabled={isLoading || !canProceed}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : currentStage === totalStages - 1 ? (
          "Finish"
        ) : (
          "Next"
        )}
      </Button>
    </div>
  )
}
