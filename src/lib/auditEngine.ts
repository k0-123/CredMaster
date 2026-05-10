// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Pure audit logic — no side effects
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { AuditInput, AuditResult, Recommendation, ToolAuditResult, ToolName } from "./types";
import { PRICING_DATA } from "./pricingData";

const CODING_TOOLS: ToolName[] = ["cursor", "github-copilot", "windsurf"];
const GENERAL_TOOLS: ToolName[] = ["claude", "chatgpt"];

function getPricePerSeat(tool: ToolName, plan: string): number {
  const toolData = PRICING_DATA[tool];
  const planData = (toolData as Record<string, { pricePerSeat: number | null }>)[plan];
  return planData?.pricePerSeat ?? 0;
}

export function runAudit(
  input: AuditInput
): Omit<AuditResult, "id" | "aiSummary" | "createdAt"> {
  const toolResults: ToolAuditResult[] = [];
  const activeToolNames = input.tools.map((t) => t.tool);

  for (const entry of input.tools) {
    const { tool, plan, monthlySpend, seats } = entry;
    const pricePerSeat = getPricePerSeat(tool, plan);

    let recommendation: Recommendation | null = null;

    // ── GUARD — ZERO SPEND ──
    if (monthlySpend === 0 && plan !== "free" && plan !== "hobby") {
      toolResults.push({
        tool,
        plan,
        currentMonthlySpend: 0,
        recommendation: {
          type: "optimal",
          reason:
            "No spend recorded for this tool. If you are on a paid plan, update your monthly spend for an accurate audit.",
          savingsPerMonth: 0,
        },
        savingsPerMonth: 0,
      });
      continue;
    }

    // ── RULE 4 — TOOL OVERLAP (checked first so it can override) ──

    // 4a: cursor + copilot → copilot is redundant
    if (tool === "github-copilot" && activeToolNames.includes("cursor")) {
      const savings = monthlySpend;
      recommendation = {
        type: "switch",
        reason:
          "Cursor bundles a Copilot-equivalent AI natively. Running both is double-paying for autocomplete. Drop Copilot and use Cursor's built-in completions.",
        savingsPerMonth: savings,
        suggestedTool: "cursor",
        suggestedPlan: "pro",
      };
    }

    // 4b: anthropic-api + claude (Pro/Max) → claude web is redundant
    if (
      !recommendation &&
      tool === "claude" &&
      (plan === "pro" || plan === "max") &&
      activeToolNames.includes("anthropic-api")
    ) {
      const savings = monthlySpend;
      recommendation = {
        type: "switch",
        reason:
          "If you're already using the Anthropic API directly, a Claude.ai subscription is redundant unless specific team members need the web UI exclusively.",
        savingsPerMonth: savings,
        suggestedTool: "anthropic-api",
        suggestedPlan: "pay-as-you-go",
      };
    }

    // 4c: claude + chatgpt → flag the cheaper one for consolidation
    if (
      !recommendation &&
      (tool === "claude" || tool === "chatgpt") &&
      activeToolNames.includes("claude") &&
      activeToolNames.includes("chatgpt")
    ) {
      const claudeEntry = input.tools.find((t) => t.tool === "claude")!;
      const chatgptEntry = input.tools.find((t) => t.tool === "chatgpt")!;

      const isCheaperOne =
        (tool === "chatgpt" && chatgptEntry.monthlySpend <= claudeEntry.monthlySpend) ||
        (tool === "claude" && claudeEntry.monthlySpend < chatgptEntry.monthlySpend);

      if (isCheaperOne) {
        recommendation = {
          type: "switch",
          reason: `Claude and ChatGPT have near-identical capabilities for ${input.primaryUseCase}. Most teams pick one. Consolidating to the lower-cost option saves $${monthlySpend}/month.`,
          savingsPerMonth: monthlySpend,
          suggestedTool: tool === "chatgpt" ? "claude" : "chatgpt",
          suggestedPlan: "pro",
        };
      }
    }

    // ── RULE 5 — USE-CASE MISMATCH (checked before seat waste so specific advice wins) ──
    if (
      !recommendation &&
      input.primaryUseCase === "coding" &&
      tool === "gemini" &&
      !activeToolNames.includes("cursor") &&
      !activeToolNames.includes("windsurf")
    ) {
      recommendation = {
        type: "switch",
        reason:
          "Gemini's coding assistance is weaker than IDE-native tools. Cursor Pro or Windsurf Free integrate directly into your editor for the same cost or less.",
        savingsPerMonth: monthlySpend,
        suggestedTool: "cursor",
        suggestedPlan: "pro",
      };
    }

    if (!recommendation && input.primaryUseCase === "writing" && tool === "cursor") {
      recommendation = {
        type: "switch",
        reason:
          "Cursor is an IDE-first tool. For a writing-focused team, Claude Pro or ChatGPT Plus delivers more value per dollar without the IDE overhead.",
        savingsPerMonth: 0,
        suggestedTool: "claude",
        suggestedPlan: "pro",
      };
    }

    // ── RULE 1 — SEAT WASTE (coding tools) ──
    if (!recommendation && CODING_TOOLS.includes(tool) && seats > input.engineerCount) {
      const savings = (seats - input.engineerCount) * pricePerSeat;
      recommendation = {
        type: "reduce-seats",
        reason: `You have ${seats} seats but only ${input.engineerCount} engineers. Reducing saves $${savings}/month.`,
        savingsPerMonth: savings,
        suggestedSeats: input.engineerCount,
      };
    }

    // ── RULE 2 — SEAT WASTE (general tools) ──
    if (
      !recommendation &&
      GENERAL_TOOLS.includes(tool) &&
      seats > input.teamSize * 0.7
    ) {
      const suggestedSeats = Math.ceil(input.teamSize * 0.7);
      const savings = (seats - suggestedSeats) * pricePerSeat;
      recommendation = {
        type: "reduce-seats",
        reason:
          "Typically 70% of a team actively uses AI writing tools. You may be over-licensed.",
        savingsPerMonth: savings,
        suggestedSeats,
      };
    }

    // ── RULE 3 — PLAN DOWNGRADE ──
    if (!recommendation && tool === "claude" && plan === "team" && seats < 5) {
      const savings = monthlySpend - seats * 20;
      recommendation = {
        type: "downgrade",
        reason:
          "Claude Team requires 5+ seats minimum but costs $30/seat. With fewer than 5 users, individual Pro plans at $20/seat are cheaper and include the same models.",
        savingsPerMonth: savings,
        suggestedPlan: "pro",
      };
    }

    if (!recommendation && tool === "chatgpt" && plan === "team" && seats < 3) {
      const savings = monthlySpend - seats * 20;
      recommendation = {
        type: "downgrade",
        reason:
          "ChatGPT Team adds shared workspace for 2+ users but costs $30/seat. Under 3 users, Plus at $20/seat gives the same GPT-4o access.",
        savingsPerMonth: savings,
        suggestedPlan: "plus",
      };
    }

    if (!recommendation && tool === "cursor" && plan === "business" && seats < 5) {
      const savings = seats * 40 - seats * 20;
      recommendation = {
        type: "downgrade",
        reason:
          "Cursor Business adds admin controls and SSO. Under 5 users these rarely justify the $20/seat premium over Pro.",
        savingsPerMonth: savings,
        suggestedPlan: "pro",
      };
    }
    // ── RULE 7 — RETAIL VS CREDITS ──
    if (!recommendation) {
      // Case A: Claude Pro/Max + Anthropic API
      if (
        tool === "claude" &&
        (plan === "pro" || plan === "max") &&
        (input.primaryUseCase === "coding" || input.primaryUseCase === "data") &&
        activeToolNames.includes("anthropic-api")
      ) {
        recommendation = {
          type: "switch",
          reason:
            "You are paying $20-100/month for Claude.ai Pro/Max while also using the Anthropic API directly. For coding and data workflows, API access gives the same models at pay-as-you-go rates. If your usage is under $20/month in API calls, drop the subscription and use API credits only.",
          savingsPerMonth: monthlySpend,
          suggestedTool: "anthropic-api",
          suggestedPlan: "pay-as-you-go",
        };
      }

      // Case B: ChatGPT Plus + OpenAI API
      if (
        !recommendation &&
        tool === "chatgpt" &&
        plan === "plus" &&
        (input.primaryUseCase === "coding" || input.primaryUseCase === "data") &&
        activeToolNames.includes("openai-api")
      ) {
        recommendation = {
          type: "switch",
          reason:
            "You are paying $20/month for ChatGPT Plus while also using the OpenAI API directly. API credits give the same GPT-4o access at pay-as-you-go rates. Teams doing coding or data work rarely need the ChatGPT web UI if they already have API access.",
          savingsPerMonth: monthlySpend,
          suggestedTool: "openai-api",
          suggestedPlan: "pay-as-you-go",
        };
      }

      // Case C: Gemini Pro/Ultra + API Overlap
      if (
        !recommendation &&
        tool === "gemini" &&
        (plan === "pro" || plan === "ultra") &&
        (activeToolNames.includes("openai-api") || activeToolNames.includes("anthropic-api"))
      ) {
        recommendation = {
          type: "switch",
          reason:
            "Gemini Pro/Ultra overlaps significantly with the API access you already have. Unless your team specifically needs Google Workspace integration or Gemini's unique multimodal features, consolidating to your existing API provider eliminates this $19-30/month redundancy.",
          savingsPerMonth: monthlySpend,
          suggestedTool: activeToolNames.includes("anthropic-api") ? "anthropic-api" : "openai-api",
          suggestedPlan: "pay-as-you-go",
        };
      }

      // Case D: General credits awareness (Claude Pro teams)
      if (
        !recommendation &&
        tool === "claude" &&
        plan === "pro" &&
        seats >= 3 &&
        input.primaryUseCase !== "writing"
      ) {
        recommendation = {
          type: "downgrade",
          reason:
            "For teams of 3+ primarily doing non-writing work, Anthropic API credits often cost less than multiple Pro subscriptions at $20/seat. At moderate usage, $60/month in API credits goes further than 3 Pro seats and gives programmatic access.",
          savingsPerMonth: Math.round(monthlySpend * 0.3),
          suggestedPlan: "api-credits",
        };
      }
    }

    // ── RULE 6 — ALREADY OPTIMAL ──
    if (!recommendation) {
      recommendation = {
        type: "optimal",
        reason: "Spend looks right-sized for your team and use case.",
        savingsPerMonth: 0,
      };
    }

    const savingsPerMonth =
      recommendation.type === "optimal" ? 0 : recommendation.savingsPerMonth;

    toolResults.push({
      tool,
      plan,
      currentMonthlySpend: monthlySpend,
      recommendation,
      savingsPerMonth,
    });
  }

  const totalMonthlySavings = toolResults.reduce(
    (sum, r) => sum + r.savingsPerMonth,
    0
  );
  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    input,
    toolResults,
    totalMonthlySavings,
    totalAnnualSavings,
  };
}

