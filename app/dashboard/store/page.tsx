"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Star,
  Sparkles,
  Crown,
  Check,
  Gift,
  Shield,
  Diamond,
  BadgeCheck,
  Award,
  Gem,
  Lock,
  Users,
  MapPin,
  FileCheck,
  DollarSign,
  Heart,
  Eye,
} from "lucide-react"
import MobileNav from "@/components/dashboard/mobile-nav"
import PaymentModal from "@/components/payment/payment-modal"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { Toaster } from "sonner"

const superLikePackages = [
  { count: 4, price: 199, popular: false },
  { count: 10, price: 399, popular: true },
  { count: 40, price: 999, popular: false },
]

const highlightPackages = [
  { count: 4, price: 199, popular: false },
  { count: 10, price: 399, popular: true },
  { count: 40, price: 999, popular: false },
]

export default function StorePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean
    item: any
  }>({
    isOpen: false,
    item: null,
  })
  const [billingCycle, setBillingCycle] = useState<"monthly" | "quarterly">("monthly")
  const router = useRouter()

  const openPaymentModal = (item: any) => {
    setPaymentModal({ isOpen: true, item })
  }

  const closePaymentModal = () => {
    setPaymentModal({ isOpen: false, item: null })
  }

  const handlePaymentSuccess = () => {
    // Refresh user data to show updated credits/status
    getUser()
  }

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

      // Fetch user profile data
      const { data: profileData, error } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (error) {
        console.error("Error fetching user profile:", error)
        router.push("/onboarding")
        return
      }

      // If user hasn't completed onboarding, redirect to onboarding
      if (!profileData?.onboarding_completed) {
        router.push("/onboarding")
        return
      }

      setProfile(profileData)
      setLoading(false)
    } catch (error) {
      console.error("Error in auth check:", error)
      router.push("/")
    }
  }

  useEffect(() => {
    getUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store...</p>
        </div>
      </div>
    )
  }

  // Plan pricing based on billing cycle
  const planPricing = {
    sparsh: {
      monthly: { price: 399, duration: "month" },
      quarterly: { price: 999, duration: "3 months", savings: "16%" },
    },
    sangam: {
      monthly: { price: 699, duration: "month" },
      quarterly: { price: 1799, duration: "3 months", savings: "14%" },
    },
    samarpan: {
      monthly: { price: 1299, duration: "month" },
      quarterly: { price: 2999, duration: "3 months", savings: "23%" },
    },
    elite: {
      monthly: { price: 49000, duration: "month" },
      quarterly: { price: 129000, duration: "3 months", savings: "12%" },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <MobileNav userProfile={profile} />

      {/* Main Content with proper spacing to avoid overlap */}
      <main className="pt-24 pb-40 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">DharmaSaathi Store 🛍️</h1>
            <p className="text-gray-600">Enhance your spiritual matchmaking journey</p>

            {/* Current Status */}
            <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
              <div className="bg-white/80 px-3 py-1 rounded-full">
                <span className="text-gray-600">Super Likes: </span>
                <span className="font-semibold text-orange-600">{profile?.super_likes_count || 0}</span>
              </div>
              <div className="bg-white/80 px-3 py-1 rounded-full">
                <span className="text-gray-600">Highlights: </span>
                <span className="font-semibold text-purple-600">{profile?.message_highlights_count || 0}</span>
              </div>
              {profile?.account_status === "premium" && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full">
                  <Crown className="w-4 h-4 inline mr-1" />
                  Premium Active
                </div>
              )}
              {profile?.account_status === "elite" && (
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full">
                  <Diamond className="w-4 h-4 inline mr-1" />
                  Elite Active
                </div>
              )}
            </div>
          </div>

          {/* Trust Banner */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-8 border border-green-200">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Secure Payments</span>
              </div>
              <div className="hidden md:block w-1 h-4 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Instant Activation</span>
              </div>
              <div className="hidden md:block w-1 h-4 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-green-600" />
                <span>No Hidden Charges</span>
              </div>
            </div>
          </div>

          {/* Premium Plans */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose Your Plan</h2>

            {/* Billing Cycle Selector */}
            <div className="flex justify-center mb-8">
              <Tabs
                defaultValue="monthly"
                value={billingCycle}
                onValueChange={(value) => setBillingCycle(value as "monthly" | "quarterly")}
                className="w-full max-w-md"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="quarterly">
                    Quarterly
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                      Save up to 23%
                    </span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Free Plan - Drishti */}
            <div className="mb-6">
              <Card className="relative overflow-hidden border-2 border-gray-200 bg-gray-50">
                <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-sm font-bold">👁️</span>
                      </div>
                      Drishti Plan
                    </CardTitle>
                    <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">Current Plan</div>
                  </div>
                  <div className="text-3xl font-bold">
                    Free<span className="text-lg font-normal">/forever</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>5 swipes per day</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>View your matches</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-5 h-5 text-red-500">✕</span>
                      <span className="text-gray-500">Messaging (upgrade required)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Basic profile features</span>
                    </li>
                  </ul>
                  <Button disabled className="w-full bg-gray-400">
                    Current Plan
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Paid Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sparsh Plan */}
              <Card className="relative overflow-hidden border-2 border-blue-200 hover:border-blue-300 transition-colors">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-sm font-bold">🤝</span>
                    </div>
                    Sparsh Plan
                  </CardTitle>
                  <div className="text-3xl font-bold">
                    ₹{planPricing.sparsh[billingCycle].price}
                    <span className="text-lg font-normal">/{planPricing.sparsh[billingCycle].duration}</span>
                  </div>
                  {billingCycle === "quarterly" && (
                    <div className="text-sm bg-white/20 px-2 py-0.5 rounded-full w-fit mt-1">
                      Save {planPricing.sparsh.quarterly.savings}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>20 swipes per day</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Unlimited messaging</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>View all matches</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Basic profile visibility</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() =>
                      openPaymentModal({
                        type: "plan",
                        name: `Sparsh Plan (${billingCycle === "monthly" ? "1 month" : "3 months"})`,
                        price: planPricing.sparsh[billingCycle].price,
                        description: `${billingCycle === "monthly" ? "1 month" : "3 months"} of Sparsh access`,
                        features: [
                          "20 swipes per day",
                          "Unlimited messaging",
                          "View all matches",
                          "Basic profile visibility",
                          billingCycle === "quarterly"
                            ? `Save ${planPricing.sparsh.quarterly.savings} compared to monthly`
                            : "",
                        ].filter(Boolean),
                      })
                    }
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    disabled={profile?.account_status === "premium" || profile?.account_status === "elite"}
                  >
                    {profile?.account_status === "premium" || profile?.account_status === "elite"
                      ? "Already Premium"
                      : "Choose Sparsh"}
                  </Button>
                </CardContent>
              </Card>

              {/* Sangam Plan */}
              <Card className="relative overflow-hidden border-2 border-purple-200 hover:border-purple-300 transition-colors">
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-400 to-pink-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Popular
                </div>
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-sm font-bold">💫</span>
                    </div>
                    Sangam Plan
                  </CardTitle>
                  <div className="text-3xl font-bold">
                    ₹{planPricing.sangam[billingCycle].price}
                    <span className="text-lg font-normal">/{planPricing.sangam[billingCycle].duration}</span>
                  </div>
                  {billingCycle === "quarterly" && (
                    <div className="text-sm bg-white/20 px-2 py-0.5 rounded-full w-fit mt-1">
                      Save {planPricing.sangam.quarterly.savings}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>50 swipes per day</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Everything in Sparsh</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span>5 Super Likes monthly</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-purple-500" />
                      <span>See who likes you & match instantly</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      <span>5 Message Highlights monthly</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Higher profile visibility</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() =>
                      openPaymentModal({
                        type: "plan",
                        name: `Sangam Plan (${billingCycle === "monthly" ? "1 month" : "3 months"})`,
                        price: planPricing.sangam[billingCycle].price,
                        description: `${billingCycle === "monthly" ? "1 month" : "3 months"} of Sangam access`,
                        features: [
                          "50 swipes per day",
                          "Everything in Sparsh",
                          "5 Super Likes monthly",
                          "See who likes you & match instantly",
                          "5 Message Highlights monthly",
                          "Higher profile visibility",
                          billingCycle === "quarterly"
                            ? `Save ${planPricing.sangam.quarterly.savings} compared to monthly`
                            : "",
                        ].filter(Boolean),
                      })
                    }
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    disabled={profile?.account_status === "premium" || profile?.account_status === "elite"}
                  >
                    {profile?.account_status === "premium" || profile?.account_status === "elite"
                      ? "Already Premium"
                      : "Choose Sangam"}
                  </Button>
                </CardContent>
              </Card>

              {/* Samarpan Plan */}
              <Card className="relative overflow-hidden border-2 border-gold-200 hover:border-gold-300 transition-colors">
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Premium
                </div>
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-6 h-6" />
                    Samarpan Plan
                  </CardTitle>
                  <div className="text-3xl font-bold">
                    ₹{planPricing.samarpan[billingCycle].price}
                    <span className="text-lg font-normal">/{planPricing.samarpan[billingCycle].duration}</span>
                  </div>
                  {billingCycle === "quarterly" && (
                    <div className="text-sm bg-white/20 px-2 py-0.5 rounded-full w-fit mt-1">
                      Save {planPricing.samarpan.quarterly.savings}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Unlimited swipes</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Everything in Sangam</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span>15 Super Likes monthly</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      <span>15 Message Highlights monthly</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      <span>Highest profile visibility</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Priority customer support</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() =>
                      openPaymentModal({
                        type: "plan",
                        name: `Samarpan Plan (${billingCycle === "monthly" ? "1 month" : "3 months"})`,
                        price: planPricing.samarpan[billingCycle].price,
                        description: `${billingCycle === "monthly" ? "1 month" : "3 months"} of Samarpan access`,
                        features: [
                          "Unlimited swipes",
                          "Everything in Sangam",
                          "15 Super Likes monthly",
                          "15 Message Highlights monthly",
                          "Highest profile visibility",
                          "Priority customer support",
                          billingCycle === "quarterly"
                            ? `Save ${planPricing.samarpan.quarterly.savings} compared to monthly`
                            : "",
                        ].filter(Boolean),
                      })
                    }
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    disabled={profile?.account_status === "premium" || profile?.account_status === "elite"}
                  >
                    {profile?.account_status === "premium" || profile?.account_status === "elite"
                      ? "Already Premium"
                      : "Choose Samarpan"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Elite Plan */}
          <div className="mb-16">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10 rounded-xl"></div>
              <Card className="relative overflow-hidden border-2 border-indigo-300 shadow-xl bg-gradient-to-r from-white to-indigo-50">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-500 to-purple-600 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                <div className="absolute top-6 left-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  <div className="flex items-center gap-2">
                    <Diamond className="w-4 h-4" />
                    <span>Exclusive</span>
                  </div>
                </div>

                <CardHeader className="pt-16 pb-8 text-center">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Diamond className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Elite Membership</CardTitle>
                  <p className="text-gray-600 max-w-md mx-auto">
                    For discerning individuals seeking the perfect spiritual partner with verified credentials
                  </p>

                  <div className="mt-6 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    ₹{planPricing.elite[billingCycle].price}
                    <span className="text-xl font-normal text-gray-600">
                      /{planPricing.elite[billingCycle].duration}
                    </span>
                  </div>
                  {billingCycle === "quarterly" && (
                    <div className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full w-fit mx-auto mt-2">
                      Save {planPricing.elite.quarterly.savings}
                    </div>
                  )}
                </CardHeader>

                <CardContent className="px-6 pb-8">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-indigo-200 mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                      Elite Verification Standards
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Income Verified</h4>
                          <p className="text-sm text-gray-600">
                            Members with verified high income status (₹25L+ annually)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Family Verified</h4>
                          <p className="text-sm text-gray-600">Background checks on family history and reputation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Location Verified</h4>
                          <p className="text-sm text-gray-600">Confirmed residence in premium neighborhoods</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <FileCheck className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Credit Score Verified</h4>
                          <p className="text-sm text-gray-600">Members with excellent financial responsibility</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Exclusive Benefits</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <BadgeCheck className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-900">Access to Elite Pool</span>
                          <p className="text-sm text-gray-600">
                            Connect exclusively with other high-achieving spiritual individuals
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Award className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-900">Personal Matchmaking Concierge</span>
                          <p className="text-sm text-gray-600">
                            Dedicated relationship manager to help find your perfect match
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Gem className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-900">Exclusive Events</span>
                          <p className="text-sm text-gray-600">
                            Invitations to curated spiritual retreats and networking events
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Heart className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-900">Compatibility Analysis</span>
                          <p className="text-sm text-gray-600">
                            In-depth spiritual and personality compatibility reports
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Lock className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-900">Enhanced Privacy</span>
                          <p className="text-sm text-gray-600">
                            Advanced privacy controls and discreet matching options
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Trust Elements */}
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-8">
                    <div className="flex items-center gap-3 justify-center">
                      <Shield className="w-5 h-5 text-indigo-600" />
                      <span className="text-indigo-800 font-medium">100% Confidentiality Guaranteed</span>
                    </div>
                  </div>

                  {/* Testimonials */}
                  <div className="mb-8 bg-white/70 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3 text-center">What Our Elite Members Say</h4>
                    <div className="italic text-gray-600 text-sm text-center">
                      "As a successful entrepreneur with spiritual values, finding someone who understands both worlds
                      was impossible until I joined DharmaSaathi Elite. Within two months, I found my perfect match."
                      <div className="mt-2 font-medium text-gray-800">— Rajiv S., CEO & Meditation Practitioner</div>
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      openPaymentModal({
                        type: "plan",
                        name: `Elite Membership (${billingCycle === "monthly" ? "1 month" : "3 months"})`,
                        price: planPricing.elite[billingCycle].price,
                        description: `${billingCycle === "monthly" ? "1 month" : "3 months"} of Elite Membership`,
                        features: [
                          "Access to Elite verified profiles",
                          "Personal matchmaking concierge",
                          "Exclusive spiritual events",
                          "In-depth compatibility analysis",
                          "Enhanced privacy controls",
                          billingCycle === "quarterly"
                            ? `Save ${planPricing.elite.quarterly.savings} compared to monthly`
                            : "",
                        ].filter(Boolean),
                      })
                    }
                    className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg"
                    disabled={profile?.account_status === "elite"}
                  >
                    {profile?.account_status === "elite" ? "Already Elite Member" : "Join Elite Membership"}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Elite membership is subject to verification. Our team will contact you within 24 hours.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Super Likes */}
          <div className="mb-12">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Super Likes ⭐</h2>
              <p className="text-gray-600">Stand out and show genuine interest in special connections</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {superLikePackages.map((pkg, index) => (
                <Card key={index} className={`relative ${pkg.popular ? "border-2 border-blue-300 shadow-lg" : ""}`}>
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.count} Super Likes</h3>
                    <div className="text-2xl font-bold text-blue-600 mb-4">₹{pkg.price}</div>
                    <p className="text-sm text-gray-600 mb-4">₹{Math.round(pkg.price / pkg.count)} per Super Like</p>
                    <Button
                      onClick={() =>
                        openPaymentModal({
                          type: "superlike",
                          name: `${pkg.count} Super Likes`,
                          price: pkg.price,
                          description: `Get ${pkg.count} Super Likes to stand out`,
                          count: pkg.count,
                        })
                      }
                      className={`w-full ${pkg.popular ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"}`}
                    >
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Message Highlights */}
          <div className="mb-12">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Highlights ✨</h2>
              <p className="text-gray-600">Make your messages stand out in conversations</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {highlightPackages.map((pkg, index) => (
                <Card key={index} className={`relative ${pkg.popular ? "border-2 border-purple-300 shadow-lg" : ""}`}>
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Best Value
                    </div>
                  )}
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.count} Highlights</h3>
                    <div className="text-2xl font-bold text-purple-600 mb-4">₹{pkg.price}</div>
                    <p className="text-sm text-gray-600 mb-4">₹{Math.round(pkg.price / pkg.count)} per Highlight</p>
                    <Button
                      onClick={() =>
                        openPaymentModal({
                          type: "highlight",
                          name: `${pkg.count} Message Highlights`,
                          price: pkg.price,
                          description: `Get ${pkg.count} Message Highlights to stand out`,
                          count: pkg.count,
                        })
                      }
                      className={`w-full ${pkg.popular ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-600 hover:bg-gray-700"}`}
                    >
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Special Offers */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">🎉 Limited Time Offer!</h3>
                    <p className="text-gray-700 mb-4">
                      Get your first month of Premium for just ₹499 (50% off) when you verify your profile through our
                      referral program!
                    </p>
                    <Button
                      onClick={() => router.push("/dashboard/referrals")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Learn More About Referrals
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Comparison */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Why Choose Premium?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Free Features</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Basic profile creation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Limited daily matches</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Basic messaging</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Community access</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Premium Features</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Unlimited matches & likes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Advanced spiritual filters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Priority profile visibility</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Exclusive events & workshops</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {paymentModal.item && (
        <PaymentModal
          isOpen={paymentModal.isOpen}
          onClose={closePaymentModal}
          item={paymentModal.item}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <Toaster position="top-center" />
    </div>
  )
}
