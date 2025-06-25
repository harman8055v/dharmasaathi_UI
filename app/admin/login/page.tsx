"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, Eye, EyeOff } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Sign in with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error("Login failed - no user data")
      }

      // Check if user has admin role
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, email, role, first_name, last_name, is_active")
        .eq("id", authData.user.id)
        .single()

      if (userError) {
        console.error("User data fetch error:", userError)
        throw new Error("Failed to verify admin access")
      }

      if (!userData) {
        throw new Error("User profile not found")
      }

      // Check if user is active
      if (userData.is_active === false) {
        await supabase.auth.signOut()
        throw new Error("Your account has been deactivated. Please contact support.")
      }

      // Check if user has admin role
      const normalizedRole = userData.role?.toLowerCase()
      if (!normalizedRole || !["admin", "super_admin", "superadmin"].includes(normalizedRole)) {
        await supabase.auth.signOut()
        throw new Error("You don't have admin access. Please contact support if you believe this is an error.")
      }

      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.first_name || "Admin"}!`,
      })

      // Redirect to admin dashboard
      router.push("/admin")
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Login failed")
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image src="/logo.png" alt="DharmaSaathi" width={120} height={40} className="h-10 w-auto" />
          </div>
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Shield className="w-6 h-6 text-red-500" />
            Admin Login
          </CardTitle>
          <CardDescription>Sign in to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@dharmasaathi.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Need help? Contact support</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
