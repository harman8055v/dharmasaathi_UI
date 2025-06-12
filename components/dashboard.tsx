"use client"

import { useState } from "react"
import { Home, Heart, MessageCircle, User, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import HomeFeed from "./home-feed"
import MatchesTab from "./matches-tab"
import ChatTab from "./chat-tab"
import ProfileTab from "./profile-tab"
import SettingsTab from "./settings-tab"
import type { User as UserType } from "@/lib/types"

type Tab = "home" | "matches" | "chat" | "profile" | "settings"

// Mock demo user data
const DEMO_USER: UserType = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Demo User",
  age: 28,
  city: "Mumbai",
  photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"],
  about_me:
    "This is a demo account for exploring DharmaSaathi. I'm interested in spiritual growth and finding meaningful connections.",
  spiritual_highlights: ["Meditation", "Yoga", "Vegetarian", "Temple Visits"],
  spiritual_journey:
    "My spiritual journey began with daily meditation practice. I believe in living with compassion and mindfulness.",
  partner_expectations: "Looking for someone who shares similar spiritual values and wants to grow together.",
  occupation: "Software Engineer",
  education: "B.Tech",
  height: "5'8\"",
  religion: "Hindu",
  caste: "Brahmin",
  mother_tongue: "Hindi",
  kyc_verified: true,
  is_premium: false,
  created_at: new Date().toISOString(),
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("home")
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [unreadCount, setUnreadCount] = useState(2)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [signingIn, setSigningIn] = useState(false)

  const handleDemoSignIn = async () => {
    setSigningIn(true)

    // Simulate loading time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setCurrentUser(DEMO_USER)
    setIsAuthenticated(true)
    setSigningIn(false)
  }

  const handleSignOut = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setActiveTab("home")
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "home":
        return <HomeFeed currentUser={currentUser} />
      case "matches":
        return <MatchesTab currentUser={currentUser} />
      case "chat":
        return <ChatTab currentUser={currentUser} onUnreadUpdate={setUnreadCount} />
      case "profile":
        return <ProfileTab currentUser={currentUser} onUserUpdate={setCurrentUser} />
      case "settings":
        return <SettingsTab currentUser={currentUser} onSignOut={handleSignOut} />
      default:
        return <HomeFeed currentUser={currentUser} />
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent mb-2">
            DharmaSaathi
          </h1>
          <p className="text-gray-600 mb-8">Find your spiritual life partner</p>

          <div className="space-y-4">
            <button
              onClick={handleDemoSignIn}
              disabled={signingIn}
              className="w-full bg-orange-600 text-white py-3 rounded-full font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {signingIn ? "Signing in..." : "Demo Sign In"}
            </button>
            <button className="w-full border border-orange-600 text-orange-600 py-3 rounded-full font-medium hover:bg-orange-50 transition-colors">
              Create Account
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "home" as Tab, icon: Home, label: "Home" },
    { id: "matches" as Tab, icon: Heart, label: "Matches" },
    { id: "chat" as Tab, icon: MessageCircle, label: "Chat", badge: unreadCount },
    { id: "profile" as Tab, icon: User, label: "Profile" },
    { id: "settings" as Tab, icon: Settings, label: "Settings" },
  ]

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">{renderActiveTab()}</div>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-orange-100 px-2 py-2 safe-area-pb">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 relative",
                activeTab === tab.id ? "text-orange-600 bg-orange-50" : "text-gray-500 hover:text-orange-500",
              )}
            >
              <tab.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
              {tab.badge && tab.badge > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {tab.badge > 9 ? "9+" : tab.badge}
                </div>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
