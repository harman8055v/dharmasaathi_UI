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
  messages = [
    "Initializing your spiritual journey...",
    "Encrypting your personal data...",
    "Setting up your profile...",
    "Preparing your matches...",
    "Almost ready...",
  ],
  duration = 5000,
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
    <>
      {/* Full screen overlay with highest z-index */}
      <div className="fixed inset-0 z-[99999] bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.3),transparent_50%)]" />
        </div>

        {/* Main content container */}
        <div className="relative z-10 text-center space-y-8 max-w-md mx-auto px-6 py-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image src="/logo.png" alt="DharmaSaathi" width={140} height={48} className="animate-pulse" priority />
          </div>

          {/* Animated lotus/spinner */}
          <div className="relative flex justify-center mb-8">
            <div className="relative">
              {/* Outer ring */}
              <div className="w-20 h-20 rounded-full border-4 border-orange-200 animate-spin">
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-orange-500 rounded-full transform -translate-x-1/2 -translate-y-1" />
              </div>
              {/* Inner spinner */}
              <div className="absolute inset-2">
                <Loader2
                  className="w-full h-full text-orange-500 animate-spin"
                  style={{ animationDirection: "reverse" }}
                />
              </div>
              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Title and subtitle */}
          <div className="space-y-3 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
            {subtitle && <p className="text-lg text-gray-600 font-medium">{subtitle}</p>}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 via-amber-500 to-pink-500 h-2 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>

          {/* Current message with encryption emphasis */}
          <div className="min-h-[3rem] flex items-center justify-center mb-8">
            <div className="text-center">
              <p className="text-gray-700 font-medium text-lg animate-fade-in transition-all duration-500">
                {messages[currentMessageIndex]}
              </p>
              {messages[currentMessageIndex]?.includes("Encrypting") && (
                <div className="flex items-center justify-center mt-2 space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600 font-medium">Secure & Private</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom status */}
          <div className="text-center space-y-3 pb-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
              <p className="text-sm text-gray-600 font-medium">Setting up your spiritual journey...</p>
            </div>
            <p className="text-xs text-gray-500">This process is secure and may take a few moments</p>

            {/* Progress percentage */}
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                {Math.round(progress)}% Complete
              </span>
            </div>
          </div>
        </div>

        {/* Prevent any background interactions */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
      </div>

      {/* Additional overlay to block any alerts/notifications */}
      <div className="fixed inset-0 z-[99998] pointer-events-none" />
    </>
  )
}
