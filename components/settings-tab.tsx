"use client"

import { useState } from "react"
import { Shield, Bell, Crown, HelpCircle, LogOut, Eye, Lock, ChevronRight, CreditCard } from "lucide-react"
import { User } from "lucide-react"
import type { User as UserType } from "@/lib/types"

interface SettingsTabProps {
  currentUser: UserType | null
  onSignOut?: () => void
}

export default function SettingsTab({ currentUser, onSignOut }: SettingsTabProps) {
  const [notifications, setNotifications] = useState({
    matches: true,
    messages: true,
    likes: false,
    marketing: false,
  })

  const settingsSections = [
    {
      title: "Account",
      items: [
        {
          icon: User,
          label: "Account Settings",
          description: "Manage your account details",
          action: () => console.log("Account settings"),
        },
        {
          icon: Shield,
          label: "Privacy Settings",
          description: "Control who can see your profile",
          action: () => console.log("Privacy settings"),
        },
        {
          icon: Eye,
          label: "Incognito Mode",
          description: "Browse profiles privately",
          premium: true,
          action: () => console.log("Incognito mode"),
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: Bell,
          label: "Notifications",
          description: "Manage your notification preferences",
          action: () => console.log("Notifications"),
        },
        {
          icon: Lock,
          label: "Blocked Users",
          description: "Manage blocked profiles",
          action: () => console.log("Blocked users"),
        },
      ],
    },
    {
      title: "Premium",
      items: [
        {
          icon: Crown,
          label: "Upgrade to Premium",
          description: "Unlock unlimited likes and more features",
          highlight: !currentUser?.is_premium,
          action: () => console.log("Upgrade to premium"),
        },
        {
          icon: CreditCard,
          label: "Billing & Payments",
          description: "Manage your subscription",
          premium: true,
          action: () => console.log("Billing"),
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help & Support",
          description: "Get help with your account",
          action: () => console.log("Help & support"),
        },
        {
          icon: LogOut,
          label: "Sign Out",
          description: "Sign out of your account",
          danger: true,
          action: onSignOut || (() => console.log("Sign out")),
        },
      ],
    },
  ]

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 safe-area-pt">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        {currentUser && (
          <p className="text-gray-600 text-sm mt-1">{currentUser.is_premium ? "Premium Member" : "Free Member"}</p>
        )}
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto">
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 px-4 py-2">{section.title}</h2>

            <div className="bg-white mx-4 rounded-2xl overflow-hidden shadow-sm">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={item.action}
                  disabled={item.premium && !currentUser?.is_premium}
                  className={`w-full p-4 flex items-center justify-between transition-colors ${
                    itemIndex !== section.items.length - 1 ? "border-b border-gray-100" : ""
                  } ${item.danger ? "hover:bg-red-50" : item.highlight ? "hover:bg-orange-50" : "hover:bg-gray-50"} ${
                    item.premium && !currentUser?.is_premium ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        item.danger ? "bg-red-100" : item.highlight ? "bg-orange-100" : "bg-gray-100"
                      }`}
                    >
                      <item.icon
                        className={`w-5 h-5 ${
                          item.danger ? "text-red-600" : item.highlight ? "text-orange-600" : "text-gray-600"
                        }`}
                      />
                    </div>

                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium ${item.danger ? "text-red-600" : "text-gray-900"}`}>
                          {item.label}
                        </h3>
                        {item.premium && !currentUser?.is_premium && <Crown className="w-4 h-4 text-yellow-500" />}
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* App Info */}
        <div className="px-4 py-6 text-center text-gray-500">
          <p className="text-sm">DharmaSaathi v1.0.0</p>
          <p className="text-xs mt-1">Find your spiritual connection</p>
        </div>
      </div>
    </div>
  )
}
