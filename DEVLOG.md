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
- Add actual Anthropic API call to /api/summary route
- Add dynamic og:image using @vercel/og
