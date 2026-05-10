import type { AuditResult } from "@/lib/types";
import SavingsHero from "./SavingsHero";
import ToolBreakdownCard from "./ToolBreakdownCard";

export default function AuditResults({ audit }: { audit: AuditResult }) {
  return (
    <div className="space-y-8">
      <SavingsHero
        savings={audit.totalMonthlySavings}
        annualSavings={audit.totalAnnualSavings}
      />

      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-white tracking-tight">Per-Tool Breakdown</h2>
        <div 
          role="list" 
          aria-label="Tool audit results"
          className="space-y-4"
        >
          {audit.toolResults.map((r) => (
            <ToolBreakdownCard key={r.tool} result={r} />
          ))}
        </div>
      </div>
    </div>
  );
}
