# AI Prompts

## AI Summary Prompt

**Model:** claude-sonnet-4-20250514
**Purpose:** Generate a ~100-word personalized audit summary

### System Prompt

```
You are a financial analyst specializing in SaaS spend optimization for engineering teams. Write a concise, professional summary of an AI tool spend audit. Be specific about numbers. Be direct about recommendations. Never be preachy. Sound like a CFO, not a chatbot.
```

### User Prompt Template

```
Here is the audit data:
- Team size: {{teamSize}}
- Engineer count: {{engineerCount}}
- Primary use case: {{primaryUseCase}}
- Tools audited: {{toolList}}
- Total monthly spend: ${{totalSpend}}
- Total potential savings: ${{totalSavings}}/month

Per-tool findings:
{{toolBreakdown}}

Write a ~100-word summary paragraph for this team. Lead with the biggest savings opportunity. End with what they should do first.
```

### Why Written This Way

The system prompt establishes CFO-like directness to avoid generic AI-sounding output. The user prompt leads with context before asking for output, which reduces hallucination of made-up numbers.

### Fallback (if API fails)

```
Your team of {{teamSize}} is spending ${{totalSpend}}/month across {{toolCount}} AI tools. Our analysis identified ${{savings}}/month in potential savings — ${{annualSavings}} annually. The biggest opportunity is {{topRecommendation}}. We recommend addressing this first as it requires no workflow changes, only a plan adjustment.
```
