"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SwipeCard from "./swipe-card"
import { Heart, X, RotateCcw, Sparkles } from "lucide-react"

interface SwipeStackProps {
  profiles: any[]
  onSwipe: (direction: "left" | "right", profileId: string) => void
}

export default function SwipeStack({ profiles, onSwipe }: SwipeStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const visibleProfiles = profiles.slice(currentIndex, currentIndex + 3)

  const handleSwipe = (direction: "left" | "right", profileId: string) => {
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

  const handleUndo = () => {
    if (currentIndex > 0 && !isAnimating) {
      setCurrentIndex((prev) => prev - 1)
    }
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
      <div className="relative px-4 py-4 h-[calc(100vh-200px)]">
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
                    swipeDirection === "right" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {swipeDirection === "right" ? <Heart className="w-16 h-16" /> : <X className="w-16 h-16" />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="px-4 pb-8 mt-auto">
        <div className="flex items-center justify-center gap-4">
          {/* Undo Button */}
          <motion.button
            onClick={handleUndo}
            disabled={currentIndex === 0 || isAnimating}
            className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            whileHover={{ scale: currentIndex > 0 ? 1.1 : 1 }}
            whileTap={{ scale: currentIndex > 0 ? 0.9 : 1 }}
          >
            <RotateCcw className="w-6 h-6" />
          </motion.button>

          {/* Dislike Button */}
          <motion.button
            onClick={() => visibleProfiles[0] && handleSwipe("left", visibleProfiles[0].id)}
            disabled={isAnimating || visibleProfiles.length === 0}
            className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            whileHover={{ scale: !isAnimating ? 1.1 : 1 }}
            whileTap={{ scale: !isAnimating ? 0.9 : 1 }}
          >
            <X className="w-8 h-8" />
          </motion.button>

          {/* Like Button */}
          <motion.button
            onClick={() => visibleProfiles[0] && handleSwipe("right", visibleProfiles[0].id)}
            disabled={isAnimating || visibleProfiles.length === 0}
            className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-green-500 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            whileHover={{ scale: !isAnimating ? 1.1 : 1 }}
            whileTap={{ scale: !isAnimating ? 0.9 : 1 }}
          >
            <Heart className="w-8 h-8" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
