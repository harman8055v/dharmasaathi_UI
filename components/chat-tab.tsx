"use client"

import { useState } from "react"
import { MessageCircle, Send } from "lucide-react"
import type { User, Match, Chat } from "@/lib/types"

interface ChatTabProps {
  currentUser: User | null
  onUnreadUpdate: (count: number) => void
}

interface ChatConversation {
  match: Match
  lastMessage: Chat | null
  unreadCount: number
  otherUser: User
}

// Mock conversation data
const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    match: {
      id: "match1",
      user1_id: "550e8400-e29b-41d4-a716-446655440000",
      user2_id: "1",
      matched_at: new Date().toISOString(),
      user1: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "Demo User",
        age: 28,
        city: "Mumbai",
        photos: [],
        about_me: "",
        spiritual_highlights: [],
        spiritual_journey: "",
        partner_expectations: "",
        occupation: "",
        education: "",
        height: "",
        religion: "",
        mother_tongue: "",
        kyc_verified: false,
        is_premium: false,
        created_at: "",
      },
      user2: {
        id: "1",
        name: "Priya Sharma",
        age: 28,
        city: "Mumbai",
        photos: ["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400"],
        about_me: "",
        spiritual_highlights: [],
        spiritual_journey: "",
        partner_expectations: "",
        occupation: "",
        education: "",
        height: "",
        religion: "",
        mother_tongue: "",
        kyc_verified: false,
        is_premium: false,
        created_at: "",
      },
    },
    lastMessage: {
      id: "msg1",
      match_id: "match1",
      sender_id: "1",
      message: "Hi! Nice to connect with you 🙏",
      sent_at: new Date().toISOString(),
      read: false,
    },
    unreadCount: 2,
    otherUser: {
      id: "1",
      name: "Priya Sharma",
      age: 28,
      city: "Mumbai",
      photos: ["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400"],
      about_me: "",
      spiritual_highlights: [],
      spiritual_journey: "",
      partner_expectations: "",
      occupation: "",
      education: "",
      height: "",
      religion: "",
      mother_tongue: "",
      kyc_verified: false,
      is_premium: false,
      created_at: "",
    },
  },
]

export default function ChatTab({ currentUser, onUnreadUpdate }: ChatTabProps) {
  const [conversations, setConversations] = useState<ChatConversation[]>(MOCK_CONVERSATIONS)
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null)
  const [messages, setMessages] = useState<Chat[]>([
    {
      id: "msg1",
      match_id: "match1",
      sender_id: "1",
      message: "Hi! Nice to connect with you 🙏",
      sent_at: new Date(Date.now() - 3600000).toISOString(),
      read: true,
    },
    {
      id: "msg2",
      match_id: "match1",
      sender_id: "1",
      message: "I saw that you're also into meditation. That's wonderful!",
      sent_at: new Date().toISOString(),
      read: false,
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !currentUser) return

    const message: Chat = {
      id: `msg_${Date.now()}`,
      match_id: selectedConversation.match.id,
      sender_id: currentUser.id,
      message: newMessage.trim(),
      sent_at: new Date().toISOString(),
      read: true,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const handleConversationSelect = (conversation: ChatConversation) => {
    setSelectedConversation(conversation)
    // Mark as read
    onUnreadUpdate(0)
  }

  if (selectedConversation) {
    return (
      <div className="flex flex-col h-full bg-white">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 safe-area-pt">
          <div className="flex items-center">
            <button onClick={() => setSelectedConversation(null)} className="mr-3 text-orange-600">
              ←
            </button>
            <img
              src={
                selectedConversation.otherUser.photos?.[0] || "/placeholder.svg?height=40&width=40&query=profile photo"
              }
              alt={selectedConversation.otherUser.name}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div>
              <h2 className="font-semibold text-gray-900">{selectedConversation.otherUser.name}</h2>
              <p className="text-sm text-gray-600">Online</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === currentUser?.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${
                  message.sender_id === currentUser?.id ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <p>{message.message}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender_id === currentUser?.id ? "text-orange-100" : "text-gray-500"
                  }`}
                >
                  {new Date(message.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4 safe-area-pb">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-orange-600"
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-white border-b border-orange-100 p-4 safe-area-pt">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 text-sm mt-1">{conversations.length} conversations</p>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="bg-orange-100 p-6 rounded-full mb-4">
              <MessageCircle className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No conversations yet</h3>
            <p className="text-gray-600">Start matching to begin conversations!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {conversations.map((conversation) => (
              <button
                key={conversation.match.id}
                onClick={() => handleConversationSelect(conversation)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={
                        conversation.otherUser.photos?.[0] || "/placeholder.svg?height=50&width=50&query=profile photo"
                      }
                      alt={conversation.otherUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">{conversation.otherUser.name}</h3>
                      <span className="text-xs text-gray-500">
                        {conversation.lastMessage
                          ? new Date(conversation.lastMessage.sent_at).toLocaleDateString()
                          : new Date(conversation.match.matched_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage?.message || "You matched!"}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
