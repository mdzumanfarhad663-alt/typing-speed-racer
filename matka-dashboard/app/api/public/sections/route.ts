import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { rows } from "@/lib/schema";
import type { PublicSectionsResponse } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const all = await db.select().from(rows).orderBy(asc(rows.position), asc(rows.createdAt));
    const grouped: PublicSectionsResponse = { lucky: [], live_result: [], free_zone: [], live_update: [] };
    for (const r of all) {
      if (r.section in grouped) grouped[r.section as keyof PublicSectionsResponse].push(r);
    }
    return NextResponse.json(grouped, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (e) {
    console.error("[public/sections] error", e);
    return NextResponse.json(
      { lucky: [], live_result: [], free_zone: [], live_update: [], error: "db_unavailable" },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }
}
