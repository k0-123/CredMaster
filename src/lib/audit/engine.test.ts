import { describe, it, expect } from 'vitest';
import { runAudit, calculateCurrentSpend, detectDuplicates } from './engine';
import { AuditInput } from '@/types/audit';

describe('Audit Engine Core Logic', () => {
  it('should correctly calculate current spend', () => {
    const input: AuditInput = {
      companyName: 'Test Inc',
      employeeCount: 10,
      engineeringTeamSize: 5,
      subscriptions: [
        { tool: 'cursor', plan: 'pro', seats: 5 }, // 5 * $20 = $100
        { tool: 'claude', plan: 'team', seats: 10 } // 10 * $30 = $300
      ]
    };
    
    const spend = calculateCurrentSpend(input.subscriptions);
    expect(spend).toBe(400);
  });

  it('should detect duplicate tools in the same category', () => {
    const input: AuditInput = {
      companyName: 'Test Inc',
      employeeCount: 10,
      engineeringTeamSize: 5,
      subscriptions: [
        { tool: 'cursor', plan: 'pro', seats: 5 },
        { tool: 'copilot', plan: 'pro', seats: 5 },
        { tool: 'claude', plan: 'team', seats: 10 }
      ]
    };
    
    const duplicates = detectDuplicates(input.subscriptions);
    expect(duplicates).toContain('Code Editors');
    expect(duplicates).not.toContain('Conversational AI');
  });

  it('should suggest removing excess seats based on team size', () => {
    const input: AuditInput = {
      companyName: 'Test Inc',
      employeeCount: 10,
      engineeringTeamSize: 5,
      subscriptions: [
        { tool: 'cursor', plan: 'pro', seats: 10 }, // 5 extra
      ]
    };
    
    const result = runAudit(input);
    expect(result.optimizationSuggestions.length).toBe(1);
    expect(result.optimizationSuggestions[0].monthlySavings).toBe(100); // 5 * $20
  });

  it('should suggest downgrading from team to pro if seats < 5', () => {
    const input: AuditInput = {
      companyName: 'Test Inc',
      employeeCount: 10,
      engineeringTeamSize: 5,
      subscriptions: [
        { tool: 'cursor', plan: 'team', seats: 3 }, // 3 * $40 = $120. Pro is $20. Savings: 3 * 20 = $60
      ]
    };
    
    const result = runAudit(input);
    expect(result.optimizationSuggestions.length).toBe(1);
    expect(result.optimizationSuggestions[0].recommendedPlan).toBe('pro');
    expect(result.optimizationSuggestions[0].monthlySavings).toBe(60);
  });

  it('should suggest alternatives and calculate total savings correctly', () => {
    const input: AuditInput = {
      companyName: 'Test Inc',
      employeeCount: 10,
      engineeringTeamSize: 10,
      subscriptions: [
        { tool: 'cursor', plan: 'pro', seats: 10 },   // $200
        { tool: 'copilot', plan: 'pro', seats: 5 },   // $50
        { tool: 'claude', plan: 'team', seats: 10 },  // $300
        { tool: 'chatgpt', plan: 'team', seats: 5 }   // $150
      ]
    }; // Total spend: $700
    
    const result = runAudit(input);
    
    expect(result.totalCurrentMonthlySpend).toBe(700);
    // Cursor (10) > Copilot (5) -> Consolidate to Cursor -> Save $50
    // Claude (10) > ChatGPT (5) -> Consolidate to Claude -> Save $150
    // Total savings should be $200
    expect(result.alternativeSuggestions.length).toBe(2);
    expect(result.totalMonthlySavings).toBe(200);
    expect(result.totalOptimizedMonthlySpend).toBe(500);
  });
});
