"use client"

import { useState, useRef } from "react"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import { Heart, X, MapPin, Briefcase, Calendar, GraduationCap, Sparkles, Star, Info } from "lucide-react"
import Image from "next/image"

interface SwipeCardProps {
  profile: any
  onSwipe: (direction: "left" | "right", profileId: string) => void
  isTop: boolean
  index: number
}

export default function SwipeCard({ profile, onSwipe, isTop, index }: SwipeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [photoSwipeX, setPhotoSwipeX] = useState(0)
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

  const handleLike = () => {
    onSwipe("right", profile.id)
  }

  const handleDislike = () => {
    onSwipe("left", profile.id)
  }

  const nextImage = () => {
    if (profile.user_photos && profile.user_photos.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % profile.user_photos.length)
    }
  }

  const prevImage = () => {
    if (profile.user_photos && profile.user_photos.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + profile.user_photos.length) % profile.user_photos.length)
    }
  }

  const getCurrentImage = () => {
    if (profile.user_photos && profile.user_photos.length > 0) {
      return profile.user_photos[currentImageIndex]
    }
    return "/placeholder.svg"
  }

  const handlePhotoSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      nextImage()
    } else {
      prevImage()
    }
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
        className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
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
              priority
            />

            {/* Image Navigation */}
            {profile.user_photos && profile.user_photos.length > 1 && (
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
                  {profile.user_photos.map((_: any, idx: number) => (
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
                    {profile.diet && (
                      <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm">
                        {profile.diet}
                      </span>
                    )}
                    {profile.education && (
                      <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm">
                        {profile.education}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Right Bottom Corner */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-3 z-20">
              {/* View Profile Button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsExpanded(true)
                }}
                className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Info className="w-6 h-6" />
              </motion.button>

              {/* Dislike Button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDislike()
                }}
                className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-red-500 hover:bg-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Super Like Button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  // handleSuperLike()
                }}
                className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-blue-500 hover:bg-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Star className="w-6 h-6" />
              </motion.button>

              {/* Like Button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  handleLike()
                }}
                className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-green-500 hover:bg-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Swipe Indicators */}
          <motion.div
            className="absolute top-1/2 left-8 transform -translate-y-1/2 px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-lg"
            style={{
              opacity: nopeOpacity,
              rotate: nopeRotate,
            }}
          >
            NOPE
          </motion.div>

          <motion.div
            className="absolute top-1/2 right-8 transform -translate-y-1/2 px-4 py-2 bg-green-500 text-white rounded-lg font-bold text-lg"
            style={{
              opacity: likeOpacity,
              rotate: likeRotate,
            }}
          >
            LIKE
          </motion.div>
        </div>
      </motion.div>

      {/* Expanded Detail View */}
      {isExpanded && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-[100000] flex items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsExpanded(false)}
        >
          <motion.div
            className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto relative"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors z-20"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>

            <div className="p-6 pb-20">
              {/* Handle */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />

              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden">
                  <Image
                    src={getCurrentImage() || "/placeholder.svg"}
                    alt={`${profile.first_name} ${profile.last_name}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {profile.first_name} {profile.last_name}
                  </h3>
                  <p className="text-gray-600">{calculateAge(profile.birthdate)} years old</p>
                </div>
              </div>

              {/* Swipeable Photo Gallery */}
              {profile.user_photos && profile.user_photos.length > 0 && (
                <div className="relative mb-6">
                  <motion.div
                    className="flex"
                    drag="x"
                    dragConstraints={{ left: -(profile.user_photos.length - 1) * 300, right: 0 }}
                    onDragEnd={(event, info) => {
                      const threshold = 50
                      if (info.offset.x > threshold) {
                        prevImage()
                      } else if (info.offset.x < -threshold) {
                        nextImage()
                      }
                    }}
                  >
                    {profile.user_photos.map((photo: string, idx: number) => (
                      <motion.div
                        key={idx}
                        className="min-w-full relative"
                        animate={{ x: -currentImageIndex * 100 + "%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <Image
                          src={photo || "/placeholder.svg"}
                          alt={`${profile.first_name} ${profile.last_name} - Photo ${idx + 1}`}
                          width={500}
                          height={400}
                          className="w-full rounded-lg object-cover aspect-[5/4]"
                        />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Photo Navigation Dots */}
                  <div className="flex justify-center gap-2 mt-4">
                    {profile.user_photos.map((_: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          idx === currentImageIndex ? "bg-orange-500" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* About Section */}
              {profile.about_me && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">About Me</h4>
                  <p className="text-gray-700 leading-relaxed">{profile.about_me}</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {profile.city && profile.state && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">
                        {profile.city}, {profile.state}
                      </p>
                    </div>
                  </div>
                )}

                {profile.profession && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Briefcase className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Profession</p>
                      <p className="font-medium">{profile.profession}</p>
                    </div>
                  </div>
                )}

                {profile.education && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Education</p>
                      <p className="font-medium">{profile.education}</p>
                    </div>
                  </div>
                )}

                {profile.diet && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Sparkles className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Diet</p>
                      <p className="font-medium">{profile.diet}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Spiritual Practices */}
              {profile.daily_practices && profile.daily_practices.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Daily Practices</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.daily_practices.map((practice: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                        {practice}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Spiritual Organizations */}
              {profile.spiritual_org && profile.spiritual_org.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Spiritual Organizations</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.spiritual_org.map((org: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {org}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
