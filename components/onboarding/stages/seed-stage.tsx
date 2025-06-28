"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { debugLog } from "@/lib/logger"
import { toast } from "sonner"
import type { User } from "@supabase/supabase-js"
import type { OnboardingProfile } from "@/lib/types/onboarding"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

interface SeedStageProps {
  profile: OnboardingProfile
  updateProfile: (data: Partial<OnboardingProfile>) => void
  onNext: () => void
  user: User
}

export default function SeedStage({ profile, updateProfile, onNext, user }: SeedStageProps) {
  const [mobileNumber, setMobileNumber] = useState(profile.mobile_number || "")
  const [otp, setOtp] = useState("")
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendOtp = async () => {
    setError(null)
    if (!/^\+91[6-9]\d{9}$/.test(mobileNumber)) {
      setError("Please enter a valid 10-digit Indian mobile number starting with +91.")
      return
    }
    setIsSendingOtp(true)
    debugLog(`Sending OTP to ${mobileNumber} for user ${user.id}`)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        phone: mobileNumber,
      })

      if (updateError) throw updateError

      setOtpSent(true)
      toast.success("OTP sent successfully!")
      debugLog("OTP sent request successful.")
    } catch (err: any) {
      console.error("Error sending OTP:", err)
      setError(err.message || "Failed to send OTP. Please try again.")
      toast.error("Failed to send OTP.")
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    setError(null)
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP.")
      return
    }
    setIsVerifyingOtp(true)
    debugLog(`Verifying OTP ${otp} for ${mobileNumber}`)

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: mobileNumber,
        token: otp,
        type: "phone_change",
      })

      if (verifyError) throw verifyError

      await supabase.auth.refreshSession()

      debugLog("OTP verified successfully.", data)
      toast.success("Mobile number verified!")

      updateProfile({ mobile_number: mobileNumber, mobile_verified: true })

      onNext()
    } catch (err: any) {
      console.error("Error verifying OTP:", err)
      if (err.message.includes("Token has expired")) {
        setError("The OTP has expired. Please request a new one.")
      } else if (err.message.includes("Not a valid OTP")) {
        setError("The OTP is incorrect. Please check and try again.")
      } else {
        setError(err.message || "Failed to verify OTP. Please try again.")
      }
      toast.error("OTP verification failed.")
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const isMobileVerified = profile.mobile_verified === true

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Verify Your Mobile Number</CardTitle>
        <CardDescription>A verified mobile number is required for security and to connect with others.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isMobileVerified ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md text-center">
            <p className="font-semibold text-green-800">✅ Your mobile number is verified!</p>
            <p className="text-sm text-green-700">{profile.mobile_number}</p>
            <Button onClick={onNext} className="mt-4">
              Continue
            </Button>
          </div>
        ) : (
          <>
            {!otpSent ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">We'll send a one-time password (OTP) to your mobile number.</p>
                <div className="flex gap-2">
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="+919876543210"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    disabled={isSendingOtp}
                  />
                  <Button onClick={handleSendOtp} disabled={isSendingOtp || !mobileNumber}>
                    {isSendingOtp ? <Loader2 className="animate-spin" /> : "Send OTP"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <p className="text-sm text-gray-600">
                  Enter the 6-digit code sent to <strong>{mobileNumber}</strong>.
                </p>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
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
                <Button onClick={handleVerifyOtp} disabled={isVerifyingOtp || otp.length < 6} className="w-full">
                  {isVerifyingOtp ? <Loader2 className="animate-spin" /> : "Verify & Continue"}
                </Button>
                <Button variant="link" size="sm" onClick={() => setOtpSent(false)} disabled={isVerifyingOtp}>
                  Change number or resend OTP
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
