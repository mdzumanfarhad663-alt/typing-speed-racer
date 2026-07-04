import { and, eq, max } from "drizzle-orm";
import { db } from "@/lib/db";
import { jodiEntries, type PanelDay, type JodiDay } from "@/lib/schema";

/**
 * Mirrors a panel entry's per-day jodi digits into the matching jodi_entries
 * row (same rowId + week), so admins only enter the jodi number once in the
 * panel form and it shows up automatically on the jodi chart page.
 */
export async function syncJodiFromPanel(rowId: string, weekStart: string, weekEnd: string, panelDays: PanelDay[]) {
  const jodiDays: JodiDay[] = panelDays.map((d) => ({
    value: d.jodi || "",
    color: d.color || "#000000",
  }));

  const [existing] = await db
    .select()
    .from(jodiEntries)
    .where(and(eq(jodiEntries.rowId, rowId), eq(jodiEntries.weekStart, weekStart), eq(jodiEntries.weekEnd, weekEnd)))
    .limit(1);

  if (existing) {
    await db.update(jodiEntries).set({ days: jodiDays, updatedAt: new Date() }).where(eq(jodiEntries.id, existing.id));
    return;
  }

  const [{ value: maxPos }] = await db
    .select({ value: max(jodiEntries.position) })
    .from(jodiEntries)
    .where(eq(jodiEntries.rowId, rowId));
  const position = (maxPos ?? -1) + 1;

  await db.insert(jodiEntries).values({ rowId, weekStart, weekEnd, days: jodiDays, position });
}
