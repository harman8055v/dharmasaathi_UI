import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { isDevelopmentMode, getDevSession } from "@/lib/dev-auth"

// Use the modern client component client for browser-side usage
export const supabase = createClientComponentClient()

// Enhanced supabase client with dev mode support
export const getSupabaseSession = async () => {
  // In development mode, check for dev session first
  if (isDevelopmentMode()) {
    const devSession = getDevSession()
    if (devSession) {
      return { data: { session: devSession }, error: null }
    }
  }

  // Fall back to real Supabase session
  return await supabase.auth.getSession()
}

// Enhanced user data fetching with dev mode support
export const getCurrentUser = async () => {
  const {
    data: { session },
    error,
  } = await getSupabaseSession()

  if (error || !session?.user) {
    return { user: null, profile: null, error }
  }

  // Fetch user profile from database
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single()

  return {
    user: session.user,
    profile,
    error: profileError,
  }
}
