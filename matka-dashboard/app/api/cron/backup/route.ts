import { NextResponse } from "next/server";
import { createBackup } from "@/lib/backup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Hourly Vercel cron (see vercel.json). Authorized via CRON_SECRET.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET ?? "";
  const auth = req.headers.get("authorization") ?? "";
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  await createBackup("auto");
  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
