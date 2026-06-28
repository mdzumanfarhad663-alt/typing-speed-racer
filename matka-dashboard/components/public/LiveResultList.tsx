import type { Row } from "@/lib/types";
import { ResultCard } from "./ResultCard";

export function LiveResultList({ items }: { items: Row[] }) {
  return (
    <section className="section-frame my-4">
      <div className="gradient-band text-center py-3">
        <h2 className="text-2xl font-bold italic">
          <span className="mx-2">{"«««"}</span>
          <span className="underline">📊 LIVE MATKA RESULT</span>
          <span className="mx-2">{"»»»"}</span>
        </h2>
      </div>
      <div className="bg-white">
        {items.length === 0 && <div className="py-6 text-center italic text-gray-500">No results yet</div>}
        {items.map((r) => <ResultCard key={r.id} row={r} />)}
      </div>
    </section>
  );
}
