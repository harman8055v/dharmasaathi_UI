import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { isDevelopmentMode, getDevSession } from "@/lib/dev-auth"

// Use the modern client component client for browser-side usage
export const supabase = createClientComponentClient()

// Enhanced supabase client with dev mode support
export const getSupabaseSession = async () => {
  try {
    // In development mode, check for dev session first
    if (isDevelopmentMode()) {
      const devSession = getDevSession()
      if (devSession) {
        return { data: { session: devSession }, error: null }
      }
    }

    // Fall back to real Supabase session
    const result = await supabase.auth.getSession()
    console.log("Supabase session result:", result)
    return result
  } catch (error) {
    console.error("Error getting session:", error)
    return { data: { session: null }, error }
  }
}

// Enhanced user data fetching with dev mode support
export const getCurrentUser = async () => {
  try {
    const {
      data: { session },
      error,
    } = await getSupabaseSession()

    console.log("getCurrentUser - session:", session, "error:", error)

    if (error || !session?.user) {
      return { user: null, profile: null, error }
    }

    // Fetch user profile from database
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single()

    console.log("getCurrentUser - profile:", profile, "profileError:", profileError)

    return {
      user: session.user,
      profile,
      error: profileError,
    }
  } catch (error) {
    console.error("Error in getCurrentUser:", error)
    return { user: null, profile: null, error }
  }
}
