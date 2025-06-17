"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Search, Send, ArrowLeft, MoreVertical, UserX, Flag, Trash2, User } from "lucide-react"
import MobileNav from "@/components/dashboard/mobile-nav"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export default function MessagesPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportDetails, setReportDetails] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  // Mock conversations for verified users
  const mockConversations = [
    {
      id: "1",
      name: "Priya Sharma",
      lastMessage:
        "I loved your thoughts on meditation practices. Would love to discuss more about mindfulness techniques!",
      time: "2m ago",
      unread: 2,
      isOnline: true,
      avatar: "/abstract-spiritual-avatar-1.png",
      compatibility: 98,
    },
    {
      id: "2",
      name: "Ananya Reddy",
      lastMessage: "Thank you for sharing that beautiful quote. It really resonated with me 🙏",
      time: "1h ago",
      unread: 0,
      isOnline: false,
      avatar: "/abstract-spiritual-avatar-2.png",
      compatibility: 95,
    },
    {
      id: "3",
      name: "Kavya Nair",
      lastMessage: "Would love to discuss our spiritual journeys over coffee sometime",
      time: "3h ago",
      unread: 1,
      isOnline: true,
      avatar: "/abstract-spiritual-avatar-3.png",
      compatibility: 92,
    },
    {
      id: "4",
      name: "Meera Gupta",
      lastMessage: "Your profile is so inspiring! I'd love to connect and learn more about your practices",
      time: "1d ago",
      unread: 0,
      isOnline: false,
      avatar: "/abstract-spiritual-avatar-4.png",
      compatibility: 89,
    },
  ]

  // Mock messages for selected chat
  const mockMessages = [
    {
      id: "1",
      senderId: "other",
      message: "Hi! I saw your profile and was really impressed by your spiritual journey. I'd love to connect!",
      timestamp: "10:30 AM",
      isRead: true,
    },
    {
      id: "2",
      senderId: "me",
      message:
        "Thank you so much! I'm equally impressed by your dedication to yoga and meditation. It's wonderful to meet someone on a similar path.",
      timestamp: "10:35 AM",
      isRead: true,
    },
    {
      id: "3",
      senderId: "other",
      message:
        "I loved your thoughts on meditation practices. Would love to discuss more about mindfulness techniques!",
      timestamp: "10:40 AM",
      isRead: false,
    },
    {
      id: "4",
      senderId: "other",
      message: "Do you have any favorite meditation apps or techniques you'd recommend?",
      timestamp: "10:41 AM",
      isRead: false,
    },
  ]

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/")
          return
        }

        setUser(user)

        // Fetch user profile data
        const { data: profileData, error } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (error) {
          console.error("Error fetching user profile:", error)
          router.push("/onboarding")
          return
        }

        // If user hasn't completed onboarding, redirect to onboarding
        if (!profileData?.onboarding_completed) {
          router.push("/onboarding")
          return
        }

        setProfile(profileData)

        // Set conversations based on verification status
        const isVerifiedAccount =
          profileData?.verification_status === "verified" ||
          [
            "active",
            "sparsh",
            "sangam",
            "samarpan",
            "premium",
            "elite",
          ].includes(profileData?.account_status ?? "")

        if (isVerifiedAccount) {
          setConversations(mockConversations)
          setMessages(mockMessages)
        }

        // Check if there's a specific chat to open
        const chatId = searchParams.get("chat")
        if (chatId) {
          setSelectedChat(chatId)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error in auth check:", error)
        router.push("/")
      }
    }

    getUser()
  }, [router, searchParams])

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedConversation = conversations.find((conv) => conv.id === selectedChat)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        senderId: "me",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isRead: true,
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const handleBlockUser = async () => {
    if (!selectedConversation) return

    setActionLoading(true)
    try {
      const response = await fetch("/api/messages/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocked_user_id: selectedConversation.id }),
      })

      if (response.ok) {
        // Remove conversation from list and close chat
        setConversations((prev) => prev.filter((conv) => conv.id !== selectedConversation.id))
        setSelectedChat(null)
        alert("User has been blocked successfully")
      } else {
        alert("Failed to block user")
      }
    } catch (error) {
      console.error("Block error:", error)
      alert("Failed to block user")
    } finally {
      setActionLoading(false)
    }
  }

  const handleReportUser = async () => {
    if (!selectedConversation || !reportReason.trim()) return

    setActionLoading(true)
    try {
      const response = await fetch("/api/messages/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reported_user_id: selectedConversation.id,
          reason: reportReason,
          details: reportDetails,
        }),
      })

      if (response.ok) {
        setShowReportDialog(false)
        setReportReason("")
        setReportDetails("")
        alert("Report submitted successfully")
      } else {
        alert("Failed to submit report")
      }
    } catch (error) {
      console.error("Report error:", error)
      alert("Failed to submit report")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteChat = () => {
    if (!selectedConversation) return

    if (confirm(`Are you sure you want to delete your conversation with ${selectedConversation.name}?`)) {
      // Remove conversation from list and close chat
      setConversations((prev) => prev.filter((conv) => conv.id !== selectedConversation.id))
      setSelectedChat(null)
    }
  }

  const handleViewProfile = () => {
    if (!selectedConversation) return
    // For now, just show an alert. In a real app, this would navigate to the profile
    alert(`Viewing profile of ${selectedConversation.name}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    )
  }

  const isVerified =
    profile?.verification_status === "verified" ||
    ["active", "sparsh", "sangam", "samarpan", "premium", "elite"].includes(
      profile?.account_status ?? "",
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <MobileNav userProfile={profile} />

      <main className="pt-24 pb-40 px-4 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {isVerified ? (
            // Verified User - Full Messages Interface
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
              {/* Conversations List */}
              <div
                className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 flex flex-col ${selectedChat ? "hidden lg:flex" : ""}`}
              >
                <div className="p-6 border-b border-gray-100">
                  <h1 className="text-xl font-semibold text-gray-900 mb-1">Messages</h1>
                  <p className="text-sm text-gray-600 mb-4">Connect with your spiritual matches</p>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search conversations..."
                      className="pl-10 bg-gray-50 border-gray-200"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedChat(conversation.id)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedChat === conversation.id ? "bg-orange-50 border-l-4 border-l-orange-500" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={conversation.avatar || "/placeholder.svg"}
                            alt={conversation.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {conversation.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                          {conversation.unread > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                              {conversation.unread}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">{conversation.name}</h3>
                            <span className="text-xs text-gray-500">{conversation.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Interface */}
              <div
                className={`lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 flex flex-col ${!selectedChat ? "hidden lg:flex" : ""}`}
              >
                {selectedChat && selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedChat(null)} className="lg:hidden">
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <img
                          src={selectedConversation.avatar || "/placeholder.svg"}
                          alt={selectedConversation.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{selectedConversation.name}</h3>
                          <p className="text-sm text-gray-500">
                            {selectedConversation.isOnline ? "Online now" : "Last seen 2h ago"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" disabled={actionLoading}>
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={handleViewProfile}>
                              <User className="w-4 h-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setShowReportDialog(true)}>
                              <Flag className="w-4 h-4 mr-2" />
                              Report User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleBlockUser} className="text-red-600">
                              <UserX className="w-4 h-4 mr-2" />
                              Block User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleDeleteChat} className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Chat
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                              message.senderId === "me"
                                ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p
                              className={`text-xs mt-1 ${message.senderId === "me" ? "text-orange-100" : "text-gray-500"}`}
                            >
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Report Dialog */}
                    {showReportDialog && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                          <h3 className="text-lg font-semibold mb-4">Report User</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Reason for reporting</label>
                              <select
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                              >
                                <option value="">Select a reason</option>
                                <option value="inappropriate_content">Inappropriate Content</option>
                                <option value="harassment">Harassment</option>
                                <option value="spam">Spam</option>
                                <option value="fake_profile">Fake Profile</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Additional details (optional)</label>
                              <textarea
                                value={reportDetails}
                                onChange={(e) => setReportDetails(e.target.value)}
                                placeholder="Provide more details about the issue..."
                                className="w-full p-2 border border-gray-300 rounded-md h-20 resize-none"
                              />
                            </div>
                          </div>
                          <div className="flex gap-3 mt-6">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowReportDialog(false)
                                setReportReason("")
                                setReportDetails("")
                              }}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleReportUser}
                              disabled={!reportReason.trim() || actionLoading}
                              className="flex-1 bg-red-600 hover:bg-red-700"
                            >
                              {actionLoading ? "Submitting..." : "Submit Report"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a conversation</h3>
                      <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Non-verified User - Original content
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900 mb-1">Messages</h1>
                <p className="text-sm text-gray-600">Connect with your spiritual matches</p>
              </div>

              {/* Verification Required Notice */}
              <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Messages Available After Verification</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      Once your profile is verified, you'll be able to send and receive messages from your matches.
                      Start meaningful conversations with compatible spiritual partners.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => router.push("/dashboard")}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Check Verification Status
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push("/dashboard/matches")}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        View Matches
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
