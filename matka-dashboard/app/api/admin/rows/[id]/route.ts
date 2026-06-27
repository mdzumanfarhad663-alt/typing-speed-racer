import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { rows } from "@/lib/schema";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  for (const k of ["title", "resultValue", "timeRange", "leftTag", "rightTag", "color", "dateLabel"] as const) {
    if (k in body) patch[k] = body[k];
  }
  if ("highlight" in body) patch.highlight = Boolean(body.highlight);
  if ("position" in body) patch.position = Number(body.position) || 0;
  if ("extraLines" in body) patch.extraLines = Array.isArray(body.extraLines) ? body.extraLines.map(String) : null;

  const [updated] = await db.update(rows).set(patch).where(eq(rows.id, params.id)).returning();
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ row: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const denied = await guard();
  if (denied) return denied;
  await db.delete(rows).where(eq(rows.id, params.id));
  return NextResponse.json({ ok: true });
}
