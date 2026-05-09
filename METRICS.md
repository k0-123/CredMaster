# METRICS.md — CredMaster Measurement Framework

---

## North Star Metric

**Qualified leads per week** — defined as: email captures where estimated monthly waste ≥ $500.

### Why this and not something else

This is a B2B lead-gen tool. Its job is not to maximize audits, pageviews, or time-on-site — it's to surface potential Credex customers who have a real problem. "Qualified leads per week" is the metric closest to revenue without being revenue itself, which makes it the right north star at this stage.

- **Not "audit completions":** Completions are vanity if none convert. An audit tool that 10,000 people complete but nobody books a call from is a content marketing experiment, not a product.
- **Not "consultation calls booked":** That's one step too far downstream — it's influenced by email copy and outreach timing, not just product quality.
- **Not "DAU":** This isn't a retention product. No one should need to re-audit every day. Return usage is a sign something went wrong the first time.

Qualified leads per week ties product quality (does the audit surface real waste?) directly to business outcome (does Credex get pipeline?).

**Baseline:** 0 (pre-launch)
**Week-4 target:** 5 qualified leads/week
**Month-3 target:** 15 qualified leads/week

---

## 3 Input Metrics That Drive the North Star

### Input Metric 1: Audit completion rate

**What it measures:** % of visitors who start the audit form and submit it.

**Baseline estimate:** Unknown pre-launch; industry benchmark for multi-step forms is 40–60%.

**Target:** ≥ 55%

**How to improve it:**
- Reduce form fields (every field costs ~5% completion)
- Add inline progress indicator ("Step 2 of 3")
- Show a preview of results before the final submit to increase commitment

---

### Input Metric 2: Results page email capture rate

**What it measures:** % of completed audits where the user enters their email to receive the full report.

**Baseline estimate:** Unknown; comparable lead-gen tools see 10–20%.

**Target:** ≥ 15%

**How to improve it:**
- Gate the highest-value finding (the biggest single line of waste) behind the email capture
- Make the CTA specific: "Get your full breakdown + optimization plan" not "Enter email"
- Only show the email capture when estimated savings ≥ $300/month — low-savings results don't convert anyway, and showing the form to everyone dilutes the rate

---

### Input Metric 3: Organic channel attribution

**What it measures:** Which traffic source produces the highest qualified lead rate (not just volume). This is the lever for deciding where to spend time in Week 3–4.

**Baseline estimate:** Unknown until tagged links are live.

**Target:** Identify the top-converting channel by Day 21; put 80% of distribution effort there by Day 30.

**How to improve it:**
- UTM-tag every link before posting anywhere
- Build a simple internal dashboard (Plausible or even a Google Sheet) that maps source → audits → emails → consultations
- Don't optimize for raw traffic; optimize for traffic that converts at ≥ 15% email rate

---

## What to Instrument First

**Event 1: `audit_started`**
- Properties: `referrer`, `utm_source`, `utm_medium`, `timestamp`
- Why: Tells you which channels drive actual engagement, not just bounces

**Event 2: `audit_completed`**
- Properties: `tool_count`, `total_seats`, `team_size`, `estimated_monthly_spend`, `estimated_waste`, `estimated_savings`
- Why: This is the core product event; without it, you can't calculate completion rate or segment by customer profile

**Event 3: `email_captured`**
- Properties: `estimated_savings`, `tool_count`, `referrer`, `time_to_capture` (seconds from audit_completed)
- Why: This is the conversion event. `estimated_savings` tells you whether the email gate threshold is calibrated correctly

**Event 4: `results_shared`**
- Properties: `share_method` (link, Twitter, LinkedIn), `estimated_savings`
- Why: Viral loop signal; if people share high-savings results, you have a built-in distribution mechanism

**Event 5: `consultation_booked`**
- Properties: `estimated_savings`, `tool_count`, `channel` (from utm), `time_from_audit` (hours)
- Why: The final conversion event; lets you calculate channel-level CAC and optimize accordingly
