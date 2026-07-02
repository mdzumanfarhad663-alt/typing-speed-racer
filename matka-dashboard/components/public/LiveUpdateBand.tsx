import type { Row } from "@/lib/types";

export function LiveUpdateBand({ items }: { items: Row[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="section-card my-4">
      <div className="text-center py-2 font-bold text-xl tracking-wide text-white" style={{ background: "#29b6d8" }}>
        📡 LIVE UPDATE
      </div>
      {items.map((row, i) => (
        <div
          key={row.id}
          className={`flex flex-col items-center py-2.5 bg-white ${i < items.length - 1 ? "border-b border-gray-200" : ""}`}
        >
          <span className="text-red-600 font-bold text-xl">{row.title}</span>
          <span className="text-blue-700 font-bold text-2xl tracking-widest">{row.resultValue}</span>
          {row.timeRange && <span className="text-red-500 text-sm">{row.timeRange}</span>}
        </div>
      ))}
    </div>
  );
}
