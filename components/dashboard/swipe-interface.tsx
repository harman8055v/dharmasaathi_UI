"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, X, RotateCcw, Zap } from "lucide-react"
import ProfileCard from "./profile-card"
import ProfilePreviewDialog from "./profile-preview-dialog"

interface SwipeInterfaceProps {
  userProfile: any
}

// Mock data - replace with actual API calls
const mockProfiles = [
  {
    id: "1",
    first_name: "Priya",
    last_name: "Sharma",
    age: 28,
    city: "Mumbai",
    state: "Maharashtra",
    profession: "Software Engineer",
    education: "B.Tech Computer Science",
    diet: "Vegetarian",
    user_photos: ["/placeholder-user.jpg"],
    about_me:
      "Seeking a spiritual partner who values dharma and believes in the power of meditation and yoga. I love classical music and enjoy reading spiritual texts.",
    spiritual_org: ["Art of Living", "Isha Foundation"],
    daily_practices: ["Meditation", "Yoga", "Chanting"],
    temple_visit_freq: "Weekly",
    vanaprastha_interest: "open",
    artha_vs_moksha: "Balance",
    annual_income: "₹8-12 LPA",
    partner_expectations:
      "Looking for someone who shares similar spiritual values and is ready for a meaningful relationship based on dharma.",
  },
  {
    id: "2",
    first_name: "Ananya",
    last_name: "Patel",
    age: 26,
    city: "Ahmedabad",
    state: "Gujarat",
    profession: "Doctor",
    education: "MBBS",
    diet: "Vegetarian",
    user_photos: ["/placeholder-user.jpg"],
    about_me:
      "Devoted to serving others through medicine and spirituality. I believe in living a life of purpose and compassion.",
    spiritual_org: ["ISKCON"],
    daily_practices: ["Prayer", "Reading Bhagavad Gita"],
    temple_visit_freq: "Daily",
    vanaprastha_interest: "yes",
    artha_vs_moksha: "Moksha-focused",
    annual_income: "₹12-15 LPA",
    partner_expectations: "Seeking a life partner who is spiritually inclined and values service to humanity.",
  },
]

export default function SwipeInterface({ userProfile }: SwipeInterfaceProps) {
  const [profiles, setProfiles] = useState(mockProfiles)
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)
  const [selectedProfile, setSelectedProfile] = useState<any>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [likedProfiles, setLikedProfiles] = useState<string[]>([])
  const [passedProfiles, setPassedProfiles] = useState<string[]>([])

  const currentProfile = profiles[currentProfileIndex]

  const handleLike = (profileId: string) => {
    setLikedProfiles((prev) => [...prev, profileId])
    nextProfile()
    // TODO: Send like to backend
  }

  const handlePass = (profileId: string) => {
    setPassedProfiles((prev) => [...prev, profileId])
    nextProfile()
    // TODO: Send pass to backend
  }

  const nextProfile = () => {
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex((prev) => prev + 1)
    } else {
      // Load more profiles or show end message
      console.log("No more profiles")
    }
  }

  const handleViewProfile = (profile: any) => {
    setSelectedProfile(profile)
    setIsPreviewOpen(true)
  }

  const handleRewind = () => {
    if (currentProfileIndex > 0) {
      setCurrentProfileIndex((prev) => prev - 1)
      // Remove from liked/passed arrays if needed
      const prevProfile = profiles[currentProfileIndex - 1]
      setLikedProfiles((prev) => prev.filter((id) => id !== prevProfile.id))
      setPassedProfiles((prev) => prev.filter((id) => id !== prevProfile.id))
    }
  }

  if (!currentProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-12 h-12 text-orange-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No More Profiles</h3>
        <p className="text-gray-600 mb-6">Check back later for new matches!</p>
        <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
          <RotateCcw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Profile Card */}
      <div className="mb-6">
        <ProfileCard
          profile={currentProfile}
          onLike={handleLike}
          onPass={handlePass}
          onViewProfile={handleViewProfile}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <Button
          onClick={handleRewind}
          variant="outline"
          size="lg"
          className="w-14 h-14 rounded-full border-2 border-gray-300 hover:border-orange-300 hover:bg-orange-50"
          disabled={currentProfileIndex === 0}
        >
          <RotateCcw className="w-6 h-6 text-gray-600" />
        </Button>

        <Button
          onClick={() => handlePass(currentProfile.id)}
          variant="outline"
          size="lg"
          className="w-16 h-16 rounded-full border-2 border-gray-300 hover:border-red-300 hover:bg-red-50"
        >
          <X className="w-8 h-8 text-gray-600 hover:text-red-600" />
        </Button>

        <Button
          onClick={() => handleLike(currentProfile.id)}
          size="lg"
          className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
        >
          <Heart className="w-8 h-8 text-white" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-14 h-14 rounded-full border-2 border-purple-300 hover:border-purple-400 hover:bg-purple-50"
        >
          <Zap className="w-6 h-6 text-purple-600" />
        </Button>
      </div>

      {/* Stats */}
      <div className="text-center text-sm text-gray-500">
        {currentProfileIndex + 1} of {profiles.length} profiles
      </div>

      {/* Profile Preview Dialog */}
      <ProfilePreviewDialog
        profile={selectedProfile}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onLike={handleLike}
        onPass={handlePass}
      />
    </div>
  )
}
