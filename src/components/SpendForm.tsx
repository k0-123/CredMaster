"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import type { AuditInput, ToolName, ToolEntry } from "@/lib/types";
import { PRICING_DATA } from "@/lib/pricingData";
import { ArrowRight, ChevronLeft, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useEffect } from "react";

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
  const [hpValue, setHpValue] = useState("");

  useEffect(() => {
    trackEvent("audit_form_started");
  }, []);

  const goToStep2 = () => {
    trackEvent("audit_form_step_completed", {
      step: 1,
      teamSize: formData.teamSize,
      engineerCount: formData.engineerCount,
      primaryUseCase: formData.primaryUseCase,
    });
    setStep(2);
  };

  const goToStep3 = () => {
    trackEvent("audit_form_step_completed", {
      step: 2,
      toolCount: selectedTools.length,
    });
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
        body: JSON.stringify({ ...formData, website: hpValue }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Audit failed");
      }
      const data = await res.json();
      
      trackEvent("audit_submitted", {
        toolCount: formData.tools.length,
        teamSize: formData.teamSize,
        engineerCount: formData.engineerCount,
        primaryUseCase: formData.primaryUseCase,
        totalDeclaredSpend: formData.tools.reduce(
          (sum, t) => sum + t.monthlySpend, 0
        ),
      });

      // Edge Case 4: Clear form state after submission
      localStorage.removeItem('credmaster-form-v1');
      
      router.push(`/audit/${data.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div id="audit-form" className="w-full">
      <div className="bg-white rounded-3xl overflow-hidden p-8 sm:p-10 shadow-2xl">
        {/* Progress header */}
        <div className="flex items-center justify-between mb-10">
          <div 
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={3}
            aria-label={`Step ${step} of 3`}
            className="flex gap-1.5"
          >
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 rounded-full transition-all duration-500 ${
                  s === step ? "w-8 bg-black" : s < step ? "w-4 bg-black/20" : "w-4 bg-gray-100"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Step {step} of 3</span>
        </div>

        <div>
          {/* ═══ STEP 1 — Team context ═══ */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label 
                    htmlFor="teamSize"
                    className="text-sm font-semibold text-gray-500 uppercase tracking-wider block"
                  >
                    Team Size
                  </label>
                  <input
                    id="teamSize"
                    type="number"
                    min={1}
                    max={500}
                    aria-describedby="teamSize-hint"
                    className="w-full bg-[#F5F5F5] border-none rounded-2xl px-6 py-4 text-black text-lg font-medium focus:ring-2 focus:ring-black outline-none transition-all"
                    value={formData.teamSize || ''}
                    onChange={(e) => setFormData({ ...formData, teamSize: +e.target.value })}
                  />
                  <p id="teamSize-hint" className="text-gray-400 text-xs mt-1">
                    Total people in your company
                  </p>
                  {formData.teamSize < 1 && (
                    <p className="text-red-500 text-xs mt-1" role="alert" aria-live="polite">
                      Please enter your team size
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label 
                    htmlFor="engineerCount"
                    className="text-sm font-semibold text-gray-500 uppercase tracking-wider block"
                  >
                    Engineer Count
                  </label>
                  <input
                    id="engineerCount"
                    type="number"
                    min={0}
                    aria-describedby="engineerCount-hint"
                    className="w-full bg-[#F5F5F5] border-none rounded-2xl px-6 py-4 text-black text-lg font-medium focus:ring-2 focus:ring-black outline-none transition-all"
                    value={formData.engineerCount || ''}
                    onChange={(e) => setFormData({ ...formData, engineerCount: +e.target.value })}
                  />
                  <p id="engineerCount-hint" className="text-gray-400 text-xs mt-1">
                    Number of developers/engineers
                  </p>
                  {formData.engineerCount > formData.teamSize && formData.teamSize > 0 && (
                    <p
                      className="text-red-500 text-xs mt-1"
                      role="alert"
                      aria-live="polite"
                    >
                      Engineer count cannot exceed team size
                    </p>
                  )}
                  {formData.engineerCount < 1 && step === 1 && (
                     <p className="text-red-500 text-xs mt-1" role="alert" aria-live="polite">
                       Please enter your engineer count
                     </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider block">Primary Use Case</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {["coding", "writing", "data", "research", "mixed"].map((useCase) => (
                    <button
                      key={useCase}
                      type="button"
                      aria-pressed={formData.primaryUseCase === useCase}
                      onClick={() => setFormData({ ...formData, primaryUseCase: useCase as AuditInput["primaryUseCase"] })}
                      className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                        formData.primaryUseCase === useCase 
                          ? "bg-black text-white shadow-xl shadow-black/10" 
                          : "bg-[#F5F5F5] text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {useCase.charAt(0).toUpperCase() + useCase.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                aria-label="Continue to tool selection"
                onClick={goToStep2}
                disabled={
                  formData.teamSize < 1 || 
                  formData.engineerCount < 1 || 
                  formData.engineerCount > formData.teamSize
                }
                className="w-full bg-black text-white font-medium py-5 rounded-full hover:bg-gray-800 disabled:opacity-30 transition-all flex items-center justify-center gap-2 text-lg group"
              >
                Continue
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* ═══ STEP 2 — Tool selection ═══ */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {ALL_TOOLS.map((t) => {
                  const on = selectedTools.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      aria-label={`Select ${t.name}`}
                      aria-pressed={on}
                      onClick={() => setSelectedTools((prev) => on ? prev.filter((x) => x !== t.id) : [...prev, t.id])}
                      className={`flex flex-col items-center gap-4 p-6 rounded-3xl border-2 transition-all relative ${
                        on ? "border-black bg-black text-white" : "border-gray-100 bg-[#F5F5F5] hover:border-gray-200 text-black"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold text-white ${on ? 'bg-white/20' : t.color}`}>
                        {t.initials}
                      </div>
                      <span className="font-semibold text-sm text-center">{t.name}</span>
                      {on && <Check className="w-5 h-5 text-white absolute top-4 right-4" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  aria-label="Back to team info"
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center w-16 h-16 rounded-full bg-[#F5F5F5] text-black hover:bg-gray-200 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  aria-label="Continue to spend details"
                  onClick={goToStep3}
                  disabled={selectedTools.length === 0}
                  className="flex-1 bg-black text-white font-medium py-5 rounded-full hover:bg-gray-800 disabled:opacity-30 transition-all flex items-center justify-center gap-2 text-lg group"
                >
                  Next Step
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 3 — Spend details ═══ */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Mobile Fix 5: Scrollable tool list */}
              <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1 -mr-1">
                {formData.tools.map((entry, i) => {
                  const pricing = PRICING_DATA[entry.tool];
                  const plans = Object.keys(pricing);
                  const meta = ALL_TOOLS.find((t) => t.id === entry.tool)!;

                  return (
                    <div key={entry.tool} className="bg-[#F5F5F5] rounded-3xl p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white ${meta.color}`}>
                          {meta.initials}
                        </div>
                        <span className="font-bold text-black text-lg">{meta.name}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label 
                            htmlFor={`plan-${entry.tool}`}
                            className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block"
                          >
                            Plan
                          </label>
                          <select
                            id={`plan-${entry.tool}`}
                            aria-label={`Select plan for ${meta.name}`}
                            className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-semibold text-black outline-none focus:ring-2 focus:ring-black"
                            value={entry.plan}
                            onChange={(e) => updateTool(i, { plan: e.target.value })}
                          >
                            {plans.map((p) => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label 
                            htmlFor={`seats-${entry.tool}`}
                            className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block"
                          >
                            Seats
                          </label>
                          <input
                            id={`seats-${entry.tool}`}
                            type="number"
                            min={1}
                            className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-semibold text-black outline-none focus:ring-2 focus:ring-black"
                            value={entry.seats}
                            onChange={(e) => updateTool(i, { seats: Math.max(1, +e.target.value || 1) })}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label 
                            htmlFor={`spend-${entry.tool}`}
                            className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block"
                          >
                            Monthly ($)
                          </label>
                          <input
                            id={`spend-${entry.tool}`}
                            type="number"
                            min={0}
                            className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-semibold text-black outline-none focus:ring-2 focus:ring-black"
                            value={entry.monthlySpend}
                            onChange={(e) => updateTool(i, { monthlySpend: Math.max(0, +e.target.value || 0) })}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {error && (
                <div 
                  role="alert"
                  aria-live="polite"
                  className="bg-red-50 text-red-500 p-5 rounded-2xl text-sm font-medium border border-red-100"
                >
                  {error}
                </div>
              )}

              <input 
                type="text" 
                name="website" 
                aria-hidden="true" 
                tabIndex={-1} 
                className="hidden" 
                autoComplete="off"
                value={hpValue} 
                onChange={(e) => setHpValue(e.target.value)} 
              />

              <div className="flex gap-4">
                <button
                  type="button"
                  aria-label="Back to tool selection"
                  onClick={() => setStep(2)}
                  disabled={loading}
                  className="flex items-center justify-center w-16 h-16 rounded-full bg-[#F5F5F5] text-black hover:bg-gray-200 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  aria-label="Submit audit and see results"
                  onClick={submit}
                  disabled={loading}
                  className="flex-1 bg-black text-white font-medium py-5 rounded-full hover:bg-gray-800 disabled:opacity-30 transition-all flex items-center justify-center gap-2 text-lg group"
                >
                  {loading ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Run My Audit →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
