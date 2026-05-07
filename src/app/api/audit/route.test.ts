import { describe, it, expect, beforeEach } from "vitest";
import { POST, rateLimitMap, auditStore } from "./route";
import { NextRequest } from "next/server";

function makeRequest(body: object, headers?: Record<string, string>) {
  return new NextRequest("http://localhost/api/audit", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("Audit API Route", () => {
  beforeEach(() => {
    rateLimitMap.clear();
    auditStore.clear();
  });

  // ── Test 6 — Honeypot ──
  it("returns 200 with fake data when honeypot is triggered", async () => {
    const sizeBefore = auditStore.size;
    const req = makeRequest({
      website: "spam.com",
      tools: [{ tool: "cursor", plan: "pro", seats: 1, monthlySpend: 20 }],
      teamSize: 5,
      engineerCount: 3,
      primaryUseCase: "coding",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.id).toBe("fake-id");
    // Nothing was stored
    expect(auditStore.size).toBe(sizeBefore);
  });

  // ── Test 7 — Rate limiting ──
  it("returns 429 after 10 requests from the same IP in 60s", async () => {
    const body = {
      tools: [{ tool: "cursor", plan: "pro", seats: 1, monthlySpend: 20 }],
      teamSize: 5,
      engineerCount: 3,
      primaryUseCase: "coding",
    };

    let lastRes;
    for (let i = 0; i < 11; i++) {
      lastRes = await POST(makeRequest(body, { "x-forwarded-for": "1.2.3.4" }));
    }
    expect(lastRes!.status).toBe(429);
  });
});
