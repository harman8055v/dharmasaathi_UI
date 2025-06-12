"use client"

import type React from "react"
import { memo } from "react"
import { useIntersectionObserverOptimized } from "@/hooks/use-intersection-observer-optimized"
import { cn } from "@/lib/utils"

interface FloatingElementOptimizedProps {
  className?: string
  children?: React.ReactNode
  delay?: number
}

const FloatingElementOptimized = memo(function FloatingElementOptimized({
  className,
  children,
  delay = 0,
}: FloatingElementOptimizedProps) {
  const { ref, isIntersecting } = useIntersectionObserverOptimized({
    threshold: 0.1,
    rootMargin: "100px",
    triggerOnce: true,
  })

  return (
    <div
      ref={ref}
      className={cn("absolute will-change-transform", className)}
      style={{
        opacity: isIntersecting ? 1 : 0,
        transform: isIntersecting ? "scale(1)" : "scale(0.8)",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
})

export const FloatingOrbOptimized = memo(function FloatingOrbOptimized({
  className,
  size = "w-32 h-32",
  color = "bg-primary/10",
  delay = 0,
}: {
  className?: string
  size?: string
  color?: string
  delay?: number
}) {
  return (
    <FloatingElementOptimized className={className} delay={delay}>
      <div className={cn("rounded-full blur-2xl", size, color)} />
    </FloatingElementOptimized>
  )
})

export const FloatingShapeOptimized = memo(function FloatingShapeOptimized({
  className,
  delay = 0,
}: {
  className?: string
  delay?: number
}) {
  return (
    <FloatingElementOptimized className={className} delay={delay}>
      <div className="w-16 h-16 rotate-45 bg-gradient-to-r from-primary/5 to-purple-200/10 rounded-lg blur-sm" />
    </FloatingElementOptimized>
  )
})
