import { 
  AITool, 
  AuditInput, 
  AuditResult, 
  OptimizationSuggestion, 
  AlternativeSuggestion,
  ToolSubscription,
  PlanType
} from '@/types/audit';

const PRICING = {
  cursor: {
    free: 0,
    pro: 20,
    team: 40,
    enterprise: 100 // Estimate
  },
  copilot: {
    free: 0,
    pro: 10,
    team: 19, // Business
    enterprise: 39
  },
  windsurf: {
    free: 0,
    pro: 15,
    team: 40,
    enterprise: 150
  },
  claude: {
    free: 0,
    pro: 20,
    team: 30, // Monthly
    enterprise: 100
  },
  chatgpt: {
    free: 0,
    pro: 20, // Plus
    team: 30, // Monthly
    enterprise: 100
  },
  gemini: {
    free: 0,
    pro: 20, // Advanced
    team: 30,
    enterprise: 100
  }
};

const CATEGORIES = {
  editor: ['cursor', 'copilot', 'windsurf'] as AITool[],
  conversational: ['claude', 'chatgpt', 'gemini'] as AITool[]
};

export function calculateCurrentSpend(subscriptions: ToolSubscription[]): number {
  return subscriptions.reduce((total, sub) => {
    // If user provided custom monthly cost, use it, otherwise use fallback from our pricing
    const costPerSeat = sub.monthlyCost !== undefined 
      ? sub.monthlyCost 
      : PRICING[sub.tool][sub.plan];
    return total + (costPerSeat * sub.seats);
  }, 0);
}

export function detectDuplicates(subscriptions: ToolSubscription[]): string[] {
  const duplicates: string[] = [];
  
  const editorCount = subscriptions.filter(s => CATEGORIES.editor.includes(s.tool)).length;
  if (editorCount > 1) {
    duplicates.push('Code Editors');
  }

  const chatCount = subscriptions.filter(s => CATEGORIES.conversational.includes(s.tool)).length;
  if (chatCount > 1) {
    duplicates.push('Conversational AI');
  }

  return duplicates;
}

export function generateAlternativeSuggestions(subscriptions: ToolSubscription[]): AlternativeSuggestion[] {
  const suggestions: AlternativeSuggestion[] = [];
  
  const activeEditors = subscriptions.filter(s => CATEGORIES.editor.includes(s.tool));
  const activeChats = subscriptions.filter(s => CATEGORIES.conversational.includes(s.tool));

  // Suggest consolidating code editors
  if (activeEditors.length > 1) {
    // Pick the one with most seats or default to the first
    const primaryEditor = activeEditors.reduce((prev, current) => (prev.seats > current.seats) ? prev : current);
    
    for (const editor of activeEditors) {
      if (editor.tool !== primaryEditor.tool) {
        const costPerSeat = editor.monthlyCost ?? PRICING[editor.tool][editor.plan];
        suggestions.push({
          currentTool: editor.tool,
          alternativeTool: primaryEditor.tool,
          rationale: `Consolidate code editors to ${primaryEditor.tool} to reduce redundant spending and unify your team's workflow.`,
          monthlySavings: costPerSeat * editor.seats
        });
      }
    }
  }

  // Suggest consolidating conversational AI
  if (activeChats.length > 1) {
    const primaryChat = activeChats.reduce((prev, current) => (prev.seats > current.seats) ? prev : current);
    
    for (const chat of activeChats) {
      if (chat.tool !== primaryChat.tool) {
        const costPerSeat = chat.monthlyCost ?? PRICING[chat.tool][chat.plan];
        suggestions.push({
          currentTool: chat.tool,
          alternativeTool: primaryChat.tool,
          rationale: `Consolidate conversational AI to ${primaryChat.tool} to reduce overlapping subscriptions.`,
          monthlySavings: costPerSeat * chat.seats
        });
      }
    }
  }

  return suggestions;
}

