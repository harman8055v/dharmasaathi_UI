import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  try {
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
    const { data: profiles, error } = await query
      .order("created_at", { ascending: false })
      .limit(50)

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
