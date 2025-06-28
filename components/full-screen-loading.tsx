"use client"

import { useState, useEffect } from "react"
import { Loader2, Shield, CheckCircle } from "lucide-react"
import Image from "next/image"

interface FullScreenLoadingProps {
  message?: string
  subMessage?: string
  messages?: string[]
  duration?: number
}

export default function FullScreenLoading({
  message = "Loading...",
  subMessage,
  messages,
  duration = 5000,
}: FullScreenLoadingProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (messages) {
      const messageInterval = duration / messages.length
      const progressInterval = 50 // Update progress every 50ms for smooth animation

      // Progress animation
      const progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressTimer)
            return 100
          }
          return prev + 100 / (duration / progressInterval)
        })
      }, progressInterval)

      // Message rotation
      const messageTimer = setInterval(() => {
        setCurrentMessageIndex((prev) => {
          if (prev >= messages.length - 1) {
            clearInterval(messageTimer)
            return prev
          }
          return prev + 1
        })
      }, messageInterval)

      return () => {
        clearInterval(progressTimer)
        clearInterval(messageTimer)
      }
    }
  }, [messages, duration])

  const currentMessage = messages ? messages[currentMessageIndex] : ""
  const isEncrypting = currentMessage?.toLowerCase().includes("encrypt")
  const isComplete = progress >= 100

  return (
    <div className="fixed inset-0 z-[99999] bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
      {/* Backdrop overlay to prevent any background interactions and block alerts */}
      <div className="absolute inset-0 z-[99998] bg-white/20 backdrop-blur-sm" />

      {/* Main content */}
      <div className="relative z-[99999] text-center p-8 max-w-md mx-auto">
        {/* Logo */}
        <div className="mb-6">
          <Image src="/logo.png" alt="DharmaSaathi" width={120} height={40} className="mx-auto animate-pulse" />
        </div>

        {/* Main icon/animation */}
        <div className="mb-8">
          {isComplete ? (
            <div className="w-20 h-20 mx-auto mb-4 text-green-500 animate-bounce">
              <CheckCircle className="w-full h-full" />
            </div>
          ) : (
            <div className="relative w-20 h-20 mx-auto mb-4">
              <Loader2 className="w-full h-full text-orange-500 animate-spin" />
              {isEncrypting && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-10 h-10 text-green-600 animate-pulse" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{message}</h1>

        {/* Subtitle */}
        {subMessage && <p className="text-lg text-gray-600 mb-8">{subMessage}</p>}

        {/* Progress bar */}
        {messages && (
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-orange-500 via-amber-500 to-green-500 h-3 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>
        )}

        {/* Progress percentage */}
        {messages && <div className="text-sm text-gray-500 mb-6">{Math.round(progress)}% Complete</div>}

        {/* Current message with special styling for encryption */}
        {messages && (
          <div className="min-h-[80px] flex items-center justify-center mb-6">
            <div
              className={`transition-all duration-500 ${
                isEncrypting
                  ? "bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm"
                  : "bg-white/50 rounded-lg p-4"
              }`}
            >
              <p
                className={`text-base font-medium ${
                  isEncrypting ? "text-green-800 flex items-center justify-center" : "text-gray-700"
                }`}
              >
                {isEncrypting && <Shield className="w-4 h-4 mr-2 text-green-600" />}
                {currentMessage}
              </p>
              {isEncrypting && (
                <p className="text-xs text-green-600 mt-2 flex items-center justify-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  Your data is being securely encrypted
                </p>
              )}
            </div>
          </div>
        )}

        {/* Loading dots indicator */}
        {messages && (
          <div className="flex justify-center space-x-2">
            {messages.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i <= currentMessageIndex ? "bg-orange-500 animate-pulse" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}

        {/* Bottom security notice */}
        <div className="mt-8 p-3 bg-white/70 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 flex items-center justify-center">
            <Shield className="w-3 h-3 mr-1 text-gray-500" />
            Secured by DharmaSaathi encryption
          </p>
        </div>
      </div>
    </div>
  )
}
