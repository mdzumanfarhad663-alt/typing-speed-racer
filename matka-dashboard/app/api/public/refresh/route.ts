import { NextResponse } from "next/server";
import { maybeAutoSync } from "@/lib/autoSync";

// Public, no-auth endpoint that pulls the latest results from the source site
// into our DB. The browser awaits it, which keeps the Vercel function alive
// until the scrape completes. Throttled server-side to once per 5s, so it is
// safe to expose and safe to call on a 5s client timer.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET() {
  await maybeAutoSync();
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
