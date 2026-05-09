import { NextRequest, NextResponse } from "next/server";
import type { AuditInput, AuditResult } from "@/lib/types";
import { runAudit } from "@/lib/auditEngine";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

// ── In-memory stores (Fallback if Supabase is not configured) ──
export const auditStore = new Map<string, AuditResult>();
export const rateLimitMap = new Map<string, number[]>();

const RATE_LIMIT_WINDOW = 60_000; // 60 seconds
const RATE_LIMIT_MAX = 10;

// ── POST: Run audit ──
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const now = Date.now();
    const timestamps = (rateLimitMap.get(ip) ?? []).filter(
      (ts) => ts > now - RATE_LIMIT_WINDOW
    );

    if (timestamps.length >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: "Too many requests. Try again shortly." },
        { status: 429 }
      );
    }

    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);

    const body = await req.json();

    // Honeypot check
    if (body.website && String(body.website).trim() !== "") {
      console.log("[HONEYPOT TRIGGERED]");
      return NextResponse.json(
        { id: "fake-id", totalMonthlySavings: 0, totalAnnualSavings: 0 },
        { status: 200 }
      );
    }

    // Validation
    if (
      !body.tools ||
      !Array.isArray(body.tools) ||
      typeof body.teamSize !== "number" ||
      typeof body.engineerCount !== "number" ||
      !body.primaryUseCase
    ) {
      return NextResponse.json(
        { error: "Invalid input: tools, teamSize, engineerCount, and primaryUseCase are required." },
        { status: 400 }
      );
    }

    const input: AuditInput = {
      tools: body.tools,
      teamSize: body.teamSize,
      engineerCount: body.engineerCount,
      primaryUseCase: body.primaryUseCase,
    };

    const auditData = runAudit(input);
    const id = crypto.randomUUID();

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from("audits")
        .insert({
          id,
          input: JSON.stringify(input),
          tool_results: JSON.stringify(auditData.toolResults),
          total_monthly_savings: auditData.totalMonthlySavings,
          total_annual_savings: auditData.totalAnnualSavings,
          ai_summary: null,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json({ error: "Failed to save audit" }, { status: 500 });
      }
      
      return NextResponse.json(
        {
          id: data.id,
          totalMonthlySavings: auditData.totalMonthlySavings,
          totalAnnualSavings: auditData.totalAnnualSavings,
        },
        { status: 200 }
      );
    } else {
      // Fallback to in-memory
      const result: AuditResult = {
        id,
        ...auditData,
        aiSummary: null,
        createdAt: new Date().toISOString(),
      };
      auditStore.set(id, result);
      
      return NextResponse.json(
        {
          id: result.id,
          totalMonthlySavings: result.totalMonthlySavings,
          totalAnnualSavings: result.totalAnnualSavings,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Audit API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ── GET: Retrieve audit ──
export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Query param 'id' is required." }, { status: 400 });
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("audits")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: data.id,
      input: JSON.parse(data.input),
      toolResults: JSON.parse(data.tool_results),
      totalMonthlySavings: Number(data.total_monthly_savings),
      totalAnnualSavings: Number(data.total_annual_savings),
      aiSummary: data.ai_summary,
      createdAt: data.created_at,
    });
  } else {
    const audit = auditStore.get(id);
    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }
    return NextResponse.json(audit, { status: 200 });
  }
}
