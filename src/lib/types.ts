// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// All shared TypeScript types for CredMaster
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type ToolName =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

export type ToolEntry = {
  tool: ToolName;
  plan: string;
  monthlySpend: number;
  seats: number;
};

export type AuditInput = {
  tools: ToolEntry[];
  teamSize: number;
  engineerCount: number;
  primaryUseCase: "coding" | "writing" | "data" | "research" | "mixed";
  website?: string; // honeypot field
};

export type Recommendation =
  | { type: "downgrade"; reason: string; savingsPerMonth: number; suggestedPlan: string }
  | { type: "switch"; reason: string; savingsPerMonth: number; suggestedTool: string; suggestedPlan: string }
  | { type: "reduce-seats"; reason: string; savingsPerMonth: number; suggestedSeats: number }
  | { type: "optimal"; reason: string; savingsPerMonth: 0 };

export type ToolAuditResult = {
  tool: ToolName;
  plan: string;
  currentMonthlySpend: number;
  recommendation: Recommendation;
  savingsPerMonth: number;
};

export type AuditResult = {
  id: string;
  input: AuditInput;
  toolResults: ToolAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary: string | null;
  createdAt: string;
};
