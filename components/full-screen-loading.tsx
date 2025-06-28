"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface FullScreenLoadingProps {
  title: string
  subtitle?: string
  messages?: string[]
  duration?: number
}

export default function FullScreenLoading({ title, subtitle, messages = [], duration = 3000 }: FullScreenLoadingProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  useEffect(() => {
    if (messages.length === 0) return

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
    }, duration / messages.length)

    return () => clearInterval(interval)
  }, [messages, duration])

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 py-8 max-w-md mx-auto">
        {/* Animated lotus/loading icon */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-4">
              <Loader2 className="w-full h-full text-orange-500 animate-spin" />
            </div>
            <div className="absolute inset-0 w-20 h-20 mx-auto">
              <div className="w-full h-full rounded-full border-4 border-orange-200 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>

        {/* Subtitle */}
        {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}

        {/* Rotating messages */}
        {messages.length > 0 && (
          <div className="min-h-[2rem] flex items-center justify-center">
            <p className="text-sm text-gray-500 animate-fade-in">{messages[currentMessageIndex]}</p>
          </div>
        )}

        {/* Progress indicator */}
        <div className="mt-8">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-1 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${((currentMessageIndex + 1) / Math.max(messages.length, 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
