import React from "react";
import type { ToolAuditResult } from "@/lib/types";
import { ArrowRight, AlertCircle, CheckCircle2, RefreshCcw } from "lucide-react";

const RECOMMENDATION_ICONS: Record<string, React.ReactNode> = {
  downgrade: <ArrowRight className="w-4 h-4 text-rose-500" />,
  switch: <RefreshCcw className="w-4 h-4 text-indigo-500" />,
  "reduce-seats": <AlertCircle className="w-4 h-4 text-amber-500" />,
  optimal: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
};

const BADGE_STYLES: Record<string, string> = {
  downgrade: "bg-rose-500/10 text-rose-500",
  switch: "bg-indigo-500/10 text-indigo-500",
  "reduce-seats": "bg-amber-500/10 text-amber-500",
  optimal: "bg-emerald-500/10 text-emerald-500",
};

export default function ToolBreakdownCard({ result }: { result: ToolAuditResult }) {
  const badgeStyle = BADGE_STYLES[result.recommendation.type] ?? BADGE_STYLES.optimal;
  const icon = RECOMMENDATION_ICONS[result.recommendation.type] ?? RECOMMENDATION_ICONS.optimal;

  return (
    <div 
      role="listitem" 
      className="glass-card rounded-2xl p-7 hover:border-white/20 transition-all shadow-xl group"
    >
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-white text-xs">
            {result.tool.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-xl text-white capitalize tracking-tight">
              {result.tool.replace("-", " ")}
            </h3>
            <p className="text-slate-400 text-sm font-medium">
              {result.plan} plan · ${result.currentMonthlySpend.toLocaleString()}/mo
            </p>
          </div>
        </div>
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex-shrink-0 ${badgeStyle}`}>
          {icon}
          {result.recommendation.type.replace("-", " ")}
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-2xl p-5 mb-6 border border-white/5">
        <p className="text-slate-300 text-sm leading-relaxed font-medium">
          {result.recommendation.reason}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {result.savingsPerMonth > 0 ? (
          <div 
            className="flex flex-col"
            aria-label={`Save $${result.savingsPerMonth} per month`}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Potential Savings</span>
            <span className="text-brand-400 font-bold text-lg tracking-tight">
              ${result.savingsPerMonth.toLocaleString()}/mo
            </span>
          </div>
        ) : (
          <span className="text-slate-500 text-sm font-medium">No waste detected</span>
        )}
        
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
           <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest sm:hidden">Action Required</span>
           <button 
             aria-label={`Take action on ${result.tool}`}
             className="p-3 rounded-full bg-white text-black sm:opacity-0 sm:group-hover:opacity-100 transition-all sm:translate-x-4 sm:group-hover:translate-x-0"
           >
             <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
}
