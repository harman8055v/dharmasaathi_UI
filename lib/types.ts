export interface User {
  id: string
  name: string
  age: number
  city: string
  photos: string[]
  about_me: string
  spiritual_highlights: string[]
  spiritual_journey: string
  partner_expectations: string
  occupation: string
  education: string
  height: string
  religion: string
  caste?: string
  mother_tongue: string
  kyc_verified: boolean
  is_premium: boolean
  created_at: string
}

export interface Match {
  id: string
  user1_id: string
  user2_id: string
  matched_at: string
  user1: User
  user2: User
}

export interface Chat {
  id: string
  match_id: string
  sender_id: string
  message: string
  sent_at: string
  read: boolean
}

export interface UserAction {
  id: string
  user_id: string
  target_user_id: string
  action_type: "like" | "dislike" | "superlike"
  created_at: string
}

export interface DailyLimits {
  likes_used: number
  superlikes_used: number
  max_likes: number
  max_superlikes: number
  date: string
}
