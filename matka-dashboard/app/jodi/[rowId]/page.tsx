import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { jodiEntries, rows, sectionSettings } from "@/lib/schema";
import { JodiChart } from "@/components/public/JodiChart";
import { AutoRefresh } from "@/components/public/AutoRefresh";
import { chartSectionKey } from "@/lib/sectionConfig";
import { resolveSection } from "@/lib/resolveStyle";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function JodiPage({ params }: { params: { rowId: string } }) {
  const [game] = await db.select().from(rows).where(eq(rows.id, params.rowId));
  if (!game) notFound();
  const entries = await db
    .select()
    .from(jodiEntries)
    .where(eq(jodiEntries.rowId, params.rowId))
    .orderBy(asc(jodiEntries.weekStart), asc(jodiEntries.position));

  const key = chartSectionKey("jodi", params.rowId);
  const [live] = await db.select().from(sectionSettings).where(eq(sectionSettings.sectionKey, key)).limit(1);
  const design = resolveSection(key, live);

  return (
    <>
      <AutoRefresh />
      <JodiChart game={game} entries={entries} design={design} />
    </>
  );
}
