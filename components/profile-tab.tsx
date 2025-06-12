"use client"

import { useState } from "react"
import { Camera, Edit, Sparkles, Crown } from "lucide-react"
import type { User } from "@/lib/types"

interface ProfileTabProps {
  currentUser: User | null
  onUserUpdate: (user: User) => void
}

export default function ProfileTab({ currentUser, onUserUpdate }: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  const profileCompleteness = Math.round(
    (((currentUser.photos.length > 0 ? 1 : 0) +
      (currentUser.about_me ? 1 : 0) +
      (currentUser.spiritual_journey ? 1 : 0) +
      (currentUser.partner_expectations ? 1 : 0) +
      (currentUser.spiritual_highlights.length > 0 ? 1 : 0)) /
      5) *
      100,
  )

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-green-600 text-white p-4 safe-area-pt">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <button onClick={() => setIsEditing(!isEditing)} className="bg-white bg-opacity-20 p-2 rounded-full">
            <Edit className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Completeness */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Profile Completeness</span>
            <span>{profileCompleteness}%</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${profileCompleteness}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Profile Photo Section */}
        <div className="relative -mt-16 mb-6">
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={currentUser.photos[0] || "/placeholder.svg?height=120&width=120&query=profile photo"}
                alt={currentUser.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-0 right-0 bg-orange-600 text-white p-2 rounded-full shadow-lg">
                <Camera className="w-4 h-4" />
              </button>

              {/* Badges */}
              <div className="absolute -top-2 -right-2 flex flex-col gap-1">
                {currentUser.kyc_verified && (
                  <div className="bg-green-500 text-white p-1 rounded-full">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                {currentUser.is_premium && (
                  <div className="bg-yellow-500 text-white p-1 rounded-full">
                    <Crown className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {currentUser.name}, {currentUser.age}
            </h2>
            <p className="text-gray-600">{currentUser.city}</p>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="px-4 space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Basic Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Occupation:</span>
                <span className="font-medium">{currentUser.occupation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Education:</span>
                <span className="font-medium">{currentUser.education}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Height:</span>
                <span className="font-medium">{currentUser.height}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Religion:</span>
                <span className="font-medium">{currentUser.religion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mother Tongue:</span>
                <span className="font-medium">{currentUser.mother_tongue}</span>
              </div>
            </div>
          </div>

          {/* Spiritual Highlights */}
          <div className="bg-orange-50 rounded-2xl p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Spiritual Highlights</h3>
            <div className="flex flex-wrap gap-2">
              {currentUser.spiritual_highlights.map((highlight, index) => (
                <span key={index} className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm">
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          {/* About Me */}
          <div className="bg-green-50 rounded-2xl p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">About Me</h3>
            <p className="text-gray-700 leading-relaxed">{currentUser.about_me}</p>
          </div>

          {/* Spiritual Journey */}
          <div className="bg-blue-50 rounded-2xl p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Spiritual Journey</h3>
            <p className="text-gray-700 leading-relaxed">{currentUser.spiritual_journey}</p>
          </div>

          {/* Partner Expectations */}
          <div className="bg-purple-50 rounded-2xl p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Partner Expectations</h3>
            <p className="text-gray-700 leading-relaxed">{currentUser.partner_expectations}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pb-6">
            <button className="w-full bg-orange-600 text-white py-3 rounded-full font-medium hover:bg-orange-700 transition-colors">
              Edit Profile
            </button>

            {!currentUser.kyc_verified && (
              <button className="w-full bg-green-600 text-white py-3 rounded-full font-medium hover:bg-green-700 transition-colors">
                Complete KYC Verification
              </button>
            )}

            {!currentUser.is_premium && (
              <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-full font-medium hover:from-yellow-600 hover:to-orange-600 transition-colors">
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
