"use client"

import { useState, useCallback } from "react"
import { User, Mail, Phone, Eye, EyeOff, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import type { OnboardingData } from "@/lib/types/onboarding"

interface SeedStageProps {
  data: OnboardingData
  onChange: (data: Partial<OnboardingData>) => void
  onNext: () => void
}

export default function SeedStage({ data, onChange, onNext }: SeedStageProps) {
  const [localData, setLocalData] = useState({
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: data.email || "",
    mobileNumber: data.mobileNumber || "",
    password: data.password || "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const updateField = useCallback(
    (field: string, value: string) => {
      setLocalData((prev) => ({ ...prev, [field]: value }))

      // Only update parent for actual form fields (not confirmPassword)
      if (field !== "confirmPassword") {
        onChange({ [field]: value })
      }

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }))
      }
    },
    [onChange, errors],
  )

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Name validation
    if (!localData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    } else if (localData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters"
    }

    if (!localData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    } else if (localData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!localData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(localData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Mobile validation
    const mobileRegex = /^[+]?[1-9]\d{9,14}$/
    if (!localData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required"
    } else if (!mobileRegex.test(localData.mobileNumber.replace(/\s/g, ""))) {
      newErrors.mobileNumber = "Please enter a valid mobile number"
    }

    // Password validation
    if (!localData.password) {
      newErrors.password = "Password is required"
    } else if (localData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(localData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number"
    }

    // Confirm password validation
    if (!localData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (localData.password !== localData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  const formatMobileNumber = (value: string) => {
    // Remove all non-digit characters except +
    let cleaned = value.replace(/[^\d+]/g, "")

    // If it doesn't start with +, and it's an Indian number (10 digits), add +91
    if (!cleaned.startsWith("+") && cleaned.length === 10 && cleaned.match(/^[6-9]/)) {
      cleaned = "+91" + cleaned
    }

    return cleaned
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Plant Your Seed</h2>
        <p className="text-gray-600">Begin your spiritual journey by creating your account</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                First Name *
              </Label>
              <Input
                id="firstName"
                type="text"
                value={localData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                className={`mt-1 ${errors.firstName ? "border-red-500" : ""}`}
                placeholder="Enter your first name"
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
            </div>

            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Last Name *
              </Label>
              <Input
                id="lastName"
                type="text"
                value={localData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                className={`mt-1 ${errors.lastName ? "border-red-500" : ""}`}
                placeholder="Enter your last name"
              />
              {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={localData.email}
                onChange={(e) => updateField("email", e.target.value)}
                className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="mobileNumber" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Mobile Number *
              </Label>
              <Input
                id="mobileNumber"
                type="tel"
                value={localData.mobileNumber}
                onChange={(e) => updateField("mobileNumber", formatMobileNumber(e.target.value))}
                className={`mt-1 ${errors.mobileNumber ? "border-red-500" : ""}`}
                placeholder="+91 98765 43210"
              />
              {errors.mobileNumber && <p className="mt-1 text-xs text-red-600">{errors.mobileNumber}</p>}
              <p className="mt-1 text-xs text-gray-500">Include country code (e.g., +91 for India)</p>
            </div>
          </div>

          {/* Password Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password *
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={localData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              <p className="mt-1 text-xs text-gray-500">8+ characters with uppercase, lowercase, and number</p>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password *
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={localData.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  className={`pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Terms and Privacy */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 leading-relaxed">
              By creating an account, you agree to our{" "}
              <a href="/terms-of-service" className="text-orange-600 hover:text-orange-700 font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy-policy" className="text-orange-600 hover:text-orange-700 font-medium">
                Privacy Policy
              </a>
              . Your data is encrypted and secure.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end pt-6">
        <Button
          onClick={handleNext}
          className="px-8 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
