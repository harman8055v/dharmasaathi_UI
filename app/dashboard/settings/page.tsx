"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStates, useCities } from "@/lib/hooks/useLocations"
import { SPIRITUAL_ORGS } from "@/lib/constants/spiritual-orgs"
import { DAILY_PRACTICES } from "@/lib/constants/daily-practices"
import {
  ArrowLeft,
  MapPin,
  User,
  Mail,
  CheckCircle,
  Phone,
  Shield,
  Save,
  Briefcase,
  Heart,
  Trash2,
  Ban,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import MobileNav from "@/components/dashboard/mobile-nav"
import { toast } from "sonner"
import { formatMobileNumber, validateMobileNumber } from "@/lib/types/onboarding"

export default function AccountSettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  // Mobile verification states
  const [mobileVerificationStep, setMobileVerificationStep] = useState<"edit" | "verify">("edit")
  const [newMobileNumber, setNewMobileNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [processingDeactivate, setProcessingDeactivate] = useState(false)
  const [processingDelete, setProcessingDelete] = useState(false)

  const statesList = useStates()
  const selectedState = statesList.find((s) => s.name === formData.state)
  const citiesList = useCities(selectedState?.state_code || null)

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    city: "",
    state: "",
    country: "",
    birthdate: "",
    height: "",
    gender: "",
    education: "",
    profession: "",
    annual_income: "",
    diet: "",
    temple_visit_freq: "",
    vanaprastha_interest: "",
    artha_vs_moksha: "",
    spiritual_org: [],
    daily_practices: [],
  })

  const educationLevels = [
    "High School",
    "Diploma",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate",
    "Professional Degree",
    "Other",
  ]

  const incomeRanges = [
    "Less than ₹5,00,000",
    "₹5,00,000 - ₹10,00,000",
    "₹10,00,000 - ₹15,00,000",
    "₹15,00,000 - ₹25,00,000",
    "₹25,00,000 - ₹50,00,000",
    "₹50,00,000 - ₹75,00,000",
    "₹75,00,000 - ₹1,00,00,000",
    "More than ₹1,00,00,000",
    "Prefer not to say",
  ]

  const dietOptions = [
    "Vegetarian",
    "Vegan",
    "Eggetarian",
    "Non-Vegetarian",
  ]

  const templeFreqOptions = ["Daily", "Weekly", "Monthly", "Rarely", "Never"]
  const vanaprasthaOptions = ["yes", "no", "open"]
  const arthaMokshaOptions = ["Artha-focused", "Moksha-focused", "Balance"]

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/")
          return
        }

        setUser(user)

        const { data: profileData, error } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (error) {
          console.error("Error fetching profile:", error)
          return
        }

        setProfile(profileData)
        setFormData({
          first_name: profileData.first_name || "",
          last_name: profileData.last_name || "",
          email: profileData.email || "",
          mobile_number: profileData.mobile_number || "",
          city: profileData.city || "",
          state: profileData.state || "",
          country: profileData.country || "",
          birthdate: profileData.birthdate || "",
          height: profileData.height || "",
          gender: profileData.gender || "",
          education: profileData.education || "",
          profession: profileData.profession || "",
          annual_income: profileData.annual_income || "",
          diet: profileData.diet || "",
          temple_visit_freq: profileData.temple_visit_freq || "",
          vanaprastha_interest: profileData.vanaprastha_interest || "",
          artha_vs_moksha: profileData.artha_vs_moksha || "",
          spiritual_org: profileData.spiritual_org || [],
          daily_practices: profileData.daily_practices || [],
        })
        setNewMobileNumber(profileData.mobile_number || "")
        setLoading(false)
      } catch (error) {
        console.error("Error:", error)
        router.push("/")
      }
    }

    getUser()
  }, [router])

  const handleMobileNumberChange = (value: string) => {
    const formatted = formatMobileNumber(value)
    setNewMobileNumber(formatted)
  }

  const handleSendOtp = async () => {
    if (!validateMobileNumber(newMobileNumber)) {
      toast.error("Please enter a valid mobile number (e.g., +919876543210)")
      return
    }

    if (newMobileNumber === formData.mobile_number) {
      toast.error("Please enter a different mobile number")
      return
    }

    setSendingOtp(true)
    try {
      // Update the user's phone number in auth.users table - same as onboarding
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        phone: newMobileNumber,
      })

      if (updateError) throw updateError

      setMobileVerificationStep("verify")
      setResendTimer(60)
      toast.success(`OTP sent to ${newMobileNumber}`)

      // Start countdown timer
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error: any) {
      console.error("Send OTP error:", error)
      if (error.message?.includes("Signups not allowed")) {
        toast.error("OTP service is currently unavailable. Please try again later.")
      } else {
        toast.error("Failed to send OTP. Please try again.")
      }
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }

    setVerifyingOtp(true)
    try {
      // Verify OTP using the same method as onboarding
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: newMobileNumber,
        token: otp,
        type: "phone_change",
      })

      if (verifyError) throw verifyError

      if (data.user) {
        // Update the mobile_verified status in users table
        const { error: updateError } = await supabase
          .from("users")
          .update({
            mobile_number: newMobileNumber,
            mobile_verified: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.user.id)

        if (updateError) {
          console.error("Error updating mobile_verified status:", updateError)
          toast.error("OTP verified, but failed to update profile. Please contact support.")
          return
        }

        // Update form data and reset verification state
        setFormData({ ...formData, mobile_number: newMobileNumber })
        setMobileVerificationStep("edit")
        setOtp("")
        toast.success("Mobile number verified and updated successfully!")

        // Update profile state
        setProfile({ ...profile, mobile_number: newMobileNumber, mobile_verified: true })
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error)
      if (error.message?.includes("Invalid token") || error.message?.includes("invalid")) {
        toast.error("Invalid OTP. Please check and try again.")
      } else if (error.message?.includes("expired")) {
        toast.error("OTP has expired. Please request a new one.")
      } else {
        toast.error("Failed to verify OTP. Please try again.")
      }
    } finally {
      setVerifyingOtp(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0) return

    setSendingOtp(true)
    try {
      const { error } = await supabase.auth.updateUser({
        phone: newMobileNumber,
      })

      if (error) throw error

      setResendTimer(60)
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      toast.success("OTP resent successfully")
    } catch (error: any) {
      console.error("Resend OTP error:", error)
      toast.error("Failed to resend OTP. Please try again.")
    } finally {
      setSendingOtp(false)
    }
  }

  const cancelMobileVerification = () => {
    setMobileVerificationStep("edit")
    setNewMobileNumber(formData.mobile_number)
    setOtp("")
    setResendTimer(0)
  }

  const handleDeactivateAccount = async () => {
    if (!user) return
    setProcessingDeactivate(true)
    try {
      const { error } = await supabase
        .from("users")
        .update({
          account_status: "deactivated",
          deactivated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      toast.success("Account deactivated")
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Deactivate error:", error)
      toast.error("Failed to deactivate account")
    } finally {
      setProcessingDeactivate(false)
      setDeactivateOpen(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    setProcessingDelete(true)
    try {
      const { error } = await supabase
        .from("users")
        .update({
          account_status: "deleted",
          deactivated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      toast.success("Account deleted")
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete account")
    } finally {
      setProcessingDelete(false)
      setDeleteOpen(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase.from("users").update(formData).eq("id", user.id)

      if (error) throw error

      toast.success("Account settings updated successfully!")
      setProfile({ ...profile, ...formData })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update account settings. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 pb-40">
      <MobileNav userProfile={profile} />

      <main className="pt-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
              <p className="text-gray-600">Manage your personal information</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your basic personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="birthdate">Date of Birth</Label>
                  <Input
                    id="birthdate"
                    type="date"
                    value={formData.birthdate}
                    onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>Manage your email and phone number</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>

                {/* Mobile Number with OTP Verification */}
                <div>
                  <Label htmlFor="mobile_number" className="flex items-center gap-2">
                    Mobile Number
                    {formData.mobile_number && profile?.mobile_verified && (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </Label>

                  {mobileVerificationStep === "edit" ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="mobile_number"
                          type="tel"
                          value={newMobileNumber}
                          onChange={(e) => handleMobileNumberChange(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="pl-10"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Include country code (e.g., +91 for India)</p>
                      {newMobileNumber !== formData.mobile_number && newMobileNumber && (
                        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <Shield className="w-4 h-4 text-amber-600" />
                          <div className="flex-1">
                            <p className="text-sm text-amber-800">Mobile number change requires verification</p>
                          </div>
                          <Button
                            onClick={handleSendOtp}
                            disabled={sendingOtp}
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700"
                          >
                            {sendingOtp ? "Sending..." : "Verify"}
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Phone className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Verify New Mobile Number</span>
                        </div>
                        <p className="text-sm text-green-700 mb-3">
                          We've sent a 6-digit code to: <strong>{newMobileNumber}</strong>
                        </p>

                        <div className="space-y-3">
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            placeholder="Enter 6-digit OTP"
                            className="text-center text-lg tracking-widest"
                            autoFocus
                          />

                          <div className="flex gap-2">
                            <Button
                              onClick={handleVerifyOtp}
                              disabled={verifyingOtp || otp.length !== 6}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              {verifyingOtp ? "Verifying..." : "Verify OTP"}
                            </Button>
                            <Button onClick={cancelMobileVerification} variant="outline" className="flex-1">
                              Cancel
                            </Button>
                          </div>

                          <div className="text-center">
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              disabled={resendTimer > 0 || sendingOtp}
                              className="text-sm text-green-600 hover:text-green-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setMobileVerificationStep("edit")
                          setOtp("")
                        }}
                        className="w-full text-sm text-blue-600 hover:text-blue-700 underline"
                      >
                        Change mobile number
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location
                </CardTitle>
                <CardDescription>Update your location details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Select city"
                    list="city-list"
                  />
                  <datalist id="city-list">
                    {citiesList.map((c) => (
                      <option key={c.id} value={c.name} />
                    ))}
                  </datalist>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Select state"
                      list="state-list"
                    />
                    <datalist id="state-list">
                      {statesList.map((s) => (
                        <option key={s.id} value={s.name} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Professional Information
                </CardTitle>
                <CardDescription>Update your work and education details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="education">Education</Label>
                  <Select
                    value={formData.education}
                    onValueChange={(value) => setFormData({ ...formData, education: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    placeholder="Enter profession"
                  />
                </div>

                <div>
                  <Label htmlFor="annual_income">Annual Income</Label>
                  <Select
                    value={formData.annual_income}
                    onValueChange={(value) => setFormData({ ...formData, annual_income: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select income range" />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Spiritual Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Spiritual Information
                </CardTitle>
                <CardDescription>Share your spiritual preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Spiritual Organizations</Label>
                  <div className="flex flex-wrap gap-2">
                    {SPIRITUAL_ORGS.map((org) => (
                      <button
                        key={org}
                        type="button"
                        onClick={() => {
                          const arr = formData.spiritual_org.includes(org)
                            ? formData.spiritual_org.filter((o: string) => o !== org)
                            : [...formData.spiritual_org, org]
                          setFormData({ ...formData, spiritual_org: arr })
                        }}
                        className={`px-3 py-1 text-sm rounded-full ${formData.spiritual_org.includes(org) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                      >
                        {org}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Daily Practices</Label>
                  <div className="flex flex-wrap gap-2">
                    {DAILY_PRACTICES.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          const arr = formData.daily_practices.includes(p)
                            ? formData.daily_practices.filter((d: string) => d !== p)
                            : [...formData.daily_practices, p]
                          setFormData({ ...formData, daily_practices: arr })
                        }}
                        className={`px-3 py-1 text-sm rounded-full ${formData.daily_practices.includes(p) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="diet">Diet</Label>
                  <Select
                    value={formData.diet}
                    onValueChange={(value) => setFormData({ ...formData, diet: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet" />
                    </SelectTrigger>
                    <SelectContent>
                      {dietOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="temple_visit_freq">Temple Visit Frequency</Label>
                  <Select
                    value={formData.temple_visit_freq}
                    onValueChange={(value) => setFormData({ ...formData, temple_visit_freq: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {templeFreqOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="vanaprastha_interest">Interest in Vanaprastha</Label>
                  <Select
                    value={formData.vanaprastha_interest}
                    onValueChange={(value) => setFormData({ ...formData, vanaprastha_interest: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select interest" />
                    </SelectTrigger>
                    <SelectContent>
                      {vanaprasthaOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="artha_vs_moksha">Artha vs Moksha</Label>
                  <Select
                    value={formData.artha_vs_moksha}
                    onValueChange={(value) => setFormData({ ...formData, artha_vs_moksha: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      {arthaMokshaOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={saving || mobileVerificationStep === "verify"}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>

            {mobileVerificationStep === "verify" && (
              <p className="text-sm text-amber-600 text-center">
                Please verify your new mobile number before saving changes
              </p>
            )}

            {/* Deactivate Account */}
            <Dialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="w-full mt-6">
                  <Ban className="w-4 h-4 mr-2" />
                  Deactivate Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deactivate Account</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to deactivate your account?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeactivateOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeactivateAccount}
                    disabled={processingDeactivate}
                    variant="destructive"
                  >
                    {processingDeactivate ? "Processing..." : "Deactivate"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Account */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full mt-2">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Account</DialogTitle>
                  <DialogDescription>
                    This will permanently delete your account. Continue?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={processingDelete}
                    variant="destructive"
                  >
                    {processingDelete ? "Deleting..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>
    </div>
  )
}
