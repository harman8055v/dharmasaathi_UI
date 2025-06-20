import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Use the modern client component client for browser-side usage
export const supabase = createClientComponentClient()
