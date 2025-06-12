"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface UseIntersectionObserverOptimizedProps {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  skip?: boolean
}

export function useIntersectionObserverOptimized({
  threshold = 0.1,
  rootMargin = "100px",
  triggerOnce = true,
  skip = false,
}: UseIntersectionObserverOptimizedProps = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (skip || typeof window === "undefined") return

    const element = ref.current
    if (!element) return

    // Use a single observer instance
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          const isElementIntersecting = entry.isIntersecting

          if (isElementIntersecting && !hasTriggered) {
            setIsIntersecting(true)
            if (triggerOnce) {
              setHasTriggered(true)
              cleanup()
            }
          } else if (!triggerOnce) {
            setIsIntersecting(isElementIntersecting)
          }
        },
        {
          threshold,
          rootMargin,
        },
      )
    }

    observerRef.current.observe(element)

    return cleanup
  }, [threshold, rootMargin, triggerOnce, hasTriggered, skip, cleanup])

  return { ref, isIntersecting }
}
