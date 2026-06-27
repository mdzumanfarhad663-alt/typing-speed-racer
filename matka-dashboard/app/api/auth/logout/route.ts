import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { buildClearCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  cookies().set(buildClearCookie());
  return NextResponse.json({ ok: true });
}
