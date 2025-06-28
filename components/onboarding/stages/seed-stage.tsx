"use client"

import { useState, useEffect } from "react"
import { Loader2, CheckCircle, AlertCircle, Shield } from "lucide-react"
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
  const [mobileNumber, setMobileNumber] = useState(formData.mobile_number?.replace("+91", "") || "")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  // This is the single source of truth for verification status.
  const isAlreadyVerified = formData.mobile_verified || !!user?.phone_confirmed_at

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendOtp = async () => {
    setLocalError(null)
    if (!mobileNumber.trim() || !/^\d{10}$/.test(mobileNumber)) {
      setLocalError("Please enter a valid 10-digit mobile number.")
      return
    }

    setSendingOtp(true)
    const formattedNumber = `+91${mobileNumber}`

    try {
      if (!user) {
        throw new Error("Authentication session has expired. Please sign in again.")
      }

      console.log(`Attempting to send OTP to ${formattedNumber} for user ${user.id}`)
      // CORRECT METHOD: Use `updateUser` to associate a phone with an existing user and send OTP.
      // `signInWithOtp` is for signing IN, not for verifying a phone on an existing session.
      const { error: updateError } = await supabase.auth.updateUser({
        phone: formattedNumber,
      })

      if (updateError) {
        console.error("Supabase updateUser error:", updateError)
        throw updateError
      }

      console.log("OTP sent successfully.")
      setOtpSent(true)
      setCountdown(60)
      onChange({ mobile_number: formattedNumber })
    } catch (err: any) {
      console.error("Error sending OTP:", err)
      setLocalError(err.message || "An unexpected error occurred while sending OTP.")
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    setLocalError(null)
    if (!otp.trim() || !/^\d{6}$/.test(otp)) {
      setLocalError("Please enter the 6-digit OTP.")
      return
    }

    setVerifying(true)
    const formattedNumber = `+91${mobileNumber}`

    try {
      console.log(`Verifying OTP ${otp} for number ${formattedNumber}`)
      // CORRECT METHOD: Use `verifyOtp` with type 'sms' to confirm the phone number change.
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: formattedNumber,
        token: otp,
        type: "sms", // This is crucial for phone verification
      })

      if (verifyError) {
        console.error("Supabase verifyOtp error:", verifyError)
        throw verifyError
      }

      console.log("OTP verification successful.")
      // CRITICAL STEP: Refresh the user session to get the `phone_confirmed_at` update.
      await supabase.auth.refreshSession()

      const verificationData = {
        mobile_number: formattedNumber,
        mobile_verified: true,
      }
      onChange(verificationData)
      onNext(verificationData) // Proceed to the next stage
    } catch (err: any) {
      console.error("Error verifying OTP:", err)
      setLocalError(err.message || "Invalid OTP or an unexpected error occurred.")
    } finally {
      setVerifying(false)
    }
  }

  if (isAlreadyVerified) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Mobile Already Verified!</h2>
        <p className="text-gray-600">Your phone number is secure. Let's continue building your profile.</p>
        <Button onClick={() => onNext({ mobile_verified: true })} disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Verify Your Mobile Number</h2>
        <p className="text-gray-600">A verified number helps keep your account secure.</p>
      </div>

      {!otpSent ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="mobile" className="font-medium">
              Mobile Number
            </Label>
            <div className="flex items-center mt-1">
              <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 rounded-l-md">
                +91
              </span>
              <Input
                id="mobile"
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="Your 10-digit number"
                className="rounded-l-none"
              />
            </div>
          </div>
          <Button onClick={handleSendOtp} disabled={sendingOtp || isLoading} className="w-full">
            {sendingOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-center text-sm text-green-700 bg-green-50 p-3 rounded-md">
            An OTP has been sent to +91{mobileNumber}.
          </p>
          <div>
            <Label htmlFor="otp" className="font-medium">
              Enter OTP
            </Label>
            <Input
              id="otp"
              type="tel"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="6-digit code"
              className="mt-1 text-center tracking-widest"
            />
          </div>
          <Button onClick={handleVerifyOtp} disabled={verifying || isLoading} className="w-full">
            {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Continue"}
          </Button>
          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm text-gray-500">Resend OTP in {countdown}s</p>
            ) : (
              <Button variant="link" onClick={handleSendOtp} disabled={sendingOtp} className="p-0 h-auto">
                Resend OTP
              </Button>
            )}
          </div>
        </div>
      )}

      {(localError || error) && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
          <AlertCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0" />
          <p className="text-red-700 text-sm">{localError || error}</p>
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-50 border rounded-lg flex items-center justify-center text-xs text-gray-600">
        <Shield className="w-4 h-4 mr-2 text-gray-500" />
        Your number is kept private and secure.
      </div>
    </div>
  )
}
