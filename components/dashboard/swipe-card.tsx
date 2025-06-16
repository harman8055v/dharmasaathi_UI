"use client"

import { useState, useRef } from "react"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import { Heart, X, MapPin, Briefcase, Calendar, GraduationCap, Sparkles, ChevronDown, Star, User } from "lucide-react"
import Image from "next/image"

interface SwipeCardProps {
  profile: any
  onSwipe: (direction: "left" | "right" | "superlike", profileId: string) => void
  isTop: boolean
  index: number
}

export default function SwipeCard({ profile, onSwipe, isTop, index }: SwipeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
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

  const handleSuperlike = () => {
    onSwipe("superlike", profile.id)
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
        className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-gray-200 cursor-grab active:cursor-grabbing overflow-hidden"
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
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors z-10"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
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
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-end justify-between">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">
                    {profile.first_name} {profile.last_name}
                  </h2>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-white/90">
                      <Calendar className="w-4 h-4" />
                      <span>{calculateAge(profile.birthdate)} years old</span>
                    </div>

                    {profile.city && profile.state && (
                      <div className="flex items-center gap-2 text-white/90">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {profile.city}, {profile.state}
                        </span>
                      </div>
                    )}

                    {profile.profession && (
                      <div className="flex items-center gap-2 text-white/90">
                        <Briefcase className="w-4 h-4" />
                        <span>{profile.profession}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Info Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.diet && (
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                        {profile.diet}
                      </span>
                    )}
                    {profile.education && (
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                        {profile.education}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expand Button */}
                <button
                  onClick={() => setIsExpanded(true)}
                  className="ml-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
              </div>
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
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsExpanded(false)}
        >
          <motion.div
            className="w-full bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Photo Carousel */}
              <div className="relative h-80 bg-gray-100">
                <Image
                  src={getCurrentImage() || "/placeholder.svg"}
                  alt={`${profile.first_name} ${profile.last_name}`}
                  fill
                  className="object-cover"
                />

                {/* Photo Navigation */}
                {profile.user_photos && profile.user_photos.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors z-10"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors z-10"
                    >
                      →
                    </button>

                    {/* Photo Indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {profile.user_photos.map((_: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            idx === currentImageIndex ? "bg-white" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="p-6">
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

                {/* About Section */}
                {profile.about_me && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">About Me</h4>
                    <p className="text-gray-700 leading-relaxed">{profile.about_me}</p>
                  </div>
                )}

                {/* Basic Details Grid */}
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

                  {profile.mother_tongue && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Mother Tongue</p>
                        <p className="font-medium">{profile.mother_tongue}</p>
                      </div>
                    </div>
                  )}

                  {profile.gender && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium">{profile.gender}</p>
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

                {/* All Photos Grid */}
                {profile.user_photos && profile.user_photos.length > 1 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Photos</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {profile.user_photos.map((photo: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className="relative aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                        >
                          <Image
                            src={photo || "/placeholder.svg"}
                            alt={`Photo ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          {index === currentImageIndex && (
                            <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 rounded-lg" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    onClick={() => {
                      setIsExpanded(false)
                      handleDislike()
                    }}
                    className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <X className="w-5 h-5" />
                    Pass
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      setIsExpanded(false)
                      handleSuperlike()
                    }}
                    className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Star className="w-5 h-5" />
                    Super Like
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      setIsExpanded(false)
                      handleLike()
                    }}
                    className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-colors flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Heart className="w-5 h-5" />
                    Like
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
