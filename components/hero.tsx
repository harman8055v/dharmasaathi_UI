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
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50/80 via-amber-50/60 to-rose-50/40 overflow-hidden pt-20 pb-8"
      >
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-brand-200/20 to-orange-200/20 rounded-full blur-3xl opacity-40 animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-rose-200/20 to-pink-200/20 rounded-full blur-3xl opacity-30 animate-pulse-slow delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-100/10 to-yellow-100/10 rounded-full blur-3xl opacity-20 animate-pulse-slow delay-4000"></div>
        </div>

        {/* Floating Icons - More Subtle */}
        <div className="absolute top-32 left-8 md:left-16 animate-float opacity-30">
          <Heart className="w-4 h-4 md:w-5 md:h-5 text-brand-400" />
        </div>
        <div className="absolute top-48 right-8 md:right-24 animate-float-delayed opacity-30">
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
        </div>
        <div className="absolute bottom-40 left-8 md:left-24 animate-float opacity-30">
          <Users className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
        </div>
        <div className="absolute bottom-56 right-8 md:right-16 animate-float-delayed opacity-30">
          <Shield className="w-4 h-4 md:w-5 md:h-5 text-rose-400" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left space-y-6 lg:space-y-8 order-2 lg:order-1">
              {/* Badge - Fixed positioning for mobile */}
              <div className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-brand-100/50 animate-fade-in-up">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-brand-500 mr-2 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium text-brand-700 leading-tight">
                  India's First Spiritual Matchmaking Platform
                </span>
              </div>

              {/* Main Heading */}
              <div className="space-y-3 md:space-y-4 animate-fade-in-up delay-200">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Find Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-orange-500 to-amber-500 mt-1">
                    Spiritual Soulmate
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Connect with like-minded souls on a journey of dharma, devotion, and divine love. Your spiritual
                  companion awaits on this sacred path.
                </p>
              </div>

              {/* Features - Better Mobile Layout */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start animate-fade-in-up delay-400">
                <div className="flex items-center gap-3 text-gray-700 justify-center lg:justify-start">
                  <div className="p-2 bg-gradient-to-r from-brand-100 to-orange-100 rounded-full flex-shrink-0">
                    <Heart className="w-4 h-4 md:w-5 md:h-5 text-brand-600" />
                  </div>
                  <span className="font-medium text-sm md:text-base">Dharma-Based Matching</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 justify-center lg:justify-start">
                  <div className="p-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full flex-shrink-0">
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                  </div>
                  <span className="font-medium text-sm md:text-base">Spiritual Compatibility</span>
                </div>
              </div>

              {/* CTA Buttons - Better Mobile Spacing */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start animate-fade-in-up delay-600">
                <Button
                  onClick={() => openAuth("signup")}
                  size="lg"
                  className="bg-gradient-to-r from-brand-600 to-orange-500 hover:from-brand-700 hover:to-orange-600 text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group w-full sm:w-auto"
                >
                  Start Your Journey
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
                <Button
                  onClick={() => scrollToSection("how-it-works")}
                  variant="outline"
                  size="lg"
                  className="border-2 border-brand-200 text-brand-700 hover:bg-brand-50 px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 group w-full sm:w-auto"
                >
                  <Play className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  How It Works
                </Button>
              </div>

              {/* Stats - Better Mobile Grid */}
              <div className="grid grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8 animate-fade-in-up delay-800">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-brand-600 to-orange-500 bg-clip-text text-transparent">
                    10K+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 leading-tight">Spiritual Seekers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    500+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 leading-tight">Success Stories</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                    50+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 leading-tight">Cities</div>
                </div>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative animate-fade-in-up delay-300 order-1 lg:order-2">
              {/* Main Image Container */}
              <div className="relative mx-auto max-w-sm md:max-w-md lg:max-w-lg">
                {/* Subtle Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-200/30 via-orange-200/20 to-amber-200/30 rounded-3xl blur-2xl opacity-60 animate-pulse-glow"></div>

                {/* Image Card */}
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl border border-white/60 transform hover:scale-105 transition-transform duration-500 group">
                  <Image
                    src="/placeholder.svg?height=500&width=400&text=Spiritual+Couple+Finding+Connection"
                    alt="Spiritual couple finding meaningful connection through DharmaSaathi"
                    width={400}
                    height={500}
                    className="w-full h-auto rounded-xl md:rounded-2xl"
                    priority
                  />

                  {/* Floating Elements on Image - More Subtle */}
                  <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-gradient-to-r from-brand-500 to-orange-500 text-white p-2 md:p-3 rounded-full shadow-lg animate-bounce-slow opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    <Heart className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 md:-bottom-3 md:-left-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white p-2 md:p-3 rounded-full shadow-lg animate-bounce-slow delay-1000 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                </div>

                {/* Decorative Elements - More Subtle */}
                <div className="absolute top-4 -left-4 md:top-8 md:-left-8 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-brand-300/20 to-orange-300/20 rounded-full opacity-40 animate-ping"></div>
                <div className="absolute bottom-4 -right-4 md:bottom-8 md:-right-8 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-amber-300/20 to-yellow-300/20 rounded-full opacity-30 animate-ping delay-1000"></div>
              </div>

              {/* Trust Indicators - Better Mobile Positioning */}
              <div className="absolute -bottom-4 md:-bottom-6 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg border border-white/60 animate-fade-in-up delay-1000 w-11/12 max-w-sm">
                <div className="flex items-center justify-center gap-3 md:gap-4 text-xs md:text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">Verified Profiles</span>
                  </div>
                  <div className="w-px h-3 md:h-4 bg-gray-300"></div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-3 h-3 md:w-4 md:h-4 text-brand-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">Safe & Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Dialog */}
      <AuthDialog isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultMode={authMode} />
    </>
  )
}
