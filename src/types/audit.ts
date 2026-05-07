export type AITool = 
  | 'cursor'
  | 'copilot'
  | 'windsurf'
  | 'claude'
  | 'chatgpt'
  | 'gemini';

export type PlanType = 'free' | 'pro' | 'team' | 'enterprise';

export interface ToolSubscription {
  tool: AITool;
  plan: PlanType;
  seats: number;
  monthlyCost?: number; // Actual current spend input by user
}

export interface AuditInput {
  companyName: string;
  employeeCount: number;
  engineeringTeamSize: number;
  subscriptions: ToolSubscription[];
}

export interface OptimizationSuggestion {
  tool: AITool;
  currentPlan: PlanType;
  recommendedPlan: PlanType;
  rationale: string;
  monthlySavings: number;
}

export interface AlternativeSuggestion {
  currentTool: AITool;
  alternativeTool: AITool;
  rationale: string;
  monthlySavings: number;
}

export interface AuditResult {
  totalCurrentMonthlySpend: number;
  totalOptimizedMonthlySpend: number;
  totalMonthlySavings: number;
  optimizationSuggestions: OptimizationSuggestion[];
  alternativeSuggestions: AlternativeSuggestion[];
  duplicateCategories: string[];
}
