import type { ToolAuditResult } from "@/lib/types";

const BADGE_STYLES: Record<string, string> = {
  downgrade: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  switch: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  "reduce-seats": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  optimal: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function ToolBreakdownCard({ result }: { result: ToolAuditResult }) {
  const badgeStyle =
    BADGE_STYLES[result.recommendation.type] ?? BADGE_STYLES.optimal;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-lg text-white capitalize">
            {result.tool.replace("-", " ")}
          </h3>
          <p className="text-slate-500 text-sm">
            {result.plan} plan · ${result.currentMonthlySpend}/mo
          </p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border whitespace-nowrap ${badgeStyle}`}
        >
          {result.recommendation.type.replace("-", " ")}
        </span>
      </div>

      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        {result.recommendation.reason}
      </p>

      {result.savingsPerMonth > 0 ? (
        <p className="text-emerald-400 font-semibold text-sm">
          Save ${result.savingsPerMonth}/month
        </p>
      ) : (
        <p className="text-slate-600 text-sm">–</p>
      )}
    </div>
  );
}
