import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"

// Mirror the browser client used throughout the app. This ensures the
// authentication session is persisted in cookies and can be read by server
// components and API routes.
export const supabase = createBrowserSupabaseClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
})

supabase.auth.onAuthStateChange((event, session) => {
  fetch('/api/auth/callback', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify({ event, session }),
  })
})

// Export as default for compatibility
export default supabase
