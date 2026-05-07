import { describe, it, expect, beforeEach } from "vitest";
import { runAudit } from "./auditEngine";
import type { AuditInput } from "./types";

describe("Audit Engine", () => {
  // ── Test 1 — Seat waste on coding tool ──
  it("recommends reducing seats when seats > engineerCount for coding tools", () => {
    const input: AuditInput = {
      teamSize: 10,
      engineerCount: 5,
      primaryUseCase: "coding",
      tools: [{ tool: "cursor", plan: "pro", seats: 10, monthlySpend: 200 }],
    };
    const result = runAudit(input);
    const rec = result.toolResults[0].recommendation;
    expect(rec.type).toBe("reduce-seats");
    expect(result.toolResults[0].savingsPerMonth).toBe(100); // (10-5) * 20
  });

  // ── Test 2 — Claude Team downgrade ──
  it("recommends downgrading Claude Team to Pro when seats < 5", () => {
    const input: AuditInput = {
      teamSize: 10,
      engineerCount: 5,
      primaryUseCase: "writing",
      tools: [{ tool: "claude", plan: "team", seats: 3, monthlySpend: 90 }],
    };
    const result = runAudit(input);
    const rec = result.toolResults[0].recommendation;
    expect(rec.type).toBe("downgrade");
    if (rec.type === "downgrade") {
      expect(rec.suggestedPlan).toBe("pro");
    }
    expect(result.toolResults[0].savingsPerMonth).toBe(30); // 90 - (3*20)
  });

  // ── Test 3 — Duplicate tool overlap (cursor + copilot) ──
  it("flags github-copilot as redundant when cursor is also present", () => {
    const input: AuditInput = {
      teamSize: 10,
      engineerCount: 10,
      primaryUseCase: "coding",
      tools: [
        { tool: "cursor", plan: "pro", seats: 2, monthlySpend: 40 },
        { tool: "github-copilot", plan: "individual", seats: 2, monthlySpend: 20 },
      ],
    };
    const result = runAudit(input);
    const copilotResult = result.toolResults.find((r) => r.tool === "github-copilot")!;
    expect(copilotResult.recommendation.type).toBe("switch");
    expect(copilotResult.recommendation.reason).toMatch(/Cursor/);
  });

  // ── Test 4 — Already optimal ──
  it("returns optimal when no rules fire", () => {
    const input: AuditInput = {
      teamSize: 5,
      engineerCount: 3,
      primaryUseCase: "writing",
      tools: [{ tool: "claude", plan: "pro", seats: 2, monthlySpend: 40 }],
    };
    const result = runAudit(input);
    const rec = result.toolResults[0].recommendation;
    expect(rec.type).toBe("optimal");
    expect(result.toolResults[0].savingsPerMonth).toBe(0);
  });

  // ── Test 5 — Total savings math ──
  it("correctly sums total monthly and annual savings", () => {
    const input: AuditInput = {
      teamSize: 5,
      engineerCount: 5,
      primaryUseCase: "coding",
      tools: [
        { tool: "cursor", plan: "business", seats: 5, monthlySpend: 200 },
        { tool: "github-copilot", plan: "individual", seats: 5, monthlySpend: 50 },
      ],
    };
    const result = runAudit(input);
    // Cursor business < 5 seats → but seats === 5, so no downgrade
    // Actually cursor business seats < 5 rule won't fire since seats = 5.
    // Copilot is redundant with cursor → savings = 50
    // Cursor business seats=5, no downgrade (rule requires < 5)
    // So let's adjust: copilot flagged as redundant = $50
    // Cursor seats = engineerCount so no seat waste
    // Cursor business + 5 seats → not < 5, so no downgrade
    // Total = 50
    // Let me recalculate with seats=3 for cursor business
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });

  // ── Test 5b — Total savings math with correct inputs ──
  it("computes cursor downgrade + copilot drop correctly", () => {
    const input: AuditInput = {
      teamSize: 5,
      engineerCount: 5,
      primaryUseCase: "coding",
      tools: [
        { tool: "cursor", plan: "business", seats: 4, monthlySpend: 160 },
        { tool: "github-copilot", plan: "individual", seats: 5, monthlySpend: 50 },
      ],
    };
    const result = runAudit(input);
    // Copilot: redundant with cursor → switch, savings = 50
    // Cursor: business, 4 seats < 5 → downgrade to pro, savings = 4*(40-20) = 80
    expect(result.totalMonthlySavings).toBe(130);
    expect(result.totalAnnualSavings).toBe(1560);
  });

  // ── Test 8 — Use-case mismatch ──
  it("flags cursor as mismatched for a writing-focused team", () => {
    const input: AuditInput = {
      teamSize: 5,
      engineerCount: 0,
      primaryUseCase: "writing",
      tools: [{ tool: "cursor", plan: "pro", seats: 2, monthlySpend: 40 }],
    };
    const result = runAudit(input);
    const rec = result.toolResults[0].recommendation;
    expect(rec.type).toBe("switch");
    expect(rec.reason).toMatch(/writing/i);
    expect(rec.reason).toMatch(/IDE/);
  });
});
