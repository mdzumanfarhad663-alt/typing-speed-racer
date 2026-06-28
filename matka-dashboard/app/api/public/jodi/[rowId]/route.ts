import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { jodiEntries, rows } from "@/lib/schema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_req: Request, { params }: { params: { rowId: string } }) {
  try {
    const [game] = await db.select().from(rows).where(eq(rows.id, params.rowId));
    if (!game) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const entries = await db
      .select()
      .from(jodiEntries)
      .where(eq(jodiEntries.rowId, params.rowId))
      .orderBy(asc(jodiEntries.weekStart), asc(jodiEntries.position));
    return NextResponse.json(
      { game, entries },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error("[jodi/get] error", e);
    return NextResponse.json({ error: "db_unavailable" }, { status: 500 });
  }
}
