import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { panelEntries, rows } from "@/lib/schema";
import { PanelChart } from "@/components/public/PanelChart";
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
  return <PanelChart game={game} entries={entries} />;
}
