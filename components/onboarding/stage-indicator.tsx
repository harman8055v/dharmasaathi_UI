interface StageIndicatorProps {
  currentStage: number
  totalStages: number
  stageName: string
}

export default function StageIndicator({ currentStage, totalStages, stageName }: StageIndicatorProps) {
  return (
    <div className="fixed top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-md z-10">
      <div className="flex items-center text-sm">
        <span className="font-medium text-amber-800">
          Stage: {stageName} ({currentStage + 1}/{totalStages})
        </span>
      </div>
    </div>
  )
}
