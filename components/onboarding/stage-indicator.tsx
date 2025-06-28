interface StageIndicatorProps {
  stages: string[]
  currentStageIndex: number
  progress: number
}

export default function StageIndicator({ stages, currentStageIndex }: StageIndicatorProps) {
  return (
    <div className="text-center my-4">
      <p className="text-sm text-gray-500">
        Step {currentStageIndex + 1} of {stages.length}
      </p>
      <h2 className="text-2xl font-bold capitalize">{stages[currentStageIndex]}</h2>
    </div>
  )
}
