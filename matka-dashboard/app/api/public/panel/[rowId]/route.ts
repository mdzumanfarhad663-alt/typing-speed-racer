import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { panelEntries, rows } from "@/lib/schema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_req: Request, { params }: { params: { rowId: string } }) {
  try {
    const [game] = await db.select().from(rows).where(eq(rows.id, params.rowId));
    if (!game) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const entries = await db
      .select()
      .from(panelEntries)
      .where(eq(panelEntries.rowId, params.rowId))
      .orderBy(asc(panelEntries.weekStart), asc(panelEntries.position));
    return NextResponse.json(
      { game, entries },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error("[panel/get] error", e);
    return NextResponse.json({ error: "db_unavailable" }, { status: 500 });
  }
}
