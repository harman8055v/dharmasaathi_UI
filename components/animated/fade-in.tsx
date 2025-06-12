"use client"

import type React from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  distance?: number
  duration?: number
}

export default function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 30,
  duration = 600,
}: FadeInProps) {
  const { ref, shouldAnimate } = useScrollAnimation({
    threshold: 0.1,
    delay,
    triggerOnce: true,
  })

  const getTransform = () => {
    if (shouldAnimate) return "translate3d(0, 0, 0)"

    switch (direction) {
      case "up":
        return `translate3d(0, ${distance}px, 0)`
      case "down":
        return `translate3d(0, -${distance}px, 0)`
      case "left":
        return `translate3d(${distance}px, 0, 0)`
      case "right":
        return `translate3d(-${distance}px, 0, 0)`
      default:
        return `translate3d(0, ${distance}px, 0)`
    }
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
