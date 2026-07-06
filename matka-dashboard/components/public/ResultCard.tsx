import Link from "next/link";
import type { Row } from "@/lib/types";
import type { SectionResolver } from "@/lib/resolveStyle";
import { toCss } from "@/lib/resolveStyle";

function TagSide({ text, href, external }: { text: string; href?: string; external?: boolean }) {
  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="tag-side inline-block hover:opacity-80">
        {text}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className="tag-side inline-block hover:opacity-80">
        {text}
      </Link>
    );
  }
  return <span className="tag-side">{text}</span>;
}

function getExtraUrl(extraLines: string[] | null | undefined, prefix: string): string | null {
  if (!extraLines) return null;
  const line = extraLines.find((l) => l.startsWith(prefix));
  return line ? line.slice(prefix.length) : null;
}

export function ResultCard({ row, resolve }: { row: Row; resolve: SectionResolver }) {
  const { styles } = resolve("live_result_list");

  // For scraped rows, use the source site's external Jodi/Panel URLs
  const scrapedJodiUrl = getExtraUrl(row.extraLines, "jodi_url:");
  const scrapedPanelUrl = getExtraUrl(row.extraLines, "panel_url:");

  const jodiHref = scrapedJodiUrl ?? `/jodi/${row.id}`;
  const panelHref = scrapedPanelUrl ?? `/panel/${row.id}`;
  const jodiExternal = !!scrapedJodiUrl;
  const panelExternal = !!scrapedPanelUrl;

  const leftIsJodi = row.leftTag?.trim().toLowerCase() === "jodi";
  const rightIsPanel = row.rightTag?.trim().toLowerCase() === "panel";

  return (
    <div className={`flex items-center justify-between px-4 py-2.5 border-t border-gray-200 ${row.highlight ? "kalyan-row" : ""}`}>
      <div className="w-20">
        {row.leftTag && (
          <TagSide
            text={row.leftTag}
            href={leftIsJodi ? jodiHref : undefined}
            external={leftIsJodi ? jodiExternal : false}
          />
        )}
      </div>
      <div className="flex-1 text-center">
        <div className="font-bold text-xl" style={{ color: row.color, ...toCss(styles.nameText) }}>
          {row.title}
        </div>
        <div className="text-xl font-bold tracking-wide" style={toCss(styles.resultText)}>{row.resultValue}</div>
        {row.timeRange && <div className="text-sm font-bold" style={toCss(styles.timeText)}>{row.timeRange}</div>}
      </div>
      <div className="w-20 text-right">
        {row.rightTag && (
          <TagSide
            text={row.rightTag}
            href={rightIsPanel ? panelHref : undefined}
            external={rightIsPanel ? panelExternal : false}
          />
        )}
      </div>
    </div>
  );
}
