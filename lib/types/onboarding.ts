// Updated interface to match your specifications
export interface OnboardingData {
  // Email verification
  email_verified: boolean

  // Personal info
  gender: "Male" | "Female" | "Other" | null
  birthdate: string | null
  city: string | null
  state: string | null
  country: string | null
  mother_tongue: string | null

  // Professional info
  education: string | null
  profession: string | null
  annual_income: string | null

  // Spiritual preferences (updated enum values)
  diet: "Vegetarian" | "Vegan" | "Eggetarian" | "Non-Vegetarian" | null
  temple_visit_freq: "Daily" | "Weekly" | "Monthly" | "Rarely" | "Never" | null
  vanaprastha_interest: "yes" | "no" | "open" | null
  artha_vs_moksha: "Artha-focused" | "Moksha-focused" | "Balance" | null

  // Array fields
  spiritual_org: string[]
  daily_practices: string[]
  user_photos: string[]

  // Text fields
  about_me: string | null
  partner_expectations: string | null
}

export interface OnboardingProfile extends OnboardingData {
  id: string
  email: string
  first_name?: string
  last_name?: string
  mobile_number?: string
  onboarding_completed?: boolean
  updated_at?: string
}

// Updated validation constants
export const VALID_VALUES = {
  gender: [null, "Male", "Female", "Other"] as const,
  diet: [null, "Vegetarian", "Vegan", "Eggetarian", "Non-Vegetarian"] as const,
  temple_visit_freq: [null, "Daily", "Weekly", "Monthly", "Rarely", "Never"] as const,
  vanaprastha_interest: [null, "yes", "no", "open"] as const,
  artha_vs_moksha: [null, "Artha-focused", "Moksha-focused", "Balance"] as const,
} as const

// Helper function to validate enum fields
export function validateEnumField<T extends keyof typeof VALID_VALUES>(
  field: T,
  value: any,
): value is (typeof VALID_VALUES)[T][number] {
  return VALID_VALUES[field].includes(value as any)
}

// Helper function to validate mobile number
export function validateMobileNumber(mobile: string): boolean {
  if (!mobile) return false

  // Remove all non-digit characters except +
  const cleanMobile = mobile.replace(/[^\d+]/g, "")

  // Should start with + or digit, be 10-15 characters long
  const mobileRegex = /^[+]?[1-9]\d{9,14}$/
  return mobileRegex.test(cleanMobile)
}

// Helper function to format mobile number
export function formatMobileNumber(mobile: string): string {
  // Remove all non-digit characters except +
  let cleaned = mobile.replace(/[^\d+]/g, "")

  // If it doesn't start with +, and it's an Indian number (10 digits), add +91
  if (!cleaned.startsWith("+") && cleaned.length === 10 && cleaned.match(/^[6-9]/)) {
    cleaned = "+91" + cleaned
  }

  return cleaned
}
