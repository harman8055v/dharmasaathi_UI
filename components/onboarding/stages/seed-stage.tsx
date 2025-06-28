"use client"

import { useState, useEffect } from "react"
import { Loader2, Phone, CheckCircle, AlertCircle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import type { OnboardingData } from "@/lib/types/onboarding"

interface SeedStageProps {
  formData: OnboardingData
  onChange: (updates: Partial<OnboardingData>) => void
  onNext: (updates: Partial<OnboardingData>) => void
  isLoading: boolean
  user: User | null
  error?: string | null
}

export default function SeedStage({ formData, onChange, onNext, isLoading, user, error }: SeedStageProps) {
  const [mobileNumber, setMobileNumber] = useState(formData.mobile_number || "")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  // Check if mobile is already verified
  const isAlreadyVerified = formData.mobile_verified || !!user?.phone_confirmed_at

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendOtp = async () => {
    if (!mobileNumber.trim()) {
      setLocalError("Please enter your mobile number")
      return
    }

    // Basic mobile number validation
    const cleanNumber = mobileNumber.replace(/\D/g, "")
    if (cleanNumber.length < 10) {
      setLocalError("Please enter a valid mobile number")
      return
    }

    setSendingOtp(true)
    setLocalError(null)

    try {
      // Format the number for international format
      const formattedNumber = cleanNumber.startsWith("91") ? `+${cleanNumber}` : `+91${cleanNumber}`

      console.log("📱 Sending OTP to:", formattedNumber)

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedNumber,
      })

      if (error) {
        console.error("❌ OTP send error:", error)
        setLocalError(error.message || "Failed to send OTP. Please try again.")
        return
      }

      console.log("✅ OTP sent successfully")
      setOtpSent(true)
      setCountdown(60) // 60 second countdown

      // Update form data with mobile number
      onChange({ mobile_number: formattedNumber })
    } catch (error) {
      console.error("❌ Error sending OTP:", error)
      setLocalError("Failed to send OTP. Please try again.")
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setLocalError("Please enter the OTP")
      return
    }

    if (otp.length !== 6) {
      setLocalError("OTP must be 6 digits")
      return
    }

    if (!mobileNumber.trim()) {
      setLocalError("Mobile number is required")
      return
    }

    setVerifying(true)
    setLocalError(null)

    try {
      const cleanNumber = mobileNumber.replace(/\D/g, "")
      const formattedNumber = cleanNumber.startsWith("91") ? `+${cleanNumber}` : `+91${cleanNumber}`

      console.log("🔐 Verifying OTP for:", formattedNumber)

      const { error } = await supabase.auth.verifyOtp({
        phone: formattedNumber,
        token: otp,
        type: "sms",
      })

      if (error) {
        console.error("❌ OTP verification error:", error)
        setLocalError(error.message || "Invalid OTP. Please try again.")
        return
      }

      console.log("✅ OTP verified successfully")

      // OTP verified successfully
      const verificationData = {
        mobile_number: formattedNumber,
        mobile_verified: true,
      }

      // Update form data and proceed to next stage
      onChange(verificationData)
      onNext(verificationData)
    } catch (error) {
      console.error("❌ Error verifying OTP:", error)
      setLocalError("Failed to verify OTP. Please try again.")
    } finally {
      setVerifying(false)
    }
  }

  const handleSkipVerification = () => {
    // Allow skipping but mark as not verified
    const skipData = {
      mobile_number: null,
      mobile_verified: false,
    }
    onChange(skipData)
    onNext(skipData)
  }

  if (isAlreadyVerified) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mobile Already Verified! ✅</h2>
          <p className="text-gray-600">Your mobile number is already verified. Let's continue with your profile.</p>
        </div>

        <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
          <Shield className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-green-700 font-medium">Mobile verification complete</span>
        </div>

        <Button onClick={() => onNext({ mobile_verified: true })} disabled={isLoading} className="w-full">
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </span>
          ) : (
            "Continue to Next Step"
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Plant your seed of trust 🌱</h2>
        <p className="text-gray-600">
          Verify your mobile number to ensure secure communication on your spiritual journey
        </p>
      </div>

      {!otpSent ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mobile" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Phone className="w-4 h-4" />
              Mobile Number *
            </Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                +91
              </span>
              <Input
                id="mobile"
                type="tel"
                value={mobileNumber.replace("+91", "")}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                  setMobileNumber(value)
                  setLocalError(null)
                }}
                placeholder="Enter your mobile number"
                className="rounded-l-none"
                maxLength={10}
              />
            </div>
            <p className="text-xs text-gray-500">We'll send you a secure verification code via SMS</p>
          </div>

          {(localError || error) && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0" />
              <p className="text-red-700 text-sm">{localError || error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleSendOtp}
              disabled={sendingOtp || !mobileNumber.trim()}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              {sendingOtp ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending OTP...
                </span>
              ) : (
                "Send OTP"
              )}
            </Button>

            <Button variant="outline" onClick={handleSkipVerification} disabled={sendingOtp}>
              Skip for now
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
              <p className="text-blue-700 text-sm font-medium">OTP sent to +91{mobileNumber.replace("+91", "")}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
              Enter Verification Code
            </Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                setOtp(value)
                setLocalError(null)
              }}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />
            <p className="text-xs text-gray-500">Enter the 6-digit code sent to your mobile</p>
          </div>

          {(localError || error) && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0" />
              <p className="text-red-700 text-sm">{localError || error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleVerifyOtp}
              disabled={verifying || otp.length !== 6}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              {verifying ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify & Continue"
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setOtpSent(false)
                setOtp("")
                setLocalError(null)
              }}
              disabled={verifying}
            >
              Change Number
            </Button>
          </div>

          {countdown > 0 ? (
            <p className="text-center text-sm text-gray-500">Resend OTP in {countdown} seconds</p>
          ) : (
            <Button variant="link" onClick={handleSendOtp} disabled={sendingOtp} className="w-full">
              Resend OTP
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={handleSkipVerification}
            disabled={verifying}
            className="w-full text-gray-500"
          >
            Skip verification for now
          </Button>
        </div>
      )}

      {/* Security notice */}
      <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-center">
          <Shield className="w-4 h-4 text-gray-500 mr-2" />
          <p className="text-xs text-gray-600">Your mobile number is encrypted and secure</p>
        </div>
      </div>
    </div>
  )
}
