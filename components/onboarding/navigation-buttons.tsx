"use client"

interface NavigationButtonsProps {
  currentStage: number
  isSubmitting: boolean
  onBack: () => void
  onSkip: () => void
}

export default function NavigationButtons({ currentStage, isSubmitting, onBack, onSkip }: NavigationButtonsProps) {
  if (currentStage === 0) return null

  return (
    <div className="flex justify-between px-4 py-4 border-t border-gray-200">
      <button
        type="button"
        onClick={onBack}
        disabled={isSubmitting}
        className="text-amber-600 hover:text-amber-800 disabled:opacity-50"
      >
        Back
      </button>
      <button
        type="button"
        onClick={onSkip}
        disabled={isSubmitting}
        className="text-amber-600 hover:text-amber-800 disabled:opacity-50"
      >
        Skip
      </button>
    </div>
  )
}
