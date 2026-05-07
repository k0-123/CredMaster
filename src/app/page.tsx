import SpendForm from "@/components/SpendForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ═══ NAVBAR ═══ */}
      <nav className="border-b border-slate-800/60 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight">CredMaster</span>
          <span className="text-sm text-slate-500 font-medium hidden sm:inline">
            AI Spend Auditor
          </span>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
          You&apos;re probably wasting{" "}
          <span className="text-indigo-400">$400/month</span> on AI tools.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Get a free 60-second audit of your team&apos;s AI subscriptions. See
          exactly where the waste is.
        </p>
        <div className="mt-8">
          <a
            href="#audit-form"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg shadow-indigo-500/20"
          >
            Audit My AI Stack →
          </a>
          <p className="mt-4 text-sm text-slate-500">
            No login required. Free forever. Takes 60 seconds.
          </p>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF BAR ═══ */}
      <section className="border-y border-slate-800/40 bg-slate-900/30 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-center text-sm text-slate-500 mb-6 uppercase tracking-wider font-medium">
            Trusted by 200+ engineering teams
            <span className="text-xs ml-2 text-slate-600">(illustrative)</span>
          </p>
          <div className="flex justify-center gap-8 flex-wrap">
            {[
              { name: "Acme Corp", color: "bg-blue-900/50 border-blue-800/50" },
              { name: "TechFlow", color: "bg-purple-900/50 border-purple-800/50" },
              { name: "DataWave", color: "bg-emerald-900/50 border-emerald-800/50" },
            ].map((company) => (
              <div
                key={company.name}
                className={`${company.color} border rounded-lg px-6 py-3 text-sm font-medium text-slate-400`}
              >
                {company.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-center mb-12 text-white">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Enter your tools",
              desc: "Tell us what AI tools your team uses and how much you pay.",
              icon: "📝",
            },
            {
              step: "2",
              title: "Get your audit instantly",
              desc: "Our engine checks for seat waste, plan mismatches, and overlaps.",
              icon: "⚡",
            },
            {
              step: "3",
              title: "Share your savings report",
              desc: "Get a shareable link with actionable recommendations.",
              icon: "📊",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center hover:border-slate-700 transition-colors"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <div className="text-indigo-400 font-bold text-sm mb-2">
                STEP {item.step}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ THE FORM ═══ */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <SpendForm />
      </section>

      {/* ═══ FOOTER ═══ */}
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
