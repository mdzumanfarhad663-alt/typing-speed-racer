import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { restoreBackup, createBackup } from "@/lib/backup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Safety net: snapshot current state before overwriting it, so a mistaken
    // restore can itself be undone from the backup list.
    await createBackup("auto").catch(() => {});
    await restoreBackup(params.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "restore_failed";
    return NextResponse.json({ error: msg }, { status: msg === "not_found" ? 404 : 500 });
  }
}
