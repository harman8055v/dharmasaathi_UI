"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  Search,
  Heart,
  MoreVertical,
  Lock,
  Sparkles,
} from "lucide-react";
import MobileNav from "@/components/dashboard/mobile-nav";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function MessagesPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/");
          return;
        }

        setUser(user);

        // Fetch user profile data
        const { data: profileData, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error);
          router.push("/onboarding");
          return;
        }

        // If user hasn't completed onboarding, redirect to onboarding
        if (!profileData?.onboarding_completed) {
          router.push("/onboarding");
          return;
        }

        setProfile(profileData);
        setLoading(false);
      } catch (error) {
        console.error("Error in auth check:", error);
        router.push("/");
      }
    }

    getUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }
  const isVerified = profile?.verification_status === "verified";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <MobileNav userProfile={profile} />

      {/* Main Content with proper spacing to avoid overlap */}
      <main className="pt-24 pb-40 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Messages 💬
            </h1>
            <p className="text-gray-600">Connect with your spiritual matches</p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 bg-white/80 backdrop-blur-sm border-orange-200"
              disabled
            />
          </div>

          {isVerified ? null : (
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Messages Available After Verification
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Once your profile is verified, you'll be able to send and
                    receive messages from your matches. Start meaningful
                    conversations with compatible spiritual partners.
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
          )}

          {/* Preview Conversations (Blurred) */}
          {!isVerified && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Preview: Your Future Conversations
              </h2>

              {/* Sample Conversation Cards */}
              {[
                {
                  name: "Spiritual Seeker",
                  lastMessage:
                    "I loved your thoughts on meditation practices...",
                  time: "2m ago",
                  unread: 2,
                  isHighlighted: true,
                },
                {
                  name: "Yoga Enthusiast",
                  lastMessage: "Would love to discuss our spiritual journeys",
                  time: "1h ago",
                  unread: 0,
                  isHighlighted: false,
                },
                {
                  name: "Mindful Soul",
                  lastMessage: "Thank you for the book recommendation!",
                  time: "3h ago",
                  unread: 1,
                  isHighlighted: false,
                },
              ].map((conversation, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <p className="text-gray-600 text-sm font-medium">
                        Available after verification
                      </p>
                    </div>
                  </div>
                  <CardContent
                    className={`p-4 filter blur-sm ${conversation.isHighlighted ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-l-yellow-400" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full flex items-center justify-center">
                          <span className="text-lg">🧘‍♀️</span>
                        </div>
                        {conversation.unread > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {conversation.unread}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {conversation.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            {conversation.isHighlighted && (
                              <Sparkles className="w-4 h-4 text-yellow-500" />
                            )}
                            <span className="text-xs text-gray-500">
                              {conversation.time}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="p-1">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isVerified && (
            <>
              {/* Features Preview */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-100 text-center">
                  <MessageCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Secure Messaging
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Private, encrypted conversations with your spiritual matches
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-100 text-center">
                  <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Message Highlights
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Make your messages stand out with premium highlighting
                    features
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-100 text-center">
                  <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Meaningful Connections
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Build deep, spiritual connections through thoughtful
                    conversations
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Message Tips */}
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">
              💡 Tips for Meaningful Conversations
            </h3>
            <ul className="space-y-2 text-sm text-purple-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>
                  Ask about their spiritual practices and what brings them peace
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>
                  Share your own journey and experiences authentically
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>
                  Discuss books, teachings, or practices that have influenced
                  you
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>
                  Be respectful of different spiritual paths and beliefs
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
