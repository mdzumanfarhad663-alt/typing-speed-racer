import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { panelEntries, rows, sectionSettings } from "@/lib/schema";
import { PanelChart } from "@/components/public/PanelChart";
import { chartSectionKey } from "@/lib/sectionConfig";
import { resolveSection } from "@/lib/resolveStyle";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PanelPage({ params }: { params: { rowId: string } }) {
  const [game] = await db.select().from(rows).where(eq(rows.id, params.rowId));
  if (!game) notFound();
  const entries = await db
    .select()
    .from(panelEntries)
    .where(eq(panelEntries.rowId, params.rowId))
    .orderBy(asc(panelEntries.weekStart), asc(panelEntries.position));

  const key = chartSectionKey("panel", params.rowId);
  const [live] = await db.select().from(sectionSettings).where(eq(sectionSettings.sectionKey, key)).limit(1);
  const design = resolveSection(key, live);

  return <PanelChart game={game} entries={entries} design={design} />;
}
