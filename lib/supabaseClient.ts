import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Use the modern client component client for browser-side usage
export const supabase = createClientComponentClient()

// Export as default for compatibility
export default supabase
