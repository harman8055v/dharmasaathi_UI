import { NextResponse } from "next/server"
import { listStorageFiles, supabaseAdmin } from "@/lib/supabase-server"

export async function GET() {
  try {
    console.log("🔍 Debug: Listing storage files...")

    // List files in storage
    const files = await listStorageFiles()

    // Get a sample of user photo paths from database
    const { data: sampleUsers, error } = await supabaseAdmin
      .from("users")
      .select("id, profile_photo_url, user_photos")
      .not("profile_photo_url", "is", null)
      .limit(5)

    if (error) {
      console.error("Error fetching sample users:", error)
    }

    const debugInfo = {
      storageFiles: files.map((f) => f.name),
      sampleUserPaths:
        sampleUsers?.map((u) => ({
          id: u.id,
          profile_photo_url: u.profile_photo_url,
          user_photos: u.user_photos,
        })) || [],
      totalStorageFiles: files.length,
      totalSampleUsers: sampleUsers?.length || 0,
    }

    console.log("📊 Debug info:", debugInfo)

    return NextResponse.json(debugInfo)
  } catch (error) {
    console.error("Debug endpoint error:", error)
    return NextResponse.json({ error: "Debug failed" }, { status: 500 })
  }
}
