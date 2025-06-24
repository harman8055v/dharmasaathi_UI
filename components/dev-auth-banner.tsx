"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { isDevelopmentMode, simulateDevAuth, clearDevSession, getDevSession } from "@/lib/dev-auth"
import { Code, User, LogOut, LogIn, AlertTriangle } from "lucide-react"

export default function DevAuthBanner() {
  const [isDevMode, setIsDevMode] = useState(false)
  const [isDevLoggedIn, setIsDevLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const devMode = isDevelopmentMode()
    setIsDevMode(devMode)

    if (devMode) {
      const session = getDevSession()
      setIsDevLoggedIn(!!session)
    }
  }, [])

  const handleDevLogin = async () => {
    setIsLoading(true)
    try {
      const success = await simulateDevAuth()
      if (success) {
        setIsDevLoggedIn(true)
        // Refresh the page to apply the dev session
        window.location.reload()
      }
    } catch (error) {
      console.error("Dev login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDevLogout = () => {
    clearDevSession()
    setIsDevLoggedIn(false)
    window.location.reload()
  }

  if (!isDevMode) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-50 border-b border-yellow-200">
      <Alert className="rounded-none border-0 bg-transparent">
        <Code className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              <AlertTriangle className="w-3 h-3 mr-1" />
              DEV MODE
            </Badge>
            <span className="text-sm text-yellow-800">Development authentication bypass active</span>
            {isDevLoggedIn && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                <User className="w-3 h-3 mr-1" />
                Logged in as Dev User
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isDevLoggedIn ? (
              <Button
                size="sm"
                variant="outline"
                onClick={handleDevLogout}
                className="h-7 text-xs bg-red-50 hover:bg-red-100 text-red-700 border-red-300"
              >
                <LogOut className="w-3 h-3 mr-1" />
                Dev Logout
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={handleDevLogin}
                disabled={isLoading}
                className="h-7 text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
              >
                <LogIn className="w-3 h-3 mr-1" />
                {isLoading ? "Logging in..." : "Dev Login"}
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
