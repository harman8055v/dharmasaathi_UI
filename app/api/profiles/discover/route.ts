import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Mock profiles for development
const mockProfiles = [
  {
    id: "mock-1",
    first_name: "Ananya",
    last_name: "Sharma",
    age: 28,
    city: "Mumbai",
    state: "Maharashtra",
    profession: "Software Engineer",
    education: "B.Tech Computer Science",
    diet: "Vegetarian",
    birthdate: "1995-03-15",
    gender: "Female",
    about_me:
      "Passionate about spirituality and technology. Love practicing yoga and meditation daily. Seeking a life partner who shares similar spiritual values.",
    user_photos: ["/abstract-spiritual-avatar-1.png"],
    spiritual_org: ["Art of Living", "Isha Foundation"],
    daily_practices: ["Meditation", "Yoga", "Pranayama"],
    mother_tongue: "Hindi",
    verification_status: "verified",
    account_status: "sangam",
    created_at: "2024-01-15T10:00:00Z",
    compatibility_score: 95,
  },
  {
    id: "mock-2",
    first_name: "Priya",
    last_name: "Reddy",
    age: 26,
    city: "Hyderabad",
    state: "Telangana",
    profession: "Teacher",
    education: "M.Ed",
    diet: "Vegan",
    birthdate: "1997-07-22",
    gender: "Female",
    about_me:
      "Teaching is my passion, and I believe in nurturing young minds with spiritual values. Looking for someone who values education and spirituality.",
    user_photos: ["/abstract-spiritual-avatar-2.png"],
    spiritual_org: ["Osho International", "Vipassana"],
    daily_practices: ["Meditation", "Reading", "Chanting"],
    mother_tongue: "Telugu",
    verification_status: "verified",
    account_status: "sparsh",
    created_at: "2024-01-14T10:00:00Z",
    compatibility_score: 92,
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
    diet: "Vegetarian",
    birthdate: "1994-11-08",
    gender: "Female",
    about_me:
      "Dedicated to spreading the ancient wisdom of yoga and meditation. Seeking a spiritual companion for life's beautiful journey.",
    user_photos: ["/abstract-spiritual-avatar-3.png"],
    spiritual_org: ["Sivananda Yoga", "Ramana Maharshi Foundation"],
    daily_practices: ["Yoga", "Meditation", "Kirtan"],
    mother_tongue: "Malayalam",
    verification_status: "verified",
    account_status: "samarpan",
    created_at: "2024-01-13T10:00:00Z",
    compatibility_score: 89,
  },
  {
    id: "mock-4",
    first_name: "Meera",
    last_name: "Gupta",
    age: 27,
    city: "Delhi",
    state: "Delhi",
    profession: "Counselor",
    education: "M.A. Psychology",
    diet: "Vegetarian",
    birthdate: "1996-05-30",
    gender: "Female",
    about_me:
      "Helping people find inner peace through counseling and spiritual guidance. Looking for a soulmate who understands the deeper meaning of life.",
    user_photos: ["/abstract-spiritual-avatar-4.png"],
    spiritual_org: ["Brahma Kumaris", "Heartfulness"],
    daily_practices: ["Meditation", "Counseling", "Prayer"],
    mother_tongue: "Hindi",
    verification_status: "verified",
    account_status: "drishti",
    created_at: "2024-01-12T10:00:00Z",
    compatibility_score: 87,
  },
  {
    id: "mock-5",
    first_name: "Riya",
    last_name: "Patel",
    age: 25,
    city: "Ahmedabad",
    state: "Gujarat",
    profession: "Artist",
    education: "B.F.A",
    diet: "Vegetarian",
    birthdate: "1998-09-12",
    gender: "Female",
    about_me:
      "Art is my way of expressing spirituality. I find the divine in every brushstroke and color. Seeking someone who appreciates art and spirituality.",
    user_photos: ["/abstract-spiritual-avatar-1.png"],
    spiritual_org: ["ISKCON", "Swaminarayan"],
    daily_practices: ["Painting", "Bhajan", "Temple visits"],
    mother_tongue: "Gujarati",
    verification_status: "verified",
    account_status: "sparsh",
    created_at: "2024-01-11T10:00:00Z",
    compatibility_score: 85,
  },
]

