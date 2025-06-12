"use client"

import { useState } from "react"
import { RefreshCw, Crown } from "lucide-react"
import SwipeableCard from "./swipeable-card"
import FullProfileModal from "./full-profile-modal"
import type { User, DailyLimits } from "@/lib/types"

interface HomeFeedProps {
  currentUser: User | null
}

// Mock users data for demo
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Priya Sharma",
    age: 28,
    city: "Mumbai",
    photos: ["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400"],
    about_me:
      "A spiritual seeker who finds peace in meditation and yoga. I believe in living a life of compassion and mindfulness.",
    spiritual_highlights: ["Daily Meditation", "Yoga Practitioner", "Vegetarian", "Temple Volunteer"],
    spiritual_journey:
      "My spiritual journey began in college when I started practicing yoga. Over the years, meditation has become my anchor.",
    partner_expectations:
      "Looking for someone who shares similar spiritual values and believes in growing together on this beautiful journey of life.",
    occupation: "Software Engineer",
    education: "B.Tech Computer Science",
    height: "5'4\"",
    religion: "Hindu",
    mother_tongue: "Hindi",
    kyc_verified: true,
    is_premium: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Arjun Patel",
    age: 32,
    city: "Ahmedabad",
    photos: ["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"],
    about_me: "Devoted to dharma and seeking a life partner who values spiritual growth and family traditions.",
    spiritual_highlights: ["Bhagavad Gita Study", "Morning Prayers", "Ayurveda Enthusiast", "Classical Music"],
    spiritual_journey:
      "Raised in a traditional family, I have always been drawn to our ancient wisdom. I practice daily meditation.",
    partner_expectations:
      "Seeking a partner who values our cultural heritage and is interested in building a spiritually grounded family.",
    occupation: "Business Owner",
    education: "MBA",
    height: "5'10\"",
    religion: "Hindu",
    caste: "Patel",
    mother_tongue: "Gujarati",
    kyc_verified: true,
    is_premium: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Ananya Reddy",
    age: 26,
    city: "Hyderabad",
    photos: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"],
    about_me:
      "Believer in the power of positive thinking and spiritual healing. Love spending time in nature and practicing mindfulness.",
    spiritual_highlights: ["Reiki Healer", "Nature Lover", "Mindfulness", "Organic Living"],
    spiritual_journey:
      "My spiritual path led me to become a certified Reiki healer. I believe in the interconnectedness of all beings.",
    partner_expectations:
      "Looking for a soulmate who appreciates holistic living and wants to create a harmonious life together.",
    occupation: "Wellness Coach",
    education: "M.Sc Psychology",
    height: "5'6\"",
    religion: "Hindu",
    mother_tongue: "Telugu",
    kyc_verified: false,
    is_premium: false,
    created_at: new Date().toISOString(),
  },
]

export default function HomeFeed({ currentUser }: HomeFeedProps) {
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [dailyLimits, setDailyLimits] = useState<DailyLimits>({
    likes_used: 3,
    superlikes_used: 0,
    max_likes: 10,
    max_superlikes: 1,
    date: new Date().toISOString().split("T")[0],
  })
  const [loading, setLoading] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)

  const handleSwipe = (direction: "left" | "right" | "up") => {
    if (!currentUser || currentIndex >= users.length) return

    let actionType: "like" | "dislike" | "superlike"

    if (direction === "left") {
      actionType = "dislike"
    } else if (direction === "right") {
      actionType = "like"
      if (dailyLimits.likes_used >= dailyLimits.max_likes) {
        setShowUpgrade(true)
        return
      }
      setDailyLimits((prev) => ({ ...prev, likes_used: prev.likes_used + 1 }))
    } else {
      actionType = "superlike"
      if (dailyLimits.superlikes_used >= dailyLimits.max_superlikes) {
        setShowUpgrade(true)
        return
      }
      setDailyLimits((prev) => ({ ...prev, superlikes_used: prev.superlikes_used + 1 }))
    }

    setCurrentIndex((prev) => prev + 1)
  }

  const currentUser_card = users[currentIndex]
  const nextUser = users[currentIndex + 1]

  if (!currentUser_card) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="bg-orange-100 p-6 rounded-full mb-4">
          <RefreshCw className="w-8 h-8 text-orange-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No more profiles</h3>
        <p className="text-gray-600 mb-4">Check back later for new matches!</p>
        <button
          onClick={() => {
            setCurrentIndex(0)
            setUsers(MOCK_USERS)
          }}
          className="bg-orange-600 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-700 transition-colors"
        >
          Refresh
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-orange-100 p-4 safe-area-pt">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
            DharmaSaathi
          </h1>
          <div className="text-sm text-gray-600">
            {currentIndex + 1} of{" "}
            {Math.min(users.length, dailyLimits.max_likes - dailyLimits.likes_used + currentIndex + 1)}
          </div>
        </div>

        {/* Daily Limits Progress */}
        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Daily Likes</span>
            <span>
              {dailyLimits.likes_used}/{dailyLimits.max_likes}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-orange-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${(dailyLimits.likes_used / dailyLimits.max_likes) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Stack */}
      <div className="flex-1 relative">
        {nextUser && (
          <SwipeableCard
            key={nextUser.id}
            user={nextUser}
            onSwipe={() => {}}
            onViewProfile={() => {}}
            isTopCard={false}
          />
        )}
        <SwipeableCard
          key={currentUser_card.id}
          user={currentUser_card}
          onSwipe={handleSwipe}
          onViewProfile={() => setSelectedUser(currentUser_card)}
          isTopCard={true}
        />
      </div>

      {/* Full Profile Modal */}
      {selectedUser && (
        <FullProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onAction={handleSwipe}
          currentUser={currentUser}
        />
      )}

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
              <p className="text-gray-600 mb-4">
                You've reached your daily limit. Upgrade to get unlimited likes and more features!
              </p>
              <div className="space-y-2">
                <button className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white py-3 rounded-full font-medium">
                  Upgrade Now
                </button>
                <button onClick={() => setShowUpgrade(false)} className="w-full text-gray-600 py-2">
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
