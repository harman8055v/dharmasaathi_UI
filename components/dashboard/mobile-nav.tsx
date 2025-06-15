"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  Heart,
  Home,
  User,
  Settings,
  MessageCircle,
  ShoppingBag,
  LogOut,
  Shield,
  Users,
  Gift,
  ChevronDown,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"

interface MobileNavProps {
  userProfile?: any
}

export default function MobileNav({ userProfile }: MobileNavProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [tappedItem, setTappedItem] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleNavItemClick = (href: string) => {
    setTappedItem(href)
    setTimeout(() => setTappedItem(null), 200)
    router.push(href)
  }

  const navItems = [
    {
      icon: Home,
      label: "Home",
      href: "/dashboard",
      active: pathname === "/dashboard",
      color: "text-blue-500",
    },
    {
      icon: Heart,
      label: "Matches",
      href: "/dashboard/matches",
      active: pathname === "/dashboard/matches",
      color: "text-pink-500",
    },
    {
      icon: MessageCircle,
      label: "Messages",
      href: "/dashboard/messages",
      active: pathname === "/dashboard/messages",
      color: "text-green-500",
    },
    {
      icon: ShoppingBag,
      label: "Store",
      href: "/dashboard/store",
      active: pathname === "/dashboard/store",
      color: "text-purple-500",
    },
    {
      icon: User,
      label: "Profile",
      href: "/dashboard/profile",
      active: pathname === "/dashboard/profile",
      color: "text-orange-500",
    },
  ]

  const settingsItems = [
    { icon: Settings, label: "Account Settings", href: "/dashboard/settings" },
    { icon: Heart, label: "Partner Preferences", href: "/dashboard/preferences" },
    { icon: Shield, label: "Privacy & Safety", href: "/dashboard/privacy" },
    { icon: Users, label: "Referrals", href: "/dashboard/referrals" },
    { icon: Gift, label: "Premium", href: "/dashboard/store" }, // Changed from premium to store since store exists
  ]

  const getUserPhoto = () => {
    if (userProfile?.user_photos && userProfile.user_photos.length > 0) {
      return userProfile.user_photos[0]
    }
    return "/placeholder-user.jpg"
  }

  return (
    <>
      {/* Top Header - Minimal */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-orange-50 to-pink-50 backdrop-blur-md border-b border-orange-100/50">
        <div className="flex items-center justify-between px-4 py-4">
          {/* Left Spacer */}
          <div className="w-12"></div>

          {/* Centered Logo */}
          <div className="flex items-center justify-center flex-1">
            <Image src="/logo.png" alt="DharmaSaathi" width={100} height={32} className="h-8 w-auto" />
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-white/50 transition-all duration-200 group"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gradient-to-r from-orange-400 to-pink-400 shadow-lg group-hover:shadow-xl transition-all duration-200">
                  <Image
                    src={getUserPhoto() || "/placeholder.svg"}
                    alt={userProfile?.first_name || "User"}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                {userProfile?.fast_track_verification && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isProfileMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsProfileMenuOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-md border border-orange-200 rounded-2xl shadow-2xl z-40 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  {/* User Info */}
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-pink-50 border-b border-orange-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-200">
                        <Image
                          src={getUserPhoto() || "/placeholder.svg"}
                          alt={userProfile?.first_name || "User"}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {userProfile?.first_name} {userProfile?.last_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {userProfile?.fast_track_verification ? "Fast Track Verification" : "Profile Under Review"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    {settingsItems.map((item, index) => (
                      <button
                        key={item.href}
                        onClick={() => {
                          router.push(item.href)
                          setIsProfileMenuOpen(false)
                        }}
                        className="flex items-center gap-3 w-full px-3 py-3 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all duration-200 group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-100 to-pink-100 flex items-center justify-center group-hover:from-orange-200 group-hover:to-pink-200 transition-all duration-200">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    ))}

                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-3 py-3 text-left text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-all duration-200">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Bottom Navigation - Floating with Subtle Animations */}
      <nav className="fixed bottom-6 left-4 right-4 z-50">
        <div className="bg-white/90 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-2xl shadow-orange-500/10">
          <div className="flex items-center justify-around px-2 py-4">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavItemClick(item.href)}
                className={`relative flex flex-col items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-200 ${
                  item.active
                    ? "bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 shadow-lg shadow-orange-500/20"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                } ${tappedItem === item.href ? "scale-95" : "scale-100"}`}
              >
                {/* Active Indicator */}
                {item.active && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full" />
                )}

                {/* Icon */}
                <div className="relative">
                  <item.icon className={`w-6 h-6 ${item.active ? item.color : ""} transition-all duration-200`} />

                  {/* Notification Badge (example for Messages) */}
                  {item.label === "Messages" && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">3</span>
                    </div>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-xs font-medium transition-all duration-200 ${
                    item.active ? "text-orange-600" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Safe Area */}
      <div className="h-24" />
    </>
  )
}
