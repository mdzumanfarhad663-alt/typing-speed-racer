import type { Row } from "@/lib/types";

export function FreeZoneBlock({ items }: { items: Row[] }) {
  const dateLabel = items.find((i) => i.dateLabel)?.dateLabel || null;
  return (
    <section className="section-card my-4">
      <div className="py-2 px-4" style={{ background: "#6c1d8b", color: "#fff200" }}>
        <h2 className="font-bold text-lg">⇛ OPEN TO CLOSE FREE GAME ZONE</h2>
      </div>
      {dateLabel && (
        <div className="text-center font-bold py-2" style={{ background: "#ffd400" }}>
          {dateLabel}
        </div>
      )}
      <div style={{ background: "#ffd400" }}>
        {items.length === 0 && <div className="py-6 text-center text-gray-700">No tips yet</div>}
        {items.map((r) => (
          <div key={r.id} className="text-center py-2.5 border-t border-black/20">
            <div className="font-bold text-xl" style={{ color: r.color }}>
              {r.title}
            </div>
            {r.resultValue && <div className="font-bold text-lg text-blue-900">{r.resultValue}</div>}
            {r.extraLines?.map((line, i) => (
              <div key={i} className="font-bold" style={{ color: i % 2 === 0 ? "#000" : "#8e2430" }}>{line}</div>
            ))}
            {r.timeRange && <div className="font-bold text-red-700">{r.timeRange}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
