import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create admin client for storage operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function uploadUserPhoto(file: File, userId: string, photoIndex: number): Promise<string | null> {
  try {
    // Generate unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/photo-${photoIndex}-${Date.now()}.${fileExt}`

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage.from("user-photos").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Upload error:", error)
      return null
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("user-photos").getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error("Error uploading photo:", error)
    return null
  }
}

export async function deleteUserPhoto(photoUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = photoUrl.split("/user-photos/")
    if (urlParts.length < 2) return false

    const filePath = urlParts[1]

    const { error } = await supabaseAdmin.storage.from("user-photos").remove([filePath])

    if (error) {
      console.error("Delete error:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error deleting photo:", error)
    return false
  }
}

export function getOptimizedImageUrl(url: string, width?: number, height?: number): string {
  if (!url) return "/placeholder.svg"

  // If it's already a placeholder, return as is
  if (url.includes("placeholder.svg") || url.includes("abstract-spiritual-avatar")) {
    return url
  }

  // If it's a Supabase storage URL, add transformation parameters
  if (url.includes("supabase")) {
    const params = new URLSearchParams()
    if (width) params.append("width", width.toString())
    if (height) params.append("height", height.toString())
    params.append("resize", "cover")
    params.append("quality", "80")

    return `${url}?${params.toString()}`
  }

  return url
}
