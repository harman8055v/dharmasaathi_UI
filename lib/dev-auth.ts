import { supabase } from "@/lib/supabase"

// Development-only authentication bypass
export const DEV_USER_ID = "dev-user-12345"
export const DEV_USER_EMAIL = "dev@dharmasaathi.com"

export const isDevelopmentMode = () => {
  return (
    (process.env.NODE_ENV === "development" &&
      typeof window !== "undefined" &&
      window.location.hostname === "localhost") ||
    process.env.NEXT_PUBLIC_DEV_MODE === "true"
  )
}

export const createDevUser = async () => {
  if (!isDevelopmentMode()) return null

  try {
    // Check if dev user already exists
    const { data: existingUser } = await supabase.from("users").select("*").eq("id", DEV_USER_ID).single()

    if (existingUser) {
      return existingUser
    }

    // Create dev user profile
    const devUserData = {
      id: DEV_USER_ID,
      email: DEV_USER_EMAIL,
      first_name: "Dev",
      last_name: "User",
      full_name: "Dev User",
      mobile_number: "+91 9999999999",
      email_verified: true,
      mobile_verified: true,
      verification_status: "verified",
      onboarding_completed: true,
      is_active: true,
      role: "user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Add some sample profile data
      date_of_birth: "1990-01-01",
      gender: "male",
      height: "5'10\"",
      education: "Graduate",
      occupation: "Software Developer",
      location: "Mumbai",
      bio: "Development test user for DharmaSaathi",
      spiritual_practices: ["meditation", "yoga"],
      daily_practices: ["morning_prayer"],
      spiritual_organization: "None",
      mother_tongue: "Hindi",
      languages_spoken: ["Hindi", "English"],
      diet: "vegetarian",
      smoking: "never",
      drinking: "never",
      marital_status: "single",
      photos: ["/placeholder-user.jpg"],
    }

    const { data: newUser, error } = await supabase.from("users").insert(devUserData).select().single()

    if (error) {
      console.error("Error creating dev user:", error)
      return null
    }

    return newUser
  } catch (error) {
    console.error("Dev user creation failed:", error)
    return null
  }
}

export const simulateDevAuth = async () => {
  if (!isDevelopmentMode()) return false

  try {
    // Create or get dev user
    const devUser = await createDevUser()
    if (!devUser) return false

    // Store dev session in localStorage for persistence
    const devSession = {
      user: {
        id: DEV_USER_ID,
        email: DEV_USER_EMAIL,
        email_confirmed_at: new Date().toISOString(),
        phone_confirmed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      access_token: "dev-token",
      refresh_token: "dev-refresh",
      expires_at: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      token_type: "bearer",
    }

    localStorage.setItem("dev-session", JSON.stringify(devSession))
    return true
  } catch (error) {
    console.error("Dev auth simulation failed:", error)
    return false
  }
}

export const getDevSession = () => {
  if (!isDevelopmentMode()) return null

  try {
    const stored = localStorage.getItem("dev-session")
    if (!stored) return null

    const session = JSON.parse(stored)

    // Check if session is expired
    if (session.expires_at && Date.now() > session.expires_at) {
      localStorage.removeItem("dev-session")
      return null
    }

    return session
  } catch (error) {
    console.error("Error getting dev session:", error)
    return null
  }
}

export const clearDevSession = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("dev-session")
  }
}

// Development user profile
export const DEV_USER_PROFILE = {
  id: "dev-user-123",
  first_name: "Dev",
  last_name: "User",
  email: "dev@dharmasaathi.com",
  mobile_number: "+91-9999999999",
  mobile_verified: true,
  email_verified: true,
  gender: "Male",
  birthdate: "1990-01-01",
  city: "Mumbai",
  state: "Maharashtra",
  country: "India",
  mother_tongue: "Hindi",
  education: "B.Tech",
  profession: "Software Developer",
  diet: "Vegetarian",
  about_me: "Development test user for DharmaSaathi",
  spiritual_org: ["Art of Living", "Isha Foundation"],
  daily_practices: ["Meditation", "Yoga"],
  user_photos: ["/abstract-spiritual-avatar-1.png"],
  verification_status: "verified",
  account_status: "sangam",
  onboarding_completed: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  partner_age_min: 25,
  partner_age_max: 35,
  partner_location_preference: "same_state",
}
