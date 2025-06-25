import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side supabase instance
export const supabase = createClientComponentClient()

// Service role client for server operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Upload a user photo to the private bucket and return the storage path
export async function uploadUserPhoto(file: File, userId: string): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    const filePath = `users/${userId}/${fileName}`

    const { data, error } = await supabase.storage.from("user-photos").upload(filePath, file)
    if (error) {
      console.error("Upload error:", error)
      return null
    }

    return data?.path || filePath
  } catch (error) {
    console.error("Error uploading photo:", error)
    return null
  }
}

// Remove a photo from storage given its path
export async function deleteUserPhoto(photoPath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage.from("user-photos").remove([photoPath])

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

// Generate signed URLs for an array of photo paths using the service role key
export async function getSignedUrlsForPhotos(photoPaths: string[]): Promise<string[]> {
  if (!photoPaths || photoPaths.length === 0) return []

  const { data, error } = await supabaseAdmin.storage.from("user-photos").createSignedUrls(photoPaths, 60)

  if (error) {
    console.error("Error generating signed URLs:", error)
    return []
  }

  return data.map((d) => d.signedUrl)
}

// Client-side helper for signed URLs using the logged in user's credentials
export async function getSignedUrlsForPhotosClient(photoPaths: string[]): Promise<string[]> {
  if (!photoPaths || photoPaths.length === 0) return []

  const { data, error } = await supabase.storage.from("user-photos").createSignedUrls(photoPaths, 60)

  if (error) {
    console.error("Error generating client signed URLs:", error)
    return []
  }

  return data.map((d) => d.signedUrl)
}
