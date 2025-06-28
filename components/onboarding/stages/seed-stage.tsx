"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import type { OnboardingProfile } from "@/lib/types/onboarding"

interface SeedStageProps {
  user: User
  profile: OnboardingProfile
  updateProfile: (data: Partial<OnboardingProfile>) => void
  onNext: () => void
}

export default function SeedStage({ user, profile, updateProfile, onNext }: SeedStageProps) {
  const [mobileNumber, setMobileNumber] = useState(profile.mobile_number || "")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(profile.mobile_verified || false)

  const handleSendOtp = async () => {
    if (!/^\+[1-9]\d{1,14}$/.test(mobileNumber)) {
      toast.error("Please enter a valid phone number with country code (e.g., +14155552671).")
      return
    }
    setIsLoading(true)
    try {
      // This is for an authenticated user changing their number
      const { error } = await supabase.auth.updateUser({ phone: mobileNumber })
      if (error) throw error
      setOtpSent(true)
      toast.success("OTP sent to your phone!")
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.")
      return
    }
    setIsLoading(true)
    try {
      // The correct type for verifying a phone number change for an existing user
      const {
        data: { session },
        error,
      } = await supabase.auth.verifyOtp({
        phone: mobileNumber,
        token: otp,
        type: "phone_change",
      })

      if (error) throw error

      // Manually refresh the session to get the updated user object with the new phone
      await supabase.auth.refreshSession()

      toast.success("Phone number verified successfully!")
      setIsVerified(true)
      updateProfile({ mobile_number: mobileNumber, mobile_verified: true })
    } catch (error: any) {
      toast.error(error.message || "Invalid or expired OTP.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Verify Your Phone Number</CardTitle>
        <CardDescription>
          A verified phone number is required for security and to ensure the authenticity of profiles.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isVerified ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+14155552671"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                disabled={otpSent || isLoading}
              />
            </div>
            {otpSent && (
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password (OTP)</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}
            <div className="flex justify-end">
              {!otpSent ? (
                <Button onClick={handleSendOtp} disabled={isLoading || !mobileNumber}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send OTP
                </Button>
              ) : (
                <Button onClick={handleVerifyOtp} disabled={isLoading || !otp}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify OTP
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700 font-medium">Your phone number is verified!</p>
          </div>
        )}
        <div className="flex justify-end pt-4">
          <Button onClick={onNext} disabled={!isVerified}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
