"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Loader2, CheckCircle, Phone, MessageSquareText, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { formatMobileNumber, validateMobileNumber } from "@/lib/types/onboarding"

interface OnboardingData {
  mobile_number?: string | null
  mobile_verified?: boolean
}

interface SeedStageProps {
  formData: any
  onChange: (updates: any) => void
  onNext: (updates: Partial<OnboardingData>) => void
  isLoading: boolean
  user?: any // This 'user' is the userProfile from the 'users' table
  error?: string | null
}

export default function SeedStage({ formData, onChange, onNext, isLoading, user, error }: SeedStageProps) {
  // Initialize mobileNumber from formData.mobile_number (which comes from the user profile)
  const [mobileNumber, setMobileNumber] = useState(formData.mobile_number || "")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [isMobileVerified, setIsMobileVerified] = useState(formData.mobile_verified || false)
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    // If mobile is already verified, immediately proceed
    if (isMobileVerified) {
      onNext({ mobile_verified: true })
    }
  }, [isMobileVerified, onNext])

  // Update local state if formData props change
  useEffect(() => {
    if (formData.mobile_number && formData.mobile_number !== mobileNumber) {
      setMobileNumber(formData.mobile_number)
    }
    if (formData.mobile_verified !== isMobileVerified) {
      setIsMobileVerified(formData.mobile_verified || false)
    }
  }, [formData.mobile_number, formData.mobile_verified, mobileNumber, isMobileVerified])

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMobileNumber(e.target.value)
    setMobileNumber(formatted)
    setLocalError(null)
  }

  const checkMobileExists = async (mobile: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, mobile_verified")
        .eq("mobile_number", mobile)
        .limit(1)

      if (error) {
        console.error("Error checking mobile number:", error)
        return false
      }

      // Check if a user exists with this mobile number AND it's not the current user
      // This prevents the current user from being flagged as "already registered" to themselves
      if (data && data.length > 0) {
        return data[0].id !== user?.id // 'user' here is the current userProfile
      }
      return false
    } catch (err) {
      console.error("Error in mobile check:", err)
      return false
    }
  }

  const handleSendOtp = async () => {
    setLocalError(null)
    if (!validateMobileNumber(mobileNumber)) {
      setLocalError("Please enter a valid mobile number (e.g., +919876543210)")
      return
    }

    setIsVerifying(true)
    try {
      // First check if mobile number is already registered by another user
      const mobileExistsForOtherUser = await checkMobileExists(mobileNumber)

      if (mobileExistsForOtherUser) {
        setLocalError(
          "This mobile number is already registered with another account. Please use a different number or contact support if this is your number.",
        )
        setIsVerifying(false)
        return
      }

      // Update the user's phone number in auth.users table
      // This will also trigger an OTP to be sent if the phone number is new or changed
      const { data: updateAuthData, error: updateAuthError } = await supabase.auth.updateUser({
        phone: mobileNumber,
      })

      if (updateAuthError) {
        console.error("Error updating phone in auth:", updateAuthError)
        // Specific error for phone already registered by *another* user
        if (
          updateAuthError.message?.includes("already been registered") ||
          updateAuthError.message?.includes("User with this phone number has already been registered")
        ) {
          setLocalError("This mobile number is already registered with another account. Please use a different number.")
          setIsVerifying(false)
          return
        }
        // For other errors, we might still proceed to OTP if it's a transient issue
        // or if the phone number is already set in auth but not yet verified.
        // We'll rely on signInWithOtp to handle the actual OTP sending.
      }

      // If the phone number was just updated in auth, an OTP should have been sent.
      // If it was already the same, signInWithOtp will resend.
      // Use signInWithOtp to explicitly send the OTP for verification.
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: mobileNumber,
        options: {
          shouldCreateUser: false, // User is already created via email/password signup
        },
      })

      if (otpError) {
        console.error("OTP Error:", otpError)

        if (
          otpError.message?.includes("already been registered") ||
          otpError.message?.includes("User with this phone number has already been registered")
        ) {
          setLocalError(
            "This mobile number is already registered with another account. Please use a different number or contact support if this is your number.",
          )
          setIsVerifying(false)
          return
        } else if (
          otpError.message?.includes("Signups not allowed for otp") ||
          otpError.message?.includes("Phone signups are disabled")
        ) {
          setLocalError("SMS verification is currently unavailable. You can skip this step for now.")
          setIsVerifying(false)
          return
        } else if (otpError.message?.includes("rate limit") || otpError.message?.includes("too many")) {
          setLocalError("Too many attempts. Please wait a few minutes before trying again.")
          setIsVerifying(false)
          return
        } else {
          throw otpError
        }
      }

      setOtpSent(true)
      setResendTimer(60)

      // Start countdown timer
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      setLocalError(null)
    } catch (err: any) {
      console.error("Error sending OTP:", err)
      setLocalError(err.message || "Failed to send OTP. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleVerifyOtp = async () => {
    setLocalError(null)
    if (!otp) {
      setLocalError("Please enter the OTP.")
      return
    }

    if (otp.length !== 6) {
      setLocalError("OTP must be 6 digits.")
      return
    }

    setIsVerifying(true)
    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: mobileNumber,
        token: otp,
        type: "sms",
      })

      if (verifyError) throw verifyError

      if (data.user) {
        // Update the mobile_verified status in your 'users' table
        const { error: updateError } = await supabase
          .from("users")
          .update({
            mobile_number: mobileNumber,
            mobile_verified: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.user.id)

        if (updateError) {
          console.error("Error updating mobile_verified status:", updateError)
          setLocalError("OTP verified, but failed to update profile. Please contact support.")
          return
        }

        setIsMobileVerified(true)
        onChange({ mobile_number: mobileNumber, mobile_verified: true })
        onNext({ mobile_verified: true })
      }
    } catch (err: any) {
      console.error("Error verifying OTP:", err)
      if (err.message?.includes("Invalid token") || err.message?.includes("invalid")) {
        setLocalError("Invalid OTP. Please check and try again.")
      } else if (err.message?.includes("expired")) {
        setLocalError("OTP has expired. Please request a new one.")
      } else {
        setLocalError(err.message || "Failed to verify OTP. Please try again.")
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0) return

    setIsVerifying(true)
    setLocalError(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: mobileNumber,
        options: {
          shouldCreateUser: false,
        },
      })

      if (error) throw error

      setResendTimer(60)
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      setLocalError(null)
    } catch (error: any) {
      console.error("Resend OTP error:", error)
      setLocalError("Failed to resend OTP. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Mobile Number</h2>
        <p className="text-gray-600">A crucial step to secure your spiritual journey on DharmaSaathi</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        {localError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-700 text-sm">{localError}</p>
          </div>
        )}

        {isMobileVerified ? (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center text-green-600 gap-2 bg-green-50 p-4 rounded-lg">
              <CheckCircle className="h-6 w-6" />
              <span className="font-semibold">Mobile number verified successfully! 🌱</span>
            </div>
            <p className="text-gray-600 text-sm">Your sacred seed has been planted. Ready to grow your profile?</p>
            <button
              onClick={() => onNext({ mobile_verified: true })}
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
          <div className="space-y-4">
            {!otpSent ? (
              <>
                <div className="space-y-2">
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-foreground">
                    Mobile Number *
                  </label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="mobileNumber"
                      type="tel"
                      value={mobileNumber}
                      onChange={handleMobileNumberChange}
                      className={`w-full pl-10 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
                        localError ? "border-red-500" : ""
                      }`}
                      placeholder="+91 98765 43210"
                      disabled={isVerifying}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Include country code (e.g., +91 for India)</p>
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isVerifying || !mobileNumber}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isVerifying ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending OTP...
                    </span>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquareText className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter Verification Code</h3>
                  <p className="text-gray-600 text-sm">
                    We've sent a 6-digit code to:
                    <br />
                    <span className="font-semibold text-gray-900">{mobileNumber}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="otp" className="block text-sm font-medium text-foreground">
                    Enter OTP *
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className={`w-full px-3 py-3 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-center text-lg tracking-widest ${
                        localError ? "border-red-500" : ""
                      }`}
                      placeholder="000000"
                      disabled={isVerifying}
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifying || otp.length !== 6}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isVerifying ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Verifying OTP...
                    </span>
                  ) : (
                    "Verify & Continue"
                  )}
                </button>

                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || isVerifying}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false)
                    setOtp("")
                    setLocalError(null)
                  }}
                  className="w-full text-sm text-blue-600 hover:text-blue-700 underline mt-2"
                >
                  Change mobile number
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Having trouble? Ensure your mobile number is correct and your network is active.
        </p>
      </div>
    </div>
  )
}
