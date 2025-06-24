"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, User, LogOut } from "lucide-react"

export default function DevAuthBanner() {
  const [isDevMode, setIsDevMode] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if we're in development mode
    const isDev =
      process.env.NODE_ENV === "development" ||
      process.env.NEXT_PUBLIC_DEV_MODE === "true" ||
      (typeof window !== "undefined" && window.location.hostname === "localhost")

    setIsDevMode(isDev)

    if (isDev) {
      // Check if already logged in
      const devSession = localStorage.getItem("dev-session")
      setIsLoggedIn(!!devSession)
    }
  }, [])

  const handleDevLogin = () => {
    // Create a simple dev session
    const devSession = {
      user: {
        id: "dev-user-123",
        email: "dev@dharmasaathi.com",
        name: "Dev User",
      },
      access_token: "dev-token",
      expires_at: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }

    localStorage.setItem("dev-session", JSON.stringify(devSession))
    setIsLoggedIn(true)

    // Refresh the page to apply auth state
    window.location.reload()
  }

  const handleDevLogout = () => {
    localStorage.removeItem("dev-session")
    setIsLoggedIn(false)

    // Refresh the page to clear auth state
    window.location.reload()
  }

  const handleDismiss = () => {
    setIsVisible(false)
  }

  // Don't show banner if not in dev mode or if dismissed
  if (!isDevMode || !isVisible) {
    return null
  }

  return (
    <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2 relative">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-yellow-200 text-yellow-800 border-yellow-300">
            DEV MODE
          </Badge>
          <span className="text-sm text-yellow-800">Development environment - Authentication bypass available</span>
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
                <User className="w-3 h-3 mr-1" />
                Logged In
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDevLogout}
                className="text-yellow-800 border-yellow-300 hover:bg-yellow-200"
              >
                <LogOut className="w-3 h-3 mr-1" />
                Dev Logout
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={handleDevLogin} className="bg-yellow-600 hover:bg-yellow-700 text-white">
              <User className="w-3 h-3 mr-1" />
              Dev Login
            </Button>
          )}

          <Button size="sm" variant="ghost" onClick={handleDismiss} className="text-yellow-600 hover:bg-yellow-200 p-1">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
