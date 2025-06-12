"use client"

import { useEffect, useState, useRef } from "react"

interface ParallaxOptions {
  speed?: number
  direction?: "up" | "down" | "left" | "right"
  offset?: number
  disabled?: boolean
}

export function useParallax({ speed = 0.5, direction = "up", offset = 0, disabled = false }: ParallaxOptions = {}) {
  const [transform, setTransform] = useState("translate3d(0, 0, 0)")
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (disabled || typeof window === "undefined") return

    const handleScroll = () => {
      if (!elementRef.current) return

      const scrolled = window.pageYOffset
      const rect = elementRef.current.getBoundingClientRect()
      const elementTop = rect.top + scrolled
      const elementHeight = rect.height
      const windowHeight = window.innerHeight

      // Check if element is in viewport
      const isInViewport = scrolled + windowHeight > elementTop && scrolled < elementTop + elementHeight

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
    }

    // Throttle scroll events for better performance
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", throttledScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener("scroll", throttledScroll)
    }
  }, [speed, direction, offset, disabled])

  return { ref: elementRef, transform }
}
