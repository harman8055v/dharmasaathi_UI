"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Sparkles, Crown, Check, Gift, Shield } from "lucide-react"
import MobileNav from "@/components/dashboard/mobile-nav"
import PaymentModal from "@/components/payment/payment-modal"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { Toaster } from "sonner"

const superLikePackages = [
  { count: 5, price: 499, popular: false },
  { count: 15, price: 1299, popular: true },
  { count: 30, price: 2499, popular: false },
]

const highlightPackages = [
  { count: 3, price: 399, popular: false },
  { count: 10, price: 999, popular: true },
  { count: 20, price: 1799, popular: false },
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
            <div className="mt-4 flex justify-center gap-4 text-sm">
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
            </div>
          </div>

          {/* Trust Banner */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-8 border border-green-200">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Secure Payments</span>
              </div>
              <div className="w-1 h-4 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Instant Activation</span>
              </div>
              <div className="w-1 h-4 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-green-600" />
                <span>No Hidden Charges</span>
              </div>
            </div>
          </div>

          {/* Premium Plans */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Premium Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Premium Monthly */}
              <Card className="relative overflow-hidden border-2 border-purple-200 hover:border-purple-300 transition-colors">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="w-6 h-6" />
                      Premium Monthly
                    </CardTitle>
                  </div>
                  <div className="text-3xl font-bold">
                    ₹999<span className="text-lg font-normal">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Unlimited Super Likes</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Priority Profile Visibility</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Advanced Matching Filters</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Message Highlights (10/month)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>See Who Liked You</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Read Receipts</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() =>
                      openPaymentModal({
                        type: "plan",
                        name: "Premium Monthly",
                        price: 999,
                        description: "1 month of premium access",
                        features: [
                          "Unlimited Super Likes",
                          "Priority Profile Visibility",
                          "Advanced Matching Filters",
                          "Message Highlights (10/month)",
                          "See Who Liked You",
                          "Read Receipts",
                        ],
                      })
                    }
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    disabled={profile?.account_status === "premium"}
                  >
                    {profile?.account_status === "premium" ? "Already Premium" : "Choose Premium Monthly"}
                  </Button>
                </CardContent>
              </Card>

              {/* Premium Annual */}
              <Card className="relative overflow-hidden border-2 border-gold-200 hover:border-gold-300 transition-colors">
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Save 40%
                </div>
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-6 h-6" />
                    Premium Annual
                  </CardTitle>
                  <div className="text-3xl font-bold">
                    ₹5999<span className="text-lg font-normal">/year</span>
                  </div>
                  <p className="text-sm opacity-90">Just ₹500/month - Save ₹6000!</p>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Everything in Premium Monthly</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Unlimited Message Highlights</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Priority Customer Support</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Exclusive Events Access</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Profile Boost (2x/month)</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() =>
                      openPaymentModal({
                        type: "plan",
                        name: "Premium Annual",
                        price: 5999,
                        description: "12 months of premium access",
                        features: [
                          "Everything in Premium Monthly",
                          "Unlimited Message Highlights",
                          "Priority Customer Support",
                          "Exclusive Events Access",
                          "Profile Boost (2x/month)",
                        ],
                      })
                    }
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    disabled={profile?.account_status === "premium"}
                  >
                    {profile?.account_status === "premium" ? "Already Premium" : "Choose Premium Annual"}
                  </Button>
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
                <div className="flex items-start gap-4">
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
                      onClick={() => router.push("/dashboard")}
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
