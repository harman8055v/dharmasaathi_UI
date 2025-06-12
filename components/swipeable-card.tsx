"use client"

import { useState, useRef } from "react"
import { Heart, X, Star, MapPin, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { User } from "@/lib/types"

interface SwipeableCardProps {
  user: User
  onSwipe: (direction: "left" | "right" | "up") => void
  onViewProfile: () => void
  isTopCard: boolean
}

export default function SwipeableCard({ user, onSwipe, onViewProfile, isTopCard }: SwipeableCardProps) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const startPos = useRef({ x: 0, y: 0 })

  const handleStart = (clientX: number, clientY: number) => {
    if (!isTopCard) return
    setIsDragging(true)
    startPos.current = { x: clientX, y: clientY }
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !isTopCard) return

    const deltaX = clientX - startPos.current.x
    const deltaY = clientY - startPos.current.y

    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleEnd = () => {
    if (!isDragging || !isTopCard) return

    const threshold = 100
    const { x, y } = dragOffset

    if (Math.abs(x) > threshold) {
      onSwipe(x > 0 ? "right" : "left")
    } else if (y < -threshold) {
      onSwipe("up")
    }

    setIsDragging(false)
    setDragOffset({ x: 0, y: 0 })
  }

  const rotation = dragOffset.x * 0.1
  const opacity = Math.max(0.7, 1 - Math.abs(dragOffset.x) / 200)

  return (
    <div
      ref={cardRef}
      className={cn(
        "absolute inset-4 bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300",
        isTopCard ? "z-10 cursor-grab active:cursor-grabbing" : "z-0 scale-95 opacity-80",
        isDragging && "transition-none",
      )}
      style={{
        transform: isTopCard ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)` : undefined,
        opacity: isTopCard ? opacity : undefined,
      }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      {/* Photo */}
      <div className="relative h-2/3">
        <img
          src={user.photos[0] || "/placeholder.svg?height=400&width=300&query=profile photo"}
          alt={user.name}
          className="w-full h-full object-cover"
        />

        {/* KYC Badge */}
        {user.kyc_verified && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Verified
          </div>
        )}

        {/* Swipe Indicators */}
        {isDragging && (
          <>
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-opacity",
                dragOffset.x > 50 ? "opacity-100" : "opacity-0",
              )}
            >
              <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg transform rotate-12">
                LIKE
              </div>
            </div>
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-opacity",
                dragOffset.x < -50 ? "opacity-100" : "opacity-0",
              )}
            >
              <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg transform -rotate-12">
                PASS
              </div>
            </div>
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-opacity",
                dragOffset.y < -50 ? "opacity-100" : "opacity-0",
              )}
            >
              <div className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold text-lg">SUPER LIKE</div>
            </div>
          </>
        )}
      </div>

      {/* Info Section */}
      <div className="p-4 h-1/3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">
              {user.name}, {user.age}
            </h3>
            {user.is_premium && (
              <div className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-2 py-1 rounded-full text-xs font-medium">
                Premium
              </div>
            )}
          </div>

          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{user.city}</span>
          </div>

          {/* Spiritual Highlights */}
          <div className="flex flex-wrap gap-1 mb-2">
            {user.spiritual_highlights.slice(0, 3).map((highlight, index) => (
              <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                {highlight}
              </span>
            ))}
          </div>

          <p className="text-sm text-gray-700 line-clamp-2">{user.about_me}</p>
        </div>

        {/* Action Buttons */}
        {isTopCard && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => onSwipe("left")}
              className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={() => onSwipe("up")}
              className="bg-blue-100 hover:bg-blue-200 p-3 rounded-full transition-colors"
            >
              <Star className="w-6 h-6 text-blue-600" />
            </button>
            <button
              onClick={() => onSwipe("right")}
              className="bg-green-100 hover:bg-green-200 p-3 rounded-full transition-colors"
            >
              <Heart className="w-6 h-6 text-green-600" />
            </button>
          </div>
        )}

        {/* View Profile Button */}
        <button
          onClick={onViewProfile}
          className="mt-2 text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors"
        >
          View Full Profile
        </button>
      </div>
    </div>
  )
}
