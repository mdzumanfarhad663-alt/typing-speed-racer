import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sectionSettings } from "@/lib/schema";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Home-page widget visibility toggles (refresh button + Matka Play button),
// stored in section_settings under the "chatbot" key (content.refreshEnabled /
// content.matkaPlayEnabled = "true" | "false"). The public home page reads
// them through /api/public/section-settings.
const KEY = "chatbot";

// Drops the retired "enabled" (live chat) field from a content object.
function stripLiveChat(content: Record<string, string>): Record<string, string> {
  const { enabled: _enabled, ...rest } = content;
  return rest;
}

async function guard() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  const [row] = await db.select().from(sectionSettings).where(eq(sectionSettings.sectionKey, KEY)).limit(1);
  const content = (row?.content as Record<string, string> | undefined) ?? {};
  // Clean up the retired live-chat cache field if it's still stored.
  if ("enabled" in content) {
    await db
      .update(sectionSettings)
      .set({ content: stripLiveChat(content), updatedAt: new Date() })
      .where(eq(sectionSettings.sectionKey, KEY));
  }
  return NextResponse.json({
    refreshEnabled: content.refreshEnabled !== "false",
    matkaPlayEnabled: content.matkaPlayEnabled !== "false",
  });
}

export async function PATCH(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  if (!body || (typeof body.refreshEnabled !== "boolean" && typeof body.matkaPlayEnabled !== "boolean")) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const content: Record<string, string> = {};
  if (typeof body.refreshEnabled === "boolean") content.refreshEnabled = String(body.refreshEnabled);
  if (typeof body.matkaPlayEnabled === "boolean") content.matkaPlayEnabled = String(body.matkaPlayEnabled);
  const [existing] = await db.select().from(sectionSettings).where(eq(sectionSettings.sectionKey, KEY)).limit(1);
  const merged = stripLiveChat({ ...((existing?.content as Record<string, string>) ?? {}), ...content });
  if (existing) {
    await db
      .update(sectionSettings)
      .set({ content: merged, updatedAt: new Date() })
      .where(eq(sectionSettings.sectionKey, KEY));
  } else {
    await db.insert(sectionSettings).values({ sectionKey: KEY, styles: {}, content: merged });
  }
  return NextResponse.json({
    refreshEnabled: merged.refreshEnabled !== "false",
    matkaPlayEnabled: merged.matkaPlayEnabled !== "false",
  });
}
