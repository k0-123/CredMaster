import React from "react";

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
          ? "bg-white border-gray-100 shadow-xl shadow-gray-200/50"
          : "bg-white border-emerald-100 shadow-2xl shadow-emerald-500/10"
      }`}
    >
      <div className="relative z-10">
        {isOptimal || isLow ? (
          <>
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-medium text-black tracking-tight mb-4" style={{ letterSpacing: "-0.03em" }}>
              Your stack is optimized.
            </h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
              Our AI analysis shows your current tool subscriptions are right-sized for your team.
            </p>
          </>
        ) : (
          <>
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-6">
              Potential Savings Found
            </span>
            <div 
              className="text-6xl md:text-8xl font-medium text-black tracking-tighter mb-4"
              style={{ letterSpacing: "-0.05em" }}
            >
              ${savings.toLocaleString()}
              <span className="text-2xl md:text-3xl text-gray-300 font-medium ml-3">
                / month
              </span>
            </div>
            <div className="text-xl md:text-2xl text-emerald-600 font-medium tracking-tight">
              That&apos;s ${annualSavings.toLocaleString()} in annual efficiency.
            </div>

            {savings > 500 && (
              <div className="mt-12 inline-block bg-[#F5F5F5] rounded-2xl px-8 py-5">
                <p className="text-gray-600 text-sm font-medium">
                  Ready to capture these savings?{" "}
                  <a
                    href="https://credex.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black font-bold border-b-2 border-black/20 hover:border-black transition-all ml-1"
                  >
                    Get the CredMaster Playbook →
                  </a>
                </p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Decorative background element */}
      {!isOptimal && (
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
      )}
    </div>
  );
}
