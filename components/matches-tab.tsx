"use client"

import { useState } from "react"
import { MessageCircle, Heart } from "lucide-react"
import type { User, Match } from "@/lib/types"

interface MatchesTabProps {
  currentUser: User | null
}

// Mock matches data
const MOCK_MATCHES: Match[] = [
  {
    id: "match1",
    user1_id: "550e8400-e29b-41d4-a716-446655440000",
    user2_id: "1",
    matched_at: new Date().toISOString(),
    user1: {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Demo User",
      age: 28,
      city: "Mumbai",
      photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"],
      about_me: "Demo user",
      spiritual_highlights: ["Meditation"],
      spiritual_journey: "",
      partner_expectations: "",
      occupation: "Software Engineer",
      education: "B.Tech",
      height: "5'8\"",
      religion: "Hindu",
      mother_tongue: "Hindi",
      kyc_verified: true,
      is_premium: false,
      created_at: new Date().toISOString(),
    },
    user2: {
      id: "1",
      name: "Priya Sharma",
      age: 28,
      city: "Mumbai",
      photos: ["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400"],
      about_me: "A spiritual seeker who finds peace in meditation and yoga.",
      spiritual_highlights: ["Daily Meditation", "Yoga Practitioner"],
      spiritual_journey: "My spiritual journey began in college.",
      partner_expectations: "Looking for someone who shares similar spiritual values.",
      occupation: "Software Engineer",
      education: "B.Tech Computer Science",
      height: "5'4\"",
      religion: "Hindu",
      mother_tongue: "Hindi",
      kyc_verified: true,
      is_premium: false,
      created_at: new Date().toISOString(),
    },
  },
]

export default function MatchesTab({ currentUser }: MatchesTabProps) {
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES)
  const [loading, setLoading] = useState(false)

  const getMatchedUser = (match: Match) => {
    return match.user1_id === currentUser?.id ? match.user2 : match.user1
  }

  const handleStartChat = (matchId: string) => {
    console.log("Start chat with match:", matchId)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-white border-b border-orange-100 p-4 safe-area-pt">
        <h1 className="text-2xl font-bold text-gray-900">Matches</h1>
        <p className="text-gray-600 text-sm mt-1">{matches.length} mutual connections</p>
      </div>

      {/* Matches List */}
      <div className="flex-1 overflow-y-auto">
        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="bg-orange-100 p-6 rounded-full mb-4">
              <Heart className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No matches yet</h3>
            <p className="text-gray-600">Keep swiping to find your spiritual connection!</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {matches.map((match) => {
              const matchedUser = getMatchedUser(match)
              return (
                <div key={match.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={matchedUser.photos?.[0] || "/placeholder.svg?height=60&width=60&query=profile photo"}
                        alt={matchedUser.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {matchedUser.name}, {matchedUser.age}
                      </h3>
                      <p className="text-gray-600 text-sm">{matchedUser.city}</p>

                      {/* Spiritual Highlights */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {matchedUser.spiritual_highlights?.slice(0, 2).map((highlight, index) => (
                          <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartChat(match.id)}
                      className="bg-orange-600 text-white p-3 rounded-full hover:bg-orange-700 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-3 text-xs text-gray-500 text-center">
                    Matched {new Date(match.matched_at).toLocaleDateString()}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
