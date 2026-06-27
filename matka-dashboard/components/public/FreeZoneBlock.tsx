import type { Row } from "@/lib/types";

export function FreeZoneBlock({ items }: { items: Row[] }) {
  const dateLabel = items.find((i) => i.dateLabel)?.dateLabel || null;
  return (
    <section className="section-frame max-w-5xl mx-auto my-4" style={{ outlineColor: "#aa0000" }}>
      <div className="py-2 px-4" style={{ background: "#6c1d8b", color: "#fff200" }}>
        <h2 className="font-bold italic text-lg">⇛ OPEN TO CLOSE FREE GAME ZONE</h2>
      </div>
      {dateLabel && (
        <div className="text-center italic font-bold py-2" style={{ background: "#fff066" }}>
          {dateLabel}
        </div>
      )}
      <div style={{ background: "#fff2c4" }}>
        {items.length === 0 && <div className="py-6 text-center italic text-gray-500">No tips yet</div>}
        {items.map((r) => (
          <div key={r.id} className="text-center py-4 border-t-2 border-blue-700">
            <div className="italic font-bold text-xl" style={{ color: r.color, background: "rgba(255,255,255,0.4)", display: "inline-block", padding: "2px 10px" }}>
              {r.title}
            </div>
            {r.resultValue && <div className="italic font-bold text-lg text-blue-700">{r.resultValue}</div>}
            {r.extraLines?.map((line, i) => (
              <div key={i} className="italic font-bold" style={{ color: i % 2 === 0 ? "#000" : "#d00" }}>{line}</div>
            ))}
            {r.timeRange && <div className="italic font-bold text-red-600">{r.timeRange}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
