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
  downgrade: "bg-rose-50 text-rose-600",
  switch: "bg-indigo-50 text-indigo-600",
  "reduce-seats": "bg-amber-50 text-amber-600",
  optimal: "bg-emerald-50 text-emerald-600",
};

export default function ToolBreakdownCard({ result }: { result: ToolAuditResult }) {
  const badgeStyle = BADGE_STYLES[result.recommendation.type] ?? BADGE_STYLES.optimal;
  const icon = RECOMMENDATION_ICONS[result.recommendation.type] ?? RECOMMENDATION_ICONS.optimal;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-7 hover:border-black/10 transition-all shadow-sm hover:shadow-md group">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center font-bold text-black text-xs">
            {result.tool.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-xl text-black capitalize tracking-tight">
              {result.tool.replace("-", " ")}
            </h3>
            <p className="text-gray-400 text-sm font-medium">
              {result.plan} plan · ${result.currentMonthlySpend.toLocaleString()}/mo
            </p>
          </div>
        </div>
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${badgeStyle}`}>
          {icon}
          {result.recommendation.type.replace("-", " ")}
        </div>
      </div>

      <div className="bg-[#F5F5F5] rounded-2xl p-5 mb-6">
        <p className="text-gray-600 text-sm leading-relaxed font-medium">
          {result.recommendation.reason}
        </p>
      </div>

      <div className="flex items-center justify-between">
        {result.savingsPerMonth > 0 ? (
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Potential Savings</span>
            <span className="text-emerald-600 font-bold text-lg tracking-tight">
              ${result.savingsPerMonth.toLocaleString()}/month
            </span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm font-medium">No waste detected</span>
        )}
        
        <button className="p-3 rounded-full bg-black text-white opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
