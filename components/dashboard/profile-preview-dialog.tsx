"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Heart,
  X,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Utensils,
  Star,
  Church,
  NotebookIcon as Lotus,
  Target,
  DollarSign,
  MessageCircle,
} from "lucide-react"

interface ProfilePreviewDialogProps {
  profile: any
  isOpen: boolean
  onClose: () => void
  onLike: (profileId: string) => void
  onPass: (profileId: string) => void
  onMessage?: (profileId: string) => void
}

export default function ProfilePreviewDialog({
  profile,
  isOpen,
  onClose,
  onLike,
  onPass,
  onMessage,
}: ProfilePreviewDialogProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!profile) return null

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          <div className="relative">
            {/* Header Image */}
            <div className="relative h-80 bg-gradient-to-br from-orange-100 to-pink-100">
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
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                      >
                        ‹
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                      >
                        ›
                      </button>
                      {/* Image Counter */}
                      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {profile.user_photos.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl font-bold text-orange-400">
                  {profile.first_name[0]}
                  {profile.last_name[0]}
                </div>
              )}
            </div>

            {/* Profile Content */}
            <div className="p-6">
              {/* Basic Info */}
              <div className="mb-6">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-3xl font-bold text-gray-900">
                    {profile.first_name} {profile.last_name}
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <span>{profile.age} years old</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <span>
                      {profile.city}, {profile.state}
                    </span>
                  </div>
                  {profile.profession && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="w-5 h-5 text-orange-500" />
                      <span>{profile.profession}</span>
                    </div>
                  )}
                  {profile.education && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <GraduationCap className="w-5 h-5 text-orange-500" />
                      <span>{profile.education}</span>
                    </div>
                  )}
                  {profile.annual_income && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-5 h-5 text-orange-500" />
                      <span>{profile.annual_income}</span>
                    </div>
                  )}
                  {profile.diet && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Utensils className="w-5 h-5 text-orange-500" />
                      <span>{profile.diet}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* About Me */}
              {profile.about_me && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-orange-500" />
                    About Me
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-orange-50 p-4 rounded-lg">{profile.about_me}</p>
                </div>
              )}

              {/* Spiritual Details */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lotus className="w-5 h-5 text-orange-500" />
                  Spiritual Journey
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {profile.temple_visit_freq && (
                    <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Church className="w-4 h-4 text-orange-600" />
                        <span className="font-medium text-gray-800">Temple Visits</span>
                      </div>
                      <p className="text-gray-700">{profile.temple_visit_freq}</p>
                    </div>
                  )}

                  {profile.vanaprastha_interest && (
                    <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-orange-600" />
                        <span className="font-medium text-gray-800">Vanaprastha Interest</span>
                      </div>
                      <p className="text-gray-700 capitalize">{profile.vanaprastha_interest}</p>
                    </div>
                  )}

                  {profile.artha_vs_moksha && (
                    <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-4 rounded-lg md:col-span-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-orange-600" />
                        <span className="font-medium text-gray-800">Life Focus</span>
                      </div>
                      <p className="text-gray-700">{profile.artha_vs_moksha}</p>
                    </div>
                  )}
                </div>

                {/* Spiritual Organizations */}
                {profile.spiritual_org && profile.spiritual_org.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">Spiritual Organizations</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.spiritual_org.map((org: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                          {org}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Daily Practices */}
                {profile.daily_practices && profile.daily_practices.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">Daily Practices</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.daily_practices.map((practice: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-pink-100 text-pink-800">
                          {practice}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Partner Expectations */}
              {profile.partner_expectations && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-orange-500" />
                    What I'm Looking For
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-pink-50 p-4 rounded-lg">
                    {profile.partner_expectations}
                  </p>
                </div>
              )}

              {/* All Photos Grid */}
              {profile.user_photos && profile.user_photos.length > 1 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">All Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {profile.user_photos.map((photo: string, index: number) => (
                      <div
                        key={index}
                        className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ${
                          index === currentImageIndex ? "ring-2 ring-orange-500" : ""
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => {
                    onPass(profile.id)
                    onClose()
                  }}
                  variant="outline"
                  size="lg"
                  className="flex-1 border-2 border-gray-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="w-5 h-5 mr-2" />
                  Pass
                </Button>
                {onMessage && (
                  <Button
                    onClick={() => {
                      onMessage(profile.id)
                      onClose()
                    }}
                    variant="outline"
                    size="lg"
                    className="flex-1 border-2 border-orange-300 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Message
                  </Button>
                )}
                <Button
                  onClick={() => {
                    onLike(profile.id)
                    onClose()
                  }}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Like
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
