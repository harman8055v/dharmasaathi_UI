import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Discover API called")

    // Always return mock profiles with signed URLs for development
    const mockProfiles = [
      {
        id: "mock-1",
        first_name: "Arjun",
        last_name: "Sharma",
        age: 28,
        city: "Mumbai",
        state: "Maharashtra",
        profession: "Software Engineer",
        education: "B.Tech Computer Science",
        spiritual_organization: "Art of Living",
        about_me:
          "Seeking a life partner who shares my spiritual journey and values. I practice meditation daily and believe in living with compassion and mindfulness.",
        profile_photo_url: "user-photos/mock-1-profile.jpg",
        user_photos: ["user-photos/mock-1-1.jpg", "user-photos/mock-1-2.jpg", "user-photos/mock-1-3.jpg"],
        compatibility_score: 92,
      },
      {
        id: "mock-2",
        first_name: "Priya",
        last_name: "Patel",
        age: 26,
        city: "Ahmedabad",
        state: "Gujarat",
        profession: "Teacher",
        education: "M.Ed",
        spiritual_organization: "Isha Foundation",
        about_me:
          "Devoted to Sadhguru's teachings and inner engineering. Looking for someone who understands the importance of spiritual growth in relationships.",
        profile_photo_url: "user-photos/mock-2-profile.jpg",
        user_photos: ["user-photos/mock-2-1.jpg", "user-photos/mock-2-2.jpg"],
        compatibility_score: 88,
      },
      {
        id: "mock-3",
        first_name: "Vikram",
        last_name: "Singh",
        age: 30,
        city: "Delhi",
        state: "Delhi",
        profession: "Doctor",
        education: "MBBS, MD",
        spiritual_organization: "ISKCON",
        about_me:
          "Hare Krishna! Seeking a devotee partner to walk the path of bhakti together. Regular temple visits and kirtan are important to me.",
        profile_photo_url: "user-photos/mock-3-profile.jpg",
        user_photos: [
          "user-photos/mock-3-1.jpg",
          "user-photos/mock-3-2.jpg",
          "user-photos/mock-3-3.jpg",
          "user-photos/mock-3-4.jpg",
        ],
        compatibility_score: 85,
      },
      {
        id: "mock-4",
        first_name: "Ananya",
        last_name: "Reddy",
        age: 25,
        city: "Bangalore",
        state: "Karnataka",
        profession: "Marketing Manager",
        education: "MBA Marketing",
        spiritual_organization: "Brahma Kumaris",
        about_me:
          "Practicing Raja Yoga meditation and following the principles of purity and peace. Looking for a soul connection based on spiritual understanding.",
        profile_photo_url: "user-photos/mock-4-profile.jpg",
        user_photos: ["user-photos/mock-4-1.jpg", "user-photos/mock-4-2.jpg"],
        compatibility_score: 90,
      },
      {
        id: "mock-5",
        first_name: "Rohit",
        last_name: "Gupta",
        age: 32,
        city: "Pune",
        state: "Maharashtra",
        profession: "Business Analyst",
        education: "B.Com, CA",
        spiritual_organization: "Radha Soami",
        about_me:
          "Following the path of Sant Mat and seeking a partner who values meditation, vegetarianism, and spiritual discipline in daily life.",
        profile_photo_url: "user-photos/mock-5-profile.jpg",
        user_photos: ["user-photos/mock-5-1.jpg", "user-photos/mock-5-2.jpg", "user-photos/mock-5-3.jpg"],
        compatibility_score: 87,
      },
    ]

    // Generate signed URLs for mock profiles (these will fail gracefully since files don't exist)
    const enrichedProfiles = await Promise.all(
      mockProfiles.map(async (profile) => {
        // For development, we'll use placeholder images since the actual files don't exist
        const profileSignedUrl = `/placeholder.svg?height=400&width=300&text=${profile.first_name}`
        const gallerySignedUrls = profile.user_photos.map(
          (_, index) => `/placeholder.svg?height=300&width=300&text=Photo${index + 1}`,
        )

        return {
          ...profile,
          profileSignedUrl,
          gallerySignedUrls,
          // Keep original paths for reference
          originalProfilePath: profile.profile_photo_url,
          originalPhotoPaths: profile.user_photos,
        }
      }),
    )

    console.log("✅ Returning mock profiles with signed URLs:", enrichedProfiles.length)

    return NextResponse.json({
      profiles: enrichedProfiles,
      hasMore: false,
      total: enrichedProfiles.length,
    })
  } catch (error) {
    console.error("❌ Discover API error:", error)

    // Return basic mock profiles as fallback
    const fallbackProfiles = [
      {
        id: "fallback-1",
        first_name: "Test",
        last_name: "User",
        age: 28,
        city: "Mumbai",
        state: "Maharashtra",
        profession: "Engineer",
        education: "B.Tech",
        spiritual_organization: "Art of Living",
        about_me: "Test profile for development",
        profileSignedUrl: "/placeholder.svg?height=400&width=300&text=TestUser",
        gallerySignedUrls: ["/placeholder.svg?height=300&width=300&text=Photo1"],
        compatibility_score: 85,
      },
    ]

    return NextResponse.json({
      profiles: fallbackProfiles,
      hasMore: false,
      total: 1,
    })
  }
}
