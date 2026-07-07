import { NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { rows } from "@/lib/schema";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Bulk-restore the MANUAL game rows from a snapshot (used by undo/redo in the
// admin row tables). Scraped/auto rows are never touched — they stay live-synced.
export async function PUT(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.snapshot)) {
    return NextResponse.json({ error: "snapshot required" }, { status: 400 });
  }

  type Snap = {
    id?: string; section?: string; title?: string; resultValue?: string;
    timeRange?: string | null; leftTag?: string | null; rightTag?: string | null;
    color?: string; extraLines?: unknown; dateLabel?: string | null;
    highlight?: boolean; position?: number; source?: string;
  };

  const SECTIONS = ["live_result", "live_update"] as const;
  const values = (body.snapshot as Snap[])
    .filter((r) => r.source !== "scraped" && r.id && r.section && SECTIONS.includes(r.section as "live_result" | "live_update"))
    .map((r) => ({
      id: r.id!,
      section: r.section as "live_result" | "live_update",
      title: String(r.title ?? "").slice(0, 200),
      resultValue: String(r.resultValue ?? ""),
      timeRange: r.timeRange ?? null,
      leftTag: r.leftTag ?? null,
      rightTag: r.rightTag ?? null,
      color: typeof r.color === "string" && r.color.startsWith("#") ? r.color : "#000000",
      extraLines: Array.isArray(r.extraLines) ? r.extraLines.map(String) : null,
      dateLabel: r.dateLabel ?? null,
      highlight: Boolean(r.highlight),
      position: typeof r.position === "number" ? r.position : 0,
      source: "manual",
    }));

  // Replace all manual rows in these sections with the snapshot (ids preserved so
  // linked Jodi/Panel charts keep working).
  await db.delete(rows).where(and(inArray(rows.section, [...SECTIONS]), eq(rows.source, "manual")));
  if (values.length > 0) {
    await db.insert(rows).values(values);
  }
  return NextResponse.json({ ok: true, count: values.length });
}
