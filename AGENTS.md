# AGENTS.md — Codex/Engineering Agent Guide for DharmaSaathi

## Mission
Build and maintain DharmaSaathi, the premium web platform for spiritual matchmaking in India, to the exact spec of PRD.md and db_schema.md. All logic, UI, and flows must be modern, user-friendly, safe, and spiritually relevant.

---

## Folder Structure (Next.js/Tailwind/Supabase Standard)

- `/pages` — Next.js route pages (Landing, Discovery, Matches, Messages, Profile, Admin, etc.)
- `/components` — All React components (swipe card, onboarding, filters, chat UI, profile, admin, premium upsell modals)
- `/lib` — API, Supabase client, utilities
- `/styles` — Tailwind & global styles
- `/public` — Images, logos, icons, manifest
- `/hooks` — React custom hooks (e.g., for Supabase queries, swipe logic, etc.)

---

## Code/Style Guide

- **TypeScript for all code.**
- **TailwindCSS for all styling.**
- Clean, atomic, well-documented React components.
- All API calls via `/lib/supabaseClient.ts` (initialized with env variables).
- Use Next.js API routes for any server logic (if needed).
- **All forms validated with zod or equivalent.**
- Use React Context for auth/user session management.
- All critical UI must have loading, error, and empty states.
- Accessibility: alt text, keyboard nav, readable color contrast.

---

## Workflow/Validation

1. Always run `npm install` after cloning/fetching code.
2. For every new feature:
    - Write/update unit/component tests (if practical).
    - Run `npm run lint`, `npm run build` before commit.
    - Use environment variables from `.env.local` for any keys (never commit real secrets).
3. All code must be auto-formatted (Prettier config).
4. For PRs: Include feature summary, screenshots if UI, steps to test.
5. Only merge PRs if all checks/tests pass and feature is visible/usable in deployed preview.
6. For payments: Razorpay test keys in dev, live keys in prod, never expose secrets to frontend.

---

## Feature-Specific Instructions

- **Onboarding:** Multi-step, save progress, validate all fields, progress bar UI, motivational microcopy.
- **Profile:** Full edit, photo crop/order, hide info, KYC badge logic, completeness meter, privacy controls.
- **Discovery:** Infinite swipe, animated card transitions, responsive for touch & mouse, filters as per PRD.
- **Matching:** Mutual like logic, superlike highlight, undo, match creation, notifications.
- **Who Liked/View Me:** Track views/likes in backend, surface list to user, blur for non-premium, full for premium.
- **Messaging:** Only matched users, real-time via Supabase, typing indicator, unread badges, block/report direct in chat, read receipts for premium.
- **Premium:** Gate features as per PRD, upsell modals (animated), handle subscription/expiry, show “premium badge”.
- **Admin:** Separate protected route, view reports/KYC, approve/reject, basic analytics (active users, matches, etc).

---

## Data/Environment

- All DB as per db_schema.md.
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `RAZORPAY_KEY_ID`, secrets for server-side only.
- Never commit secrets or PATs.
- Use `.env.example` for sample keys.

---

## Prompting Tips for Codex

- Reference PRD.md and db_schema.md in all new features/tasks.
- Break complex features into clear, testable steps.
- Always ask for acceptance criteria before implementing features with business impact.
- Never remove existing features without confirmation.

---

**All agent work must align with the full feature set in PRD.md and current db_schema.md. No “future” features—all MVP features must be delivered.**
