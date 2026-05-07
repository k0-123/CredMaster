# Tests

## Audit Engine Tests

**File:** `src/lib/auditEngine.test.ts`
**Run:** `npm test`

| # | Test | What It Covers |
|---|------|---------------|
| 1 | Seat waste on coding tool | Cursor Pro with 10 seats but only 5 engineers → recommends reduce-seats, savings = $100/mo |
| 2 | Claude Team downgrade | Claude Team with 3 seats (< 5 minimum) → recommends downgrade to Pro, savings = $30/mo |
| 3 | Duplicate tool overlap (cursor + copilot) | Both Cursor + GitHub Copilot active → flags Copilot as redundant switch with reason mentioning Cursor |
| 4 | Already optimal | Claude Pro with 2 seats, team of 5, no overlaps → returns optimal, savings = $0 |
| 5 | Total savings math | Verifies totalAnnualSavings === totalMonthlySavings * 12 |
| 5b | Cursor downgrade + copilot drop | Cursor Business 4 seats (downgrade) + Copilot 5 seats (redundant) → total = $130/mo, $1560/yr |
| 8 | Use-case mismatch | primaryUseCase="writing" + Cursor → flags as switch with reason mentioning "writing" and "IDE" |

## API Route Tests

**File:** `src/app/api/audit/route.test.ts`
**Run:** `npm test`

| # | Test | What It Covers |
|---|------|---------------|
| 6 | Honeypot in API route | POST with website="spam.com" → returns 200 with fake-id, audit NOT stored in map |
| 7 | Rate limiting | 11 requests from same IP within 60s → 11th request returns HTTP 429 |
