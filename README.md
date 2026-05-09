# CredMaster — AI Spend Auditor

CredMaster is a free web app that audits AI tool spend for engineering teams. You enter your tools, seat counts, and team size — it shows you exactly where you're wasting money and what you could save. No login required, no integrations, instant results.

Built in one week as a job application project for [Credex](https://credex.ai), an AI infrastructure company.

---

## Screenshots

> 📸 *[Add screenshots here — audit form, results page, email capture modal]*

---

## Live Demo

> 🔗 *[Vercel URL — add after deployment]*

---

## Quick Start

```bash
git clone https://github.com/k0-123/CredMaster
cd CredMaster
cp .env.example .env.local
# Fill in your env vars (see DEPLOYMENT.md)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Decisions

**Decision:** In-memory fallback when Supabase is unavailable  
**Alternatives considered:** Require Supabase as a hard dependency; fail loudly if env vars are missing  
**Why:** The core audit logic is pure computation — it doesn't need a database to run. Requiring Supabase would make local development and demo deployments unnecessarily fragile. If `SUPABASE_URL` is absent, the app works fully; it just doesn't persist email captures. This also makes it easy for anyone to fork and run the tool without configuring external services.

---

**Decision:** Hardcoded audit rules (static pricing database) instead of AI-generated recommendations  
**Alternatives considered:** Call an LLM on every audit submission to generate personalized recommendations; maintain a CMS-backed pricing table  
**Why:** Determinism matters here. Engineers and EMs doing a spend audit want consistent, explainable output — not a model hallucinating a price or inventing a tool comparison. Hardcoded rules are also instant (no latency), free (no API cost per audit), and easy to audit themselves. The tradeoff is maintenance: pricing changes mean updating a config file. That's acceptable at this stage.

---

**Decision:** No login required  
**Alternatives considered:** Gate the tool behind an email wall up front; require OAuth with GitHub or Google to verify identity  
**Why:** Friction kills top-of-funnel conversion in lead-gen tools. The goal is to get an engineering manager to the results page before they decide whether CredMaster is worth their time. Requiring login before showing value is a bet that your brand trust exceeds their skepticism — and at launch, it doesn't. Login comes after value delivery, not before. Email is captured on the results page, conditional on finding real savings.

---

**Decision:** Honeypot field for spam prevention instead of hCaptcha  
**Alternatives considered:** hCaptcha, reCAPTCHA v3, Cloudflare Turnstile, rate limiting by IP  
**Why:** CAPTCHAs introduce visible friction and fail on accessibility. The target user — a technical EM — is especially likely to find a CAPTCHA condescending. A honeypot (hidden form field that bots fill in but humans don't) catches the vast majority of automated submissions with zero UX cost. If bot traffic becomes a real problem at scale, Cloudflare Turnstile (invisible challenge) is the next step.

---

**Decision:** Dynamic OG images via `@vercel/og` instead of a static image  
**Alternatives considered:** Single static OG image for all pages; Cloudinary-based dynamic images; no OG image  
**Why:** CredMaster's results page is the shareable artifact — if someone tweets "we found $3,200/month in waste," the OG image should show that number, not a generic logo. `@vercel/og` renders JSX to PNG at the edge with zero infrastructure cost, making it the lowest-overhead path to personalized share images. The tradeoff is an extra edge function invocation per share, which is negligible at this traffic level.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | File-based routing, built-in API routes, edge runtime support, and first-class Vercel deployment — the right default for a one-week build |
| Language | TypeScript | Catches pricing calculation errors at compile time; the audit logic has enough numeric operations to make type safety worth the setup cost |
| Styling | Tailwind CSS | Utility-first means fast iteration; no context switching between stylesheet and component files |
| Database | Supabase (Postgres) | Managed Postgres with a generous free tier, instant REST API, and row-level security for email capture storage. No infrastructure to manage. |
| OG Images | @vercel/og | Dynamic share images at the edge (see Decisions above) |
| Email | Resend | Simple API, generous free tier (3K emails/month), React Email templates. Sends the full audit report to users who capture their email. |
| Analytics | Plausible | Privacy-first, no cookie banner required, GDPR-compliant. Captures the five instrumented events (see METRICS.md) without tracking individuals. |
| Deployment | Vercel | Zero-config Next.js deployment, edge functions, instant preview URLs for each PR |
| Form validation | Zod | Schema validation for audit form inputs server-side; shares schemas with TypeScript types |
| Testing | Vitest + React Testing Library | Fast, ESM-native, drop-in Jest replacement. Unit tests on audit calculation logic; integration tests on form submission flow. |
