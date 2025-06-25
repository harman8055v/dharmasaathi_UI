import { createClient } from "@supabase/supabase-js"

// Server-side Supabase client with service role key for admin operations
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function getSignedUrl(path: string, expiresIn = 300): Promise<string | null> {
  try {
    if (!path) return null

    // Remove any leading slashes and ensure proper format
    const cleanPath = path.replace(/^\/+/, "")

    const { data, error } = await supabaseAdmin.storage.from("user-photos").createSignedUrl(cleanPath, expiresIn)

    if (error) {
      console.error("Error creating signed URL:", error)
      return null
    }

    return data.signedUrl
  } catch (error) {
    console.error("Error in getSignedUrl:", error)
    return null
  }
}

export async function getMultipleSignedUrls(paths: string[], expiresIn = 300): Promise<string[]> {
  try {
    if (!paths || paths.length === 0) return []

    const signedUrls = await Promise.all(
      paths.map(async (path) => {
        const signedUrl = await getSignedUrl(path, expiresIn)
        return signedUrl || ""
      }),
    )

    return signedUrls.filter((url) => url !== "")
  } catch (error) {
    console.error("Error in getMultipleSignedUrls:", error)
    return []
  }
}

export { supabaseAdmin }
