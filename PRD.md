# DharmaSaathi Web Application — Full Product Requirements Document

## 1. Product Overview

DharmaSaathi is India’s first spiritual matchmaking web app for modern, conscious Indian singles seeking real relationships and marriage rooted in shared spiritual values, practices, and growth. The web app combines a Tinder/Aisle-inspired swipe interface with deep profile-driven matching and an authentic, privacy-focused, premium experience. Quality, trust, and spiritual compatibility are core.

---

## 2. Core Features & User Stories

### 2.1 Authentication & Onboarding

- **Email/password sign up, social logins (Google, Facebook, Apple).**
- **Multi-step onboarding flow (must be mobile-first, visually guided, progress bar):**
    1. Personal details: Name, age/DOB, gender, city/state/country, height, mother tongue, education, job/profession, annual income (optional).
    2. Spiritual details: Primary path(s) or teacher(s), spiritual organization(s), practices (multi-select + free text), years on path, daily/weekly routine, ashram/minimalist lifestyle openness, temple visit frequency, artha vs moksha orientation.
    3. Lifestyle & preferences: Diet (Veg/Vegan/Eggetarian/Non-veg), smoking/drinking, openness to relocation, marital status, partner preferences (age, city, openness to spiritual life, dietary, ashram/minimalism).
    4. Open-text: Journey/story, what they seek in a partner, “about me”, “expectations from partner”.
    5. **Profile photo upload (minimum 1, up to 6), cropping and ordering UI.**
    6. **KYC/ID upload (optional but encouraged; badge for verified).**
    7. **Email/OTP verification (must be enforced before platform access).**
    8. Profile completeness meter, auto-reminders for incomplete sections.

---

### 2.2 Profile Management

- **Edit all details, change or remove photos, reorder photos, set a main display photo.**
- Profile privacy controls: hide age/last name, blur photos (unlock on match), hide from search (incognito, premium only).
- Display profile completeness indicator and offer prompts for missing info.

---

### 2.3 Discovery & Matching

- **Swipe-based UI (web & mobile):**
    - **Right swipe:** Like
    - **Left swipe:** Pass
    - **Up swipe:** Superlike (highlighted, limited daily—free & premium tiers)
    - **Undo last swipe:** Premium only (can undo previous swipe, with a cooldown)
- **Filter/browse cards by:** Age range, gender, city/state/country, spiritual path/org, diet, years on path, ashram openness, language, height, education.
- **Profile card details:** Photo(s), name, age, city, “about me”, top spiritual practices, badge for verified/KYC, premium badge, number of superlikes received, “who liked me” (premium).
- **Profile “flip” or “expand” for more info:** Journey, partner expectations, deeper details.
- **Limits:** Free: X swipes/day, Y superlikes/day, basic filters. Premium: Unlimited swipes, more superlikes, advanced filters.

---

### 2.4 “Who Liked Me” & “Who Viewed Me”

- **“Who Liked Me” list:**  
  - Free users get “someone liked you” blurred, must upgrade to see names/photos.
  - Premium users see full list with profile preview, sort by recency, and can swipe back directly.
- **“Who Viewed My Profile” list:**  
  - Premium only. Shows up to 30 days’ views, profile + timestamp. Free users get blurred/unlocked via upsell.
- **Notifications:** In-app and email for likes, views, matches, and superlikes.

---

### 2.5 Matching & Mutual Likes

- **A match is created if both users swipe right or superlike each other.**
- **Superlike triggers instant notification, highlights the profile for 24 hours.**
- **Matches unlock chat; profile is bookmarked in “Matches” tab.**
- **Blocked, reported, or unmatched users removed from list.**
- **Undo last swipe:** Premium only; once per X hours or limited uses.

---

### 2.6 Messaging

- **Real-time, in-app chat available only after matching.**
- **Message features:** Text, emoji, typing indicator, unread badge, “read receipts” (premium only).
- **Superlike can unlock an “intro message” before matching (upsell opportunity).**
- **Safety:** Block, report directly from chat. Chat is hidden if one user is blocked/reported.
- **Incognito mode:** Premium; chat remains open for matched users only.

---

### 2.7 Premium Plans & Monetization

- **Free Tier:** Limited daily swipes, limited superlikes, basic filters, cannot see “who liked me”, no “undo swipe”, can’t view who viewed profile, limited chat features.
- **Premium Tier:** Unlimited swipes, more superlikes, advanced filters, “undo swipe”, “see who liked you”, “see who viewed you”, read receipts, profile boost (one per week), premium badge, incognito mode, priority support.
- **Microtransactions:** Superlike packs (for both free and premium), extra boosts.
- **Payments:** Razorpay integration (INR cards, UPI, wallets); upgrade/downgrade/cancel flow, in-app purchase experience with instant access to premium features.

---

### 2.8 Safety & Moderation

- **Block/report users at any stage.**
- **Admin dashboard:** Review reported users, block/unblock, manage KYC, approve photos/descriptions if flagged.
- **KYC badge for verified users (must be visible on all profiles).**
- **Privacy:** Hide profile from non-matches, incognito mode for browsing (premium).

---

### 2.9 Notifications

- **In-app notifications:** New matches, new messages, superlikes, views, likes, premium expiring, account actions.
- **Email notifications:** New match, unread message reminders, weekly “insights” (e.g. “10 people viewed your profile this week”).
- **Push notifications:** (for PWA/mobile, stretch goal).

---

### 2.10 Admin & Analytics

- **Admin panel:** User search, approve KYC, moderate reports, manage subscriptions.
- **Analytics dashboard:** Active users, matches, revenue, churn, gender ratio, conversion to premium, top cities, etc.
- **Export data:** For analysis/backup.

---

### 2.11 Accessibility & Performance

- Mobile-first, responsive, loads in <2s on 4G.
- Keyboard navigation, alt text for all images.
- Internationalization-ready, English-first.
- Secure authentication, encrypted file upload, GDPR compliant.
- Scalable to 100,000+ users.

---

## 3. Database Models (see db_schema.md for exact fields)

- User: Full personal, spiritual, professional, and preference fields.
- Match: User1, user2, status, date, match type.
- Message: MatchID, sender, content, timestamp, read status.
- Superlike: Sender, receiver, timestamp, type.
- Likes: User, target, timestamp.
- ProfileViews: Viewer, viewed, timestamp.
- Subscription: User, plan type, features, dates.
- Admin: Reports, moderation, analytics.
- KYC: User, status, file, verified_by, date.
- Photos: URLs, order, main display.

---

## 4. Branding & UI

- **Color palette:** Saffron/orange, earthy green/teal, white, charcoal, navy.
- **Typography:** Modern, sans-serif (Poppins/Inter).
- **UI:** Clean, card-driven, modern, with Indian spiritual symbolism (lotus, mandala), not religious icons.
- **Logo:** Minimal, spiritual + modern, instantly recognizable.
- **Photo handling:** Gallery with upload, cropping, main display, privacy controls.
- **Layout:** Home, Discovery, Matches, Messages, Profile, Settings, Premium.

---

## 5. Stretch/Optional (for later)

- PWA/mobile app, video profiles, virtual events, blog/content, referral program, community forum.

---

## 6. User Flows

1. Sign up > Onboard > Add profile > Swipe/browse > Match > Chat > Upgrade > Continue matching.
2. Receive like/view/superlike > Get notified > Check profile > Swipe back > Match/unmatch.
3. Premium: Unlock features, view who liked/viewed, boost profile, undo swipe.

---

**ALWAYS follow this PRD and db_schema.md for new features, context, and business logic. No vague “future” features: all key features are MVP.**
