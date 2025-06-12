"use client"

import type React from "react"
import { useParallaxOptimized } from "@/hooks/use-parallax-optimized"
import { useIntersectionObserverOptimized } from "@/hooks/use-intersection-observer-optimized"
import { cn } from "@/lib/utils"

interface ParallaxContainerOptimizedProps {
  children: React.ReactNode
  speed?: number
  direction?: "up" | "down" | "left" | "right"
  offset?: number
  className?: string
  disabled?: boolean
}

export default function ParallaxContainerOptimized({
  children,
  speed = 0.5,
  direction = "up",
  offset = 0,
  className,
  disabled = false,
}: ParallaxContainerOptimizedProps) {
  const { ref: intersectionRef, isIntersecting } = useIntersectionObserverOptimized({
    threshold: 0.1,
    rootMargin: "200px",
    triggerOnce: false,
  })

  const { ref: parallaxRef, transform } = useParallaxOptimized({
    speed,
    direction,
    offset,
    disabled: disabled || !isIntersecting,
  })

  return (
    <div
      ref={(el) => {
        if (el) {
          intersectionRef.current = el
          parallaxRef.current = el
        }
      }}
      className={cn("will-change-transform", className)}
      style={{
        transform: isIntersecting ? transform : "translate3d(0, 0, 0)",
        transition: disabled ? "none" : undefined,
      }}
    >
      {children}
    </div>
  )
}
