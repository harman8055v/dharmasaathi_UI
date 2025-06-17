"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import SwipeCard from "./swipe-card"
import { Button } from "@/components/ui/button"
import { Heart, X, Star, RotateCcw, Clock, Zap } from "lucide-react"
import { toast } from "sonner"

interface SwipeStackProps {
  profiles: any[]
  onSwipe: (direction: "left" | "right" | "superlike", profileId: string) => void
  headerless?: boolean
}

export default function SwipeStack({ profiles: initialProfiles, onSwipe, headerless = false }: SwipeStackProps) {
  const [profiles, setProfiles] = useState(initialProfiles)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [undoStack, setUndoStack] = useState<any[]>([])
  const [swipeStats, setSwipeStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Fetch swipe stats and profiles on mount
  useEffect(() => {
    fetchSwipeStats()
    fetchProfiles()
  }, [])

  const fetchSwipeStats = async () => {
    try {
      const response = await fetch("/api/swipe/stats")
      if (response.ok) {
        const stats = await response.json()
        setSwipeStats(stats)
      }
    } catch (error) {
      console.error("Error fetching swipe stats:", error)
    }
  }

  const fetchProfiles = async () => {
    try {
      const response = await fetch("/api/profiles/discover")
      if (response.ok) {
        const data = await response.json()
        setProfiles(data.profiles || [])
      }
    } catch (error) {
      console.error("Error fetching profiles:", error)
    }
  }

  const handleSwipe = async (direction: "left" | "right" | "superlike", profileId: string) => {
    if (loading) return

    // Check limits before swiping
    if (!swipeStats?.can_swipe) {
      toast.error("Daily swipe limit reached! Come back tomorrow or upgrade your plan.")
      return
    }

    if (direction === "superlike" && swipeStats?.super_likes_available <= 0) {
      toast.error("No Super Likes available! Purchase more or upgrade your plan.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/swipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          swiped_user_id: profileId,
          action: direction === "left" ? "dislike" : direction === "right" ? "like" : "superlike",
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Handle successful swipe
        const swipedProfile = profiles[currentIndex]
        setUndoStack((prev) => [...prev, { profile: swipedProfile, direction, index: currentIndex }])
        setCurrentIndex((prev) => prev + 1)

        // Update stats
        fetchSwipeStats()

        // Show match notification
        if (result.is_match) {
          toast.success("🎉 It's a match! You can now message each other.")
        } else if (direction === "superlike") {
          toast.success("⭐ Super Like sent!")
        }

        // Call parent callback
        onSwipe(direction, profileId)

        // Load more profiles if running low
        if (currentIndex >= profiles.length - 3) {
          fetchProfiles()
        }
      } else {
        if (result.limit_reached) {
          toast.error("Daily swipe limit reached! Upgrade your plan for more swipes.")
        } else {
          toast.error(result.error || "Failed to swipe")
        }
      }
    } catch (error) {
      console.error("Swipe error:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleUndo = () => {
    if (undoStack.length === 0) return

    const lastAction = undoStack[undoStack.length - 1]
    setUndoStack((prev) => prev.slice(0, -1))
    setCurrentIndex(lastAction.index)

    toast.success("Last action undone!")
  }

  const currentProfile = profiles[currentIndex]
  const hasMoreProfiles = currentIndex < profiles.length

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
          <Button onClick={fetchProfiles} className="bg-gradient-to-r from-orange-500 to-pink-500">
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

        {/* Limit Reached Overlay */}
        {swipeStats && !swipeStats.can_swipe && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Daily Limit Reached</h3>
              <p className="text-gray-600 mb-6">
                You've used all {swipeStats.daily_limit} swipes for today. Come back tomorrow or upgrade your plan!
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => (window.location.href = "/dashboard/store")}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
                <Button variant="outline" onClick={fetchSwipeStats} className="w-full">
                  Check Again
                </Button>
              </div>
            </div>
          </div>
        )}
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
              disabled={undoStack.length === 0 || loading}
              className="rounded-full w-14 h-14 p-0 border-gray-300 hover:border-yellow-400 hover:bg-yellow-50"
            >
              <RotateCcw className="w-6 h-6 text-gray-500 hover:text-yellow-500" />
            </Button>

            {/* Dislike Button */}
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleSwipe("left", currentProfile.id)}
              disabled={loading || !swipeStats?.can_swipe}
              className="rounded-full w-16 h-16 p-0 border-gray-300 hover:border-red-400 hover:bg-red-50"
            >
              <X className="w-7 h-7 text-gray-500 hover:text-red-500" />
            </Button>

            {/* Super Like Button */}
            <Button
              size="lg"
              onClick={() => handleSwipe("superlike", currentProfile.id)}
              disabled={loading || !swipeStats?.can_swipe || swipeStats?.super_likes_available <= 0}
              className="rounded-full w-14 h-14 p-0 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50"
            >
              <Star className="w-6 h-6 text-white" />
            </Button>

            {/* Like Button */}
            <Button
              size="lg"
              onClick={() => handleSwipe("right", currentProfile.id)}
              disabled={loading || !swipeStats?.can_swipe}
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
