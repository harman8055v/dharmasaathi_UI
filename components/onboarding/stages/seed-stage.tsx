"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import type { OnboardingProfile } from "@/lib/types/onboarding"

interface SeedStageProps {
  profile: OnboardingProfile
  updateProfile: (data: Partial<OnboardingProfile>) => void
  onNext: () => void
  user: User
}

export default function SeedStage({ profile, updateProfile, onNext, user }: SeedStageProps) {
  const [mobileNumber, setMobileNumber] = useState(profile.mobile_number || "+91")
  const [otp, setOtp] = useState("")
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If already verified, allow user to proceed.
  if (profile.mobile_verified) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Mobile Verified</CardTitle>
          <CardDescription>Your mobile number is already verified.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-green-600 font-semibold">Your number {profile.mobile_number} is verified.</p>
          <Button onClick={onNext} className="mt-4 w-full">
            Continue
          </Button>
        </CardContent>
      </Card>
    )
  }

  const handleSendOtp = async () => {
    setError(null)
    if (!/^\+91[6-9]\d{9}$/.test(mobileNumber)) {
      setError("Please enter a valid 10-digit Indian mobile number starting with +91.")
      return
    }
    setIsSendingOtp(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ phone: mobileNumber })
      if (updateError) throw updateError
      setOtpSent(true)
      toast.success("OTP sent successfully!")
    } catch (err: any) {
      console.error("Error sending OTP:", err)
      setError(err.message || "Failed to send OTP.")
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
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: mobileNumber,
        token: otp,
        type: "phone_change",
      })

      if (verifyError) throw verifyError

      await supabase.auth.refreshSession()
      toast.success("Mobile number verified!")
      updateProfile({ mobile_number: mobileNumber, mobile_verified: true })
      onNext()
    } catch (err: any) {
      console.error("Error verifying OTP:", err)
      const message = err.message.toLowerCase().includes("token has expired")
        ? "The OTP has expired. Please request a new one."
        : "The OTP is incorrect. Please check and try again."
      setError(message)
      toast.error(message)
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Verify Your Mobile Number</CardTitle>
        <CardDescription>A verified number helps keep your account secure.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!otpSent ? (
          <div className="space-y-4">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              disabled={isSendingOtp}
              placeholder="+91XXXXXXXXXX"
            />
            <Button onClick={handleSendOtp} disabled={isSendingOtp} className="w-full">
              {isSendingOtp ? <Loader2 className="animate-spin" /> : "Send OTP"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              Enter the 6-digit code sent to <strong>{mobileNumber}</strong>.
            </p>
            <Label htmlFor="otp">OTP Code</Label>
            <Input id="otp" type="tel" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
            <Button onClick={handleVerifyOtp} disabled={isVerifyingOtp} className="w-full">
              {isVerifyingOtp ? <Loader2 className="animate-spin" /> : "Verify & Continue"}
            </Button>
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                setOtpSent(false)
                setError(null)
                setOtp("")
              }}
              disabled={isVerifyingOtp}
              className="w-full"
            >
              Change number or resend OTP
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
