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

    // Clean and normalize the path
    let cleanPath = path.replace(/^\/+/, "") // Remove leading slashes

    // If path doesn't start with user-photos/, add it
    if (!cleanPath.startsWith("user-photos/")) {
      cleanPath = `user-photos/${cleanPath}`
    }

    console.log(`🔍 Attempting to create signed URL for path: "${cleanPath}"`)

    // First, check if the file exists
    const { data: fileData, error: listError } = await supabaseAdmin.storage.from("user-photos").list("", {
      search: cleanPath.replace("user-photos/", ""),
    })

    if (listError) {
      console.log(`⚠️ Error checking file existence for "${cleanPath}":`, listError.message)
    }

    // Try to create signed URL regardless of list result (sometimes list fails but file exists)
    const { data, error } = await supabaseAdmin.storage
      .from("user-photos")
      .createSignedUrl(cleanPath.replace("user-photos/", ""), expiresIn)

    if (error) {
      console.log(`❌ Failed to create signed URL for "${cleanPath}": ${error.message}`)

      // Try alternative path formats
      const alternativePaths = [
        path, // Original path as-is
        path.replace(/^user-photos\//, ""), // Remove user-photos prefix
        path.replace(/^\//, ""), // Remove leading slash only
      ]

      for (const altPath of alternativePaths) {
        if (altPath !== cleanPath.replace("user-photos/", "")) {
          console.log(`🔄 Trying alternative path: "${altPath}"`)
          const { data: altData, error: altError } = await supabaseAdmin.storage
            .from("user-photos")
            .createSignedUrl(altPath, expiresIn)

          if (!altError && altData?.signedUrl) {
            console.log(`✅ Success with alternative path: "${altPath}"`)
            return altData.signedUrl
          }
        }
      }

      return null
    }

    if (data?.signedUrl) {
      console.log(`✅ Successfully created signed URL for "${cleanPath}"`)
      return data.signedUrl
    }

    return null
  } catch (error) {
    console.error(`💥 Exception in getSignedUrl for path "${path}":`, error)
    return null
  }
}

export async function getMultipleSignedUrls(paths: string[], expiresIn = 300): Promise<string[]> {
  try {
    if (!paths || paths.length === 0) return []

    console.log(`📸 Processing ${paths.length} image paths`)

    const signedUrls = await Promise.all(
      paths.map(async (path, index) => {
        console.log(`🖼️ Processing image ${index + 1}/${paths.length}: "${path}"`)
        const signedUrl = await getSignedUrl(path, expiresIn)
        return signedUrl || ""
      }),
    )

    const validUrls = signedUrls.filter((url) => url !== "")
    console.log(`✅ Successfully generated ${validUrls.length}/${paths.length} signed URLs`)

    return signedUrls
  } catch (error) {
    console.error("💥 Exception in getMultipleSignedUrls:", error)
    return []
  }
}

// Helper function to list all files in the bucket (for debugging)
export async function listStorageFiles(prefix = "") {
  try {
    const { data, error } = await supabaseAdmin.storage.from("user-photos").list(prefix, {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    })

    if (error) {
      console.error("Error listing storage files:", error)
      return []
    }

    console.log(`📁 Found ${data?.length || 0} files in storage:`)
    data?.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file.name} (${file.metadata?.size || "unknown size"})`)
    })

    return data || []
  } catch (error) {
    console.error("Exception listing storage files:", error)
    return []
  }
}

export { supabaseAdmin }
