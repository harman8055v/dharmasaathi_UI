"use client"

import { CheckCircle2 } from "lucide-react"

export default function CompletionOverlay() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
        <h2 className="mt-4 text-2xl font-bold">Profile Complete!</h2>
        <p className="mt-2 text-muted-foreground">Redirecting you to your dashboard...</p>
      </div>
    </div>
  )
}
