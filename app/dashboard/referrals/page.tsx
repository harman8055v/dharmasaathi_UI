"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Users, Gift, Copy, Share2, Trophy, Star, CheckCircle } from "lucide-react"
import MobileNav from "@/components/dashboard/mobile-nav"
import { toast } from "sonner"
import { Toaster } from "sonner"

export default function ReferralsPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [referralStats, setReferralStats] = useState({
    total_referrals: 0,
    successful_referrals: 0,
    pending_referrals: 0,
    total_rewards: 0,
  })
  const router = useRouter()

  const referralCode = profile?.referral_code || "DHARMA123"
  const referralLink = `https://dharmasaathi.com/signup?ref=${referralCode}`

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

        // Fetch referral stats
        await fetchReferralStats(user.id)

        setLoading(false)
      } catch (error) {
        console.error("Error:", error)
        router.push("/")
      }
    }

    getUser()
  }, [router])

  const fetchReferralStats = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("referrals").select("*").eq("referrer_id", userId)

      if (error) {
        console.error("Error fetching referral stats:", error)
        return
      }

      const stats = {
        total_referrals: data?.length || 0,
        successful_referrals: data?.filter((r) => r.status === "completed").length || 0,
        pending_referrals: data?.filter((r) => r.status === "pending").length || 0,
        total_rewards:
          data?.filter((r) => r.status === "completed").reduce((sum, r) => sum + (r.reward_amount || 0), 0) || 0,
      }

      setReferralStats(stats)
    } catch (error) {
      console.error("Error fetching referral stats:", error)
    }
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode)
    toast.success("Referral code copied to clipboard!")
  }

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast.success("Referral link copied to clipboard!")
  }

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join DharmaSaathi - Find Your Spiritual Match",
          text: "Join me on DharmaSaathi, the spiritual matchmaking platform. Use my referral code for exclusive benefits!",
          url: referralLink,
        })
      } catch (error) {
        console.error("Error sharing:", error)
        copyReferralLink()
      }
    } else {
      copyReferralLink()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading referral program...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <MobileNav userProfile={profile} />

      <main className="pt-24 pb-40 px-4 min-h-screen">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Referral Program</h1>
              <p className="text-gray-600">Invite friends and earn rewards</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Referral Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{referralStats.total_referrals}</div>
                  <p className="text-sm text-gray-600">Total Referrals</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{referralStats.successful_referrals}</div>
                  <p className="text-sm text-gray-600">Successful</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">₹{referralStats.total_rewards}</div>
                  <p className="text-sm text-gray-600">Total Rewards</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{referralStats.pending_referrals}</div>
                  <p className="text-sm text-gray-600">Pending</p>
                </CardContent>
              </Card>
            </div>

            {/* How It Works */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Gift className="w-5 h-5" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800">Share Your Code</h4>
                      <p className="text-sm text-purple-700">Share your unique referral code with friends and family</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800">They Sign Up</h4>
                      <p className="text-sm text-purple-700">Your friends join DharmaSaathi using your referral code</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800">Earn Rewards</h4>
                      <p className="text-sm text-purple-700">
                        Get ₹100 credit when they complete their profile verification
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referral Code */}
            <Card>
              <CardHeader>
                <CardTitle>Your Referral Code</CardTitle>
                <CardDescription>Share this code with friends to earn rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input value={referralCode} readOnly className="font-mono text-lg text-center bg-gray-50" />
                  <Button onClick={copyReferralCode} variant="outline" size="icon">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Referral Link */}
            <Card>
              <CardHeader>
                <CardTitle>Your Referral Link</CardTitle>
                <CardDescription>Direct link for easy sharing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input value={referralLink} readOnly className="text-sm bg-gray-50" />
                  <Button onClick={copyReferralLink} variant="outline" size="icon">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <Button onClick={shareReferralLink} className="w-full bg-gradient-to-r from-orange-500 to-pink-500">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Referral Link
                </Button>
              </CardContent>
            </Card>

            {/* Rewards Structure */}
            <Card>
              <CardHeader>
                <CardTitle>Reward Structure</CardTitle>
                <CardDescription>Earn more as you refer more friends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <h4 className="font-semibold text-green-800">Profile Verification</h4>
                      <p className="text-sm text-green-700">When your friend completes profile verification</p>
                    </div>
                    <div className="text-lg font-bold text-green-600">₹100</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <h4 className="font-semibold text-blue-800">First Premium Purchase</h4>
                      <p className="text-sm text-blue-700">When your friend buys their first premium plan</p>
                    </div>
                    <div className="text-lg font-bold text-blue-600">₹500</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div>
                      <h4 className="font-semibold text-purple-800">Milestone Bonus</h4>
                      <p className="text-sm text-purple-700">Extra ₹1000 for every 10 successful referrals</p>
                    </div>
                    <div className="text-lg font-bold text-purple-600">₹1000</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-sm">Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li>• Referral rewards are credited within 24-48 hours of completion</li>
                  <li>• Referred users must complete profile verification to qualify</li>
                  <li>• Rewards can be used for premium features or withdrawn to bank account</li>
                  <li>• Self-referrals and fake accounts will result in account suspension</li>
                  <li>• DharmaSaathi reserves the right to modify the referral program</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Toaster position="top-center" />
    </div>
  )
}
