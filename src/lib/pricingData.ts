// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Pricing data for all AI tools
// Sources verified as of 2025-01
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const PRICING_DATA = {
  "cursor": {
    "hobby": { pricePerSeat: 0, annualOption: false },       // https://cursor.com/pricing
    "pro": { pricePerSeat: 20, annualOption: true },          // https://cursor.com/pricing
    "business": { pricePerSeat: 40, annualOption: true },     // https://cursor.com/pricing
  },
  "github-copilot": {
    "individual": { pricePerSeat: 10, annualOption: true },   // https://github.com/features/copilot
    "business": { pricePerSeat: 19, annualOption: false },    // https://github.com/features/copilot
    "enterprise": { pricePerSeat: 39, annualOption: false },  // https://github.com/features/copilot
  },
  "claude": {
    "free": { pricePerSeat: 0 },                              // https://claude.ai/pricing
    "pro": { pricePerSeat: 20 },                              // https://claude.ai/pricing
    "max": { pricePerSeat: 100 },                             // https://claude.ai/pricing
    "team": { pricePerSeat: 30, minimumSeats: 5 },            // https://claude.ai/pricing
  },
  "chatgpt": {
    "plus": { pricePerSeat: 20 },                             // https://openai.com/chatgpt/pricing
    "team": { pricePerSeat: 30, minimumSeats: 2 },            // https://openai.com/chatgpt/pricing
    "enterprise": { pricePerSeat: null as number | null },    // https://openai.com/chatgpt/pricing — custom pricing
  },
  "anthropic-api": {
    "pay-as-you-go": { pricePerSeat: null as number | null }, // https://www.anthropic.com/pricing — usage based
  },
  "openai-api": {
    "pay-as-you-go": { pricePerSeat: null as number | null }, // https://openai.com/api/pricing — usage based
  },
  "gemini": {
    "free": { pricePerSeat: 0 },                              // https://one.google.com/about/plans
    "pro": { pricePerSeat: 19.99 },                           // https://one.google.com/about/plans
    "ultra": { pricePerSeat: 29.99 },                         // https://one.google.com/about/plans
  },
  "windsurf": {
    "free": { pricePerSeat: 0 },                              // https://codeium.com/windsurf/pricing
    "pro": { pricePerSeat: 15 },                              // https://codeium.com/windsurf/pricing
    "team": { pricePerSeat: 35 },                             // https://codeium.com/windsurf/pricing
  },
} as const;
