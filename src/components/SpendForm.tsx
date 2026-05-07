"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import type { AuditInput, ToolName, ToolEntry } from "@/lib/types";
import { PRICING_DATA } from "@/lib/pricingData";

const ALL_TOOLS: { id: ToolName; name: string; color: string; initials: string }[] = [
  { id: "cursor", name: "Cursor", color: "bg-blue-600", initials: "CU" },
  { id: "github-copilot", name: "GitHub Copilot", color: "bg-purple-600", initials: "GC" },
  { id: "claude", name: "Claude", color: "bg-amber-600", initials: "CL" },
  { id: "chatgpt", name: "ChatGPT", color: "bg-emerald-600", initials: "GP" },
  { id: "anthropic-api", name: "Anthropic API", color: "bg-orange-600", initials: "AA" },
  { id: "openai-api", name: "OpenAI API", color: "bg-teal-600", initials: "OA" },
  { id: "gemini", name: "Gemini", color: "bg-sky-600", initials: "GE" },
  { id: "windsurf", name: "Windsurf", color: "bg-indigo-600", initials: "WS" },
];

const DEFAULT_INPUT: AuditInput = {
  teamSize: 10,
  engineerCount: 5,
  primaryUseCase: "coding",
  tools: [],
};

export default function SpendForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useFormPersistence<AuditInput>(
    "credmaster-form-v1",
    DEFAULT_INPUT
  );

  const [selectedTools, setSelectedTools] = useState<ToolName[]>(
    formData.tools.map((t) => t.tool)
  );

  // ── Step navigation ──

  const goToStep2 = () => setStep(2);

  const goToStep3 = () => {
    const newTools: ToolEntry[] = selectedTools.map((toolId) => {
      const existing = formData.tools.find((t) => t.tool === toolId);
      if (existing) return existing;

      const pricing = PRICING_DATA[toolId];
      const plans = Object.keys(pricing);
      const firstPlan = plans[0];
      const planData = (pricing as Record<string, { pricePerSeat: number | null }>)[firstPlan];
      const price = planData?.pricePerSeat ?? 0;

      return { tool: toolId, plan: firstPlan, seats: 1, monthlySpend: price };
    });
    setFormData({ ...formData, tools: newTools });
    setStep(3);
  };

  const updateTool = (index: number, patch: Partial<ToolEntry>) => {
    const tools = [...formData.tools];
    const updated = { ...tools[index], ...patch };

    // Auto-compute monthly spend when plan or seats change
    if (patch.plan !== undefined || patch.seats !== undefined) {
      const pricing = PRICING_DATA[updated.tool];
      const planData = (pricing as Record<string, { pricePerSeat: number | null }>)[updated.plan];
      if (planData?.pricePerSeat != null) {
        updated.monthlySpend = planData.pricePerSeat * updated.seats;
      }
    }

    tools[index] = updated;
    setFormData({ ...formData, tools });
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, website: "" }), // honeypot empty
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Audit failed");
      }
      const data = await res.json();
      router.push(`/audit/${data.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  // ── Render ──

  return (
    <div id="audit-form" className="w-full max-w-2xl mx-auto">
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl shadow-2xl shadow-indigo-500/5 overflow-hidden">
        {/* Progress bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-lg text-white">AI Spend Audit</h3>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-1.5 rounded-full transition-colors ${
                  s <= step ? "bg-indigo-500" : "bg-slate-700"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* ═══ STEP 1 — Team context ═══ */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Team Size
                </label>
                <input
                  id="team-size"
                  type="number"
                  min={1}
                  max={500}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  value={formData.teamSize}
                  onChange={(e) =>
                    setFormData({ ...formData, teamSize: Math.max(1, +e.target.value || 1) })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Engineer / Developer Count
                </label>
                <p className="text-xs text-slate-500 mb-2">People who write code</p>
                <input
                  id="engineer-count"
                  type="number"
                  min={0}
                  max={500}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  value={formData.engineerCount}
                  onChange={(e) =>
                    setFormData({ ...formData, engineerCount: Math.max(0, +e.target.value || 0) })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Primary Use Case
                </label>
                <select
                  id="use-case"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  value={formData.primaryUseCase}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      primaryUseCase: e.target.value as AuditInput["primaryUseCase"],
                    })
                  }
                >
                  <option value="coding">Coding</option>
                  <option value="writing">Writing / Content</option>
                  <option value="data">Data Analysis</option>
                  <option value="research">Research</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              <button
                id="step1-next"
                onClick={goToStep2}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          )}

          {/* ═══ STEP 2 — Tool selection ═══ */}
          {step === 2 && (
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-white">
                Which AI tools is your team paying for?
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ALL_TOOLS.map((t) => {
                  const on = selectedTools.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() =>
                        setSelectedTools((prev) =>
                          on ? prev.filter((x) => x !== t.id) : [...prev, t.id]
                        )
                      }
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                        on
                          ? "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/30"
                          : "border-slate-700 bg-slate-950 hover:border-slate-600"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-white ${t.color}`}
                      >
                        {t.initials}
                      </div>
                      <span className="font-medium text-slate-200 flex-1">{t.name}</span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          on ? "border-indigo-500 bg-indigo-500" : "border-slate-600"
                        }`}
                      >
                        {on && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-slate-700 hover:bg-slate-800 rounded-lg text-slate-300 font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  id="step2-next"
                  onClick={goToStep3}
                  disabled={selectedTools.length === 0}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Next &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 3 — Spend details ═══ */}
          {step === 3 && (
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-white">Spend details per tool</h4>

              <div className="space-y-4">
                {formData.tools.map((entry, i) => {
                  const pricing = PRICING_DATA[entry.tool];
                  const plans = Object.keys(pricing);
                  const meta = ALL_TOOLS.find((t) => t.id === entry.tool)!;

                  return (
                    <div
                      key={entry.tool}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-white ${meta.color}`}
                        >
                          {meta.initials}
                        </div>
                        <span className="font-medium text-white">{meta.name}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Plan</label>
                          <select
                            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white outline-none"
                            value={entry.plan}
                            onChange={(e) => updateTool(i, { plan: e.target.value })}
                          >
                            {plans.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Seats</label>
                          <input
                            type="number"
                            min={1}
                            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white outline-none"
                            value={entry.seats}
                            onChange={(e) => updateTool(i, { seats: Math.max(1, +e.target.value || 1) })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">
                            Monthly Spend ($)
                          </label>
                          <input
                            type="number"
                            min={0}
                            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white outline-none"
                            value={entry.monthlySpend}
                            onChange={(e) =>
                              updateTool(i, { monthlySpend: Math.max(0, +e.target.value || 0) })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Honeypot — invisible to users */}
              <input
                type="text"
                name="website"
                className="hidden"
                tabIndex={-1}
                aria-hidden="true"
                autoComplete="off"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  disabled={loading}
                  className="px-6 py-3 border border-slate-700 hover:bg-slate-800 rounded-lg text-slate-300 font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  id="run-audit"
                  onClick={submit}
                  disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Run My Audit →"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
