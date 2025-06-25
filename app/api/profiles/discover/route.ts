import { type NextRequest, NextResponse } from "next/server"
import { isDevelopmentMode } from "@/lib/dev-auth"
import { getSignedUrlsForPhotos, supabaseAdmin } from "@/lib/supabase-storage"

// Mock profiles for development
const MOCK_PROFILES = [
  {
    id: "mock-1",
    first_name: "Arjun",
    last_name: "Sharma",
    age: 28,
    city: "Delhi",
    state: "Delhi",
    profession: "Software Engineer",
    education: "B.Tech",
    about_me:
      "Seeking a spiritual partner who values meditation and yoga. Love exploring ancient wisdom and modern spirituality.",
    spiritual_org: ["Art of Living"],
    daily_practices: ["Meditation", "Yoga", "Pranayama"],
    user_photos: ["/abstract-spiritual-avatar-1.png"],
    compatibility_score: 92,
    diet: "Vegetarian",
    mother_tongue: "Hindi",
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
    about_me: "Devoted to Krishna consciousness and seeking a like-minded soul. Love kirtan and spiritual discussions.",
    spiritual_org: ["ISKCON"],
    daily_practices: ["Chanting", "Temple visits", "Reading scriptures"],
    user_photos: ["/abstract-spiritual-avatar-2.png"],
    compatibility_score: 88,
    diet: "Vegetarian",
    mother_tongue: "Gujarati",
  },
  {
    id: "mock-3",
    first_name: "Rahul",
    last_name: "Gupta",
    age: 30,
    city: "Bangalore",
    state: "Karnataka",
    profession: "Data Scientist",
    education: "M.Tech",
    about_me: "Following Sadhguru's teachings and inner engineering practices. Looking for a conscious partner.",
    spiritual_org: ["Isha Foundation"],
    daily_practices: ["Shambhavi Mahamudra", "Yoga"],
    user_photos: ["/abstract-spiritual-avatar-3.png"],
    compatibility_score: 85,
    diet: "Vegetarian",
    mother_tongue: "Hindi",
  },
  {
    id: "mock-4",
    first_name: "Ananya",
    last_name: "Singh",
    age: 27,
    city: "Mumbai",
    state: "Maharashtra",
    profession: "Marketing Manager",
    education: "MBA",
    about_me: "Practicing Raja Yoga meditation and seeking inner peace. Would love to find a spiritual companion.",
    spiritual_org: ["Brahma Kumaris"],
    daily_practices: ["Raja Yoga", "Meditation", "Self-reflection"],
    user_photos: ["/abstract-spiritual-avatar-4.png"],
    compatibility_score: 90,
    diet: "Vegetarian",
    mother_tongue: "Hindi",
  },
  {
    id: "mock-5",
    first_name: "Vikram",
    last_name: "Reddy",
    age: 29,
    city: "Hyderabad",
    state: "Telangana",
    profession: "Doctor",
    education: "MBBS",
    about_me: "Follower of Vedantic philosophy and regular temple visitor. Seeking a spiritually aligned life partner.",
    spiritual_org: ["Chinmaya Mission"],
    daily_practices: ["Vedic chanting", "Temple visits", "Satsang"],
    user_photos: ["/abstract-spiritual-avatar-1.png"],
    compatibility_score: 87,
    diet: "Vegetarian",
    mother_tongue: "Telugu",
  },
]

export async function GET(request: NextRequest) {
  try {
    // In development mode, return mock profiles
    if (isDevelopmentMode()) {
      return NextResponse.json({
        success: true,
        profiles: MOCK_PROFILES,
        hasMore: false,
        message: "Mock profiles loaded for development",
      })
    }

    const { data: profiles, error } = await supabaseAdmin
      .from("users")
      .select(
        "id, first_name, last_name, birthdate, city, state, profession, education, about_me, spiritual_org, daily_practices, user_photos, diet, mother_tongue"
      )
      .eq("verification_status", "verified")
      .limit(20)

    if (error) throw error

    const mapped = await Promise.all(
      (profiles || []).map(async (p) => ({
        ...p,
        user_photos: await getSignedUrlsForPhotos(p.user_photos || []),
      }))
    )

    return NextResponse.json({ success: true, profiles: mapped, hasMore: false })
  } catch (error) {
    console.error("Error fetching profiles:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch profiles" }, { status: 500 })
  }
}
