interface LotusAnimationProps {
  stage: number
}

export default function LotusAnimation({ stage }: LotusAnimationProps) {
  // Simple SVG lotus with petals that open based on stage
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Center */}
      <circle cx="50" cy="50" r="10" fill="#f59e0b" />

      {/* Petals - they open progressively based on stage */}
      <path
        d="M50,50 C60,30 70,20 50,0 C30,20 40,30 50,50"
        fill={stage >= 1 ? "#fbbf24" : "#fef3c7"}
        transform="rotate(0, 50, 50)"
      />
      <path
        d="M50,50 C60,30 70,20 50,0 C30,20 40,30 50,50"
        fill={stage >= 2 ? "#fbbf24" : "#fef3c7"}
        transform="rotate(72, 50, 50)"
      />
      <path
        d="M50,50 C60,30 70,20 50,0 C30,20 40,30 50,50"
        fill={stage >= 3 ? "#fbbf24" : "#fef3c7"}
        transform="rotate(144, 50, 50)"
      />
      <path
        d="M50,50 C60,30 70,20 50,0 C30,20 40,30 50,50"
        fill={stage >= 4 ? "#fbbf24" : "#fef3c7"}
        transform="rotate(216, 50, 50)"
      />
      <path
        d="M50,50 C60,30 70,20 50,0 C30,20 40,30 50,50"
        fill={stage >= 5 ? "#fbbf24" : "#fef3c7"}
        transform="rotate(288, 50, 50)"
      />
    </svg>
  )
}
