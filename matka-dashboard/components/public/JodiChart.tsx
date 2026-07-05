import type { JodiEntry, Row } from "@/lib/schema";
import { toCss } from "@/lib/resolveStyle";
import type { ChartDesign } from "./PanelChart";
import { RefreshButton } from "./RefreshButton";

const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

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

export function JodiChart({ game, entries, design }: { game: Row; entries: JodiEntry[]; design: ChartDesign }) {
  const { styles, content } = design;

  return (
    <main
      className="min-h-screen bg-black text-white p-2"
      style={{ fontFamily: "Times New Roman, serif", textAlign: "center", fontWeight: 700, fontStyle: "italic" }}
    >
      <div className="w-full">
        <div id="top" style={{ margin: "3px 0", padding: "3px", ...toCss(styles.topHeader) }}>
          <h1 style={{ fontSize: "2em", fontWeight: "bolder", fontFamily: "Georgia, serif" }}>
            {game.title.toUpperCase()} {content.titleSuffix}
          </h1>
        </div>
        <div style={{ margin: "3px 0", padding: "3px", ...toCss(styles.subtitleBox) }}>
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
                  {DAY_LABELS.map((label) => (
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
                    {entry.days.map((d, i) => (
                      <td
                        key={i}
                        className="bg-white text-center align-middle p-0.5 sm:p-1.5"
                        style={{ border: "1px inset #893bff" }}
                      >
                        <span
                          className="text-[13px] sm:text-lg md:text-2xl font-bold italic"
                          style={{ color: d.color || "#000", fontFamily: "Georgia, serif", textShadow: "1px 1px 0 #ffd700" }}
                        >
                          {d.value || "--"}
                        </span>
                      </td>
                    ))}
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
