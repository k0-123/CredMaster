"use client";

import React from "react";
import { trackEvent } from "@/lib/analytics";

function formatSavings(amount: number): string {
  if (amount >= 10000) {
    return `${Math.round(amount / 1000)}k+`
  }
  return amount.toLocaleString()
}

export default function SavingsHero({
  savings,
  annualSavings,
}: {
  savings: number;
  annualSavings: number;
}) {
  const isOptimal = savings === 0;
  const isLow = savings > 0 && savings < 100;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-10 md:p-16 text-center border-2 transition-all ${
        isOptimal || isLow
          ? "glass-card border-white/5 shadow-2xl shadow-slate-900/50"
          : "glass-card border-brand-500/20 shadow-2xl shadow-brand-500/5"
      }`}
    >
      <div className="relative z-10">
        {isOptimal || isLow ? (
          <>
            <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-brand-500">✓</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-4">
              Your stack is optimized.
            </h2>
            <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
              Our AI analysis shows your current tool subscriptions are right-sized for your team.
            </p>
          </>
        ) : (
          <>
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-500/10 text-brand-500 font-bold text-xs uppercase tracking-widest mb-6">
              Potential Savings Found
            </span>
            {/* Performance 2: Min-height on number container */}
            <div className="min-h-[80px] sm:min-h-[120px] flex items-center justify-center mb-4">
              <div 
                role="status"
                aria-label={`Total monthly savings: $${savings} per month`}
                aria-live="polite"
                className="text-5xl sm:text-7xl md:text-8xl font-medium text-white tracking-tighter"
              >
                ${formatSavings(savings)}
                <span className="text-xl sm:text-2xl md:text-3xl text-slate-500 font-medium ml-3">
                  / month
                </span>
              </div>
            </div>
            <div className="text-base sm:text-xl md:text-2xl text-brand-400 font-medium tracking-tight">
              That&apos;s ${annualSavings.toLocaleString()} in annual efficiency.
            </div>

            {savings > 500 && (
              <div className="mt-12 inline-block bg-slate-900/50 rounded-2xl px-8 py-5 border border-white/5 w-full">
                {/* Mobile Fix 3: Stack vertically */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-slate-300 text-sm font-medium text-left">
                    Ready to capture these savings?
                  </p>
                  <a
                    href="https://credex.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Book a free Credex consultation to capture your AI savings"
                    onClick={() => trackEvent('credex_cta_clicked', {
                      monthlySavings: savings,
                      annualSavings: annualSavings,
                    })}
                    className="text-white font-bold bg-brand-500 px-6 py-2 rounded-xl hover:bg-brand-600 transition-all text-sm"
                  >
                    Get the CredMaster Playbook →
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Decorative background element */}
      {!isOptimal && (
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
      )}
    </div>
  );
}
