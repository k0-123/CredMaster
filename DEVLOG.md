# Development Log

## Day 1 — 2025-01-15
**Hours worked:** 8

**What I did:**
- Scaffolded full Next.js 14 project with TypeScript and Tailwind
- Defined all shared TypeScript types in src/lib/types.ts with discriminated unions for recommendations
- Built the complete audit engine in src/lib/auditEngine.ts with 6 rule categories: seat waste, plan downgrades, tool overlap, and use-case mismatch
- Built SpendForm.tsx as a 3-step form with localStorage persistence
- Built the full landing page (page.tsx) with hero, social proof, how-it-works, and form
- Built the audit results page at /audit/[id] with savings hero, per-tool breakdown, AI summary placeholder, lead capture, and share button
- Created /api/audit route with in-memory store, rate limiting, and honeypot protection
- Wrote 8 unit tests covering all major audit engine rules
- Created GitHub Actions CI workflow
- Wrote PRICING_DATA.md, TESTS.md, PROMPTS.md

**What I learned:**
- Next.js 14 App Router uses a different data-fetching pattern than pages/ — layout.tsx handles metadata, not _app.tsx
- Discriminated union types in TypeScript make the recommendation logic self-documenting and catch missing cases at compile time
- The honeypot pattern is simpler and less UX-friction than hCaptcha for an MVP — right trade-off at this stage

**Blockers / what I'm stuck on:**
- Supabase connection not wired yet — using in-memory store as placeholder; need to set up env vars and swap Day 2
- Open Graph image is text-only for now; dynamic og:image generation with @vercel/og is a Day 3 task
- Anthropic API key not set up in environment yet

**Plan for tomorrow:**
- Wire Supabase for persistent audit + lead storage
- Connect Resend for transactional emails
- Deploy to Vercel and get live URL
- Add actual Anthropic API call to /api/summary route (Swapped to Gemini per request)
- Add dynamic og:image using @vercel/og

## Day 2 — 2025-01-16
**Hours worked:** 8

**What I did:**
- Replaced in-memory audit storage with Supabase (audits + leads tables with RLS policies)
- Built full leads API route with email validation, rate limiting, and honeypot protection
- Wired Resend for transactional emails — sends HTML email with audit summary + CTA to view report
- Connected Gemini API to /api/summary route with graceful fallback to templated summary if API fails
- Added @vercel/og dynamic OG image generation at /api/og — each audit URL now generates a unique 1200x630 preview card
- Updated audit results page to use dynamic og:image URL
- Added ErrorBoundary and LoadingSkeleton components
- Created DEPLOYMENT.md with setup checklist
- Added 3 more unit tests (total: 11)
- Deployed to Vercel — live and verified

**What I learned:**
- Supabase RLS (Row Level Security) requires explicit policies even for service role inserts when RLS is enabled — missing this caused silent insert failures that looked like success from the client.
- @vercel/og requires edge runtime — you cannot use Node.js APIs in the same file.
- Resend's free tier requires domain verification for custom from addresses; using onboarding@resend.dev works immediately for testing.
- Swapping LLM providers (Anthropic to Gemini) is trivial when the prompt engineering and fallback logic are decoupled from the SDK calls.

**Blockers / what I'm stuck on:**
- Waiting for DNS propagation on custom domain for Resend verification. Using sandbox for now.

**Plan for tomorrow:**
- Polish UI — visual quality on results page matters for sharing.
- Add PDF export (bonus feature).
- Start user interviews (need 3 by Day 5).
- Write GTM.md first draft.
