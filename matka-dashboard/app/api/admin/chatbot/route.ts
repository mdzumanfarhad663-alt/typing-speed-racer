import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sectionSettings } from "@/lib/schema";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Home-page widget visibility toggles (live chat + refresh button), stored in
// section_settings under the "chatbot" key (content.enabled / content.refreshEnabled
// = "true" | "false"). The public home page reads them through
// /api/public/section-settings.
const KEY = "chatbot";

async function guard() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  const [row] = await db.select().from(sectionSettings).where(eq(sectionSettings.sectionKey, KEY)).limit(1);
  const content = row?.content as Record<string, string> | undefined;
  return NextResponse.json({
    enabled: content?.enabled !== "false",
    refreshEnabled: content?.refreshEnabled !== "false",
  });
}

export async function PATCH(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  if (!body || (typeof body.enabled !== "boolean" && typeof body.refreshEnabled !== "boolean")) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const content: Record<string, string> = {};
  if (typeof body.enabled === "boolean") content.enabled = String(body.enabled);
  if (typeof body.refreshEnabled === "boolean") content.refreshEnabled = String(body.refreshEnabled);
  const [existing] = await db.select().from(sectionSettings).where(eq(sectionSettings.sectionKey, KEY)).limit(1);
  const merged = { ...((existing?.content as Record<string, string>) ?? {}), ...content };
  if (existing) {
    await db
      .update(sectionSettings)
      .set({ content: merged, updatedAt: new Date() })
      .where(eq(sectionSettings.sectionKey, KEY));
  } else {
    await db.insert(sectionSettings).values({ sectionKey: KEY, styles: {}, content: merged });
  }
  return NextResponse.json({
    enabled: merged.enabled !== "false",
    refreshEnabled: merged.refreshEnabled !== "false",
  });
}
