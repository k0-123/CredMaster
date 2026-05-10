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
- Resend's free tier requires domain verification for custom from addresses; using the sandbox email works immediately for testing.
- Swapping LLM providers (Anthropic to Gemini) is trivial when the prompt engineering and fallback logic are decoupled from the SDK calls.

**Blockers / what I'm stuck on:**
- Waiting for DNS propagation on custom domain for Resend verification. Using sandbox for now.

**Plan for tomorrow:**
- Polish UI — visual quality on results page matters for sharing.
- Add PDF export (bonus feature).
- Start user interviews (need 3 by Day 5).
- Write GTM.md first draft.

## Day 4 — 2025-01-[XX]

**Hours worked:** 7

---

**What I did:**

Full day on entrepreneurial documentation. Nothing shipped to production, but this work directly affects what gets built next.

- **GTM.md:** Mapped the exact target user (Engineering Manager at Series A–B, 15–80 person company, paying for 3+ AI tools without an audit). Listed 8 specific Google queries they run before wanting a tool like this. Built a community breakdown with exact subreddit names (`r/ExperiencedDevs`, `r/devops`), specific Slack communities (Rands Leadership Slack, Software Lead Weekly), and newsletter targets (The Pragmatic Engineer, TLDR Engineering). Wrote a day-by-day 30-day acquisition plan — which post goes where, what day, what time. Identified Credex's unfair channel advantage: existing CTO relationships mean they can send this to 100 warm contacts before any public launch.

- **ECONOMICS.md:** Modeled the full conversion funnel from 1,000 visitors to closed revenue. Estimated lead value at $6,000 per qualified consultation (25% close rate × $24K ACV). Calculated CAC for each channel: HN at ~$37/consultation, Reddit at ~$50, Credex existing customers at ~$25. Worked backwards from $1M ARR: need 42 customers, 2.3/month, 10 consultations/month, 880 visitors/month. That last number is achievable; the constraint is sales capacity, not traffic.

- **LANDING_COPY.md:** Wrote the hero headline, subheadline, and primary CTA. Wrote 5 FAQ answers aimed at a skeptical engineering manager — not "is it free?" questions but harder ones like "how do you know what I should be paying?" and "what happens to my data?" Wrote a mocked social proof block with 3 fabricated testimonials and an aggregate stat. Marked everything mocked clearly so nothing goes live accidentally.

- **METRICS.md:** Defined North Star as "qualified leads per week" — not audits, not DAUs, because this is a B2B lead-gen tool and the metric closest to revenue is the right one at this stage. Set the pivot trigger at <5% email capture rate after 500 audits. Listed the first 5 analytics events to instrument, including properties and why each one matters.

- **README.md:** Full rewrite. 5 architectural trade-off decisions in structured format (decision / alternatives / why): in-memory fallback vs. required Supabase, hardcoded rules vs. AI-generated recommendations, no login required, honeypot vs. hCaptcha, `@vercel/og` vs. static OG image. Full tech stack table with reasoning for every major dependency.

---

**What I learned:**

Writing the economics forced me to see the funnel as a system, not a sequence. Every step has a conversion rate, and the weakest link isn't traffic — it's the results page email capture. That single 15% number, if it drops to 5%, requires 3x more traffic to hit the same lead target. The UI work from Day 3 isn't just aesthetics; it's directly load-bearing for the revenue model.

The "unfair channel" realization was the most clarifying part of the GTM doc. I kept trying to figure out what makes the tool itself defensible. It's not the tool — any competent dev could build a comparable audit form. The moat is Credex's existing relationships. They can put this in front of 100 warm contacts before the first public post. No outside founder has that. That changes how you think about launch sequencing: customer base first, public second.

---

**Blockers / what I'm stuck on:**

User interviews. Have 1 confirmed engineering manager (Series B, fintech). Need 2 more to have enough signal to write USER_INTERVIEWS.md with confidence. Going to DM 5 more people tonight — keeping the ask tight: "30 minutes, I'll show you the tool, I want your gut reaction on whether the numbers feel real."

The open question I can't answer without interviews: do EMs actually feel the pain acutely enough to act on an audit, or do they know they're wasting money and not care because it's not their personal money? The economics model assumes pain → action. If that assumption is wrong, the whole funnel breaks at the email capture step.

---

**Plan for tomorrow:**

- Complete all 3 user interviews (have 1 scheduled for 10am)
- Write USER_INTERVIEWS.md with real quotes, redacted if needed
- ARCHITECTURE.md with Mermaid diagram (form → validation → audit engine → results → email capture → Supabase → Resend)
- Add 2 more unit tests to audit calculation logic (edge cases: 0 seats, single tool, team size larger than seat count)

---

## Day 5 — 2026-05-11
**Hours worked:** 8

**What I did:**
- Added Rule 7 (retail vs credits) to audit engine — this was a gap identified against the assignment rubric. Now covers all 4 evaluation criteria the PDF specifies per tool.
- Built BenchmarkPanel with visual bar showing spend per developer vs industry p25/p75 for 4 company size buckets
- Created benchmarks.ts with getBenchmarkPosition helper function
- Added form validation: engineerCount > teamSize now shows inline error and blocks submission
- Added zero spend guard to audit engine
- Added 3 new tests (total: 18)
- Updated PRICING_DATA.md with API credits break-even analysis
- Completed user interviews (see USER_INTERVIEWS.md)
- Wrote USER_INTERVIEWS.md and ARCHITECTURE.md with Mermaid diagram

**What I learned:**
- Segmenting benchmarks by both company size and role-specific headcount (engineers) provides much more granular value to users than a simple "spend per employee" metric.
- Dynamic imports are crucial for maintaining a fast initial load when adding data-heavy visualization components.

**Blockers / what I'm stuck on:**
- None. Project is functionally complete against the original rubric.

**Plan for tomorrow:**
- REFLECTION.md — all 5 questions
- Lighthouse audit and fix scores
- Accessibility sweep
- Performance fixes
- Final edge case handling
- Full end-to-end test on live URL
