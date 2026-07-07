import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { runFullSync } from "@/lib/autoSync";

export const maxDuration = 30;

export async function POST() {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await runFullSync();

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "scrape_failed", upserted: 0 }, { status: 502 });
  }

  return NextResponse.json({ ...result, timestamp: new Date().toISOString() });
}
