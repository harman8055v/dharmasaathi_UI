"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { Loader2, Heart, Sparkles } from "lucide-react"

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  general?: string
}

export default function Hero() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters"
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Sign up the user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
          },
        },
      })

      if (authError) {
        console.error("Auth error:", authError)
        throw authError
      }

      if (authData.user) {
        console.log("User created successfully:", authData.user.id)

        // Try to create profile - but don't fail if it doesn't work
        try {
          // First, let's check if a users table exists and what its structure is
          const { data: existingProfile, error: checkError } = await supabase
            .from("users")
            .select("*")
            .eq("id", authData.user.id)
            .single()

          if (checkError && checkError.code !== "PGRST116") {
            // PGRST116 means "not found", which is expected for new users
            console.log("Error checking existing profile:", checkError)
          }

          if (!existingProfile) {
            // Try to insert the profile
            const profileData = {
              id: authData.user.id,
              email: formData.email,
              first_name: formData.firstName,
              last_name: formData.lastName,
              full_name: `${formData.firstName} ${formData.lastName}`,
              onboarding_completed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }

            console.log("Attempting to create profile with data:", profileData)

            const { data: profileResult, error: profileError } = await supabase
              .from("users")
              .insert(profileData)
              .select()

            if (profileError) {
              console.error("Profile creation error details:", {
                message: profileError.message,
                details: profileError.details,
                hint: profileError.hint,
                code: profileError.code,
              })

              // Don't throw here - the auth user was created successfully
              // The onboarding page can handle creating the profile if needed
            } else {
              console.log("Profile created successfully:", profileResult)
            }
          }
        } catch (profileError) {
          console.error("Profile creation failed:", profileError)
          // Continue anyway - onboarding can handle this
        }

        setIsSuccess(true)

        // Redirect to onboarding after a brief success message
        setTimeout(() => {
          router.push("/onboarding")
        }, 2000)
      }
    } catch (error: any) {
      console.error("Sign up error:", error)

      if (error.message?.includes("already registered") || error.message?.includes("already been registered")) {
        setErrors({ email: "This email is already registered. Please try signing in instead." })
      } else if (error.message?.includes("Invalid email")) {
        setErrors({ email: "Please enter a valid email address" })
      } else if (error.message?.includes("Password")) {
        setErrors({ password: error.message })
      } else {
        setErrors({ general: error.message || "An error occurred during sign up. Please try again." })
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.png')] bg-cover bg-center opacity-10" />

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
          <div className="animate-bounce mb-8">
            <Heart className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Welcome to DharmaSaathi! 🌸</h1>

          <p className="text-xl text-gray-700 mb-8">
            Your sacred account has been created successfully.
            <br />
            Redirecting you to complete your spiritual profile...
          </p>

          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/images/hero-bg.png')] bg-cover bg-center opacity-10" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <Sparkles className="w-8 h-8 text-orange-300" />
      </div>
      <div className="absolute top-40 right-20 animate-float-delayed">
        <Heart className="w-6 h-6 text-pink-300" />
      </div>
      <div className="absolute bottom-32 left-20 animate-float">
        <Sparkles className="w-10 h-10 text-yellow-300" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 block">
                Sacred Soulmate
              </span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Connect with like-minded souls on a journey of dharma, devotion, and divine love. Your spiritual companion
              awaits.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <div className="flex items-center gap-2 text-gray-600">
                <Heart className="w-5 h-5 text-red-500" />
                <span>Dharma-Based Matching</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span>Spiritual Compatibility</span>
              </div>
            </div>
          </div>

          {/* Right Column - Sign Up Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Sacred Account</h2>
              <p className="text-gray-600">Begin your journey to find your dharmic partner</p>
            </div>

            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-gray-700 font-medium">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={`mt-1 ${errors.firstName ? "border-red-500 focus:ring-red-500" : ""}`}
                    placeholder="Enter your first name"
                    disabled={isLoading}
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-gray-700 font-medium">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={`mt-1 ${errors.lastName ? "border-red-500 focus:ring-red-500" : ""}`}
                    placeholder="Enter your last name"
                    disabled={isLoading}
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`mt-1 ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password *
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`mt-1 ${errors.password ? "border-red-500 focus:ring-red-500" : ""}`}
                  placeholder="Create a strong password"
                  disabled={isLoading}
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                <p className="mt-1 text-xs text-gray-500">
                  Must be 8+ characters with uppercase, lowercase, and number
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  "Create Sacred Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button className="text-orange-600 hover:text-orange-700 font-medium">Sign In</button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </section>
  )
}
