"use client"

interface StageIndicatorProps {
  stages: string[]
  currentStageIndex: number
  progress: number
}

export default function StageIndicator({ stages, currentStageIndex, progress }: StageIndicatorProps) {
  return (
    <div className="mb-4 text-center">
      <p className="text-sm font-medium text-gray-500 mb-2">
        Step {currentStageIndex + 1} of {stages.length}
      </p>
      <h2 className="text-2xl font-bold capitalize">{stages[currentStageIndex].replace("-", " ")}</h2>
    </div>
  )
}
