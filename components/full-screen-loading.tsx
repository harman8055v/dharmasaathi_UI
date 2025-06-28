"use client"

import { useState, useEffect } from "react"
import { Heart, Sparkles, Loader2 } from "lucide-react"
import Image from "next/image"

interface FullScreenLoadingProps {
  title: string
  subtitle: string
  messages: string[]
  duration?: number
}

export default function FullScreenLoading({ title, subtitle, messages, duration = 4000 }: FullScreenLoadingProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
    }, duration / messages.length)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + 100 / (duration / 100)
      })
    }, 100)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [messages.length, duration])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center z-50">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-200/30 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-pink-200/30 rounded-full animate-pulse delay-1000 blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-amber-200/30 rounded-full animate-pulse delay-500 blur-xl"></div>
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <Image src="/logo.png" alt="DharmaSaathi" fill className="object-contain" />
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        {/* Animated Icons */}
        <div className="flex justify-center gap-4 mb-8">
          <Heart className="w-8 h-8 text-orange-500 animate-pulse" />
          <Sparkles className="w-8 h-8 text-pink-500 animate-spin" style={{ animationDuration: "3s" }} />
          <Heart className="w-8 h-8 text-orange-500 animate-pulse" style={{ animationDelay: "0.5s" }} />
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">{Math.round(progress)}% Complete</p>
        </div>

        {/* Loading Message */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
          <p className="text-lg text-gray-700">{messages[currentMessageIndex]}</p>
        </div>

        {/* Spiritual Quote */}
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-sm">
          <p className="text-sm text-gray-600 italic leading-relaxed">
            "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you
            have built against it."
          </p>
          <p className="text-xs text-gray-500 mt-2 font-medium">- Rumi</p>
        </div>
      </div>
    </div>
  )
}
