"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  X,
  Star,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  Sparkles,
  Lock,
} from "lucide-react";
import MobileNav from "@/components/dashboard/mobile-nav";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function MatchesPage() {
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
          <p className="text-gray-600">Loading matches...</p>
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
              Matches
            </h1>
            <p className="text-gray-600">
              Discover compatible souls on the same spiritual journey
            </p>
          </div>

          {isVerified ? (
            <div className="text-center text-gray-700 py-20">
              <p>
                No matches yet. Start swiping to find your spiritual partner!
              </p>
            </div>
          ) : (
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Matches Available After Verification
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Your profile is currently under review. Once verified,
                    you'll be able to see and connect with compatible spiritual
                    partners in our community.
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
                      onClick={() => router.push("/dashboard/settings")}
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      Complete Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isVerified && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Preview: What You'll See After Verification
              </h2>
              {[1, 2, 3].map((index) => (
                <Card key={index} className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 font-medium">
                        Available after verification
                      </p>
                    </div>
                  </div>
                  <CardContent className="p-6 filter blur-sm">
                    {/* content omitted for brevity */}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
