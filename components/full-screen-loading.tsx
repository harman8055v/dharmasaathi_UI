"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import Image from "next/image"

interface FullScreenLoadingProps {
  title: string
  subtitle?: string
  messages?: string[]
  duration?: number
}

export default function FullScreenLoading({
  title,
  subtitle,
  messages = ["Loading..."],
  duration = 3000,
}: FullScreenLoadingProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + 100 / (duration / 100)
      })
    }, 100)

    // Message rotation
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
    }, duration / messages.length)

    return () => {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
    }
  }, [duration, messages.length])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center z-50">
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Image src="/logo.png" alt="DharmaSaathi" width={120} height={40} className="animate-pulse" />
        </div>

        {/* Spinner */}
        <div className="flex justify-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Current Message */}
        <div className="min-h-[24px] flex items-center justify-center">
          <p className="text-gray-700 animate-fade-in">{messages[currentMessageIndex]}</p>
        </div>

        {/* Bottom Text */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">Please wait while we prepare your experience</p>
          <p className="text-xs text-gray-400">This may take a few moments...</p>
        </div>
      </div>
    </div>
  )
}
