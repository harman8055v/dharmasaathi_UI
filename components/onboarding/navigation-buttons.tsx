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
  const isFirstStage = currentStage === 0
  const isLastStage = currentStage === totalStages - 1

  return (
    <div className="flex items-center justify-between mt-8">
      <div>
        {!isFirstStage && (
          <Button variant="outline" onClick={onPrevious} disabled={isLoading}>
            Back
          </Button>
        )}
      </div>
      <div>
        {!isLastStage && (
          <Button onClick={onNext} disabled={isLoading || !canProceed}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Next
          </Button>
        )}
      </div>
    </div>
  )
}
