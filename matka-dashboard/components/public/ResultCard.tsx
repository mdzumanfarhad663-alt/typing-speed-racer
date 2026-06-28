import Link from "next/link";
import type { Row } from "@/lib/types";

function TagSide({ text, href }: { text: string; href?: string }) {
  if (href) {
    return (
      <Link href={href} className="tag-side inline-block hover:opacity-80">
        {text}
      </Link>
    );
  }
  return <span className="tag-side">{text}</span>;
}

export function ResultCard({ row }: { row: Row }) {
  const panelHref = `/panel/${row.id}`;
  const rightIsPanel = row.rightTag?.trim().toLowerCase() === "panel";
  return (
    <div className={`flex items-center justify-between px-4 py-3 border-t border-gray-300 ${row.highlight ? "kalyan-row" : ""}`}>
      <div className="w-20">
        {row.leftTag && <TagSide text={row.leftTag} />}
      </div>
      <div className="flex-1 text-center">
        <div className="italic font-bold text-xl" style={{ color: row.color, textShadow: "1px 1px 0 rgba(0,0,0,0.15)" }}>
          {row.title}
        </div>
        <div className="text-xl font-bold tracking-wide">{row.resultValue}</div>
        {row.timeRange && <div className="text-sm italic font-bold text-red-600">{row.timeRange}</div>}
      </div>
      <div className="w-20 text-right">
        {row.rightTag && <TagSide text={row.rightTag} href={rightIsPanel ? panelHref : undefined} />}
      </div>
    </div>
  );
}
