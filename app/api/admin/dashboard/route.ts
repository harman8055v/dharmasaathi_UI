import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: users, error: usersError } = await supabase
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
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

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

    let matchesCount = 0
    try {
      const { count } = await supabase
        .from("swipe_actions")
        .select("*", { count: "exact", head: true })
        .eq("action", "like")
      matchesCount = count || 0
    } catch (e) {
      matchesCount = 0
    }

    let messagesCount = 0
    try {
      const { count } = await supabase.from("messages").select("*", { count: "exact", head: true })
      messagesCount = count || 0
    } catch (e) {
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

    return NextResponse.json({ users, stats })
  } catch (error) {
    console.error("Admin dashboard API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
