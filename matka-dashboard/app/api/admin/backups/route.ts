import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listBackups, createBackup, maybeHourlyBackup } from "@/lib/backup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Opening this page keeps hourly backups flowing even without a paid cron.
  await maybeHourlyBackup();
  const backups = await listBackups();
  return NextResponse.json({ backups });
}

// Manual "Backup now"
export async function POST() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await createBackup("manual");
  const backups = await listBackups();
  return NextResponse.json({ ok: true, backups });
}
