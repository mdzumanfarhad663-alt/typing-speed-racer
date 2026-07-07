import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { deleteBackup } from "@/lib/backup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await deleteBackup(params.id);
  return NextResponse.json({ ok: true });
}
