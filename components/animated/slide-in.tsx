"use client"

import type React from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"

interface SlideInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "left" | "right"
  distance?: number
  duration?: number
}

export default function SlideIn({
  children,
  className,
  delay = 0,
  direction = "left",
  distance = 100,
  duration = 800,
}: SlideInProps) {
  const { ref, shouldAnimate } = useScrollAnimation({
    threshold: 0.2,
    delay,
    triggerOnce: true,
  })

  const getTransform = () => {
    if (shouldAnimate) return "translateX(0)"
    return direction === "left" ? `translateX(-${distance}px)` : `translateX(${distance}px)`
  }

  return (
    <div
      ref={ref}
      className={cn("transition-all ease-out", className)}
      style={{
        opacity: shouldAnimate ? 1 : 0,
        transform: getTransform(),
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  )
}
