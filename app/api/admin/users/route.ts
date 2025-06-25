import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import supabaseAdmin from "@/utils/supabaseAdmin"
import { getSignedUrlsForPhotos } from "@/utils/getSignedUrls"

export async function GET(request: NextRequest) {
  try {
    const supabaseAuth = createRouteHandlerClient({ cookies })
    const {
      data: { session },
      error: sessionError,
    } = await supabaseAuth.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }

    const { data: adminUser, error: adminError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single()

    if (adminError || !adminUser || !["admin", "super_admin"].includes(adminUser.role?.toLowerCase())) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { data: users, error } = await supabaseAdmin
      .from("users")
      .select("id, user_photos, verification_status")

    if (error) {
      console.error("Users fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    const mapped = await Promise.all(
      (users || []).map(async (u) => ({
        id: u.id,
        verification_status: u.verification_status,
        signedUrls: await getSignedUrlsForPhotos(u.user_photos || []),
      }))
    )

    return NextResponse.json({ users: mapped })
  } catch (err) {
    console.error("Admin users error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
