export interface OnboardingProfile {
  id: string
  email?: string
  created_at?: string
  updated_at?: string
  onboarding_completed?: boolean
  verification_status?: "pending" | "verified" | "rejected"
  gender?: string | null
  birthdate?: string | null
  height?: number | null
  country_id?: number | null
  state_id?: number | null
  city_id?: number | null
  mother_tongue?: string | null
  education?: string | null
  profession?: string | null
  annual_income?: string | null
  diet?: string | null
  temple_visit_freq?: string | null
  vanaprastha_interest?: string | null
  artha_vs_moksha?: string | null
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
