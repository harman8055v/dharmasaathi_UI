"use client"

import { useEffect, useState } from "react"
import { Heart, Sparkles, Loader2 } from "lucide-react"
import Image from "next/image"

interface FullScreenLoadingProps {
  title: string
  subtitle: string
  messages?: string[]
  duration?: number
}

export default function FullScreenLoading({
  title,
  subtitle,
  messages = [
    "Setting up your spiritual profile...",
    "Connecting you with like-minded souls...",
    "Preparing your sacred journey...",
    "Almost ready...",
  ],
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
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50 flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-orange-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-pink-200 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-amber-200 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-rose-200 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="mb-8 animate-bounce">
          <Image src="/logo.png" alt="DharmaSaathi Logo" width={120} height={40} className="mx-auto mb-4" />
          <div className="flex justify-center items-center gap-2">
            <Heart className="w-8 h-8 text-orange-500 animate-pulse" />
            <Sparkles className="w-6 h-6 text-amber-500 animate-spin" />
            <Heart className="w-8 h-8 text-pink-500 animate-pulse delay-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in">{title}</h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 mb-8 animate-fade-in delay-300">{subtitle}</p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}% Complete</p>
        </div>

        {/* Loading Message */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
          <p className="text-gray-700 font-medium animate-fade-in">{messages[currentMessageIndex]}</p>
        </div>

        {/* Spiritual Quote */}
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/50">
          <p className="text-sm text-gray-600 italic">
            "The meeting of two personalities is like the contact of two chemical substances: if there is any reaction,
            both are transformed."
          </p>
          <p className="text-xs text-gray-500 mt-2">- Carl Jung</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  )
}
