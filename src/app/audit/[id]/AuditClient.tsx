"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import type { AuditResult } from "@/lib/types";
import AuditResults from "@/components/AuditResults";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import ShareButton from "@/components/ShareButton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuditResultsSkeleton } from "@/components/LoadingSkeleton";
import { LogoIcon } from "@/components/LogoIcon";
import { Footer } from "@/components/Footer";

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
      <div className="min-h-screen bg-[#F5F5F5] text-black flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl">?</span>
          </div>
          <h1 className="text-4xl font-medium mb-4 tracking-tight" style={{ letterSpacing: "-0.03em" }}>Audit not found</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            This audit may have expired or the link is invalid. Please run a new audit to get fresh results.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-black text-white font-medium px-8 py-4 rounded-full hover:bg-gray-800 transition-all"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-black">
      {/* Results Navbar */}
      <nav className="border-b border-gray-200 backdrop-blur-md sticky top-0 z-50 bg-[#F5F5F5]/80">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <LogoIcon className="w-6 h-6 text-black" />
            <span className="text-xl font-medium tracking-tight group-hover:text-gray-600 transition-colors">
              CredMaster
            </span>
          </Link>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:inline">
              Audit ID: {id.substring(0, 8)}
            </span>
            <ShareButton />
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <ErrorBoundary>
          {loading ? (
            <div className="animate-pulse space-y-12">
               <div className="h-64 bg-white rounded-3xl border border-gray-100" />
               <div className="space-y-4">
                  <div className="h-8 w-48 bg-gray-200 rounded-lg" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-48 bg-white rounded-2xl border border-gray-100" />
                    <div className="h-48 bg-white rounded-2xl border border-gray-100" />
                  </div>
               </div>
            </div>
          ) : audit ? (
            <div className="space-y-12">
              {/* Main Results */}
              <AuditResults audit={audit} />

              {/* AI Summary Section */}
              <section className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/40 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
                <h2 className="text-2xl font-medium text-black mb-6 flex items-center gap-3 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  AI Intelligence Summary
                </h2>
                {summaryLoading && !aiSummary ? (
                  <div className="flex items-center gap-4 text-gray-400 font-medium">
                    <span className="w-5 h-5 border-2 border-gray-100 border-t-black rounded-full animate-spin" />
                    Analyzing your tool stack pattern...
                  </div>
                ) : (
                  <p className="text-gray-600 text-lg leading-relaxed italic font-medium">
                    &ldquo;{aiSummary}&rdquo;
                  </p>
                )}
              </section>

              {/* Email Capture Section */}
              <section className="bg-black rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
                
                <h2 className="text-3xl md:text-5xl font-medium mb-6 relative z-10 tracking-tight" style={{ letterSpacing: "-0.03em" }}>
                  Get the full<br />efficiency report.
                </h2>
                <p className="text-white/60 text-lg mb-10 max-w-md mx-auto relative z-10">
                  We&apos;ll email you the step-by-step consolidation plan and notify you when new savings apply.
                </p>
                <div className="relative z-10">
                  <LeadCaptureModal auditId={id} />
                </div>
              </section>
            </div>
          ) : null}
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
