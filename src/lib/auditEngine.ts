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

    // ── RULE 6 — ALREADY OPTIMAL ──
    if (!recommendation) {
      recommendation = {
        type: "optimal",
        reason: "Spend looks right-sized for your team and use case.",
        savingsPerMonth: 0 as 0,
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
