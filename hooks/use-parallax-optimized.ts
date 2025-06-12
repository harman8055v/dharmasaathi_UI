"use client"

import { useEffect, useState, useRef, useCallback } from "react"

interface ParallaxOptionsOptimized {
  speed?: number
  direction?: "up" | "down" | "left" | "right"
  offset?: number
  disabled?: boolean
}

export function useParallaxOptimized({
  speed = 0.5,
  direction = "up",
  offset = 0,
  disabled = false,
}: ParallaxOptionsOptimized = {}) {
  const [transform, setTransform] = useState("translate3d(0, 0, 0)")
  const elementRef = useRef<HTMLElement>(null)
  const rafRef = useRef<number>()
  const lastScrollY = useRef(0)

  const updateTransform = useCallback(() => {
    if (disabled || !elementRef.current) return

    const scrolled = window.pageYOffset

    // Only update if scroll position changed significantly
    if (Math.abs(scrolled - lastScrollY.current) < 1) return

    lastScrollY.current = scrolled

    const rect = elementRef.current.getBoundingClientRect()
    const elementTop = rect.top + scrolled
    const elementHeight = rect.height
    const windowHeight = window.innerHeight

    // Check if element is in viewport with buffer
    const buffer = windowHeight * 0.5
    const isInViewport = scrolled + windowHeight + buffer > elementTop && scrolled - buffer < elementTop + elementHeight

    if (!isInViewport) return

    // Calculate parallax offset
    const yPos = (scrolled - elementTop + offset) * speed

    let transformValue = ""
    switch (direction) {
      case "up":
        transformValue = `translate3d(0, ${-yPos}px, 0)`
        break
      case "down":
        transformValue = `translate3d(0, ${yPos}px, 0)`
        break
      case "left":
        transformValue = `translate3d(${-yPos}px, 0, 0)`
        break
      case "right":
        transformValue = `translate3d(${yPos}px, 0, 0)`
        break
    }

    setTransform(transformValue)
  }, [speed, direction, offset, disabled])

  useEffect(() => {
    if (disabled || typeof window === "undefined") return

    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      rafRef.current = requestAnimationFrame(updateTransform)
    }

    // Passive event listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true })
    updateTransform() // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [updateTransform, disabled])

  return { ref: elementRef, transform }
}
