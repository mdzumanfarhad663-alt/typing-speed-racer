import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sectionSettings } from "@/lib/schema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const all = await db.select().from(sectionSettings);
    const out: Record<string, { styles: unknown; content: unknown }> = {};
    for (const r of all) out[r.sectionKey] = { styles: r.styles, content: r.content };
    return NextResponse.json(out, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (e) {
    console.error("[public/section-settings] error", e);
    return NextResponse.json({}, { status: 200, headers: { "Cache-Control": "no-store" } });
  }
}
