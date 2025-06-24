"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import SwipeCard from "./swipe-card"
import { Button } from "@/components/ui/button"
import { Heart, X, Star, RotateCcw, Zap } from "lucide-react"
import { toast } from "sonner"

interface SwipeStackProps {
  profiles: any[]
  onSwipe: (direction: "left" | "right" | "superlike", profileId: string) => void
  headerless?: boolean
}

// Fallback mock profiles in case API fails
const FALLBACK_PROFILES = [
  {
    id: "fallback-1",
    first_name: "Ananya",
    last_name: "Sharma",
    age: 28,
    city: "Mumbai",
    state: "Maharashtra",
    profession: "Software Engineer",
    about_me: "Passionate about spirituality and technology. Love practicing yoga and meditation daily.",
    user_photos: ["/abstract-spiritual-avatar-1.png"],
    compatibility_score: 95,
    spiritual_org: ["Art of Living"],
    daily_practices: ["Meditation", "Yoga"],
  },
  {
    id: "fallback-2",
    first_name: "Priya",
    last_name: "Reddy",
    age: 26,
    city: "Hyderabad",
    state: "Telangana",
    profession: "Teacher",
    about_me: "Teaching is my passion, and I believe in nurturing young minds with spiritual values.",
    user_photos: ["/abstract-spiritual-avatar-2.png"],
    compatibility_score: 92,
    spiritual_org: ["ISKCON"],
    daily_practices: ["Chanting", "Reading"],
  },
]

