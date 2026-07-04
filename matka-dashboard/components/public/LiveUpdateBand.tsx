import type { Row } from "@/lib/types";
import type { SectionResolver } from "@/lib/resolveStyle";
import { toCss } from "@/lib/resolveStyle";

export function LiveUpdateBand({ items, resolve }: { items: Row[]; resolve: SectionResolver }) {
  if (!items || items.length === 0) return null;
  const { styles, content } = resolve("live_update_band");

  return (
    <div className="section-card my-4">
      <div className="live-result" style={toCss(styles.header)}>
        {content.heading}
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
