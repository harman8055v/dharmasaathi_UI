import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

// Use auth helpers client so the session is stored in cookies that the
// server-side helpers can read. This is required for API routes to detect
// the logged in user.
export const supabase = createBrowserSupabaseClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
})