export async function GET(request: NextRequest) {
  try {
    // In development mode, return mock profiles
    if (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DEV_MODE === "true") {
      console.log("Development mode: returning mock profiles")
      return NextResponse.json({ profiles: mockProfiles })
    }

    // Rest of the existing code for production...
    // Create Supabase client with service role key for server-side operations
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Get the authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")

    // Verify the JWT token
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's profile and preferences
    const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

    if (!userProfile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    // Get profiles user has already swiped on
    const { data: swipedProfiles } = await supabase.from("swipe_actions").select("swiped_id").eq("swiper_id", user.id)

    const swipedIds = swipedProfiles?.map((s) => s.swiped_id) || []

    // Build query for discovering profiles
    let query = supabase
      .from("users")
      .select("*")
      .eq("verification_status", "verified")
      .eq("onboarding_completed", true)
      .neq("id", user.id)

    // Exclude already swiped profiles
    if (swipedIds.length > 0) {
      query = query.not("id", "in", `(${swipedIds.join(",")})`)
    }

    // Apply basic filters based on user preferences
    if (userProfile.partner_age_min && userProfile.partner_age_max) {
      const minDate = new Date()
      minDate.setFullYear(minDate.getFullYear() - userProfile.partner_age_max)
      const maxDate = new Date()
      maxDate.setFullYear(maxDate.getFullYear() - userProfile.partner_age_min)

      query = query
        .gte("birthdate", minDate.toISOString().split("T")[0])
        .lte("birthdate", maxDate.toISOString().split("T")[0])
    }

    // Gender preference
    if (userProfile.gender === "Male") {
      query = query.eq("gender", "Female")
    } else if (userProfile.gender === "Female") {
      query = query.eq("gender", "Male")
    }

    // Location preference (same state for now)
    if (userProfile.state) {
      query = query.eq("state", userProfile.state)
    }

    // Fetch profiles ordered by creation date first
    const { data: profiles, error } = await query.order("created_at", { ascending: false }).limit(50)

    if (error) {
      console.error("Error fetching profiles:", error)
      return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 })
    }

    // Sort by account status visibility ranking
    const statusRank: Record<string, number> = {
      samarpan: 1,
      sangam: 2,
      sparsh: 3,
      drishti: 4,
    }

    const sortedProfiles = (profiles || []).sort((a: any, b: any) => {
      const rankA = statusRank[a.account_status] ?? 5
      const rankB = statusRank[b.account_status] ?? 5
      if (rankA === rankB) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      return rankA - rankB
    })

    const limitedProfiles = sortedProfiles.slice(0, 10)

    // Calculate compatibility scores (simplified)
    const profilesWithCompatibility =
      limitedProfiles.map((profile) => ({
        ...profile,
        compatibility_score: calculateCompatibility(userProfile, profile),
      })) || []

    return NextResponse.json({ profiles: profilesWithCompatibility })
  } catch (error) {
    console.error("Discover API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function calculateCompatibility(user: any, profile: any): number {
  let score = 50 // Base score

  // Age compatibility
  if (user.partner_age_min && user.partner_age_max && profile.birthdate) {
    const profileAge = new Date().getFullYear() - new Date(profile.birthdate).getFullYear()
    if (profileAge >= user.partner_age_min && profileAge <= user.partner_age_max) {
      score += 15
    }
  }

  // Location compatibility
  if (user.state === profile.state) {
    score += 10
  }
  if (user.city === profile.city) {
    score += 5
  }

  // Spiritual organization overlap
  if (user.spiritual_org && profile.spiritual_org) {
    const commonOrgs = user.spiritual_org.filter((org: string) => profile.spiritual_org.includes(org))
    score += Math.min(commonOrgs.length * 5, 15)
  }

  // Daily practices overlap
  if (user.daily_practices && profile.daily_practices) {
    const commonPractices = user.daily_practices.filter((practice: string) =>
      profile.daily_practices.includes(practice),
    )
    score += Math.min(commonPractices.length * 3, 10)
  }

  // Diet compatibility
  if (user.diet === profile.diet) {
    score += 5
  }

  return Math.min(score, 99) // Cap at 99%
}
