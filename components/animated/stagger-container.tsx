"use client"

import React from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  childDelay?: number
}

export default function StaggerContainer({
  children,
  className,
  staggerDelay = 100,
  childDelay = 0,
}: StaggerContainerProps) {
  const { ref, shouldAnimate } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
  })

  const childrenArray = React.Children.toArray(children)

  return (
    <div ref={ref} className={cn(className)}>
      {childrenArray.map((child, index) => (
        <div
          key={index}
          className="transition-all duration-600 ease-out"
          style={{
            opacity: shouldAnimate ? 1 : 0,
            transform: shouldAnimate ? "translateY(0)" : "translateY(30px)",
            transitionDelay: shouldAnimate ? `${childDelay + index * staggerDelay}ms` : "0ms",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
