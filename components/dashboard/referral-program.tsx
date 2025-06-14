"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Users, Copy, CheckCircle, Gift, Zap, Crown, Share2, ExternalLink, Trophy, Clock } from "lucide-react"

interface ReferralProgramProps {
  userId: string
  userProfile: any
}

export function ReferralProgram({ userId, userProfile }: ReferralProgramProps) {
  const [referralCode, setReferralCode] = useState<string>("")
  const [referralCount, setReferralCount] = useState<number>(0)
  const [copied, setCopied] = useState(false)
  const [rewards, setRewards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    fetchReferralData()
  }, [userId])

  const fetchReferralData = async () => {
    try {
      setError("")

      // First, check if referral columns exist by trying to fetch them
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("referral_code, referral_count, fast_track_verification")
        .eq("id", userId)
        .single()

      if (userError) {
        // If columns don't exist, we'll handle it gracefully
        if (userError.message?.includes("column") && userError.message?.includes("does not exist")) {
          console.warn("Referral columns not yet created. Please run the referral system setup script.")
          setError("Referral system is being set up. Please refresh the page in a moment.")
          setLoading(false)
          return
        }
        throw userError
      }

      // Generate referral code if it doesn't exist
      let currentReferralCode = userData.referral_code
      if (!currentReferralCode) {
        currentReferralCode = await generateReferralCode()

        // Update user with new referral code
        const { error: updateError } = await supabase
          .from("users")
          .update({ referral_code: currentReferralCode })
          .eq("id", userId)

        if (updateError) {
          console.error("Error updating referral code:", updateError)
        }
      }

      setReferralCode(currentReferralCode || "")
      setReferralCount(userData.referral_count || 0)

      // Get user's rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from("referral_rewards")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")

      if (!rewardsError) {
        setRewards(rewardsData || [])
      }

      setLoading(false)
    } catch (error: any) {
      console.error("Error fetching referral data:", error)
      setError("Unable to load referral data. Please try refreshing the page.")
      setLoading(false)
    }
  }

  const generateReferralCode = async (): Promise<string> => {
    // Generate a simple referral code based on user ID and timestamp
    const timestamp = Date.now().toString(36)
    const userIdShort = userId.slice(-4)
    return `${userIdShort}${timestamp}`.toUpperCase().slice(0, 8)
  }

  const generateReferralLink = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://dharmasaathi.com"
    return `${baseUrl}?ref=${referralCode}`
  }

  const copyReferralLink = async () => {
    const link = generateReferralLink()
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = link
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareReferralLink = async () => {
    const link = generateReferralLink()
    const text = `Join me on DharmaSaathi - India's premier spiritual matrimony platform! 🕉️ Find your spiritual life partner.`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join DharmaSaathi - Find Your Spiritual Life Partner",
          text: text,
          url: link,
        })
      } catch (error) {
        console.error("Error sharing:", error)
        copyReferralLink()
      }
    } else {
      copyReferralLink()
    }
  }

  const getRemainingReferrals = () => Math.max(0, 4 - referralCount)
  const isEligibleForRewards = referralCount >= 4
  const progressPercentage = Math.min((referralCount / 4) * 100, 100)

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-orange-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-xl p-4 sm:p-6 shadow-lg border border-purple-200">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Referral Program</h3>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              The referral system database needs to be initialized.
            </p>
          </div>
        </div>

        <div className="bg-white/70 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Database Setup Required</span>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Please run the SQL script:{" "}
            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
              scripts/create-referral-system-v2.sql
            </code>
          </p>
          <p className="text-xs text-gray-500">
            This will create the necessary database tables and columns for referral tracking, rewards, and user referral
            codes.
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">Once the database is set up, you'll be able to:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
              <span>Generate referral links</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
              <span>Track successful referrals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
              <span>Earn fast verification</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
              <span>Get 14 days premium free</span>
            </div>
          </div>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            Refresh After Setup
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-xl p-4 sm:p-6 shadow-lg border border-purple-200">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Referral Program</h3>
            {isEligibleForRewards && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 text-xs font-medium rounded-full w-fit">
                <Crown className="w-3 h-3" />
                <span>Rewards Unlocked!</span>
              </div>
            )}
          </div>
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            Invite friends to boost your verification speed and earn premium benefits!
          </p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white/70 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress to Rewards</span>
          <span className="text-sm font-bold text-purple-600">{referralCount}/4 referrals</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 relative"
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage > 0 && (
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-600">
          {getRemainingReferrals() > 0
            ? `${getRemainingReferrals()} more referrals needed for premium rewards!`
            : "🎉 Congratulations! You've unlocked all rewards!"}
        </p>
      </div>

      {/* Rewards Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div
          className={`p-3 rounded-lg border-2 transition-all ${
            isEligibleForRewards
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-gray-50 border-gray-200 text-gray-600"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold">Fast Verification</span>
          </div>
          <p className="text-xs">Priority review for faster approval</p>
        </div>

        <div
          className={`p-3 rounded-lg border-2 transition-all ${
            isEligibleForRewards
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-gray-50 border-gray-200 text-gray-600"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Gift className="w-4 h-4" />
            <span className="text-sm font-semibold">14 Days Sangam Plan</span>
          </div>
          <p className="text-xs">Premium features absolutely free!</p>
        </div>
      </div>

      {/* Referral Link Section */}
      {referralCode && (
        <div className="bg-white/70 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Your Referral Link</h4>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 p-2 bg-gray-100 rounded-md text-sm text-gray-700 font-mono break-all">
              {generateReferralLink()}
            </div>
            <div className="flex gap-2">
              <Button onClick={copyReferralLink} size="sm" variant="outline" className="flex-1 sm:flex-none">
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                onClick={shareReferralLink}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex-1 sm:flex-none"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Referrals */}
      {referralCount > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-800">Successful Referrals</h4>
          </div>
          <p className="text-sm text-green-700">
            🎉 You've successfully referred <strong>{referralCount}</strong> {referralCount === 1 ? "person" : "people"}{" "}
            to DharmaSaathi!
          </p>
        </div>
      )}

      {/* Call to Action */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-3">
          Share with friends, family, and your spiritual community to help them find their perfect match!
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button
            onClick={shareReferralLink}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            disabled={!referralCode}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Start Referring Now
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Learn More
          </Button>
        </div>
      </div>

      {/* Active Rewards Display */}
      {rewards.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-yellow-600" />
            <h4 className="font-semibold text-yellow-800">Active Rewards</h4>
          </div>
          <div className="space-y-2">
            {rewards.map((reward) => (
              <div key={reward.id} className="flex items-center justify-between text-sm">
                <span className="text-yellow-700">
                  {reward.reward_type === "premium_days" && `${reward.reward_value} Days Premium`}
                  {reward.reward_type === "fast_verification" && "Fast Track Verification"}
                </span>
                <div className="flex items-center gap-1 text-yellow-600">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">Expires {new Date(reward.expires_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
