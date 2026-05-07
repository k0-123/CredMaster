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
      className={`relative overflow-hidden rounded-2xl p-8 md:p-12 text-center border ${
        isOptimal || isLow
          ? "bg-slate-900/60 border-slate-800"
          : "bg-gradient-to-br from-emerald-950/40 to-slate-900/60 border-emerald-800/40"
      }`}
    >
      {/* Decorative glow */}
      {!isOptimal && !isLow && (
        <div className="absolute inset-0 bg-emerald-500/5 blur-3xl pointer-events-none" />
      )}

      <div className="relative z-10">
        {isOptimal || isLow ? (
          <>
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              You&apos;re spending well.
            </h2>
            <p className="text-slate-400 mt-2 text-lg">
              Your stack looks right-sized.
            </p>
          </>
        ) : (
          <>
            <p className="text-emerald-400/80 font-medium text-sm uppercase tracking-wider mb-3">
              Potential Savings Found
            </p>
            <div className="text-5xl md:text-7xl font-extrabold text-emerald-400 tracking-tight">
              ${savings.toLocaleString()}
              <span className="text-xl md:text-2xl text-emerald-500/70 font-semibold ml-2">
                / month
              </span>
            </div>
            <div className="text-lg md:text-xl text-emerald-500/60 mt-2 font-medium">
              ${annualSavings.toLocaleString()} / year
            </div>

            {savings > 500 && (
              <div className="mt-8 inline-block bg-slate-800/60 border border-slate-700 rounded-xl px-6 py-4">
                <p className="text-slate-300 text-sm">
                  Want help capturing all of this?{" "}
                  <a
                    href="https://credex.ai"
                    className="text-indigo-400 hover:text-indigo-300 font-semibold underline decoration-indigo-400/30 underline-offset-4 transition-colors"
                  >
                    Book a free Credex consultation →
                  </a>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
