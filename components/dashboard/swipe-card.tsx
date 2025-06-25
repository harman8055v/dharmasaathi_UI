"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import {
  Heart,
  X,
  MapPin,
  Briefcase,
  Calendar,
  GraduationCap,
  Sparkles,
  Star,
  Info,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  User,
  Users,
  MessageCircle,
  Ruler,
  Activity,
  Palette,
} from "lucide-react"
import Image from "next/image"
import { getOptimizedImageUrl } from "@/lib/supabase-storage"

interface SwipeCardProps {
  profile: any
  onSwipe: (direction: "left" | "right" | "superlike", profileId: string) => void
  onUndo: () => void
  showUndo?: boolean
  isTop: boolean
  index: number
}

export default function SwipeCard({ profile, onSwipe, onUndo, showUndo = false, isTop, index }: SwipeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentDetailImageIndex, setCurrentDetailImageIndex] = useState(0)
  const [animatingButton, setAnimatingButton] = useState<string | null>(null)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateRaw = useTransform(x, [-300, 300], [-30, 30])
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0])

  const rotate = rotateRaw

  const calculateAge = (birthdate: string) => {
    if (!birthdate) return "N/A"
    const today = new Date()
    const birth = new Date(birthdate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 150
    const velocity = info.velocity.x

    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
      const direction = info.offset.x > 0 ? "right" : "left"
      onSwipe(direction, profile.id)
    }
  }

  const [swipeAnimation, setSwipeAnimation] = useState<"left" | "right" | "up" | null>(null)

  const triggerSwipeAnimation = (direction: "left" | "right" | "up") => {
    setSwipeAnimation(direction)
    setTimeout(() => setSwipeAnimation(null), 800)
  }

  const handleLike = () => {
    if (animatingButton) return
    setAnimatingButton("like")
    triggerSwipeAnimation("right")
    onSwipe("right", profile.id)
    setTimeout(() => setAnimatingButton(null), 500)
  }

  const handleDislike = () => {
    if (animatingButton) return
    setAnimatingButton("dislike")
    triggerSwipeAnimation("left")
    onSwipe("left", profile.id)
    setTimeout(() => setAnimatingButton(null), 500)
  }

  const handleSuperlike = () => {
    if (animatingButton) return
    setAnimatingButton("superlike")
    triggerSwipeAnimation("up")
    onSwipe("superlike", profile.id)
    setTimeout(() => setAnimatingButton(null), 500)
  }

  const handleUndoClick = () => {
    if (animatingButton) return
    setAnimatingButton("undo")
    onUndo()
    setTimeout(() => setAnimatingButton(null), 300)
  }

  const nextImage = () => {
    if (profile.signedUrls && profile.signedUrls.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % profile.signedUrls.length)
    }
  }

  const prevImage = () => {
    if (profile.signedUrls && profile.signedUrls.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + profile.signedUrls.length) % profile.signedUrls.length)
    }
  }

  const nextDetailImage = () => {
    if (profile.signedUrls && profile.signedUrls.length > 1) {
      setCurrentDetailImageIndex((prev) => (prev + 1) % profile.signedUrls.length)
    }
  }

  const prevDetailImage = () => {
    if (profile.signedUrls && profile.signedUrls.length > 1) {
      setCurrentDetailImageIndex((prev) => (prev - 1 + profile.signedUrls.length) % profile.signedUrls.length)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        prevDetailImage()
      } else {
        nextDetailImage()
      }
    }
    setTouchStartX(null)
  }

  const getCurrentImage = () => {
    if (profile.signedUrls && profile.signedUrls.length > 0) {
      return getOptimizedImageUrl(profile.signedUrls[currentImageIndex], 400, 600)
    }
    return "/placeholder.svg"
  }

  const getCurrentDetailImage = () => {
    if (profile.signedUrls && profile.signedUrls.length > 0) {
      return getOptimizedImageUrl(profile.signedUrls[currentDetailImageIndex], 800, 1200)
    }
    return "/placeholder.svg"
  }

  const nopeOpacity = useTransform(x, [-150, -50], [1, 0])
  const nopeRotate = useTransform(x, [-150, -50], [-30, 0])
  const likeOpacity = useTransform(x, [50, 150], [0, 1])
  const likeRotate = useTransform(x, [50, 150], [0, 30])

  if (!isTop && !isExpanded) {
    return (
      <motion.div
        className="absolute inset-0 bg-white rounded-3xl shadow-lg border border-gray-200"
        style={{
          scale: 1 - index * 0.05,
          y: index * 10,
          zIndex: 10 - index,
        }}
        initial={{ scale: 1 - index * 0.05, y: index * 10 }}
        animate={{ scale: 1 - index * 0.05, y: index * 10 }}
      >
        <div className="relative w-full h-full rounded-3xl overflow-hidden">
          <Image
            src={getCurrentImage() || "/placeholder.svg"}
            alt={`${profile.first_name} ${profile.last_name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            priority={isTop}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <motion.div
        ref={cardRef}
        className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden cursor-pointer"
        style={{
          x,
          y: isExpanded ? y : 0,
          rotate,
          opacity,
          zIndex: isTop ? 20 : 10 - index,
        }}
        drag={false}
        whileTap={{ scale: isExpanded ? 1 : 0.95 }}
        layout
        onClick={() => setIsExpanded(true)}
      >
        {/* Main Card Content */}
        <div className="relative w-full h-full">
          {/* Image Section */}
          <div className="relative h-full">
            <Image
              src={getCurrentImage() || "/placeholder.svg"}
              alt={`${profile.first_name} ${profile.last_name}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              priority={isTop}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg"
              }}
            />

            {/* Info Button - Top Right */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(true)
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-colors z-20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Info className="w-5 h-5" />
            </motion.button>

            {/* Image Navigation */}
            {profile.signedUrls && profile.signedUrls.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors z-10"
                >
                  ←
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors z-10"
                >
                  →
                </button>

                {/* Image Indicators */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                  {profile.signedUrls.map((_: any, idx: number) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Profile Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-end justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">
                    {profile.first_name} {profile.last_name}
                  </h2>

                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{calculateAge(profile.birthdate)} years old</span>
                    </div>

                    {profile.city && profile.state && (
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {profile.city}, {profile.state}
                        </span>
                      </div>
                    )}

                    {profile.profession && (
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <Briefcase className="w-4 h-4" />
                        <span>{profile.profession}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Info Tags */}
                  <div className="flex flex-wrap gap-2">
                    {profile.spiritual_org &&
                      profile.spiritual_org.length > 0 &&
                      profile.spiritual_org.slice(0, 2).map((org: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm">
                          {org}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Right Bottom Corner */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-3 z-20">
              {/* Like Button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  handleLike()
                }}
                disabled={animatingButton !== null}
                className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-green-500 hover:bg-white transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={animatingButton === "like" ? { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Heart className="w-6 h-6" />
              </motion.button>

              {/* Super Like Button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  handleSuperlike()
                }}
                disabled={animatingButton !== null}
                className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-blue-500 hover:bg-white transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={animatingButton === "superlike" ? { scale: [1, 1.4, 1], y: [0, -10, 0] } : {}}
                transition={{ duration: 0.6 }}
              >
                <Star className="w-6 h-6" />
              </motion.button>

              {/* Dislike Button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDislike()
                }}
                disabled={animatingButton !== null}
                className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-red-500 hover:bg-white transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={animatingButton === "dislike" ? { scale: [1, 1.2, 1], rotate: [0, -15, 15, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <X className="w-6 h-6" />
              </motion.button>

              {showUndo && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUndoClick()
                  }}
                  disabled={animatingButton !== null}
                  className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-yellow-500 hover:bg-white transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={animatingButton === "undo" ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <RotateCcw className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Enhanced Swipe Indicators */}
          <motion.div
            className="absolute top-1/2 left-8 transform -translate-y-1/2 px-6 py-3 bg-red-500 text-white rounded-2xl font-bold text-xl shadow-2xl border-4 border-white"
            style={{
              opacity: nopeOpacity,
              rotate: nopeRotate,
            }}
          >
            NOPE
          </motion.div>

          <motion.div
            className="absolute top-1/2 right-8 transform -translate-y-1/2 px-6 py-3 bg-green-500 text-white rounded-2xl font-bold text-xl shadow-2xl border-4 border-white"
            style={{
              opacity: likeOpacity,
              rotate: likeRotate,
            }}
          >
            LIKE
          </motion.div>

          {/* Swipe Animation Overlays */}
          {swipeAnimation && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {swipeAnimation === "right" && (
                <motion.div
                  className="absolute inset-0 bg-green-500/20"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1.5, rotate: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Heart className="w-16 h-16 text-green-500" fill="currentColor" />
                  </motion.div>
                </motion.div>
              )}

              {swipeAnimation === "left" && (
                <motion.div
                  className="absolute inset-0 bg-red-500/20"
                  initial={{ x: "100%" }}
                  animate={{ x: "-100%" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    initial={{ scale: 0, rotate: 45 }}
                    animate={{ scale: 1.5, rotate: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <X className="w-16 h-16 text-red-500" />
                  </motion.div>
                </motion.div>
              )}

              {swipeAnimation === "up" && (
                <motion.div
                  className="absolute inset-0 bg-blue-500/20"
                  initial={{ y: "100%" }}
                  animate={{ y: "-100%" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    initial={{ scale: 0, y: 50 }}
                    animate={{ scale: 2, y: -100 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Star className="w-12 h-12 text-blue-500" fill="currentColor" />
                  </motion.div>

                  {/* Superlike trail effect */}
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute left-1/2 transform -translate-x-1/2"
                      style={{ top: `${60 + i * 15}%` }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                    >
                      <Star className="w-6 h-6 text-blue-400" fill="currentColor" />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Expanded Detail View */}
      {isExpanded && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-[100000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsExpanded(false)}
        >
          <motion.div
            className="w-full h-screen bg-white overflow-y-auto relative"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/20 rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors z-30"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="pb-32">
              {/* Optimized Swipeable Photo Gallery */}
              {profile.signedUrls && profile.signedUrls.length > 0 && (
                <div
                  className="relative h-[50vh] bg-gray-100 overflow-hidden"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <div
                    className="flex h-full transition-transform duration-300 ease-out"
                    style={{
                      transform: `translateX(-${currentDetailImageIndex * 100}%)`,
                    }}
                  >
                    {profile.signedUrls.map((photo: string, idx: number) => (
                      <div key={idx} className="w-full h-full relative flex-shrink-0">
                        <Image
                          src={photo || "/placeholder.svg"}
                          alt={`${profile.first_name} ${profile.last_name} - Photo ${idx + 1}`}
                          fill
                          className="object-cover"
                          priority={idx === 0}
                          sizes="(max-width: 768px) 100vw, 800px"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg"
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Touch/Swipe Areas for Navigation */}
                  <div className="absolute inset-0 flex">
                    <button
                      onClick={prevDetailImage}
                      disabled={currentDetailImageIndex === 0}
                      className="flex-1 opacity-0 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={nextDetailImage}
                      disabled={currentDetailImageIndex === profile.signedUrls.length - 1}
                      className="flex-1 opacity-0 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Better Photo Navigation Arrows */}
                  {profile.signedUrls.length > 1 && (
                    <>
                      <motion.button
                        onClick={prevDetailImage}
                        disabled={currentDetailImageIndex === 0}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white shadow-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed z-20"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronLeft className="w-7 h-7" />
                      </motion.button>
                      <motion.button
                        onClick={nextDetailImage}
                        disabled={currentDetailImageIndex === profile.signedUrls.length - 1}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white shadow-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed z-20"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronRight className="w-7 h-7" />
                      </motion.button>
                    </>
                  )}

                  {/* Photo Navigation Dots */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
                    {profile.signedUrls.map((_: any, idx: number) => (
                      <motion.button
                        key={idx}
                        onClick={() => setCurrentDetailImageIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          idx === currentDetailImageIndex ? "bg-white scale-125" : "bg-white/60"
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="p-6 space-y-8">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-orange-100">
                    <Image
                      src={getCurrentImage() || "/placeholder.svg"}
                      alt={`${profile.first_name} ${profile.last_name}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      sizes="80px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">
                      {profile.first_name} {profile.last_name}
                    </h3>
                    <p className="text-lg text-gray-600 mb-2">{calculateAge(profile.birthdate)} years old</p>
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {profile.city}, {profile.state}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Favorite Quote Section */}
                {profile.favorite_quote && (
                  <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6 border border-orange-100">
                    <div className="text-center">
                      <div className="text-4xl text-orange-400 mb-3">❝</div>
                      <blockquote className="text-lg text-gray-800 font-medium italic leading-relaxed mb-3">
                        {profile.favorite_quote}
                      </blockquote>
                      {profile.quote_author && (
                        <cite className="text-sm text-gray-600 font-medium">— {profile.quote_author}</cite>
                      )}
                    </div>
                  </div>
                )}

                {/* About Section */}
                {profile.about_me && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-orange-500" />
                      About Me
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-base">{profile.about_me}</p>
                  </div>
                )}

                {/* Essential Details Grid */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    Essential Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profile.profession && (
                      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Profession</p>
                          <p className="font-semibold text-gray-900">{profile.profession}</p>
                        </div>
                      </div>
                    )}

                    {profile.education && (
                      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                        <GraduationCap className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-green-600 font-medium">Education</p>
                          <p className="font-semibold text-gray-900">{profile.education}</p>
                        </div>
                      </div>
                    )}

                    {profile.diet && (
                      <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-purple-600 font-medium">Diet</p>
                          <p className="font-semibold text-gray-900">{profile.diet}</p>
                        </div>
                      </div>
                    )}

                    {profile.mother_tongue && (
                      <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl">
                        <MessageCircle className="w-5 h-5 text-pink-600" />
                        <div>
                          <p className="text-sm text-pink-600 font-medium">Mother Tongue</p>
                          <p className="font-semibold text-gray-900">{profile.mother_tongue}</p>
                        </div>
                      </div>
                    )}

                    {profile.height && (
                      <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl">
                        <Ruler className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-sm text-indigo-600 font-medium">Height</p>
                          <p className="font-semibold text-gray-900">{profile.height}</p>
                        </div>
                      </div>
                    )}

                    {profile.marital_status && (
                      <div className="flex items-center gap-3 p-4 bg-rose-50 rounded-xl">
                        <Heart className="w-5 h-5 text-rose-600" />
                        <div>
                          <p className="text-sm text-rose-600 font-medium">Marital Status</p>
                          <p className="font-semibold text-gray-900">{profile.marital_status}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Spiritual Journey */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-orange-500" />
                    Spiritual Journey
                  </h4>

                  {/* Daily Practices */}
                  {profile.daily_practices && profile.daily_practices.length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-800 mb-3">Daily Practices</h5>
                      <div className="flex flex-wrap gap-2">
                        {profile.daily_practices.map((practice: string, index: number) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium border border-orange-200"
                          >
                            {practice}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Spiritual Organizations */}
                  {profile.spiritual_org && profile.spiritual_org.length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-800 mb-3">Spiritual Organizations</h5>
                      <div className="flex flex-wrap gap-2">
                        {profile.spiritual_org.map((org: string, index: number) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium border border-purple-200"
                          >
                            {org}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Spiritual Goals */}
                  {profile.spiritual_goals && profile.spiritual_goals.length > 0 && (
                    <div>
                      <h5 className="text-lg font-semibold text-gray-800 mb-3">Spiritual Goals</h5>
                      <div className="flex flex-wrap gap-2">
                        {profile.spiritual_goals.map((goal: string, index: number) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
                          >
                            {goal}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Family & Background */}
                {(profile.family_type || profile.caste || profile.gotra || profile.family_values) && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-500" />
                      Family & Background
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profile.family_type && (
                        <div className="p-4 bg-green-50 rounded-xl">
                          <p className="text-sm text-green-600 font-medium mb-1">Family Type</p>
                          <p className="font-semibold text-gray-900">{profile.family_type}</p>
                        </div>
                      )}
                      {profile.caste && (
                        <div className="p-4 bg-blue-50 rounded-xl">
                          <p className="text-sm text-blue-600 font-medium mb-1">Caste</p>
                          <p className="font-semibold text-gray-900">{profile.caste}</p>
                        </div>
                      )}
                      {profile.gotra && (
                        <div className="p-4 bg-purple-50 rounded-xl">
                          <p className="text-sm text-purple-600 font-medium mb-1">Gotra</p>
                          <p className="font-semibold text-gray-900">{profile.gotra}</p>
                        </div>
                      )}
                      {profile.family_values && (
                        <div className="p-4 bg-orange-50 rounded-xl">
                          <p className="text-sm text-orange-600 font-medium mb-1">Family Values</p>
                          <p className="font-semibold text-gray-900">{profile.family_values}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Lifestyle & Habits */}
                {(profile.smoking || profile.drinking || profile.exercise_frequency || profile.sleep_schedule) && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-red-500" />
                      Lifestyle & Habits
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {profile.smoking && (
                        <div className="text-center p-3 bg-red-50 rounded-xl">
                          <p className="text-xs text-red-600 font-medium mb-1">Smoking</p>
                          <p className="text-sm font-semibold text-gray-900">{profile.smoking}</p>
                        </div>
                      )}
                      {profile.drinking && (
                        <div className="text-center p-3 bg-amber-50 rounded-xl">
                          <p className="text-xs text-amber-600 font-medium mb-1">Drinking</p>
                          <p className="text-sm font-semibold text-gray-900">{profile.drinking}</p>
                        </div>
                      )}
                      {profile.exercise_frequency && (
                        <div className="text-center p-3 bg-green-50 rounded-xl">
                          <p className="text-xs text-green-600 font-medium mb-1">Exercise</p>
                          <p className="text-sm font-semibold text-gray-900">{profile.exercise_frequency}</p>
                        </div>
                      )}
                      {profile.sleep_schedule && (
                        <div className="text-center p-3 bg-blue-50 rounded-xl">
                          <p className="text-xs text-blue-600 font-medium mb-1">Sleep</p>
                          <p className="text-sm font-semibold text-gray-900">{profile.sleep_schedule}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Interests & Hobbies */}
                {profile.interests && profile.interests.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Palette className="w-5 h-5 text-pink-500" />
                      Interests & Hobbies
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {profile.interests.map((interest: string, index: number) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 text-gray-800 rounded-full text-sm font-medium border border-pink-200"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Partner Preferences */}
                {(profile.partner_age_min ||
                  profile.partner_education ||
                  profile.partner_profession ||
                  profile.partner_location) && (
                  <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-500" />
                      Looking For
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profile.partner_age_min && profile.partner_age_max && (
                        <div className="p-4 bg-white/70 rounded-xl">
                          <p className="text-sm text-rose-600 font-medium mb-1">Age Range</p>
                          <p className="font-semibold text-gray-900">
                            {profile.partner_age_min} - {profile.partner_age_max} years
                          </p>
                        </div>
                      )}
                      {profile.partner_education && (
                        <div className="p-4 bg-white/70 rounded-xl">
                          <p className="text-sm text-rose-600 font-medium mb-1">Education</p>
                          <p className="font-semibold text-gray-900">{profile.partner_education}</p>
                        </div>
                      )}
                      {profile.partner_profession && (
                        <div className="p-4 bg-white/70 rounded-xl">
                          <p className="text-sm text-rose-600 font-medium mb-1">Profession</p>
                          <p className="font-semibold text-gray-900">{profile.partner_profession}</p>
                        </div>
                      )}
                      {profile.partner_location && (
                        <div className="p-4 bg-white/70 rounded-xl">
                          <p className="text-sm text-rose-600 font-medium mb-1">Location</p>
                          <p className="font-semibold text-gray-900">{profile.partner_location}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Same Circular Action Buttons as Card */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-30">
              {/* Like Button */}
              <motion.button
                onClick={() => {
                  setIsExpanded(false)
                  triggerSwipeAnimation("right")
                  handleLike()
                }}
                disabled={animatingButton !== null}
                className="w-14 h-14 bg-white shadow-xl rounded-full flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors disabled:opacity-50 border border-gray-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={animatingButton === "like" ? { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Heart className="w-7 h-7" />
              </motion.button>

              {/* Super Like Button */}
              <motion.button
                onClick={() => {
                  setIsExpanded(false)
                  triggerSwipeAnimation("up")
                  handleSuperlike()
                }}
                disabled={animatingButton !== null}
                className="w-14 h-14 bg-white shadow-xl rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 border border-gray-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={animatingButton === "superlike" ? { scale: [1, 1.4, 1], y: [0, -10, 0] } : {}}
                transition={{ duration: 0.6 }}
              >
                <Star className="w-7 h-7" />
              </motion.button>

              {/* Dislike Button */}
              <motion.button
                onClick={() => {
                  setIsExpanded(false)
                  triggerSwipeAnimation("left")
                  handleDislike()
                }}
                disabled={animatingButton !== null}
                className="w-14 h-14 bg-white shadow-xl rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 border border-gray-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={animatingButton === "dislike" ? { scale: [1, 1.2, 1], rotate: [0, -15, 15, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <X className="w-7 h-7" />
              </motion.button>

              {/* Undo Button */}
              {showUndo && (
                <motion.button
                  onClick={() => {
                    setIsExpanded(false)
                    handleUndoClick()
                  }}
                  disabled={animatingButton !== null}
                  className="w-14 h-14 bg-white shadow-xl rounded-full flex items-center justify-center text-yellow-500 hover:bg-yellow-50 transition-colors disabled:opacity-50 border border-gray-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={animatingButton === "undo" ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <RotateCcw className="w-7 h-7" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
