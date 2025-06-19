import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  try {
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

    // Fetch users data using admin client
    const { data: users, error: usersError } = await supabaseAdmin
      .from("users")
      .select(
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
        last_login_at
      `,
      )
      .order("created_at", { ascending: false })

    if (usersError) {
      console.error("Users fetch error:", usersError)
      return NextResponse.json({ error: "Failed to fetch users", details: usersError.message }, { status: 500 })
    }

    console.log(`Fetched ${users?.length || 0} users`)

    // Calculate stats
    const totalUsers = users?.length || 0
    const activeUsers = users?.filter((u) => u.is_active !== false).length || 0
    const verifiedUsers = users?.filter((u) => u.verification_status === "verified").length || 0
    const premiumUsers =
      users?.filter((u) => ["premium", "elite", "sparsh", "sangam", "samarpan"].includes(u.account_status)).length || 0
    const today = new Date().toISOString().split("T")[0]
    const todaySignups = users?.filter((u) => u.created_at?.startsWith(today)).length || 0
    const pendingVerifications = users?.filter((u) => u.verification_status === "pending").length || 0
    const maleUsers = users?.filter((u) => u.gender === "Male").length || 0
    const femaleUsers = users?.filter((u) => u.gender === "Female").length || 0
    const completedProfiles = users?.filter((u) => u.onboarding_completed === true).length || 0

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

    const stats = {
      totalUsers,
      activeUsers,
      verifiedUsers,
      premiumUsers,
      todaySignups,
      totalMatches: matchesCount,
      totalMessages: messagesCount,
      pendingVerifications,
      maleUsers,
      femaleUsers,
      completedProfiles,
    }

    console.log("Admin stats calculated:", stats)

    return NextResponse.json({ users: users || [], stats })
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
