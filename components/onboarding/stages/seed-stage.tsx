"use client"

import { useState } from "react"
import { Loader2, CheckCircle, Mail } from "lucide-react"

interface SeedStageProps {
  formData: any
  onChange: (updates: any) => void
  onNext: () => void
  isLoading: boolean
  user?: any
}

export default function SeedStage({ formData, onChange, onNext, isLoading, user }: SeedStageProps) {
  // Safe destructuring with defaults
  const { email_verified = false } = formData || {}

  const [emailVerified, setEmailVerified] = useState(email_verified || !!user?.email_confirmed_at)
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerifyEmail = async () => {
    setIsVerifying(true)

    // In a real app, you would trigger email verification here
    // For this demo, we'll simulate the verification process
    setTimeout(() => {
      setEmailVerified(true)
      onChange({ email_verified: true })
      setIsVerifying(false)
    }, 2000)
  }

  const handleNext = () => {
    if (emailVerified) {
      onChange({ email_verified: true })
      onNext()
    }
  }

  const userEmail = user?.email || formData?.email || "your email"

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Plant Your Sacred Seed</h2>
        <p className="text-gray-600">Verify your email to begin your spiritual journey on DharmaSaathi</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="text-center mb-6">
          <p className="text-gray-700 mb-2">We've sent a verification email to:</p>
          <p className="font-semibold text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{userEmail}</p>
        </div>

        {emailVerified ? (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center text-green-600 gap-2 bg-green-50 p-4 rounded-lg">
              <CheckCircle className="h-6 w-6" />
              <span className="font-semibold">Email verified successfully! 🌱</span>
            </div>
            <p className="text-gray-600 text-sm">Your sacred seed has been planted. Ready to grow your profile?</p>
            <button
              onClick={handleNext}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Growing your profile...
                </span>
              ) : (
                "Continue to Stem Stage 🌱"
              )}
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 text-sm">
                Please check your inbox and click the verification link to continue.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleVerifyEmail}
                disabled={isVerifying}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending verification email...
                  </span>
                ) : (
                  "Resend verification email"
                )}
              </button>

              {/* For demo purposes, allow manual verification */}
              <button
                type="button"
                onClick={() => {
                  setEmailVerified(true)
                  onChange({ email_verified: true })
                }}
                className="w-full text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Skip verification (Demo only)
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Didn't receive the email? Check your spam folder or try a different email address.
        </p>
      </div>
    </div>
  )
}
