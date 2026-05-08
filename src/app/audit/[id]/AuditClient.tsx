"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import type { AuditResult } from "@/lib/types";
import AuditResults from "@/components/AuditResults";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import ShareButton from "@/components/ShareButton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuditResultsSkeleton } from "@/components/LoadingSkeleton";

interface AuditClientProps {
  id: string;
}

export default function AuditClient({ id }: AuditClientProps) {
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // AI summary state
  const [fetchedAiSummary, setFetchedAiSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Derived summary
  const aiSummary = useMemo(() => audit?.aiSummary || fetchedAiSummary, [audit, fetchedAiSummary]);

  useEffect(() => {
    async function fetchAudit() {
      try {
        const res = await fetch(`/api/audit?id=${id}`);
        if (res.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setAudit(data);
        setLoading(false);
      } catch {
        setNotFound(true);
        setLoading(false);
      }
    }
    fetchAudit();
  }, [id]);

  // Fetch AI summary after audit loads
  useEffect(() => {
    if (!audit || audit.aiSummary) return;

    const timer = setTimeout(async () => {
      setSummaryLoading(true);
      try {
        const res = await fetch("/api/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ auditId: id }),
        });
        if (res.ok) {
          const data = await res.json();
          setFetchedAiSummary(data.summary);
        } else {
          throw new Error("API failed");
        }
      } catch {
        // Fallback summary logic
        const totalSpend = audit.input.tools.reduce((s, t) => s + t.monthlySpend, 0);
        const topRec = audit.toolResults.find((r) => r.savingsPerMonth > 0);
        const topDesc = topRec
          ? `adjusting your ${topRec.tool} subscription`
          : "optimizing your tool stack";
        setFetchedAiSummary(
          `Your team of ${audit.input.teamSize} is currently spending $${totalSpend}/month across ${audit.input.tools.length} AI tools. Our analysis found $${audit.totalMonthlySavings}/month ($${audit.totalAnnualSavings}/year) in potential savings. The largest opportunity is ${topRec?.tool ?? 'tool optimization'}: ${topDesc}. Addressing this requires no workflow changes — only a plan adjustment.`
        );
      } finally {
        setSummaryLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [audit, id]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Audit not found</h1>
          <p className="text-slate-400 mb-6">
            This audit may have expired or the link is invalid.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            ← Run a new audit
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800/60 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/" className="text-xl font-bold tracking-tight hover:text-indigo-400 transition-colors">
            CredMaster
          </Link>
          <span className="text-sm text-slate-500 font-medium hidden sm:inline">
            AI Spend Auditor
          </span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <ErrorBoundary>
          {loading ? (
            <AuditResultsSkeleton />
          ) : audit ? (
            <div className="space-y-12">
              <AuditResults audit={audit} />

              <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-xl shadow-indigo-500/5">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                  AI-Powered Summary
                </h2>
                {summaryLoading && !aiSummary ? (
                  <div className="flex items-center gap-3 text-slate-400">
                    <span className="w-5 h-5 border-2 border-slate-600 border-t-indigo-400 rounded-full animate-spin" />
                    Generating your personalized summary...
                  </div>
                ) : (
                  <p className="text-slate-300 leading-relaxed italic">
                    &ldquo;{aiSummary}&rdquo;
                  </p>
                )}
              </section>

              <section className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-3">
                  Get this report in your inbox
                </h2>
                <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
                  We&apos;ll email you the full breakdown and notify you when new optimizations apply to your stack.
                </p>
                <LeadCaptureModal auditId={id} />
              </section>

              <section className="text-center py-6 border-t border-slate-800/40">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Share your results
                </h2>
                <p className="text-slate-400 text-sm mb-6">
                  Share this link — your personal details are never included.
                </p>
                <ShareButton />
              </section>
            </div>
          ) : null}
        </ErrorBoundary>
      </main>

      <footer className="border-t border-slate-800/40 py-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm">
            Built for engineering teams paying too much for AI.
          </p>
          <p className="text-slate-600 text-xs mt-2">© 2025 CredMaster</p>
        </div>
      </footer>
    </div>
  );
}
