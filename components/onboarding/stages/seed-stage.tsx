"use client"

import type React from "react"

import { useState } from "react"
import { Loader2, CheckCircle } from "lucide-react"

interface SeedStageProps {
  profile: any
  onSubmit: (data: any) => void
  isSubmitting: boolean
}

export default function SeedStage({ profile, onSubmit, isSubmitting }: SeedStageProps) {
  const [emailVerified, setEmailVerified] = useState(!!profile.email_verified)

  const handleVerifyEmail = async () => {
    // In a real app, you would trigger email verification here
    // For this demo, we'll just simulate it
    setTimeout(() => {
      setEmailVerified(true)
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ email_verified: true })
  }

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Verify your email to plant the seed</h2>

        <p className="text-muted-foreground mb-6">
          We've sent a verification email to <strong>{profile.email}</strong>. Please check your inbox and verify your
          email to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {emailVerified ? (
            <div className="flex items-center text-green-600 gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Email verified successfully!</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleVerifyEmail}
              className="w-full bg-muted hover:bg-muted/80 text-muted-foreground py-2 px-4 rounded-md"
            >
              Resend verification email
            </button>
          )}

          <button
            type="submit"
            disabled={!emailVerified || isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              "Next"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
