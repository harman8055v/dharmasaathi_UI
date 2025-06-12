"use client"

import type React from "react"

import { useState } from "react"
import { Heart, Mail, Lock, User } from "lucide-react"
import { cn } from "@/lib/utils"

export default function HeroMinimal() {
  const [activeTab, setActiveTab] = useState("signup")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setShowSuccess(true)
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <section id="signup-form" className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-32">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 via-white to-purple-50/60" />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <div className="inline-block mb-6">
                <div className="flex items-center space-x-3 glass-effect px-6 py-3 rounded-full shadow-lg">
                  <Heart className="h-6 w-6 text-primary animate-pulse" />
                  <span className="text-lg font-semibold text-primary">DharmaSaathi</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                From Drama to <span className="text-primary">Dharma</span>
              </h1>

              <p className="max-w-[600px] text-lg sm:text-xl text-muted-foreground md:text-2xl leading-relaxed">
                Where Seekers Meet Their Soulmates
              </p>

              <p className="max-w-[600px] text-muted-foreground leading-relaxed">
                Join thousands of spiritual souls who have found their perfect match through our sacred platform. Begin
                your journey from chaos to consciousness, from drama to dharma.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Start Your Spiritual Journey
              </button>
              <button className="btn btn-outline btn-lg border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                Watch Stories
              </button>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-5 w-full">
            <div className="glass-effect p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/30 max-w-md mx-auto lg:mx-0">
              {showSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Account Created Successfully!</h3>
                      <p className="mt-2 text-sm text-green-700">
                        Welcome to DharmaSaathi! Please check your email to verify your account.
                      </p>
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => setShowSuccess(false)}
                          className="btn btn-outline text-sm border-green-500 text-green-500"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Simple Tabs */}
                  <div className="mb-6">
                    <div className="flex rounded-lg bg-muted/50 p-1">
                      <button
                        className={cn(
                          "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all",
                          activeTab === "signup" ? "bg-primary text-white" : "hover:bg-muted",
                        )}
                        onClick={() => setActiveTab("signup")}
                      >
                        Sign Up
                      </button>
                      <button
                        className={cn(
                          "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all",
                          activeTab === "login" ? "bg-primary text-white" : "hover:bg-muted",
                        )}
                        onClick={() => setActiveTab("login")}
                      >
                        Login
                      </button>
                    </div>
                  </div>

                  {activeTab === "signup" ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <input
                            id="name"
                            name="name"
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input pl-10 h-11 w-full"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="input pl-10 h-11 w-full"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                          Create Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input pl-10 h-11 w-full"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary w-full h-11 font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                      >
                        {isSubmitting ? "Creating Account..." : "Create Sacred Account"}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="login-email" className="text-sm font-medium">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <input
                            id="login-email"
                            type="email"
                            placeholder="your.email@example.com"
                            className="input pl-10 h-11 w-full"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="login-password" className="text-sm font-medium">
                            Password
                          </label>
                          <button className="text-xs text-primary hover:text-primary/80">Forgot password?</button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <input
                            id="login-password"
                            type="password"
                            placeholder="Enter your password"
                            className="input pl-10 h-11 w-full"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary w-full h-11 font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                      >
                        {isSubmitting ? "Signing In..." : "Sign In to Your Journey"}
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