export default function SwipeStack({ profiles: initialProfiles, onSwipe, headerless = false }: SwipeStackProps) {
  const [profiles, setProfiles] = useState(initialProfiles)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [undoStack, setUndoStack] = useState<any[]>([])
  const [swipeStats, setSwipeStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [swiping, setSwiping] = useState(false)
  const [error, setError] = useState<string | null>(null)

  console.log("🎯 SwipeStack rendered:", {
    initialProfilesCount: initialProfiles.length,
    currentProfilesCount: profiles.length,
    currentIndex,
    loading,
    headerless,
  })

  // Fetch data on mount
  useEffect(() => {
    console.log("🚀 SwipeStack useEffect triggered")
    fetchData()
  }, [])

  const fetchData = async () => {
    console.log("📡 Starting fetchData...")
    setLoading(true)
    setError(null)

    try {
      await Promise.all([fetchSwipeStats(), fetchProfiles()])
    } catch (err) {
      console.error("❌ Failed to load data:", err)
      setError("Failed to load profiles. Please try again.")
      // Use fallback profiles if API fails
      setProfiles(FALLBACK_PROFILES)
    } finally {
      setLoading(false)
    }
  }

  const fetchSwipeStats = async () => {
    console.log("📊 Fetching swipe stats...")
    try {
      // Always return mock stats in development
      const mockStats = {
        can_swipe: true,
        swipes_remaining: 50,
        daily_limit: 50,
        super_likes_available: 5,
        plan: "sangam",
      }
      console.log("✅ Mock stats set:", mockStats)
      setSwipeStats(mockStats)
    } catch (error) {
      console.error("❌ Error fetching swipe stats:", error)
      throw error
    }
  }

  const fetchProfiles = async () => {
    console.log("👥 Fetching profiles from API...")

    try {
      const response = await fetch("/api/profiles/discover", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("📡 API Response status:", response.status)

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      console.log("📦 API Response data:", data)

      if (data.profiles && Array.isArray(data.profiles)) {
        console.log("✅ Setting profiles:", data.profiles.length)
        setProfiles(data.profiles)
      } else {
        console.warn("⚠️ No profiles in response, using fallback")
        setProfiles(FALLBACK_PROFILES)
      }
    } catch (error) {
      console.error("❌ Error fetching profiles:", error)
      console.log("🔄 Using fallback profiles")
      setProfiles(FALLBACK_PROFILES)
    }
  }

  const handleSwipe = async (direction: "left" | "right" | "superlike", profileId: string) => {
    if (swiping) return

    console.log(`👆 Swiping ${direction} on profile:`, profileId)

    // Check limits before swiping
    if (!swipeStats?.can_swipe) {
      toast.error("Daily swipe limit reached! Come back tomorrow or upgrade your plan.")
      return
    }

    if (direction === "superlike" && swipeStats?.super_likes_available <= 0) {
      toast.error("No Super Likes available! Purchase more or upgrade your plan.")
      return
    }

    setSwiping(true)

    try {
      // In development, just simulate the swipe without API call
      console.log("✅ Simulating swipe action")

      // Handle successful swipe
      const swipedProfile = profiles[currentIndex]
      setUndoStack((prev) => [...prev, { profile: swipedProfile, direction, index: currentIndex }])
      setCurrentIndex((prev) => prev + 1)

      // Show success message
      if (direction === "superlike") {
        toast.success("⭐ Super Like sent!")
      } else if (direction === "right") {
        toast.success("💖 Profile liked!")
      } else {
        toast.success("👋 Profile passed")
      }

      // Call parent callback
      onSwipe(direction, profileId)

      // Load more profiles if running low
      if (currentIndex >= profiles.length - 3) {
        console.log("🔄 Loading more profiles...")
        fetchProfiles()
      }
    } catch (error) {
      console.error("❌ Swipe error:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSwiping(false)
    }
  }

  const handleUndo = () => {
    if (undoStack.length === 0) return

    const lastAction = undoStack[undoStack.length - 1]
    setUndoStack((prev) => prev.slice(0, -1))
    setCurrentIndex(lastAction.index)

    toast.success("↩️ Last action undone!")
  }

  const currentProfile = profiles[currentIndex]
  const hasMoreProfiles = currentIndex < profiles.length

  console.log("🎯 Current state:", {
    loading,
    profilesLength: profiles.length,
    currentIndex,
    hasMoreProfiles,
    currentProfile: currentProfile?.first_name,
  })

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profiles...</p>
        </div>
      </div>
    )
  }

  if (!loading && profiles.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No profiles available</h3>
          <p className="text-gray-600 mb-6">{error ?? "Try adjusting your preferences or check back later."}</p>
          <Button onClick={fetchData} className="bg-gradient-to-r from-orange-500 to-pink-500">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!hasMoreProfiles && profiles.length > 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No More Profiles</h3>
          <p className="text-gray-600 mb-6">
            You've seen all available profiles for today. Check back later for new matches!
          </p>
          <Button onClick={fetchData} className="bg-gradient-to-r from-orange-500 to-pink-500">
            Refresh Profiles
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Stats Header (only show if not headerless) */}
      {!headerless && swipeStats && (
        <div className="px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-orange-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-orange-500" />
                <span className="font-medium">
                  {swipeStats.daily_limit === -1
                    ? "Unlimited"
                    : `${swipeStats.swipes_remaining}/${swipeStats.daily_limit}`}{" "}
                  swipes left
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{swipeStats.super_likes_available} Super Likes</span>
              </div>
            </div>
            <div className="px-3 py-1 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full text-xs font-medium text-orange-800">
              {swipeStats.plan.charAt(0).toUpperCase() + swipeStats.plan.slice(1)} Plan
            </div>
          </div>
        </div>
      )}

      {/* Swipe Area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="popLayout">
          {hasMoreProfiles && (
            <div className="absolute inset-4">
              {/* Stack of cards */}
              {profiles.slice(currentIndex, currentIndex + 3).map((profile, index) => (
                <SwipeCard
                  key={`${profile.id}-${currentIndex + index}`}
                  profile={profile}
                  onSwipe={handleSwipe}
                  onUndo={handleUndo}
                  showUndo={undoStack.length > 0 && index === 0}
                  isTop={index === 0}
                  index={index}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons (only show if not headerless and has profiles) */}
      {!headerless && hasMoreProfiles && currentProfile && (
        <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-orange-100">
          <div className="flex justify-center items-center gap-4">
            {/* Undo Button */}
            <Button
              variant="outline"
              size="lg"
              onClick={handleUndo}
              disabled={undoStack.length === 0 || swiping}
              className="rounded-full w-14 h-14 p-0 border-gray-300 hover:border-yellow-400 hover:bg-yellow-50"
            >
              <RotateCcw className="w-6 h-6 text-gray-500 hover:text-yellow-500" />
            </Button>

            {/* Dislike Button */}
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleSwipe("left", currentProfile.id)}
              disabled={swiping || !swipeStats?.can_swipe}
              className="rounded-full w-16 h-16 p-0 border-gray-300 hover:border-red-400 hover:bg-red-50"
            >
              <X className="w-7 h-7 text-gray-500 hover:text-red-500" />
            </Button>

            {/* Super Like Button */}
            <Button
              size="lg"
              onClick={() => handleSwipe("superlike", currentProfile.id)}
              disabled={swiping || !swipeStats?.can_swipe || swipeStats?.super_likes_available <= 0}
              className="rounded-full w-14 h-14 p-0 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50"
            >
              <Star className="w-6 h-6 text-white" />
            </Button>

            {/* Like Button */}
            <Button
              size="lg"
              onClick={() => handleSwipe("right", currentProfile.id)}
              disabled={swiping || !swipeStats?.can_swipe}
              className="rounded-full w-16 h-16 p-0 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 disabled:opacity-50"
            >
              <Heart className="w-7 h-7 text-white" />
            </Button>

            {/* Boost Button (placeholder) */}
            <Button
              variant="outline"
              size="lg"
              disabled
              className="rounded-full w-14 h-14 p-0 border-gray-300 opacity-50"
            >
              <Zap className="w-6 h-6 text-gray-400" />
            </Button>
          </div>

          {/* Stats Display */}
          {swipeStats && (
            <div className="mt-3 text-center text-xs text-gray-500">
              {swipeStats.daily_limit === -1
                ? "Unlimited swipes remaining"
                : `${swipeStats.swipes_remaining} swipes remaining today`}{" "}
              • {swipeStats.super_likes_available} Super Likes available
            </div>
          )}
        </div>
      )}
    </div>
  )
}