/**
 * Generates a fallback CFO-style summary if the AI API fails.
 */
export function generateFallbackSummary(audit: Partial<AuditResult> & { input: AuditInput }): string {
  if (!audit.toolResults || !audit.input) return "Summary unavailable.";

  const topRec = [...audit.toolResults]
    .filter((r) => r.recommendation.type !== 'optimal')
    .sort((a, b) => b.savingsPerMonth - a.savingsPerMonth)[0];
  
  const totalMonthlySpend = audit.input.tools.reduce((s, t) => s + t.monthlySpend, 0);

  if (audit.totalMonthlySavings === 0) {
    return `Your team\'s AI tool spend appears well-optimized. Across ${audit.toolResults.length} tools reviewed, all plans are appropriately sized for your team of ${audit.input.teamSize}. Continue monitoring as your team grows — plan tiers that fit today may become inefficient as headcount changes.`;
  }

  return `Your team of ${audit.input.teamSize} is currently spending $${totalMonthlySpend}/month across ${audit.toolResults.length} AI tools. Our analysis found $${audit.totalMonthlySavings}/month ($${audit.totalAnnualSavings}/year) in potential savings. The largest opportunity is ${topRec?.tool}: ${topRec?.recommendation.reason ?? 'plan optimization'}. Addressing this requires no workflow changes — only a plan adjustment.`;
}

/**
 * Simple email validation regex helper.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
