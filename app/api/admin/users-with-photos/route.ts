import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin, getSignedUrl, getMultipleSignedUrls } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const filter = searchParams.get("filter") || "all"

    const offset = (page - 1) * limit

    // Build query
    let query = supabaseAdmin
      .from("users")
      .select(
        "id, email, first_name, last_name, profile_photo_url, user_photos, verification_status, account_status, created_at, is_active, city, state, gender, birthdate",
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply search filter
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`)
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
    }

    const { data: users, error, count } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    // Generate signed URLs for all users
    const enrichedUsers = await Promise.all(
      (users || []).map(async (user) => {
        const profileSignedUrl = user.profile_photo_url ? await getSignedUrl(user.profile_photo_url, 300) : null

        const gallerySignedUrls =
          user.user_photos && Array.isArray(user.user_photos) ? await getMultipleSignedUrls(user.user_photos, 300) : []

        return {
          ...user,
          profileSignedUrl,
          gallerySignedUrls,
        }
      }),
    )

    // Get total count for pagination
    const { count: totalCount } = await supabaseAdmin.from("users").select("*", { count: "exact", head: true })

    const totalPages = Math.ceil((totalCount || 0) / limit)

    return NextResponse.json({
      users: enrichedUsers,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
