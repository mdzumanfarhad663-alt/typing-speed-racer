import type { Row } from "@/lib/types";

export function ResultCard({ row }: { row: Row }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 border-t border-gray-300 ${row.highlight ? "kalyan-row" : ""}`}>
      <div className="w-20">
        {row.leftTag && <span className="tag-side">{row.leftTag}</span>}
      </div>
      <div className="flex-1 text-center">
        <div className="italic font-bold text-xl" style={{ color: row.color, textShadow: "1px 1px 0 rgba(0,0,0,0.15)" }}>
          {row.title}
        </div>
        <div className="text-xl font-bold tracking-wide">{row.resultValue}</div>
        {row.timeRange && <div className="text-sm italic font-bold text-red-600">{row.timeRange}</div>}
      </div>
      <div className="w-20 text-right">
        {row.rightTag && <span className="tag-side">{row.rightTag}</span>}
      </div>
    </div>
  );
}
