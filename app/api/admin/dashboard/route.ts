import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const filter = searchParams.get("filter") || "all"
    const search = searchParams.get("search") || ""
    const offset = (page - 1) * limit

    // Create admin client with service role key for data access
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Create auth client to verify user session
    const supabaseAuth = createRouteHandlerClient({ cookies })

    // Check if user is authenticated
    const {
      data: { session },
      error: sessionError,
    } = await supabaseAuth.auth.getSession()

    if (sessionError) {
      console.error("Session error:", sessionError)
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }

    if (!session?.user) {
      console.error("No user session found")
      return NextResponse.json({ error: "No active session" }, { status: 401 })
    }

    console.log("Admin dashboard access by user:", session.user.email)

    // Build query based on filters
    let query = supabaseAdmin.from("users").select(
      `
        id,
        first_name,
        last_name,
        email,
        mobile_number,
        birthdate,
        gender,
        city,
        state,
        country,
        account_status,
        verification_status,
        created_at,
        updated_at,
        user_photos,
        is_active,
        email_verified,
        mobile_verified,
        about_me,
        partner_expectations,
        education,
        profession,
        annual_income,
        diet,
        temple_visit_freq,
        onboarding_completed,
        last_login_at,
        role
      `,
      { count: "exact" },
    )

    // Apply search filter
    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,mobile_number.ilike.%${search}%`,
      )
    }

    // Apply status filter
    switch (filter) {
      case "active":
        query = query.eq("is_active", true)
        break
      case "inactive":
        query = query.eq("is_active", false)
        break
      case "verified":
        query = query.eq("verification_status", "verified")
        break
      case "pending":
        query = query.eq("verification_status", "pending")
        break
      case "rejected":
        query = query.eq("verification_status", "rejected")
        break
      case "premium":
        query = query.in("account_status", ["premium", "elite", "sparsh", "sangam", "samarpan"])
        break
      case "incomplete":
        query = query.eq("onboarding_completed", false)
        break
    }

    // Apply pagination and ordering
    const {
      data: users,
      error: usersError,
      count,
    } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1)

    if (usersError) {
      console.error("Users fetch error:", usersError)
      return NextResponse.json({ error: "Failed to fetch users", details: usersError.message }, { status: 500 })
    }

    console.log(`Fetched ${users?.length || 0} users (page ${page}, total: ${count})`)

    // Calculate stats (only when needed - for overview)
    let stats = null
    if (searchParams.get("include_stats") === "true") {
      // Get total counts for stats
      const { count: totalUsers } = await supabaseAdmin.from("users").select("*", { count: "exact", head: true })

      const { count: activeUsers } = await supabaseAdmin
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true)

      const { count: verifiedUsers } = await supabaseAdmin
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("verification_status", "verified")

      const { count: premiumUsers } = await supabaseAdmin
        .from("users")
        .select("*", { count: "exact", head: true })
        .in("account_status", ["premium", "elite", "sparsh", "sangam", "samarpan"])

      const today = new Date().toISOString().split("T")[0]
      const { count: todaySignups } = await supabaseAdmin
        .from("users")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today)

      const { count: pendingVerifications } = await supabaseAdmin
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("verification_status", "pending")

      const { count: maleUsers } = await supabaseAdmin
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("gender", "Male")

      const { count: femaleUsers } = await supabaseAdmin
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("gender", "Female")

      const { count: completedProfiles } = await supabaseAdmin
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("onboarding_completed", true)

      // Try to fetch matches count (optional table)
      let matchesCount = 0
      try {
        const { count } = await supabaseAdmin
          .from("swipe_actions")
          .select("*", { count: "exact", head: true })
          .eq("action", "like")
        matchesCount = count || 0
      } catch (e) {
        console.log("Swipe actions table not accessible:", e)
        matchesCount = 0
      }

      // Try to fetch messages count (optional table)
      let messagesCount = 0
      try {
        const { count } = await supabaseAdmin.from("messages").select("*", { count: "exact", head: true })
        messagesCount = count || 0
      } catch (e) {
        console.log("Messages table not accessible:", e)
        messagesCount = 0
      }

      stats = {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        verifiedUsers: verifiedUsers || 0,
        premiumUsers: premiumUsers || 0,
        todaySignups: todaySignups || 0,
        totalMatches: matchesCount,
        totalMessages: messagesCount,
        pendingVerifications: pendingVerifications || 0,
        maleUsers: maleUsers || 0,
        femaleUsers: femaleUsers || 0,
        completedProfiles: completedProfiles || 0,
      }
    }

    return NextResponse.json({
      users: users || [],
      stats,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: offset + limit < (count || 0),
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Admin dashboard API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
