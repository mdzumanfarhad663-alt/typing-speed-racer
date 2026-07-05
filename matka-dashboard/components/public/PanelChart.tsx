import type { PanelDay, PanelEntry, Row, StyleSlot } from "@/lib/schema";
import { toCss } from "@/lib/resolveStyle";
import { RefreshButton } from "./RefreshButton";

export type ChartDesign = { styles: Record<string, StyleSlot>; content: Record<string, string> };

function pad(s: string, len: number) {
  return (s + "      ").slice(0, len).split("");
}

function DayCell({ d }: { d: PanelDay }) {
  const open = pad(d.open || "   ", 3);
  const close = pad(d.close || "   ", 3);
  const jodiColor = d.color || "#000000";
  return (
    <td className="bg-white text-black align-middle p-0.5 sm:p-1.5" style={{ border: "1px solid #ddd" }}>
      <div className="flex items-center justify-center gap-0.5 sm:gap-1">
        <div className="flex flex-col text-[6px] sm:text-[10px] leading-tight font-bold">
          <span>{open[0]}</span><span>{open[1]}</span><span>{open[2]}</span>
        </div>
        <div className="text-[11px] sm:text-lg md:text-xl font-bold px-0.5" style={{ color: jodiColor }}>{d.jodi || "--"}</div>
        <div className="flex flex-col text-[6px] sm:text-[10px] leading-tight font-bold">
          <span>{close[0]}</span><span>{close[1]}</span><span>{close[2]}</span>
        </div>
      </div>
    </td>
  );
}

function fmtDate(s: string) {
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
}

function GameHeader({
  game,
  design,
  anchorId,
  jumpHref,
  jumpLabel,
}: {
  game: Row;
  design: ChartDesign;
  anchorId: string;
  jumpHref: string;
  jumpLabel: string;
}) {
  const { styles } = design;
  return (
    <div id={anchorId}>
      <div className="text-black text-center py-4 sm:py-6 px-4" style={toCss(styles.resultBox)}>
        <h2
          className="font-bold"
          style={{ fontSize: "25px", fontStyle: "italic", textShadow: "1px 1px #8bc34a", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", color: "blue" }}
        >
          {game.title.toUpperCase()}
        </h2>
        <div className="mt-1" style={{ fontWeight: 700, fontSize: "23px", letterSpacing: "1pt", fontFamily: "Georgia, serif" }}>{game.resultValue}</div>
        <div className="mt-3">
          <RefreshButton />
        </div>
      </div>
      <div className="bg-black text-center py-2">
        <a
          href={jumpHref}
          className="inline-block font-bold"
          style={{
            borderRadius: 4,
            borderLeft: "5px solid gold",
            borderRight: "5px solid gold",
            borderTop: "2px solid gold",
            borderBottom: "2px solid gold",
            fontStyle: "italic",
            fontSize: "large",
            textShadow: "1px 1px gold",
            fontFamily: "Trebuchet MS, sans-serif",
            marginTop: "10px",
            marginBottom: "5px",
            padding: "5px 8px",
            ...toCss(styles.goToPill),
          }}
        >
          {jumpLabel}
        </a>
      </div>
    </div>
  );
}

export function PanelChart({ game, entries, design }: { game: Row; entries: PanelEntry[]; design: ChartDesign }) {
  const { styles, content } = design;
  const dayLabels = (content.dayLabels || "MON,TUE,WED,THU,FRI,SAT,SUN").split(",").map((s) => s.trim());

  return (
    <main className="min-h-screen bg-black text-white p-2" style={{ fontFamily: "Georgia, serif", textAlign: "center" }}>
      <div className="w-full">
        <div id="top" style={{ margin: "3px 0", padding: "3px", ...toCss(styles.topHeader) }}>
          <h1 style={{ fontSize: "2em", fontWeight: "bolder", fontFamily: "Georgia, serif" }}>
            {game.title.toUpperCase()} {content.titleSuffix}
          </h1>
        </div>
        <div style={{ margin: "3px 0", padding: "3px", ...toCss(styles.subtitleBox) }}>
          <h2 style={{ fontSize: "1.5em" }}>{game.title.toUpperCase()} {content.seoHeading}</h2>
          <p>{game.title} {content.subtitleText}</p>
          <p className="mt-1">{content.keywordsText}</p>
        </div>

        <GameHeader game={game} design={design} anchorId="header-top" jumpHref="#bottom" jumpLabel={content.goToBottomLabel} />

        {entries.length === 0 ? (
          <div className="text-black text-center py-8 text-base font-bold" style={toCss(styles.resultBox)}>
            {content.emptyMessage}
          </div>
        ) : (
          <div className="bg-black p-1 sm:p-2 mx-auto" style={{ maxWidth: "605px" }}>
            <table className="w-full table-fixed border-collapse bg-white" style={{ textShadow: "1px 1px 0 gold", ...toCss(styles.tableBorder) }}>
              <thead>
                <tr>
                  <th className="p-0.5 sm:p-1.5 text-[9px] sm:text-base" style={toCss(styles.tableHeader)}>
                    Date
                  </th>
                  {dayLabels.map((label) => (
                    <th key={label} className="p-0.5 sm:p-1.5 text-[9px] sm:text-base" style={toCss(styles.tableHeader)}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="p-0.5 sm:p-1.5 bg-white text-black font-bold text-[7px] sm:text-[11px] text-center" style={{ border: "1px solid #ddd", width: "13%" }}>
                      <div>{fmtDate(entry.weekStart)}</div>
                      <div>To</div>
                      <div>{fmtDate(entry.weekEnd)}</div>
                    </td>
                    {entry.days.map((d, i) => <DayCell key={i} d={d} />)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <GameHeader game={game} design={design} anchorId="bottom" jumpHref="#top" jumpLabel={content.goToTopLabel} />

        <div className="text-center py-3" style={{ borderTop: "none", ...toCss(styles.footerBar) }}>
          <a href="/" className="underline font-bold text-sm" style={{ color: toCss(styles.footerBar).color }}>{content.backLabel}</a>
        </div>
      </div>
    </main>
  );
}
