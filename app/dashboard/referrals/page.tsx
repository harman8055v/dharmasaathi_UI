"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Users, Gift, Copy, Share2, Star, CheckCircle, Zap, Crown } from "lucide-react"
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
      const { data, error } = await supabase
        .from("referrals")
        .select("*, referred:users!referrals_referred_id_fkey(verification_status)")
        .eq("referrer_id", userId)

      if (error) {
        console.error("Error fetching referral stats:", error)
        return
      }

      const totalReferrals = data?.length || 0
      const successfulReferrals =
        data?.filter((r) => r.status === "completed" && r.referred?.verification_status === "verified").length || 0
      const pendingReferrals =
        data?.filter(
          (r) => r.status === "pending" || (r.status === "completed" && r.referred?.verification_status !== "verified"),
        ).length || 0

      setReferralStats({
        total_referrals: totalReferrals,
        successful_referrals: successfulReferrals,
        pending_referrals: pendingReferrals,
      })
    } catch (error) {
      console.error("Error fetching referral stats:", error)
    }
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
          text: "Join me on DharmaSaathi, the spiritual matchmaking platform. Use my referral link for exclusive benefits!",
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

  const getProgressForLevel = (level: number) => {
    const { successful_referrals } = referralStats
    switch (level) {
      case 1: // Fast Track (4 referrals)
        return Math.min((successful_referrals / 4) * 100, 100)
      case 2: // Sangam Plan (10 referrals)
        return Math.min((successful_referrals / 10) * 100, 100)
      case 3: // Samarpan Plan (20 referrals)
        return Math.min((successful_referrals / 20) * 100, 100)
      default:
        return 0
    }
  }

  const getRewardStatus = (requiredReferrals: number) => {
    const { successful_referrals } = referralStats
    if (successful_referrals >= requiredReferrals) {
      return "unlocked"
    } else if (successful_referrals >= requiredReferrals * 0.5) {
      return "progress"
    } else {
      return "locked"
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
              <h1 className="text-xl font-semibold text-gray-900">Referral Program</h1>
              <p className="text-sm text-gray-600">Invite friends and unlock exclusive benefits</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Referral Stats */}
            <div className="grid grid-cols-3 gap-4">
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
                  <Star className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{referralStats.pending_referrals}</div>
                  <p className="text-sm text-gray-600">Pending</p>
                </CardContent>
              </Card>
            </div>

            {/* Reward Levels */}
            <Card>
              <CardHeader>
                <CardTitle>Reward Levels</CardTitle>
                <CardDescription>Unlock exclusive benefits as you refer more friends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Level 1: Fast Track Verification */}
                <div
                  className={`p-4 rounded-lg border-2 transition-all ${
                    getRewardStatus(4) === "unlocked"
                      ? "bg-green-50 border-green-200"
                      : getRewardStatus(4) === "progress"
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap
                        className={`w-5 h-5 ${getRewardStatus(4) === "unlocked" ? "text-green-600" : "text-gray-500"}`}
                      />
                      <span className="font-semibold">Fast Track Verification</span>
                    </div>
                    <span className="text-sm font-bold">{referralStats.successful_referrals}/4</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        getRewardStatus(4) === "unlocked" ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${getProgressForLevel(1)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600">Priority review for faster profile approval</p>
                </div>

                {/* Level 2: Sangam Plan */}
                <div
                  className={`p-4 rounded-lg border-2 transition-all ${
                    getRewardStatus(10) === "unlocked"
                      ? "bg-green-50 border-green-200"
                      : getRewardStatus(10) === "progress"
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Gift
                        className={`w-5 h-5 ${getRewardStatus(10) === "unlocked" ? "text-green-600" : "text-gray-500"}`}
                      />
                      <span className="font-semibold">1 Month Sangam Plan</span>
                    </div>
                    <span className="text-sm font-bold">{referralStats.successful_referrals}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        getRewardStatus(10) === "unlocked" ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${getProgressForLevel(2)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600">Premium features for 30 days absolutely free</p>
                </div>

                {/* Level 3: Samarpan Plan */}
                <div
                  className={`p-4 rounded-lg border-2 transition-all ${
                    getRewardStatus(20) === "unlocked"
                      ? "bg-green-50 border-green-200"
                      : getRewardStatus(20) === "progress"
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Crown
                        className={`w-5 h-5 ${getRewardStatus(20) === "unlocked" ? "text-green-600" : "text-gray-500"}`}
                      />
                      <span className="font-semibold">45 Days Samarpan Plan</span>
                    </div>
                    <span className="text-sm font-bold">{referralStats.successful_referrals}/20</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        getRewardStatus(20) === "unlocked" ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${getProgressForLevel(3)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600">Premium+ features for 45 days with exclusive benefits</p>
                </div>
              </CardContent>
            </Card>

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
                      <h4 className="font-semibold text-purple-800">Share Your Link</h4>
                      <p className="text-sm text-purple-700">Share your unique referral link with friends and family</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800">They Sign Up & Get Verified</h4>
                      <p className="text-sm text-purple-700">
                        Your friends join DharmaSaathi and complete verification
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800">Unlock Rewards</h4>
                      <p className="text-sm text-purple-700">
                        Get exclusive benefits based on successful verified referrals
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referral Link */}
            <Card>
              <CardHeader>
                <CardTitle>Your Referral Link</CardTitle>
                <CardDescription>Share this link with friends to earn rewards</CardDescription>
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

            {/* Terms */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-sm">Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li>• Rewards are unlocked when referred users complete verification</li>
                  <li>• Only verified referrals count towards successful referral milestones</li>
                  <li>• Rewards are activated automatically upon reaching milestones</li>
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
