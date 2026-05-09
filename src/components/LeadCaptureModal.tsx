"use client";

import { useState, useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface Props {
  auditId: string;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
}

export default function LeadCaptureModal({ 
  auditId, 
  totalMonthlySavings,
  totalAnnualSavings 
}: Props) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    trackEvent('lead_form_opened', {
      auditId,
      totalMonthlySavings,
    });
  }, [auditId, totalMonthlySavings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          companyName: company, 
          role, 
          auditId,
          website // Bot trap
        }),
      });
      if (res.ok) {
        trackEvent('lead_captured', {
          auditId,
          totalMonthlySavings,
          totalAnnualSavings,
          isHighSavings: totalMonthlySavings > 500,
        });
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="text-4xl mb-4">🚀</div>
        <p className="text-emerald-400 font-bold text-xl mb-2">
          Report sent!
        </p>
        <p className="text-slate-400 text-sm">
          Check your inbox. We&apos;ve sent the full breakdown to <span className="text-slate-200">{email}</span>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <div className="text-left">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
          Email Address <span className="text-rose-500">*</span>
        </label>
        <input
          id="lead-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
          placeholder="engineering@company.com"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-left">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
            Company
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            placeholder="Acme Inc"
          />
        </div>
        <div className="text-left">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
            Role
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            placeholder="CTO / VP"
          />
        </div>
      </div>

      {/* Honeypot */}
      <input
        type="text"
        name="website"
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />

      {status === "error" && (
        <p className="text-rose-400 text-xs italic">Something went wrong. Please try again.</p>
      )}

      <button
        id="send-report"
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
      >
        {status === "loading" ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </span>
        ) : "Send My Report →"}
      </button>
    </form>
  );
}
