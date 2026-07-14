import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { panelEntries, type PanelDay } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { syncJodiFromPanel } from "@/lib/syncJodi";
import { normalizeResult } from "@/lib/pannaFix";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeDays(raw: unknown): PanelDay[] {
  if (!Array.isArray(raw)) return Array.from({ length: 7 }, () => ({ open: "", jodi: "", close: "" }));
  const arr: PanelDay[] = [];
  for (let i = 0; i < 7; i++) {
    const d = (raw[i] || {}) as PanelDay;
    arr.push({
      open: normalizeResult(String(d.open || "").slice(0, 6)),
      jodi: String(d.jodi || "").slice(0, 4),
      close: normalizeResult(String(d.close || "").slice(0, 6)),
      color: typeof d.color === "string" && d.color.startsWith("#") ? d.color : "#000000",
    });
  }
  return arr;
}

async function guard() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const denied = await guard();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const patch: Record<string, unknown> = { updatedAt: new Date() };
  if ("weekStart" in body) patch.weekStart = body.weekStart;
  if ("weekEnd" in body) patch.weekEnd = body.weekEnd;
  if ("days" in body) patch.days = normalizeDays(body.days);
  if ("position" in body) patch.position = Number(body.position) || 0;
  const [updated] = await db.update(panelEntries).set(patch).where(eq(panelEntries.id, params.id)).returning();
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await syncJodiFromPanel(updated.rowId, updated.weekStart, updated.weekEnd, updated.days);
  return NextResponse.json({ entry: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const denied = await guard();
  if (denied) return denied;
  await db.delete(panelEntries).where(eq(panelEntries.id, params.id));
  return NextResponse.json({ ok: true });
}
