import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sectionSettings } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { SECTION_CONFIG, getSectionDefaults } from "@/lib/sectionConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function guard() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;

  const existing = await db.select().from(sectionSettings);
  const byKey = new Map(existing.map((r) => [r.sectionKey, r]));

  const sections = SECTION_CONFIG.map((cfg) => {
    const row = byKey.get(cfg.key);
    const defaults = getSectionDefaults(cfg.key);
    return {
      sectionKey: cfg.key,
      label: cfg.label,
      styles: row ? { ...defaults.styles, ...(row.styles as Record<string, unknown>) } : defaults.styles,
      content: row ? { ...defaults.content, ...(row.content as Record<string, unknown>) } : defaults.content,
    };
  });

  return NextResponse.json({ sections });
}
