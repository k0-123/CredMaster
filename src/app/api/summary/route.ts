import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // TODO Day 2: Call Anthropic API with the audit data
    // For now return a placeholder summary
    await new Promise((resolve) => setTimeout(resolve, 500));

    const summary =
      "Your team is currently spending on AI tools, but our analysis identified significant potential savings. The biggest opportunity is adjusting seat counts to match actual engineer usage and eliminating redundant tool subscriptions. We recommend addressing seat waste first as it requires no workflow changes, only a plan adjustment.";

    return NextResponse.json({ summary }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
