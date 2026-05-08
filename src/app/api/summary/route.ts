import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { generateFallbackSummary } from "@/lib/auditEngine";
import type { AuditResult } from "@/lib/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { auditId } = await req.json();
    if (!auditId) {
      return NextResponse.json({ error: "Audit ID is required" }, { status: 400 });
    }

    // 1. Fetch audit data
    let audit: AuditResult | null = null;

    if (isSupabaseConfigured) {
      const { data } = await supabaseAdmin
        .from("audits")
        .select("*")
        .eq("id", auditId)
        .single();
      
      if (data) {
        audit = {
          id: data.id,
          input: JSON.parse(data.input),
          toolResults: JSON.parse(data.tool_results),
          totalMonthlySavings: Number(data.total_monthly_savings),
          totalAnnualSavings: Number(data.total_annual_savings),
          aiSummary: data.ai_summary,
          createdAt: data.created_at,
        };
      }
    }

    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    // 2. Generate summary using Gemini
    let summary: string;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key") {
      summary = generateFallbackSummary(audit);
    } else {
      try {
        const model = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          systemInstruction: "You are a financial analyst specializing in SaaS spend optimization for engineering teams. Write a concise, professional ~100-word summary of an AI tool spend audit. Be specific about numbers. Be direct. Sound like a CFO, not a chatbot. No bullet points. One paragraph only.",
        });

        const prompt = buildSummaryPrompt(audit);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        summary = response.text();
      } catch (err) {
        console.error("Gemini API error:", err);
        summary = generateFallbackSummary(audit);
      }
    }

    // 3. Save summary back to DB
    if (isSupabaseConfigured) {
      await supabaseAdmin
        .from("audits")
        .update({ ai_summary: summary })
        .eq("id", auditId);
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summary API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

function buildSummaryPrompt(audit: AuditResult): string {
  const toolBreakdown = audit.toolResults.map(r => 
    `- ${r.tool} (${r.plan}): $${r.currentMonthlySpend}/mo — ${r.recommendation.type === 'optimal' ? 'optimal' : r.recommendation.reason}`
  ).join('\n');

  const totalMonthlySpend = audit.input.tools.reduce((s, t) => s + t.monthlySpend, 0);

  return `Audit data:
Team size: ${audit.input.teamSize}
Engineer count: ${audit.input.engineerCount}
Primary use case: ${audit.input.primaryUseCase}
Total monthly AI spend: $${totalMonthlySpend}
Potential monthly savings: $${audit.totalMonthlySavings}

Per-tool findings:
${toolBreakdown}

Write a ~100-word summary. Lead with biggest savings opportunity. End with what they should do first this week.`;
}
