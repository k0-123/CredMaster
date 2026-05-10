# Tests

## How to Run
```bash
npm test           # run all tests once
npm test -- --watch  # watch mode
```

## Test File
src/lib/auditEngine.test.ts

## All Tests

| # | Test Name | What It Covers |
|---|-----------|---------------|
| 1 | Seat waste on coding tool | cursor with 10 seats, 5 engineers → reduce-seats recommendation, savings = $100 |
| 2 | Claude Team downgrade | 3 seats on Team plan → downgrade to Pro, savings = $30 |
| 3 | Duplicate tool overlap | cursor + copilot together → copilot flagged as redundant |
| 4 | Already optimal | claude pro, 2 seats, no duplicates → optimal, $0 savings |
| 5 | Total savings math | cursor business + copilot → totalMonthlySavings = $150, annual = $1800 |
| 6 | Honeypot in API route | POST with website field → 200 but not stored |
| 7 | Rate limiting | 11 requests from same IP → 11th returns 429 |
| 8 | Use-case mismatch | writing use case + cursor → reason mentions writing |
| 9 | Fallback summary generation | mock audit → string contains tool name and savings |
| 10 | Email validation | invalid email → 400, valid email → not 400 |
| 11 | Supabase fallback | no SUPABASE_URL → falls back to in-memory, returns 200 |
| 12 | Analytics trackEvent | trackEvent called → no error thrown, returns void |
| 13 | Benchmark high spender | $500 spend, 3 engineers → above p75 threshold |
| 14 | Benchmark normal spender | $180 spend, 4 engineers → between p25 and p75 |
| 15 | getCompanySize buckets | all size boundaries return correct bucket |
| 16 | Credits rule fires | claude pro + anthropic-api, coding use case → switch recommendation |
| 17 | getSpendPerDev math | 300/5=60, 0/5=0, division by zero guard |
| 18 | Zero spend guard | cursor pro, $0 spend → optimal with explanation |

## CI
Tests run automatically on every push to main.
See: .github/workflows/ci.yml
