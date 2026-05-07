"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { AuditResult } from "@/lib/types";
import AuditResults from "@/components/AuditResults";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import ShareButton from "@/components/ShareButton";

export default function AuditPage() {
  const params = useParams();
  const id = params.id as string;

  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // AI summary state
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

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
    if (!audit) return;

    const timer = setTimeout(async () => {
      setSummaryLoading(true);
      try {
        const res = await fetch("/api/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (res.ok) {
          const data = await res.json();
          setAiSummary(data.summary);
        } else {
          throw new Error("API failed");
        }
      } catch {
        // Fallback summary
        const totalSpend = audit.input.tools.reduce((s, t) => s + t.monthlySpend, 0);
        const topRec = audit.toolResults.find((r) => r.savingsPerMonth > 0);
        const topDesc = topRec
          ? `adjusting your ${topRec.tool} subscription`
          : "optimizing your tool stack";
        setAiSummary(
          `Your team of ${audit.input.teamSize} is spending $${totalSpend}/month across ${audit.input.tools.length} AI tools. Our analysis identified $${audit.totalMonthlySavings}/month in potential savings — $${audit.totalAnnualSavings} annually. The biggest opportunity is ${topDesc}. We recommend addressing this first as it requires no workflow changes, only a plan adjustment.`
        );
      } finally {
        setSummaryLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [audit, id]);

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <div className="space-y-6 animate-pulse">
            <div className="h-48 bg-slate-800/50 rounded-2xl" />
            <div className="h-6 w-48 bg-slate-800/50 rounded" />
            <div className="h-32 bg-slate-800/50 rounded-xl" />
            <div className="h-32 bg-slate-800/50 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // ── Not found ──
  if (notFound || !audit) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Audit not found</h1>
          <p className="text-slate-400 mb-6">
            This audit may have expired or the link is invalid.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            ← Run a new audit
          </a>
        </div>
      </div>
    );
  }

  // ── Results ──
  const ogTitle = `I found $${audit.totalMonthlySavings}/month in AI savings with CredMaster`;
  const ogDesc = `See how a ${audit.input.teamSize}-person team can save $${audit.totalMonthlySavings}/month on AI tools`;

  return (
    <>
      {/* Open Graph meta tags */}
      <head>
        <title>{ogTitle}</title>
        <meta name="description" content={ogDesc} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDesc} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDesc} />
      </head>

      <div className="min-h-screen bg-slate-950 text-white">
        {/* Navbar */}
        <nav className="border-b border-slate-800/60 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/80">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
            <a href="/" className="text-xl font-bold tracking-tight hover:text-indigo-400 transition-colors">
              CredMaster
            </a>
            <span className="text-sm text-slate-500 font-medium hidden sm:inline">
              AI Spend Auditor
            </span>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-6 py-12 space-y-12">
          {/* A. Savings Hero + Per-Tool Breakdown */}
          <AuditResults audit={audit} />

          {/* D. AI Summary */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              AI-Powered Summary
            </h2>
            {summaryLoading || !aiSummary ? (
              <div className="flex items-center gap-3 text-slate-400">
                <span className="w-5 h-5 border-2 border-slate-600 border-t-indigo-400 rounded-full animate-spin" />
                Generating your personalized summary...
              </div>
            ) : (
              <p className="text-slate-300 leading-relaxed">{aiSummary}</p>
            )}
          </section>

          {/* E. Lead Capture */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              Get this report in your inbox
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              We&apos;ll also notify you when new optimizations apply to your stack.
            </p>
            <LeadCaptureModal />
          </section>

          {/* F. Share */}
          <section className="text-center py-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              Share your results
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              Share this link — your personal details are not included.
            </p>
            <ShareButton />
          </section>
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
    </>
  );
}
