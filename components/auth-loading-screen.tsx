"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Shield, Heart, Star, CheckCircle } from "lucide-react"
import Image from "next/image"

interface AuthLoadingScreenProps {
  userId?: string
  isNewUser?: boolean
}

export default function AuthLoadingScreen({ userId, isNewUser }: AuthLoadingScreenProps) {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  const inspirationalMessages = [
    "It's time to move from Drama to Dharma ✨",
    "Your spiritual journey begins now 🌸",
    "Connecting hearts through sacred bonds 💫",
    "Where tradition meets modern love 🕉️",
    "Building meaningful relationships with purpose 🙏",
  ]

  const trustElements = [
    { icon: Shield, text: "Secure & Private", color: "text-green-600" },
    { icon: Heart, text: "Verified Profiles", color: "text-red-500" },
    { icon: Star, text: "Premium Experience", color: "text-yellow-500" },
    { icon: CheckCircle, text: "Trusted Platform", color: "text-blue-600" },
  ]

  useEffect(() => {
    // Cycle through inspirational messages
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % inspirationalMessages.length)
    }, 3000)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 100)

    // Check user status and redirect after 5 seconds
    const redirectTimer = setTimeout(async () => {
      try {
        if (userId) {
          const { data: profile } = await supabase
            .from("users")
            .select("onboarding_completed")
            .eq("id", userId)
            .single()

          if (profile?.onboarding_completed) {
            router.push("/dashboard")
          } else {
            router.push("/onboarding")
          }
        } else {
          // Fallback - check current session
          const {
            data: { session },
          } = await supabase.auth.getSession()
          if (session?.user) {
            const { data: profile } = await supabase
              .from("users")
              .select("onboarding_completed")
              .eq("id", session.user.id)
              .single()

            if (profile?.onboarding_completed) {
              router.push("/dashboard")
            } else {
              router.push("/onboarding")
            }
          } else {
            router.push("/")
          }
        }
      } catch (error) {
        console.error("Redirect error:", error)
        router.push("/onboarding")
      }
    }, 5000)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
      clearTimeout(redirectTimer)
    }
  }, [userId, router, inspirationalMessages.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-orange-300 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border-2 border-pink-300 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 border-2 border-amber-300 rounded-full"></div>
        <div className="absolute bottom-32 right-10 w-12 h-12 border-2 border-orange-300 rounded-full"></div>
      </div>

      <div className="max-w-md w-full text-center space-y-8 relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Image src="/logo.png" alt="DharmaSaathi" width={120} height={120} className="drop-shadow-lg" priority />
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full opacity-20 blur-lg animate-pulse"></div>
          </div>
        </div>

        {/* Main Loading Animation */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-orange-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-transparent border-t-pink-500 rounded-full animate-spin animation-delay-150"></div>
            <div className="absolute inset-4 border-4 border-transparent border-t-amber-500 rounded-full animate-spin animation-delay-300"></div>
          </div>
        </div>

        {/* Inspirational Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800 transition-all duration-500 ease-in-out">
            {inspirationalMessages[currentMessage]}
          </h1>
          <p className="text-lg text-gray-600 font-medium">Please wait while we process your account</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500">{progress}% Complete</p>

        {/* Trust Elements */}
        <div className="grid grid-cols-2 gap-4 mt-12">
          {trustElements.map((element, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 shadow-sm"
            >
              <element.icon className={`w-5 h-5 ${element.color}`} />
              <span className="text-sm font-medium text-gray-700">{element.text}</span>
            </div>
          ))}
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-green-600" />
            <span>256-bit SSL Encryption</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span>Trusted by 10,000+ Users</span>
          </div>
        </div>

        {/* Subtle Animation Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/20 to-transparent"></div>
    </div>
  )
}
