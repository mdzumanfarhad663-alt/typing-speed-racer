import type { Row } from "@/lib/types";

export function LiveUpdateBand({ items }: { items: Row[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="section-frame my-4">
      <div className="bg-amber-400 text-center py-2 font-bold text-xl tracking-wide border-b-2 border-amber-600">
        📡 LIVE UPDATE
      </div>
      {items.map((row, i) => (
        <div
          key={row.id}
          className={`flex flex-col items-center py-3 bg-white ${i < items.length - 1 ? "border-b-2 border-gray-300" : ""}`}
        >
          <span className="text-red-600 font-bold text-xl italic">{row.title}</span>
          <span className="text-blue-700 font-bold text-2xl tracking-widest">{row.resultValue}</span>
          {row.timeRange && <span className="text-red-500 text-sm italic">{row.timeRange}</span>}
        </div>
      ))}
    </div>
  );
}
