"use client"

import type React from "react"
import { useParallax } from "@/hooks/use-parallax"
import { cn } from "@/lib/utils"

interface ParallaxContainerProps {
  children: React.ReactNode
  speed?: number
  direction?: "up" | "down" | "left" | "right"
  offset?: number
  className?: string
  disabled?: boolean
}

export default function ParallaxContainer({
  children,
  speed = 0.5,
  direction = "up",
  offset = 0,
  className,
  disabled = false,
}: ParallaxContainerProps) {
  const { ref, transform } = useParallax({ speed, direction, offset, disabled })

  return (
    <div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={{
        transform,
        transition: disabled ? "none" : "transform 0.1s ease-out",
      }}
    >
      {children}
    </div>
  )
}
