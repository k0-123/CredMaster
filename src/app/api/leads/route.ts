import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { sendAuditEmail } from "@/lib/email";

export const leadRateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 3600_000; // 1 hour
const RATE_LIMIT_MAX = 3;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const now = Date.now();
    const timestamps = (leadRateLimitMap.get(ip) ?? []).filter(
      (ts) => ts > now - RATE_LIMIT_WINDOW
    );

    if (timestamps.length >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in an hour." },
        { status: 429 }
      );
    }

    timestamps.push(now);
    leadRateLimitMap.set(ip, timestamps);

    const body = await req.json();

    // Honeypot check
    if (body.website && String(body.website).trim() !== "") {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const { email, auditId, companyName, role, teamSize } = body;

    // Validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!auditId) {
      return NextResponse.json({ error: "Audit ID is required" }, { status: 400 });
    }

    // Save to DB
    if (isSupabaseConfigured) {
      const { error } = await supabaseAdmin.from("leads").insert({
        audit_id: auditId,
        email: email.toLowerCase().trim(),
        company_name: companyName || null,
        role: role || null,
        team_size: teamSize || null,
      });

      if (error) {
        console.error("Supabase lead insert error:", error);
      }
    } else {
      console.log("[LOCAL LEAD CAPTURE]:", { email, companyName, role, teamSize });
    }

    // Fetch audit data to populate email
    let auditData;
    if (isSupabaseConfigured) {
      const { data } = await supabaseAdmin
        .from("audits")
        .select("*")
        .eq("id", auditId)
        .single();
      
      if (data) {
        const parsedResults = JSON.parse(data.tool_results);
        const topRec = parsedResults
          .filter((r: any) => r.recommendation.type !== "optimal")
          .sort((a: any, b: any) => b.savingsPerMonth - a.savingsPerMonth)[0];

        auditData = {
          totalMonthlySavings: Number(data.total_monthly_savings),
          totalAnnualSavings: Number(data.total_annual_savings),
          teamSize: JSON.parse(data.input).teamSize,
          topRecommendation: topRec ? topRec.recommendation.reason : "All good!",
        };
      }
    }

    // Trigger email
    if (auditData) {
      await sendAuditEmail({
        to: email,
        auditId,
        totalMonthlySavings: auditData.totalMonthlySavings,
        totalAnnualSavings: auditData.totalAnnualSavings,
        teamSize: auditData.teamSize,
        topRecommendation: auditData.topRecommendation,
      });
    } else {
      console.warn("Could not find audit data for email trigger");
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Leads API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
