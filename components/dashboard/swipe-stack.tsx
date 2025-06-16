"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SwipeCard from "./swipe-card"
import { Heart, X, Sparkles, Star } from "lucide-react"

interface SwipeStackProps {
  profiles: any[]
  onSwipe: (direction: "left" | "right" | "superlike", profileId: string) => void
}

export default function SwipeStack({ profiles, onSwipe }: SwipeStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | "superlike" | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const visibleProfiles = profiles.slice(currentIndex, currentIndex + 3)

  const handleSwipe = (direction: "left" | "right" | "superlike", profileId: string) => {
    if (isAnimating) return

    setIsAnimating(true)
    setSwipeDirection(direction)

    // Call the parent onSwipe function
    onSwipe(direction, profileId)

    // Animate the swipe
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
      setSwipeDirection(null)
      setIsAnimating(false)
    }, 300)
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="w-24 h-24 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">You're all caught up!</h3>
          <p className="text-gray-600 mb-6">Check back later for new profiles</p>

          <motion.button
            onClick={() => setCurrentIndex(0)}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-semibold hover:from-orange-600 hover:to-pink-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Over
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Card Stack */}
      <div className="relative px-4 py-4 h-[calc(100vh-120px)]">
        <div className="relative w-full max-w-sm mx-auto h-full">
          <AnimatePresence mode="popLayout">
            {visibleProfiles.map((profile, index) => (
              <SwipeCard
                key={`${profile.id}-${currentIndex + index}`}
                profile={profile}
                onSwipe={handleSwipe}
                isTop={index === 0}
                index={index}
              />
            ))}
          </AnimatePresence>

          {/* Swipe Animation Overlay */}
          <AnimatePresence>
            {swipeDirection && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`w-32 h-32 rounded-full flex items-center justify-center ${
                    swipeDirection === "right"
                      ? "bg-green-500 text-white"
                      : swipeDirection === "superlike"
                        ? "bg-blue-500 text-white"
                        : "bg-red-500 text-white"
                  }`}
                >
                  {swipeDirection === "right" ? (
                    <Heart className="w-16 h-16" />
                  ) : swipeDirection === "superlike" ? (
                    <Star className="w-16 h-16" />
                  ) : (
                    <X className="w-16 h-16" />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
