import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { rows } from "@/lib/schema";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.order)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const order = body.order as Array<{ id: string; position: number }>;

  // neon-http driver doesn't support multi-statement transactions; sequential updates.
  for (const { id, position } of order) {
    await db.update(rows).set({ position: Number(position) || 0 }).where(eq(rows.id, id));
  }
  return NextResponse.json({ ok: true });
}
