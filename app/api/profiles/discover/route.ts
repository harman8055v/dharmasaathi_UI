import { type NextRequest, NextResponse } from "next/server"

// Mock profiles for development - always available
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
    verification_status: "verified",
    account_status: "sangam",
    created_at: "2024-01-15T10:00:00Z",
    birthdate: "1995-03-15",
    gender: "Female",
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
    verification_status: "verified",
    account_status: "sparsh",
    created_at: "2024-01-14T10:00:00Z",
    birthdate: "1997-07-22",
    gender: "Female",
  },
  {
    id: "mock-3",
    first_name: "Kavya",
    last_name: "Nair",
    age: 29,
    city: "Kochi",
    state: "Kerala",
    profession: "Yoga Instructor",
    education: "B.A. Philosophy",
    about_me:
      "Dedicated to spreading the ancient wisdom of yoga and meditation. Seeking a spiritual companion for life's beautiful journey.",
    spiritual_org: ["Sivananda Yoga", "Ramana Maharshi Foundation"],
    daily_practices: ["Yoga", "Meditation", "Kirtan"],
    user_photos: ["/abstract-spiritual-avatar-3.png"],
    compatibility_score: 89,
    diet: "Vegetarian",
    mother_tongue: "Malayalam",
    verification_status: "verified",
    account_status: "samarpan",
    created_at: "2024-01-13T10:00:00Z",
    birthdate: "1994-11-08",
    gender: "Female",
  },
  {
    id: "mock-4",
    first_name: "Meera",
    last_name: "Gupta",
    age: 27,
    city: "Mumbai",
    state: "Maharashtra",
    profession: "Counselor",
    education: "M.A. Psychology",
    about_me:
      "Helping people find inner peace through counseling and spiritual guidance. Looking for a soulmate who understands the deeper meaning of life.",
    spiritual_org: ["Brahma Kumaris", "Heartfulness"],
    daily_practices: ["Meditation", "Counseling", "Prayer"],
    user_photos: ["/abstract-spiritual-avatar-4.png"],
    compatibility_score: 90,
    diet: "Vegetarian",
    mother_tongue: "Hindi",
    verification_status: "verified",
    account_status: "drishti",
    created_at: "2024-01-12T10:00:00Z",
    birthdate: "1996-05-30",
    gender: "Female",
  },
  {
    id: "mock-5",
    first_name: "Riya",
    last_name: "Reddy",
    age: 25,
    city: "Hyderabad",
    state: "Telangana",
    profession: "Artist",
    education: "B.F.A",
    about_me:
      "Art is my way of expressing spirituality. I find the divine in every brushstroke and color. Seeking someone who appreciates art and spirituality.",
    spiritual_org: ["Chinmaya Mission"],
    daily_practices: ["Painting", "Vedic chanting", "Satsang"],
    user_photos: ["/abstract-spiritual-avatar-1.png"],
    compatibility_score: 87,
    diet: "Vegetarian",
    mother_tongue: "Telugu",
    verification_status: "verified",
    account_status: "sparsh",
    created_at: "2024-01-11T10:00:00Z",
    birthdate: "1998-09-12",
    gender: "Female",
  },
]

export async function GET(request: NextRequest) {
  console.log("🔍 Discover API called")
  console.log("🌍 Environment:", process.env.NODE_ENV)
  console.log("🔧 Dev Mode:", process.env.NEXT_PUBLIC_DEV_MODE)

  try {
    // Always return mock profiles in development for now
    console.log("✅ Returning mock profiles:", MOCK_PROFILES.length)

    return NextResponse.json({
      profiles: MOCK_PROFILES,
      success: true,
      message: "Mock profiles loaded successfully",
    })
  } catch (error) {
    console.error("❌ Discover API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        profiles: MOCK_PROFILES, // Fallback to mock profiles even on error
      },
      { status: 500 },
    )
  }
}
