"use client"

import type React from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"

interface ScaleInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  scale?: number
  duration?: number
}

export default function ScaleIn({ children, className, delay = 0, scale = 0.8, duration = 600 }: ScaleInProps) {
  const { ref, shouldAnimate } = useScrollAnimation({
    threshold: 0.1,
    delay,
    triggerOnce: true,
  })

  return (
    <div
      ref={ref}
      className={cn("transition-all ease-out", className)}
      style={{
        opacity: shouldAnimate ? 1 : 0,
        transform: shouldAnimate ? "scale(1)" : `scale(${scale})`,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  )
}
