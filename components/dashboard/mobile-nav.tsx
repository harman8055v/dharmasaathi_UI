"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Heart,
  Home,
  User,
  Settings,
  Search,
  MessageCircle,
  Bell,
  Menu,
  X,
  LogOut,
  Shield,
  Users,
  Gift,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

interface MobileNavProps {
  userProfile?: any
}

export default function MobileNav({ userProfile }: MobileNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: pathname === "/dashboard" },
    { icon: Search, label: "Discover", href: "/dashboard/discover", active: pathname === "/dashboard/discover" },
    { icon: MessageCircle, label: "Messages", href: "/dashboard/messages", active: pathname === "/dashboard/messages" },
    {
      icon: Bell,
      label: "Notifications",
      href: "/dashboard/notifications",
      active: pathname === "/dashboard/notifications",
    },
    { icon: User, label: "Profile", href: "/dashboard/profile", active: pathname === "/dashboard/profile" },
  ]

  const settingsItems = [
    { icon: Settings, label: "Account Settings", href: "/dashboard/settings" },
    { icon: Heart, label: "Partner Preferences", href: "/dashboard/preferences" },
    { icon: Shield, label: "Privacy & Safety", href: "/dashboard/privacy" },
    { icon: Users, label: "Referrals", href: "/dashboard/referrals" },
    { icon: Gift, label: "Premium", href: "/dashboard/premium" },
  ]

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-100">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Heart className="w-7 h-7 text-orange-500" />
            <h1 className="text-xl font-bold text-gray-900">DharmaSaathi</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{userProfile?.first_name}</p>
              <p className="text-xs text-gray-500">
                {userProfile?.fast_track_verification ? "Fast Track" : "In Review"}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/98 backdrop-blur-md border-b border-orange-100 shadow-lg">
            <div className="px-4 py-4">
              <div className="space-y-1 mb-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Settings</h3>
                {settingsItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => {
                      router.push(item.href)
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-orange-100">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                item.active ? "bg-orange-100 text-orange-600" : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? "text-orange-600" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}
