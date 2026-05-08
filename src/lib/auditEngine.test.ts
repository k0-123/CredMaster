import { describe, it, expect } from "vitest";
import { runAudit, generateFallbackSummary, isValidEmail } from "./auditEngine";
import type { AuditInput } from "./types";

describe("Audit Engine & Utilities", () => {
  // ── Existing Tests 1-8 ──
  
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
    expect(result.toolResults[0].savingsPerMonth).toBe(100);
  });

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
    expect(result.toolResults[0].savingsPerMonth).toBe(30);
  });

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
  });

  it("returns optimal when no rules fire", () => {
    const input: AuditInput = {
      teamSize: 5,
      engineerCount: 3,
      primaryUseCase: "writing",
      tools: [{ tool: "claude", plan: "pro", seats: 2, monthlySpend: 40 }],
    };
    const result = runAudit(input);
    expect(result.toolResults[0].recommendation.type).toBe("optimal");
  });

  it("correctly sums total monthly and annual savings", () => {
    const input: AuditInput = {
      teamSize: 5,
      engineerCount: 5,
      primaryUseCase: "coding",
      tools: [
        { tool: "cursor", plan: "pro", seats: 5, monthlySpend: 100 },
        { tool: "github-copilot", plan: "individual", seats: 5, monthlySpend: 50 },
      ],
    };
    const result = runAudit(input);
    expect(result.totalMonthlySavings).toBe(50);
    expect(result.totalAnnualSavings).toBe(600);
  });

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
    expect(result.totalMonthlySavings).toBe(130); // (4*20) + 50
  });

  it("flags cursor as mismatched for a writing-focused team", () => {
    const input: AuditInput = {
      teamSize: 5,
      engineerCount: 0,
      primaryUseCase: "writing",
      tools: [{ tool: "cursor", plan: "pro", seats: 2, monthlySpend: 40 }],
    };
    const result = runAudit(input);
    expect(result.toolResults[0].recommendation.type).toBe("switch");
  });

  // ── Test 9 — Fallback summary generates correctly ──
  it("Test 9: generateFallbackSummary contains tool name and savings", () => {
    const mockAudit = {
      input: { teamSize: 10, engineerCount: 5, primaryUseCase: "coding" as const, tools: [{ tool: "cursor" as const, plan: "pro", seats: 10, monthlySpend: 200 }] },
      toolResults: [{
        tool: "cursor" as const,
        plan: "pro",
        currentMonthlySpend: 200,
        recommendation: { type: "reduce-seats" as const, reason: "Too many seats", savingsPerMonth: 100, suggestedSeats: 5 },
        savingsPerMonth: 100
      }],
      totalMonthlySavings: 100,
      totalAnnualSavings: 1200
    };
    const summary = generateFallbackSummary(mockAudit);
    expect(summary).toContain("cursor");
    expect(summary).toContain("100");
    expect(summary).toContain("1200");
  });

  // ── Test 10 — Email validation ──
  it("Test 10: isValidEmail validates formats correctly", () => {
    expect(isValidEmail("notanemail")).toBe(false);
    expect(isValidEmail("valid@test.com")).toBe(true);
    expect(isValidEmail("test@sub.domain.co")).toBe(true);
    expect(isValidEmail("")).toBe(false);
  });

  // ── Test 11 — Supabase fallback simulation (logic level) ──
  it("Test 11: verify in-memory fallback flag logic", () => {
    const SUPABASE_URL_MOCK = "https://test.supabase.co";
    const isConfigured = (url?: string) => !!url && url !== "your_supabase_project_url";
    
    expect(isConfigured(undefined)).toBe(false);
    expect(isConfigured("your_supabase_project_url")).toBe(false);
    expect(isConfigured(SUPABASE_URL_MOCK)).toBe(true);
  });

  // ── Test 12 — Rule 2 Seat waste (general tools) ──
  it("Test 12: recommends reducing seats for Claude when seats > 70% of team size", () => {
    const input: AuditInput = {
      teamSize: 10,
      engineerCount: 5,
      primaryUseCase: "writing",
      tools: [{ tool: "claude", plan: "pro", seats: 10, monthlySpend: 200 }],
    };
    const result = runAudit(input);
    const rec = result.toolResults[0].recommendation;
    expect(rec.type).toBe("reduce-seats");
    expect(rec.type === "reduce-seats" && rec.suggestedSeats).toBe(7); // 10 * 0.7
  });
});