export function generateOptimizationSuggestions(input: AuditInput): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];

  for (const sub of input.subscriptions) {
    const costPerSeat = sub.monthlyCost ?? PRICING[sub.tool][sub.plan];
    
    // Team plan optimization
    // If they have pro seats >= 5, suggest team plan if it exists
    if (sub.plan === 'pro' && sub.seats >= 5) {
      const teamCost = PRICING[sub.tool]['team'];
      // Wait, team plan is often MORE expensive per user (e.g. Cursor Pro $20 vs Team $40).
      // Let's suggest Team plan only if it brings savings or provides crucial admin controls.
      // But for pure cost savings, if Team cost < Pro cost, we suggest. (Rarely true for AI tools)
    }

    // If they are on Team but have < 5 seats, suggest downgrading to Pro.
    if (sub.plan === 'team' && sub.seats < 5) {
      const proCost = PRICING[sub.tool]['pro'];
      if (proCost < costPerSeat) {
        suggestions.push({
          tool: sub.tool,
          currentPlan: 'team',
          recommendedPlan: 'pro',
          rationale: `With under 5 seats on ${sub.tool}, you likely don't need the advanced admin controls of the Team plan. Downgrading to Pro saves money.`,
          monthlySavings: (costPerSeat - proCost) * sub.seats
        });
      }
    }

    // Unused seat estimation based on engineering team size
    if (CATEGORIES.editor.includes(sub.tool)) {
      if (sub.seats > input.engineeringTeamSize) {
        const excessSeats = sub.seats - input.engineeringTeamSize;
        suggestions.push({
          tool: sub.tool,
          currentPlan: sub.plan,
          recommendedPlan: sub.plan,
          rationale: `You have ${sub.seats} seats for ${sub.tool} but only ${input.engineeringTeamSize} engineers. Removing excess seats.`,
          monthlySavings: excessSeats * costPerSeat
        });
      }
    }
    
    // If they have over-provisioned conversational AI vs total employees
    if (CATEGORIES.conversational.includes(sub.tool)) {
      if (sub.seats > input.employeeCount) {
        const excessSeats = sub.seats - input.employeeCount;
        suggestions.push({
          tool: sub.tool,
          currentPlan: sub.plan,
          recommendedPlan: sub.plan,
          rationale: `You have ${sub.seats} seats for ${sub.tool} but only ${input.employeeCount} total employees. Removing excess seats.`,
          monthlySavings: excessSeats * costPerSeat
        });
      }
    }
  }

  return suggestions;
}

export function runAudit(input: AuditInput): AuditResult {
  const totalCurrentMonthlySpend = calculateCurrentSpend(input.subscriptions);
  
  const optimizationSuggestions = generateOptimizationSuggestions(input);
  const alternativeSuggestions = generateAlternativeSuggestions(input.subscriptions);
  const duplicateCategories = detectDuplicates(input.subscriptions);

  let totalMonthlySavings = 0;
  
  // Sum up savings safely. (Assuming applying all suggestions doesn't conflict, 
  // though in reality alternatives and optimizations might overlap).
  // For the sake of this engine, we will sum them up, but prioritize alternatives over optimizations 
  // for the same tool.
  const toolsToRemove = new Set(alternativeSuggestions.map(a => a.currentTool));

  for (const alt of alternativeSuggestions) {
    totalMonthlySavings += alt.monthlySavings;
  }

  for (const opt of optimizationSuggestions) {
    // Only apply optimization savings if we aren't already suggesting removing the tool entirely
    if (!toolsToRemove.has(opt.tool)) {
      totalMonthlySavings += opt.monthlySavings;
    }
  }

  // Ensure savings don't exceed current spend
  totalMonthlySavings = Math.min(totalMonthlySavings, totalCurrentMonthlySpend);

  const totalOptimizedMonthlySpend = totalCurrentMonthlySpend - totalMonthlySavings;

  return {
    totalCurrentMonthlySpend,
    totalOptimizedMonthlySpend,
    totalMonthlySavings,
    optimizationSuggestions,
    alternativeSuggestions,
    duplicateCategories
  };
}
