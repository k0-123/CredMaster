"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import type { AuditResult } from "@/lib/types";
import AuditResults from "@/components/AuditResults";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Footer } from "@/components/Footer";
import { trackEvent } from "@/lib/analytics";
import dynamic from 'next/dynamic'
import { LogoIcon } from "@/components/LogoIcon";

const BenchmarkPanel = dynamic(
  () => import('@/components/BenchmarkPanel')
    .then(m => m.BenchmarkPanel),
  { ssr: false, loading: () => null }
)

const LeadCaptureModal = dynamic(
  () => import('@/components/LeadCaptureModal'),
  { ssr: false, loading: () => null }
)

interface AuditClientProps {
  id: string;
}

export default function AuditClient({ id }: AuditClientProps) {
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [countdown, setCountdown] = useState(3);

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
        
        trackEvent("audit_viewed", {
          auditId: id,
          totalMonthlySavings: data.totalMonthlySavings,
          totalAnnualSavings: data.totalAnnualSavings,
          toolCount: data.toolResults.length,
          teamSize: data.input.teamSize,
          isOptimal: data.totalMonthlySavings === 0,
          isHighSavings: data.totalMonthlySavings > 500,
        });

        setLoading(false);
      } catch {
        setNotFound(true);
        setLoading(false);
      }
    }
    fetchAudit();
  }, [id]);

  // Edge Case 1: Auto-redirect on not-found
  useEffect(() => {
    if (!notFound) return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [notFound]);

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
          trackEvent("summary_generated", { auditId: id });
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
        trackEvent("summary_fallback_used", { auditId: id });
      } finally {
        setSummaryLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [audit, id]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-slate-900 rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8 border border-white/10">
            <span className="text-4xl text-slate-400">?</span>
          </div>
          <h1 className="text-4xl font-medium mb-4 tracking-tight">Audit not found</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            This audit may have expired or the link is incorrect.
            Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-brand-500 text-white font-medium px-8 py-4 rounded-full hover:bg-brand-600 transition-all"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const ShareButton = dynamic(() => import('@/components/ShareButton'), { ssr: false });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Results Navbar */}
      <nav className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <LogoIcon className="w-6 h-6 text-white" />
            <span className="text-xl font-medium tracking-tight group-hover:text-slate-400 transition-colors">
              CredMaster
            </span>
          </Link>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden sm:inline">
              Audit ID: {id.substring(0, 8)}
            </span>
            <ShareButton />
          </div>
        </div>
      </nav>

      <main id="main" className="max-w-4xl mx-auto px-6 py-16">
        <ErrorBoundary>
          {loading ? (
            <div className="animate-pulse space-y-12">
               <div className="h-64 bg-slate-900 rounded-3xl border border-white/5" />
               <div className="space-y-4">
                  <div className="h-8 w-48 bg-slate-800 rounded-lg" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-48 bg-slate-900 rounded-2xl border border-white/5" />
                    <div className="h-48 bg-slate-900 rounded-2xl border border-white/5" />
                  </div>
               </div>
            </div>
          ) : audit ? (
            <div className="space-y-12">
              {/* AI Summary Section */}
              <section className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-brand-500" />
                <h2 className="text-2xl font-medium text-white mb-6 flex items-center gap-3 tracking-tight">
                  <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
                  AI Intelligence Summary
                </h2>
                {summaryLoading && !aiSummary ? (
                  <div className="flex items-center gap-4 text-slate-400 font-medium">
                    <span className="w-5 h-5 border-2 border-white/10 border-t-brand-500 rounded-full animate-spin" />
                    Analyzing your tool stack pattern...
                  </div>
                ) : (
                  <p className="text-slate-300 text-lg leading-relaxed italic font-medium">
                    &quot;{aiSummary}&quot;
                  </p>
                )}
              </section>

              <BenchmarkPanel
                totalMonthlySpend={audit.input.tools.reduce(
                  (sum, t) => sum + t.monthlySpend, 0
                )}
                engineerCount={audit.input.engineerCount}
                teamSize={audit.input.teamSize}
              />

              {/* Main Results & Tool Breakdown */}
              <AuditResults audit={audit} />

              {/* Email Capture Section */}
              <section className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-500/10 blur-[120px] pointer-events-none" />
                
                <h2 className="text-3xl md:text-5xl font-medium mb-6 relative z-10 tracking-tight">
                  Get the full<br />efficiency report.
                </h2>
                <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto relative z-10">
                  We&apos;ll email you the step-by-step consolidation plan and notify you when new savings apply.
                </p>
                <div className="relative z-10">
                  <LeadCaptureModal 
                    auditId={id} 
                    totalMonthlySavings={audit.totalMonthlySavings}
                    totalAnnualSavings={audit.totalAnnualSavings}
                  />
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
