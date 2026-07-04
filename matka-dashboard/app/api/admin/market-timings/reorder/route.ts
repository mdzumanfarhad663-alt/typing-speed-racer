import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { marketTimings } from "@/lib/schema";
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

  for (const { id, position } of order) {
    await db.update(marketTimings).set({ position: Number(position) || 0 }).where(eq(marketTimings.id, id));
  }
  return NextResponse.json({ ok: true });
}
