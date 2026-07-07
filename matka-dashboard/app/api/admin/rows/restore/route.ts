import { NextResponse } from "next/server";
import { and, eq, inArray, notInArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { rows } from "@/lib/schema";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Bulk-restore the MANUAL game rows from a snapshot (used by undo/redo in the
// admin row tables).
//
// IMPORTANT: panel_entries / jodi_entries have ON DELETE CASCADE on row_id, so
// deleting a row destroys its chart data. We therefore UPSERT existing rows
// (never delete them) and only delete manual rows that were added after the
// snapshot. Auto-scraped rows are never touched.
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
    }));

  // Upsert by id — updates existing rows in place (no delete → no chart cascade).
  for (const v of values) {
    await db.insert(rows).values(v).onConflictDoUpdate({
      target: rows.id,
      set: {
        section: v.section, title: v.title, resultValue: v.resultValue,
        timeRange: v.timeRange, leftTag: v.leftTag, rightTag: v.rightTag,
        color: v.color, extraLines: v.extraLines, dateLabel: v.dateLabel,
        highlight: v.highlight, position: v.position, updatedAt: new Date(),
      },
    });
  }

  // Remove only manual rows added AFTER the snapshot (i.e. undo of an "add").
  const keepIds = values.map((v) => v.id);
  await db.delete(rows).where(
    keepIds.length > 0
      ? and(inArray(rows.section, [...SECTIONS]), eq(rows.source, "manual"), notInArray(rows.id, keepIds))
      : and(inArray(rows.section, [...SECTIONS]), eq(rows.source, "manual"))
  );

  return NextResponse.json({ ok: true, count: values.length });
}
