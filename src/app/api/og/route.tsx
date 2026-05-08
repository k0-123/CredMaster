import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const savings = searchParams.get("savings") ?? "0";
    const annual = searchParams.get("annual") ?? "0";
    const tools = searchParams.get("tools") ?? "0";

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            fontFamily: "sans-serif",
            padding: "60px",
          }}
        >
          <div
            style={{
              color: "#94a3b8",
              fontSize: 28,
              marginBottom: 20,
            }}
          >
            CredMaster AI Spend Audit
          </div>
          <div
            style={{
              color: "#22c55e",
              fontSize: 96,
              fontWeight: "bold",
              lineHeight: 1,
            }}
          >
            ${savings}/mo
          </div>
          <div
            style={{
              color: "#ffffff",
              fontSize: 36,
              marginTop: 16,
            }}
          >
            in potential savings found
          </div>
          <div
            style={{
              color: "#64748b",
              fontSize: 24,
              marginTop: 12,
            }}
          >
            ${annual}/year • {tools} tools audited
          </div>
          <div
            style={{
              marginTop: 48,
              background: "#22c55e",
              color: "#000",
              padding: "16px 40px",
              borderRadius: 12,
              fontSize: 28,
              fontWeight: "bold",
            }}
          >
            Audit your AI stack free →
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e) {
    const error = e as Error;
    console.log(`${error.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
