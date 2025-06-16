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

  const currentPlan = profile?.current_plan || "drishti"

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <MobileNav userProfile={profile} />

      {/* Main Content with proper spacing to avoid overlap */}
      <main className="pt-20 pb-40 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">DharmaSaathi Store</h1>
            <p className="text-gray-600">Enhance your spiritual matchmaking journey</p>

            {/* Current Status */}
            <div className="mt-4 flex justify-center gap-4 text-sm">
              <div className="bg-white/80 px-3 py-1 rounded-full">
                <span className="text-gray-600">Plan: </span>
                <span className="font-semibold text-orange-600 capitalize">{currentPlan}</span>
              </div>
              <div className="bg-white/80 px-3 py-1 rounded-full">
                <span className="text-gray-600">Super Likes: </span>
                <span className="font-semibold text-orange-600">{profile?.super_likes_count || 0}</span>
              </div>
              <div className="bg-white/80 px-3 py-1 rounded-full">
                <span className="text-gray-600">Highlights: </span>
                <span className="font-semibold text-purple-600">{profile?.message_highlights_count || 0}</span>
              </div>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 border border-green-200">
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

          {/* Subscription Plans */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Subscription Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Drishti Plan - Free */}
              <Card className={`relative ${currentPlan === "drishti" ? "border-2 border-gray-400" : ""}`}>
                {currentPlan === "drishti" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Current Plan
                  </div>
                )}
                <CardHeader className="bg-gradient-to-r from-gray-400 to-gray-500 text-white text-center">
                  <CardTitle className="text-lg">Drishti</CardTitle>
                  <div className="text-2xl font-bold">Free</div>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-2 mb-4 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>5 swipes per day</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>See matches</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 text-red-500">✗</span>
                      <span>No messaging</span>
                    </li>
                  </ul>
                  <Button
                    className="w-full"
                    variant={currentPlan === "drishti" ? "secondary" : "outline"}
                    disabled={currentPlan === "drishti"}
                  >
                    {currentPlan === "drishti" ? "Current Plan" : "Downgrade"}
                  </Button>
                </CardContent>
              </Card>

              {/* Sparsh Plan */}
              <Card className={`relative ${currentPlan === "sparsh" ? "border-2 border-blue-400" : ""}`}>
                {currentPlan === "sparsh" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Current Plan
                  </div>
                )}
                <CardHeader className="bg-gradient-to-r from-blue-400 to-blue-500 text-white text-center">
                  <CardTitle className="text-lg">Sparsh</CardTitle>
                  <div className="text-2xl font-bold">
                    ₹399<span className="text-sm">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-2 mb-4 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>20 swipes per day</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Chat access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>See who liked you</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() =>
                      openPaymentModal({
                        type: "plan",
                        name: "Sparsh Plan",
                        price: 399,
                        description: "1 month of Sparsh access",
                        features: ["20 swipes per day", "Chat access", "See who liked you"],
                      })
                    }
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    disabled={currentPlan === "sparsh"}
                  >
                    {currentPlan === "sparsh" ? "Current Plan" : "Choose Sparsh"}
                  </Button>
                </CardContent>
              </Card>

              {/* Sangam Plan */}
              <Card
                className={`relative ${currentPlan === "sangam" ? "border-2 border-purple-400" : "border-2 border-purple-200"}`}
              >
                {currentPlan === "sangam" ? (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Current Plan
                  </div>
                ) : (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Popular
                  </div>
                )}
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center">
                  <CardTitle className="text-lg">Sangam</CardTitle>
                  <div className="text-2xl font-bold">
                    ₹699<span className="text-sm">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-2 mb-4 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>50 swipes per day</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Everything in Sparsh</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>5 Super Likes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>5 Message Highlights</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Higher profile visibility</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() =>
                      openPaymentModal({
                        type: "plan",
                        name: "Sangam Plan",
                        price: 699,
                        description: "1 month of Sangam access",
                        features: [
                          "50 swipes per day",
                          "Everything in Sparsh",
                          "5 Super Likes",
                          "5 Message Highlights",
                          "Higher profile visibility",
                        ],
                      })
                    }
                    className="w-full bg-purple-500 hover:bg-purple-600"
                    disabled={currentPlan === "sangam"}
                  >
                    {currentPlan === "sangam" ? "Current Plan" : "Choose Sangam"}
                  </Button>
                </CardContent>
              </Card>

              {/* Samarpan Plan */}
              <Card className={`relative ${currentPlan === "samarpan" ? "border-2 border-yellow-400" : ""}`}>
                {currentPlan === "samarpan" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Current Plan
                  </div>
                )}
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-center">
                  <CardTitle className="text-lg flex items-center justify-center gap-2">
                    <Crown className="w-5 h-5" />
                    Samarpan
                  </CardTitle>
                  <div className="text-2xl font-bold">
                    ₹1299<span className="text-sm">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-2 mb-4 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Unlimited swipes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Everything in Sangam</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>15 Super Likes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>15 Message Highlights</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Highest profile visibility</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() =>
                      openPaymentModal({
                        type: "plan",
                        name: "Samarpan Plan",
                        price: 1299,
                        description: "1 month of Samarpan access",
                        features: [
                          "Unlimited swipes",
                          "Everything in Sangam",
                          "15 Super Likes",
                          "15 Message Highlights",
                          "Highest profile visibility",
                        ],
                      })
                    }
                    className="w-full bg-yellow-500 hover:bg-yellow-600"
                    disabled={currentPlan === "samarpan"}
                  >
                    {currentPlan === "samarpan" ? "Current Plan" : "Choose Samarpan"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Super Likes */}
          <div className="mb-10">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Super Likes ⭐</h2>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{pkg.count} Super Likes</h3>
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
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Message Highlights ✨</h2>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{pkg.count} Highlights</h3>
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
