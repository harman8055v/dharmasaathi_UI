"use client"

import { useEffect, useState, useRef } from "react"

interface MouseParallaxOptions {
  strength?: number
  disabled?: boolean
  invertX?: boolean
  invertY?: boolean
}

export function useMouseParallax({
  strength = 20,
  disabled = false,
  invertX = false,
  invertY = false,
}: MouseParallaxOptions = {}) {
  const [transform, setTransform] = useState("translate3d(0, 0, 0)")
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (disabled || typeof window === "undefined") return

    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current) return

      const rect = elementRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (e.clientX - centerX) / rect.width
      const deltaY = (e.clientY - centerY) / rect.height

      const moveX = deltaX * strength * (invertX ? -1 : 1)
      const moveY = deltaY * strength * (invertY ? -1 : 1)

      setTransform(`translate3d(${moveX}px, ${moveY}px, 0)`)
    }

    const handleMouseLeave = () => {
      setTransform("translate3d(0, 0, 0)")
    }

    const element = elementRef.current
    if (element) {
      element.addEventListener("mousemove", handleMouseMove)
      element.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        element.removeEventListener("mousemove", handleMouseMove)
        element.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [strength, disabled, invertX, invertY])

  return { ref: elementRef, transform }
}
