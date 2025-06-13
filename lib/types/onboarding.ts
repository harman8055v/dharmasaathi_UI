export interface OnboardingProfile {
  id: string
  email: string
  first_name?: string
  last_name?: string
  gender?: string
  birthdate?: string
  city?: string
  state?: string
  country?: string
  mother_tongue?: string
  education?: string
  profession?: string
  annual_income?: string
  spiritual_org?: string
  daily_practices?: string[]
  diet?: string
  temple_visit_freq?: string
  vanaprastha_interest?: string
  artha_vs_moksha?: number
  about_me?: string
  partner_expectations?: string
  user_photos?: Array<{ url: string; path: string }>
  onboarding_completed?: boolean
  updated_at?: string
}
