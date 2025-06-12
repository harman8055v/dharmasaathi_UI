"use client"

import { useState } from "react"
import { X, Heart, Star, MapPin, Briefcase, GraduationCap, Ruler, Church, MessageCircle, Sparkles } from "lucide-react"
import type { User } from "@/lib/types"

interface FullProfileModalProps {
  user: User
  onClose: () => void
  onAction: (direction: "left" | "right" | "up") => void
  currentUser: User | null
}

export default function FullProfileModal({ user, onClose, onAction, currentUser }: FullProfileModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const handleAction = (direction: "left" | "right" | "up") => {
    onAction(direction)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-md h-full sm:h-auto sm:max-h-[90vh] sm:rounded-t-2xl overflow-hidden">
        {/* Header */}
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Photo Carousel */}
          <div className="relative h-96">
            <img
              src={user.photos[currentPhotoIndex] || "/placeholder.svg?height=400&width=300&query=profile photo"}
              alt={user.name}
              className="w-full h-full object-cover"
            />

            {/* Photo Indicators */}
            {user.photos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {user.photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentPhotoIndex ? "bg-white" : "bg-white bg-opacity-50"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* KYC Badge */}
            {user.kyc_verified && (
              <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                KYC Verified
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-24rem)] sm:max-h-96">
          {/* Basic Info */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {user.name}, {user.age}
              </h2>
              {user.is_premium && (
                <div className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Premium
                </div>
              )}
            </div>

            <div className="space-y-2 text-gray-600">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{user.city}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                <span>{user.occupation}</span>
              </div>
              <div className="flex items-center">
                <GraduationCap className="w-4 h-4 mr-2" />
                <span>{user.education}</span>
              </div>
              <div className="flex items-center">
                <Ruler className="w-4 h-4 mr-2" />
                <span>{user.height}</span>
              </div>
              <div className="flex items-center">
                <Church className="w-4 h-4 mr-2" />
                <span>
                  {user.religion}
                  {user.caste && `, ${user.caste}`}
                </span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                <span>{user.mother_tongue}</span>
              </div>
            </div>
          </div>

          {/* Spiritual Highlights */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Spiritual Highlights</h3>
            <div className="flex flex-wrap gap-2">
              {user.spiritual_highlights.map((highlight, index) => (
                <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          {/* About Me */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">About Me</h3>
            <p className="text-gray-700 leading-relaxed">{user.about_me}</p>
          </div>

          {/* Spiritual Journey */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Spiritual Journey</h3>
            <p className="text-gray-700 leading-relaxed">{user.spiritual_journey}</p>
          </div>

          {/* Partner Expectations */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Partner Expectations</h3>
            <p className="text-gray-700 leading-relaxed">{user.partner_expectations}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 border-t">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleAction("left")}
              className="bg-gray-100 hover:bg-gray-200 p-4 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={() => handleAction("up")}
              className="bg-blue-100 hover:bg-blue-200 p-4 rounded-full transition-colors"
            >
              <Star className="w-6 h-6 text-blue-600" />
            </button>
            <button
              onClick={() => handleAction("right")}
              className="bg-green-100 hover:bg-green-200 p-4 rounded-full transition-colors"
            >
              <Heart className="w-6 h-6 text-green-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
