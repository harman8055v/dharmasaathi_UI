export interface OnboardingProfile {
  id: string
  email?: string
  created_at?: string
  updated_at?: string
  onboarding_completed?: boolean
  verification_status?: "pending" | "verified" | "rejected"
  gender?: "Male" | "Female" | "Other" | null
  birthdate?: string | null
  height?: number | null
  country_id?: number | null
  state_id?: number | null
  city_id?: number | null
  mother_tongue?: string | null
  education?: string | null
  profession?: string | null
  annual_income?: string | null
  diet?: "Vegetarian" | "Vegan" | "Eggetarian" | "Non-Vegetarian" | null
  temple_visit_freq?: "Daily" | "Weekly" | "Monthly" | "Rarely" | "Never" | null
  vanaprastha_interest?: "yes" | "no" | "open" | null
  artha_vs_moksha?: "Artha-focused" | "Moksha-focused" | "Balance" | null
  spiritual_org?: string[] | null
  daily_practices?: string[] | null
  user_photos?: string[] | null
  about_me?: string | null
  partner_expectations?: string | null
  favorite_spiritual_quote?: string | null
  mobile_number?: string | null
  mobile_verified?: boolean
  email_verified?: boolean
}

export type OnboardingData = Partial<OnboardingProfile>

// THIS WAS THE MISSING EXPORT
export const VALID_VALUES = {
  gender: [null, "Male", "Female", "Other"] as const,
  diet: [null, "Vegetarian", "Vegan", "Eggetarian", "Non-Vegetarian"] as const,
  temple_visit_freq: [null, "Daily", "Weekly", "Monthly", "Rarely", "Never"] as const,
  vanaprastha_interest: [null, "yes", "no", "open"] as const,
  artha_vs_moksha: [null, "Artha-focused", "Moksha-focused", "Balance"] as const,
} as const
