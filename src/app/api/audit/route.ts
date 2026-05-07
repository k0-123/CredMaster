import { NextRequest, NextResponse } from "next/server";
import type { AuditInput, AuditResult } from "@/lib/types";
import { runAudit } from "@/lib/auditEngine";

// ── In-memory stores ──
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
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ── GET: Retrieve audit ──
export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Query param 'id' is required." }, { status: 400 });
  }

  const audit = auditStore.get(id);
  if (!audit) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  return NextResponse.json(audit, { status: 200 });
}
