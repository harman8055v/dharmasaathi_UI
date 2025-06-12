"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface LoadingWrapperProps {
  children: React.ReactNode
  skeleton: React.ReactNode
  delay?: number
}

export default function LoadingWrapper({ children, skeleton, delay = 1500 }: LoadingWrapperProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  if (isLoading) {
    return <>{skeleton}</>
  }

  return <>{children}</>
}
