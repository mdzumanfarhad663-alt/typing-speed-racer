import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sectionSettings } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { getSectionConfig, getSectionDefaults } from "@/lib/sectionConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function guard() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET(_req: Request, { params }: { params: { key: string } }) {
  const denied = await guard();
  if (denied) return denied;
  const cfg = getSectionConfig(params.key);
  if (!cfg) return NextResponse.json({ error: "Unknown section" }, { status: 404 });

  const [existing] = await db.select().from(sectionSettings).where(eq(sectionSettings.sectionKey, params.key)).limit(1);
  const defaults = getSectionDefaults(params.key);
  return NextResponse.json({
    sectionKey: params.key,
    label: cfg.label,
    styles: existing ? { ...defaults.styles, ...(existing.styles as Record<string, unknown>) } : defaults.styles,
    content: existing ? { ...defaults.content, ...(existing.content as Record<string, unknown>) } : defaults.content,
  });
}

export async function PATCH(req: Request, { params }: { params: { key: string } }) {
  const denied = await guard();
  if (denied) return denied;
  if (!getSectionConfig(params.key)) return NextResponse.json({ error: "Unknown section" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const [existing] = await db.select().from(sectionSettings).where(eq(sectionSettings.sectionKey, params.key)).limit(1);
  const styles = body.styles ?? existing?.styles ?? {};
  const content = body.content ?? existing?.content ?? {};

  const [saved] = existing
    ? await db
        .update(sectionSettings)
        .set({ styles, content, updatedAt: new Date() })
        .where(eq(sectionSettings.sectionKey, params.key))
        .returning()
    : await db.insert(sectionSettings).values({ sectionKey: params.key, styles, content }).returning();

  return NextResponse.json({ setting: saved });
}

// Reset a section back to its hardcoded defaults (clears overrides rather than deleting the row).
export async function DELETE(_req: Request, { params }: { params: { key: string } }) {
  const denied = await guard();
  if (denied) return denied;
  if (!getSectionConfig(params.key)) return NextResponse.json({ error: "Unknown section" }, { status: 404 });

  const [existing] = await db.select().from(sectionSettings).where(eq(sectionSettings.sectionKey, params.key)).limit(1);
  if (!existing) return NextResponse.json({ ok: true });

  await db
    .update(sectionSettings)
    .set({ styles: {}, content: {}, updatedAt: new Date() })
    .where(eq(sectionSettings.sectionKey, params.key));
  return NextResponse.json({ ok: true });
}
