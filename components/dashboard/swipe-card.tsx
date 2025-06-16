"use client"

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
} from "lucide-react"
import Image from "next/image"

interface SwipeCardProps {
  profile: any
  onSwipe: (direction: "left" | "right" | "superlike", profileId: string) => void
  onUndo: () => void
  showUndo?: boolean           // NEW — controls undo-button visibility
  isTop: boolean
  index: number
}

export default function SwipeCard({
  profile,
  onSwipe,
  onUndo,
  showUndo = false,            // default false
  isTop,
  index,
}: SwipeCardProps) {
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

  /* ------------------------ helpers & handlers ------------------------ */

  const calculateAge = (birthdate: string) => {
    if (!birthdate) return "N/A"
    const today = new Date()
    const birth = new Date(birthdate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 150
    const velocity = info.velocity.x
    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
      const direction = info.offset.x > 0 ? "right" : "left"
      onSwipe(direction, profile.id)
    }
  }

  const triggerButton = (kind: "like" | "dislike" | "superlike" | "undo") => {
    if (animatingButton) return
    setAnimatingButton(kind)
    if (kind === "undo") onUndo()
    else onSwipe(kind === "like" ? "right" : kind === "dislike" ? "left" : "superlike", profile.id)
    setTimeout(() => setAnimatingButton(null), kind === "undo" ? 300 : 500)
  }

  /* ----------------------- image helpers ----------------------- */

  const nextImage = () =>
    profile.user_photos?.length > 1 &&
    setCurrentImageIndex((p) => (p + 1) % profile.user_photos.length)

  const prevImage = () =>
    profile.user_photos?.length > 1 &&
    setCurrentImageIndex((p) => (p - 1 + profile.user_photos.length) % profile.user_photos.length)

  const nextDetailImage = () =>
    profile.user_photos?.length > 1 &&
    setCurrentDetailImageIndex((p) => (p + 1) % profile.user_photos.length)

  const prevDetailImage = () =>
    profile.user_photos?.length > 1 &&
    setCurrentDetailImageIndex((p) => (p - 1 + profile.user_photos.length) % profile.user_photos.length)

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX)

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX
    if (Math.abs(deltaX) > 50) deltaX > 0 ? prevDetailImage() : nextDetailImage()
    setTouchStartX(null)
  }

  const getCurrentImage = () =>
    profile.user_photos?.length ? profile.user_photos[currentImageIndex] : "/placeholder.svg"

  const getCurrentDetailImage = () =>
    profile.user_photos?.length ? profile.user_photos[currentDetailImageIndex] : "/placeholder.svg"

  /* ------------------------ motion values for NOPE / LIKE labels ------------------------ */

  const nopeOpacity = useTransform(x, [-150, -50], [1, 0])
  const nopeRotate = useTransform(x, [-150, -50], [-30, 0])
  const likeOpacity = useTransform(x, [50, 150], [0, 1])
  const likeRotate = useTransform(x, [50, 150], [0, 30])

  /* ------------------------------ collapsed stack card ------------------------------ */

  if (!isTop && !isExpanded) {
    return (
      <motion.div
        className="absolute inset-0 bg-white rounded-3xl shadow-lg border border-gray-200"
        style={{ scale: 1 - index * 0.05, y: index * 10, zIndex: 10 - index }}
        initial={{ scale: 1 - index * 0.05, y: index * 10 }}
        animate={{ scale: 1 - index * 0.05, y: index * 10 }}
      >
        <div className="relative w-full h-full rounded-3xl overflow-hidden">
          <Image src={getCurrentImage()} alt={`${profile.first_name} ${profile.last_name}`} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      </motion.div>
    )
  }

  /* ------------------------------ main swipe card ------------------------------ */

  return (
    <>
      <motion.div
        ref={cardRef}
        className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden cursor-pointer"
        style={{ x, y: isExpanded ? y : 0, rotate, opacity, zIndex: isTop ? 20 : 10 - index }}
        drag={false}
        whileTap={{ scale: isExpanded ? 1 : 0.95 }}
        layout
        onClick={() => setIsExpanded(true)}
      >
        {/* Image, overlays, info button etc. */}
        {/* … existing unchanged JSX up to action buttons … */}

        {/* ---------- action buttons ----------- */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-3 z-20">
          {/* like */}
          <motion.button
            onClick={(e) => { e.stopPropagation(); triggerButton("like") }}
            disabled={!!animatingButton}
            className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-green-500 hover:bg-white transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={animatingButton === "like" ? { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Heart className="w-6 h-6" />
          </motion.button>

          {/* superlike */}
          <motion.button
            onClick={(e) => { e.stopPropagation(); triggerButton("superlike") }}
            disabled={!!animatingButton}
            className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-blue-500 hover:bg-white transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={animatingButton === "superlike" ? { scale: [1, 1.4, 1], y: [0, -10, 0] } : {}}
            transition={{ duration: 0.6 }}
          >
            <Star className="w-6 h-6" />
          </motion.button>

          {/* dislike */}
          <motion.button
            onClick={(e) => { e.stopPropagation(); triggerButton("dislike") }}
            disabled={!!animatingButton}
            className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-red-500 hover:bg-white transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={animatingButton === "dislike" ? { scale: [1, 1.2, 1], rotate: [0, -15, 15, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <X className="w-6 h-6" />
          </motion.button>

          {/* undo – only if allowed */}
          {showUndo && (
            <motion.button
              onClick={(e) => { e.stopPropagation(); triggerButton("undo") }}
              disabled={!!animatingButton}
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

        {/* NOPE / LIKE badges etc. … */}
      </motion.div>

      {/* --------------------- expanded detail modal --------------------- */}
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
            {/* … existing gallery & profile details … */}

            {/* ---------- floating action buttons in modal ----------- */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-30">
              {/* like */}
              <motion.button
                onClick={() => { setIsExpanded(false); triggerButton("like") }}
                disabled={!!animatingButton}
                className="w-14 h-14 bg-white shadow-xl rounded-full flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors disabled:opacity-50 border border-gray-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={animatingButton === "like" ? { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Heart className="w-7 h-7" />
              </motion.button>

              {/* superlike */}
              <motion.button
                onClick={() => { setIsExpanded(false); triggerButton("superlike") }}
                disabled={!!animatingButton}
                className="w-14 h-14 bg-white shadow-xl rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 border border-gray-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={animatingButton === "superlike" ? { scale: [1, 1.4, 1], y: [0, -10, 0] } : {}}
                transition={{ duration: 0.6 }}
              >
                <Star className="w-7 h-7" />
              </motion.button>

              {/* dislike */}
              <motion.button
                onClick={() => { setIsExpanded(false); triggerButton("dislike") }}
                disabled={!!animatingButton}
                className="w-14 h-14 bg-white shadow-xl rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 border border-gray-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={animatingButton === "dislike" ? { scale: [1, 1.2, 1], rotate: [0, -15, 15, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <X className="w-7 h-7" />
              </motion.button>

              {/* undo (conditional) */}
              {showUndo && (
                <motion.button
                  onClick={() => { setIsExpanded(false); triggerButton("undo") }}
                  disabled={!!animatingButton}
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
