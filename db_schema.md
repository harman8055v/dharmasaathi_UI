# DharmaSaathi — Supabase/PostgreSQL Schema (Full MVP)

## USERS
- id (uuid, PK, default uuid_generate_v4())
- email (text, unique, not null)
- password (auth only, not stored in users table)
- first_name (text)
- last_name (text)
- full_name (text, computed)
- gender (text: 'Male', 'Female', 'Other')
- birthdate (date)
- height (text)
- city (text)
- state (text)
- country (text)
- mother_tongue (text)
- education (text)
- profession (text)
- annual_income (text)
- spiritual_org (text)
- primary_teacher (text)
- daily_practices (text[]) -- e.g., ["meditation", "yoga"]
- years_on_path (integer)
- diet (text: 'Vegetarian', 'Vegan', 'Eggetarian', 'Non-Vegetarian')
- temple_visit_freq (text: 'Daily', 'Weekly', 'Monthly', 'Rarely', 'Never')
- ashram_interest (text: 'Yes', 'No', 'Open')
- artha_vs_moksha (text: 'Artha-focused', 'Moksha-focused', 'Balance')
- about_me (text)
- partner_expectations (text)
- user_photos (text[]) -- array of photo URLs
- profile_photo_url (text)
- kyc_status (text: 'Pending', 'Verified', 'Rejected')
- is_verified (boolean, default false)
- role (text, default 'User')
- account_status (text, default 'Active')
- super_likes_count (integer, default 0)
- swipe_count (integer, default 0)
- profile_completeness (integer, computed %)
- premium_status (boolean, default false)
- premium_expiry (timestamp)
- created_at (timestamp, default now())
- updated_at (timestamp, auto-updated)

## MATCHES
- id (uuid, PK)
- user1_id (uuid, FK users(id))
- user2_id (uuid, FK users(id))
- created_at (timestamp, default now())
- status (text: 'active', 'unmatched', 'blocked')
- UNIQUE(user1_id, user2_id)
- CHECK (user1_id != user2_id)

## LIKES
- id (uuid, PK)
- sender_id (uuid, FK users(id))
- receiver_id (uuid, FK users(id))
- created_at (timestamp, default now())
- type (text: 'like', 'superlike')
- UNIQUE(sender_id, receiver_id)

## PROFILE_VIEWS
- id (uuid, PK)
- viewer_id (uuid, FK users(id))
- viewed_id (uuid, FK users(id))
- created_at (timestamp, default now())

## MESSAGES
- id (uuid, PK)
- match_id (uuid, FK matches(id))
- sender_id (uuid, FK users(id))
- content (text)
- created_at (timestamp, default now())
- read_status (boolean, default false)

## SUPERLIKES
- id (uuid, PK)
- sender_id (uuid, FK users(id))
- receiver_id (uuid, FK users(id))
- created_at (timestamp, default now())
- status (text: 'pending', 'accepted', 'expired')

## SUBSCRIPTIONS
- id (uuid, PK)
- user_id (uuid, FK users(id))
- plan_type (text: 'free', 'premium')
- purchase_date (timestamp)
- expiry_date (timestamp)
- features_enabled (jsonb)

## KYC
- id (uuid, PK)
- user_id (uuid, FK users(id))
- kyc_file_url (text)
- status (text: 'pending', 'verified', 'rejected')
- verified_by (uuid, FK admin user)
- verified_at (timestamp)

## REPORTS
- id (uuid, PK)
- reported_user_id (uuid, FK users(id))
- reported_by_id (uuid, FK users(id))
- reason (text)
- created_at (timestamp)
- status (text: 'pending', 'resolved', 'dismissed')

## ADMIN
- id (uuid, PK)
- user_id (uuid, FK users(id))
- role (text: 'Admin', 'Moderator')
- created_at (timestamp)

## STORAGE
- Bucket: user-photos (for all user and profile photo URLs)
- Bucket: kyc-docs (for KYC files)

## AUTH
- Supabase Auth for signup/login with email magic link, OTP, or social login.

---

# ALL KEY MVP FEATURES LIKE “WHO LIKED ME” AND “WHO VIEWED ME” ARE FIRST-CLASS—THEY ARE ENABLED BY DEFAULT IN THIS SCHEMA.
