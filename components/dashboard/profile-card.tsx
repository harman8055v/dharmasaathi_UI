"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, X, MapPin, Calendar, Briefcase, GraduationCap, Utensils, Star, Info } from "lucide-react"

interface ProfileCardProps {
  profile: {
    id: string
    first_name: string
    last_name: string
    age: number
    city: string
    state: string
    profession: string
    education: string
    diet: string
    user_photos: string[]
    about_me: string
    spiritual_org: string[]
    daily_practices: string[]
    temple_visit_freq: string
    vanaprastha_interest: string
    artha_vs_moksha: string
  }
  onLike: (profileId: string) => void
  onPass: (profileId: string) => void
  onViewProfile: (profile: any) => void
}

export default function ProfileCard({ profile, onLike, onPass, onViewProfile }: ProfileCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    if (profile.user_photos.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % profile.user_photos.length)
    }
  }

  const prevImage = () => {
    if (profile.user_photos.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + profile.user_photos.length) % profile.user_photos.length)
    }
  }

  return (
    <Card className="w-full max-w-sm mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
      <div className="relative">
        {/* Profile Image */}
        <div className="relative h-96 bg-gradient-to-br from-orange-100 to-pink-100">
          {profile.user_photos.length > 0 ? (
            <>
              <img
                src={profile.user_photos[currentImageIndex] || "/placeholder.svg"}
                alt={`${profile.first_name}'s photo`}
                className="w-full h-full object-cover"
              />
              {/* Image Navigation */}
              {profile.user_photos.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                  >
                    ›
                  </button>
                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {profile.user_photos.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-orange-400">
              {profile.first_name[0]}
              {profile.last_name[0]}
            </div>
          )}

          {/* Info Button */}
          <button
            onClick={() => onViewProfile(profile)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <Info className="w-5 h-5 text-orange-600" />
          </button>
        </div>

        {/* Profile Info */}
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {profile.first_name} {profile.last_name}
            </h3>
            <div className="flex items-center gap-4 text-gray-600 text-sm mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{profile.age} years</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>
                  {profile.city}, {profile.state}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {profile.profession && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase className="w-4 h-4 text-orange-500" />
                <span className="truncate">{profile.profession}</span>
              </div>
            )}
            {profile.education && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <GraduationCap className="w-4 h-4 text-orange-500" />
                <span className="truncate">{profile.education}</span>
              </div>
            )}
            {profile.diet && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Utensils className="w-4 h-4 text-orange-500" />
                <span className="truncate">{profile.diet}</span>
              </div>
            )}
            {profile.spiritual_org.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-orange-500" />
                <span className="truncate">{profile.spiritual_org[0]}</span>
              </div>
            )}
          </div>

          {/* About Me Preview */}
          {profile.about_me && (
            <div className="mb-6">
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{profile.about_me}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => onPass(profile.id)}
              variant="outline"
              size="lg"
              className="flex-1 border-2 border-gray-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <X className="w-5 h-5 mr-2" />
              Pass
            </Button>
            <Button
              onClick={() => onLike(profile.id)}
              size="lg"
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
            >
              <Heart className="w-5 h-5 mr-2" />
              Like
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
