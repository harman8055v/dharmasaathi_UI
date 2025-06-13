"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Sparkles, Users, Shield, ArrowRight, Play } from "lucide-react"
import Image from "next/image"
import AuthDialog from "./auth-dialog"

export default function Hero() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup")

  const openAuth = (mode: "signup" | "login") => {
    setAuthMode(mode)
    setIsAuthOpen(true)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden pt-16"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-200 to-pink-200 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full blur-2xl opacity-40 animate-pulse-slow delay-1000"></div>
          <div className="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full blur-3xl opacity-25 animate-pulse-slow delay-2000"></div>
          <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full blur-2xl opacity-35 animate-pulse-slow delay-3000"></div>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-32 left-16 animate-float opacity-60">
          <Heart className="w-6 h-6 text-pink-400" />
        </div>
        <div className="absolute top-48 right-24 animate-float-delayed opacity-60">
          <Sparkles className="w-8 h-8 text-yellow-400" />
        </div>
        <div className="absolute bottom-40 left-24 animate-float opacity-60">
          <Users className="w-7 h-7 text-orange-400" />
        </div>
        <div className="absolute bottom-56 right-16 animate-float-delayed opacity-60">
          <Shield className="w-6 h-6 text-purple-400" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-orange-100 animate-fade-in-up">
                <Sparkles className="w-4 h-4 text-orange-500 mr-2" />
                <span className="text-sm font-medium text-orange-700">
                  India's First Spiritual Matchmaking Platform
                </span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4 animate-fade-in-up delay-200">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Find Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 animate-gradient-x">
                    Spiritual Soulmate
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-2xl">
                  Connect with like-minded souls on a journey of dharma, devotion, and divine love. Your spiritual
                  companion awaits on this sacred path.
                </p>
              </div>

              {/* Features */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start animate-fade-in-up delay-400">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="p-2 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full">
                    <Heart className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="font-medium">Dharma-Based Matching</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                  </div>
                  <span className="font-medium">Spiritual Compatibility</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-600">
                <Button
                  onClick={() => openAuth("signup")}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
                <Button
                  onClick={() => scrollToSection("how-it-works")}
                  variant="outline"
                  size="lg"
                  className="border-2 border-orange-200 text-orange-700 hover:bg-orange-50 px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 group"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  How It Works
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 animate-fade-in-up delay-800">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-orange-600">10K+</div>
                  <div className="text-sm text-gray-600">Spiritual Seekers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-pink-600">500+</div>
                  <div className="text-sm text-gray-600">Success Stories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-purple-600">50+</div>
                  <div className="text-sm text-gray-600">Cities</div>
                </div>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative animate-fade-in-up delay-300">
              {/* Main Image Container */}
              <div className="relative mx-auto max-w-lg">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-200 via-pink-200 to-purple-200 rounded-3xl blur-3xl opacity-30 animate-pulse-glow"></div>

                {/* Image Card */}
                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/50 transform hover:scale-105 transition-transform duration-500">
                  <Image
                    src="/placeholder.svg?height=500&width=400&text=Spiritual+Couple+Finding+Connection"
                    alt="Spiritual couple finding meaningful connection through DharmaSaathi"
                    width={400}
                    height={500}
                    className="w-full h-auto rounded-2xl"
                    priority
                  />

                  {/* Floating Elements on Image */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white p-3 rounded-full shadow-lg animate-bounce-slow">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-3 rounded-full shadow-lg animate-bounce-slow delay-1000">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-8 -left-8 w-16 h-16 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-20 animate-ping"></div>
                <div className="absolute bottom-8 -right-8 w-12 h-12 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-25 animate-ping delay-1000"></div>
              </div>

              {/* Trust Indicators */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 animate-fade-in-up delay-1000">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700 font-medium">Verified Profiles</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-gray-700 font-medium">Safe & Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Link */}
        <div className="absolute top-20 right-4 lg:right-8 animate-fade-in-up delay-1000">
          <Button
            onClick={() => openAuth("login")}
            variant="ghost"
            className="text-gray-700 hover:text-orange-600 hover:bg-white/50 backdrop-blur-sm transition-all duration-200"
          >
            Already have an account? <span className="font-semibold ml-1">Sign In</span>
          </Button>
        </div>
      </section>

      {/* Auth Dialog */}
      <AuthDialog isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultMode={authMode} />
    </>
  )
}
