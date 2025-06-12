"use client"

import type React from "react"

import { useParallax } from "@/hooks/use-parallax"
import { useMouseParallax } from "@/hooks/use-mouse-parallax"
import { cn } from "@/lib/utils"

interface FloatingElementProps {
  className?: string
  children?: React.ReactNode
  parallaxSpeed?: number
  mouseStrength?: number
  delay?: number
}

export function FloatingElement({
  className,
  children,
  parallaxSpeed = 0.3,
  mouseStrength = 15,
  delay = 0,
}: FloatingElementProps) {
  const { ref: parallaxRef, transform: parallaxTransform } = useParallax({
    speed: parallaxSpeed,
    direction: "up",
  })

  const { ref: mouseRef, transform: mouseTransform } = useMouseParallax({
    strength: mouseStrength,
  })

  // Combine both transforms
  const combinedTransform = `${parallaxTransform} ${mouseTransform.replace("translate3d", "translate3d")}`

  return (
    <div
      ref={(el) => {
        if (el) {
          parallaxRef.current = el
          mouseRef.current = el
        }
      }}
      className={cn("absolute will-change-transform", className)}
      style={{
        transform: combinedTransform,
        transition: "transform 0.1s ease-out",
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export function FloatingOrb({ className, size = "w-32 h-32", color = "bg-primary/10", delay = 0 }) {
  return (
    <FloatingElement className={className} delay={delay}>
      <div className={cn("rounded-full blur-2xl animate-float", size, color)} />
    </FloatingElement>
  )
}

export function FloatingShape({ className, delay = 0 }) {
  return (
    <FloatingElement className={className} parallaxSpeed={0.2} mouseStrength={10} delay={delay}>
      <div className="w-16 h-16 rotate-45 bg-gradient-to-r from-primary/5 to-purple-200/10 rounded-lg blur-sm animate-pulse" />
    </FloatingElement>
  )
}
