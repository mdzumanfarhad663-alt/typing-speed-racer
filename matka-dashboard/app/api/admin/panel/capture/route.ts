import { NextResponse } from "next/server";
import { and, eq, max } from "drizzle-orm";
import { db } from "@/lib/db";
import { panelEntries, rows, type PanelDay } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { syncJodiFromPanel } from "@/lib/syncJodi";
import { computePanelJodi, normalizeResult } from "@/lib/pannaFix";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SCHEDULE_TIMEZONE = "Asia/Dhaka";

// "YYYY-MM-DD" for today, and the Monday..Sunday week that contains it —
// both in the site's operating timezone, matching the panel chart's week
// convention (DAY_LABELS = MON..SUN).
function todayAndWeek(): { today: string; weekStart: string; weekEnd: string; dayIndex: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SCHEDULE_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const today = `${get("year")}-${get("month")}-${get("day")}`;
  const weekdayMap: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
  const dayIndex = weekdayMap[get("weekday")] ?? 0;

  const todayDate = new Date(`${today}T00:00:00Z`);
  const monday = new Date(todayDate);
  monday.setUTCDate(todayDate.getUTCDate() - dayIndex);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  return { today, weekStart: fmt(monday), weekEnd: fmt(sunday), dayIndex };
}

function emptyDays(): PanelDay[] {
  return Array.from({ length: 7 }, () => ({ open: "", jodi: "", close: "", color: "#000000" }));
}

async function guard() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

// Captures a live result value (e.g. "123-69-450") straight into today's day
// cell of the game's panel chart, auto-creating this week's row if it
// doesn't exist yet. Also mirrors into the jodi chart via syncJodiFromPanel.
export async function POST(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  const rowId = body?.rowId;
  const resultValue = typeof body?.resultValue === "string" ? body.resultValue.trim() : "";
  if (!rowId || !resultValue) return NextResponse.json({ error: "rowId and resultValue required" }, { status: 400 });

  const [game] = await db.select({ id: rows.id, title: rows.title }).from(rows).where(eq(rows.id, rowId)).limit(1);
  if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });

  const [rawOpen = "", rawJodi = "", rawClose = ""] = resultValue.split("-");
  const open = normalizeResult(rawOpen.trim());
  const close = normalizeResult(rawClose.trim());
  const jodi = computePanelJodi(open, close, rawJodi.trim());
  if (!open && !jodi && !close) return NextResponse.json({ error: "Could not parse result value" }, { status: 400 });

  const { today, weekStart, weekEnd, dayIndex } = todayAndWeek();

  const [existing] = await db
    .select()
    .from(panelEntries)
    .where(and(eq(panelEntries.rowId, rowId), eq(panelEntries.weekStart, weekStart), eq(panelEntries.weekEnd, weekEnd)))
    .limit(1);

  let entry;
  if (existing) {
    const days = [...existing.days] as PanelDay[];
    days[dayIndex] = { open, jodi, close, color: days[dayIndex]?.color || "#000000" };
    const [updated] = await db.update(panelEntries).set({ days, updatedAt: new Date() }).where(eq(panelEntries.id, existing.id)).returning();
    entry = updated;
  } else {
    const days = emptyDays();
    days[dayIndex] = { open, jodi, close, color: "#000000" };
    const [{ value: maxPos }] = await db.select({ value: max(panelEntries.position) }).from(panelEntries).where(eq(panelEntries.rowId, rowId));
    const [inserted] = await db
      .insert(panelEntries)
      .values({ rowId, weekStart, weekEnd, days, position: (maxPos ?? -1) + 1 })
      .returning();
    entry = inserted;
  }

  await syncJodiFromPanel(entry.rowId, entry.weekStart, entry.weekEnd, entry.days);

  return NextResponse.json({ ok: true, entry, today, weekStart, weekEnd, gameTitle: game.title });
}
