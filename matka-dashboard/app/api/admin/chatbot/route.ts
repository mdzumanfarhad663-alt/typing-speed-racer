import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sectionSettings } from "@/lib/schema";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Live chat visibility toggle, stored in section_settings under the
// "chatbot" key (content.enabled = "true" | "false"). The public home page
// reads it through /api/public/section-settings.
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
  const enabled = (row?.content as Record<string, string> | undefined)?.enabled !== "false";
  return NextResponse.json({ enabled });
}

export async function PATCH(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  if (!body || typeof body.enabled !== "boolean") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const content = { enabled: String(body.enabled) };
  const [existing] = await db.select().from(sectionSettings).where(eq(sectionSettings.sectionKey, KEY)).limit(1);
  if (existing) {
    await db
      .update(sectionSettings)
      .set({ content: { ...(existing.content as Record<string, string>), ...content }, updatedAt: new Date() })
      .where(eq(sectionSettings.sectionKey, KEY));
  } else {
    await db.insert(sectionSettings).values({ sectionKey: KEY, styles: {}, content });
  }
  return NextResponse.json({ enabled: body.enabled });
}
