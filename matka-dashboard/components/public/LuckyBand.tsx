import type { Row } from "@/lib/types";

export function LuckyBand({ items }: { items: Row[] }) {
  return (
    <section className="section-frame my-4">
      <div className="bg-pink-100 border-y-2 border-pink-300 text-center py-2">
        <h2 className="text-xl font-bold italic">Today Satta Matka Lucky Number</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 py-6 px-8">
        {items.length === 0 && (
          <div className="col-span-2 text-center text-gray-500 italic">No lucky numbers yet</div>
        )}
        {items.map((r) => (
          <div key={r.id} className="text-center">
            <div className="italic font-bold text-lg" style={{ color: r.color }}>
              {r.title}
            </div>
            <div className="text-lg font-semibold">{r.resultValue}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
