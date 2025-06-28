"use client"

import { useState, useEffect } from "react"
import { Loader2, Phone, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
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
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [otpSent, setOtpSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [localError, setLocalError] = useState<string | null>(null)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)

  // Check if mobile is already verified
  useEffect(() => {
    if (user?.phone_confirmed_at || formData.mobile_verified) {
      // Mobile already verified, proceed to next stage
      onNext({ mobile_verified: true, mobile_number: formData.mobile_number })
    }
  }, [user, formData.mobile_verified, formData.mobile_number, onNext])

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendOtp = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      setLocalError("Please enter a valid mobile number")
      return
    }

    setSendingOtp(true)
    setLocalError(null)

    try {
      // Format mobile number for India (+91)
      const formattedNumber = mobileNumber.startsWith("+91") ? mobileNumber : `+91${mobileNumber.replace(/^0+/, "")}`

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedNumber,
      })

      if (error) {
        throw error
      }

      setOtpSent(true)
      setStep("otp")
      setCountdown(60) // 60 second countdown
      onChange({ mobile_number: formattedNumber })
    } catch (err: any) {
      console.error("Error sending OTP:", err)
      setLocalError(err.message || "Failed to send OTP. Please try again.")
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setLocalError("Please enter the complete 6-digit OTP")
      return
    }

    setVerifyingOtp(true)
    setLocalError(null)

    try {
      const formattedNumber = mobileNumber.startsWith("+91") ? mobileNumber : `+91${mobileNumber.replace(/^0+/, "")}`

      const { error } = await supabase.auth.verifyOtp({
        phone: formattedNumber,
        token: otp,
        type: "sms",
      })

      if (error) {
        throw error
      }

      // OTP verified successfully
      const dataToSave = {
        mobile_verified: true,
        mobile_number: formattedNumber,
      }

      onChange(dataToSave)
      onNext(dataToSave)
    } catch (err: any) {
      console.error("Error verifying OTP:", err)
      setLocalError(err.message || "Invalid OTP. Please try again.")
    } finally {
      setVerifyingOtp(false)
    }
  }

  const handleResendOtp = () => {
    if (countdown === 0) {
      setOtp("")
      handleSendOtp()
    }
  }

  const handleSkip = () => {
    const dataToSave = {
      mobile_verified: false,
      mobile_number: null,
    }
    onChange(dataToSave)
    onNext(dataToSave)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-4xl mb-4">🌱</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Plant your seed</h2>
        <p className="text-gray-600">Verify your mobile number to secure your spiritual journey</p>
      </div>

      {step === "phone" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700">
              Mobile Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="mobile"
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter your mobile number"
                className="pl-10 py-3 text-lg"
                maxLength={10}
              />
            </div>
            <p className="text-xs text-gray-500">We'll send you a verification code via SMS</p>
          </div>

          {(localError || error) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{localError || error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              onClick={handleSendOtp}
              disabled={sendingOtp || !mobileNumber}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-4 px-6 rounded-lg"
            >
              {sendingOtp ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending OTP...
                </span>
              ) : (
                "Send OTP"
              )}
            </Button>

            <Button
              type="button"
              onClick={handleSkip}
              variant="ghost"
              className="px-6 py-4 text-gray-600 hover:text-gray-800 font-medium"
            >
              Skip
            </Button>
          </div>
        </div>
      )}

      {step === "otp" && (
        <div className="space-y-6">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">OTP Sent Successfully</h3>
            <p className="text-gray-600">We've sent a 6-digit code to {mobileNumber}</p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700 text-center">Enter Verification Code</label>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          {(localError || error) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{localError || error}</p>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={handleResendOtp}
              disabled={countdown > 0}
              className="text-sm text-orange-600 hover:text-orange-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
            </button>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleVerifyOtp}
              disabled={verifyingOtp || otp.length !== 6}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-4 px-6 rounded-lg"
            >
              {verifyingOtp ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify & Continue"
              )}
            </Button>

            <Button
              type="button"
              onClick={() => setStep("phone")}
              variant="ghost"
              className="px-6 py-4 text-gray-600 hover:text-gray-800 font-medium"
            >
              Back
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
