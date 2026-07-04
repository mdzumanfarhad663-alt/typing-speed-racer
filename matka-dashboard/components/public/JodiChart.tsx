import type { JodiEntry, Row } from "@/lib/schema";
import { toCss } from "@/lib/resolveStyle";
import type { ChartDesign } from "./PanelChart";
import { RefreshButton } from "./RefreshButton";

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
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700">
          {game.title.toUpperCase()}
        </h2>
        <div className="text-base sm:text-xl font-bold mt-1">{game.resultValue}</div>
        <div className="mt-3">
          <RefreshButton />
        </div>
      </div>
      <div className="bg-black text-center py-2">
        <a
          href={jumpHref}
          className="inline-block font-bold px-4 py-1 text-sm"
          style={{ borderRadius: 4, ...toCss(styles.goToPill) }}
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
    <main className="min-h-screen bg-black text-white p-2">
      <div className="w-full">
        <div id="top" className="text-center py-3 sm:py-4 px-2" style={toCss(styles.topHeader)}>
          <h1 className="text-lg sm:text-2xl md:text-3xl px-2">
            {game.title.toUpperCase()} {content.titleSuffix}
          </h1>
        </div>
        <div className="text-center py-2 sm:py-3 px-4" style={{ borderTop: "none", ...toCss(styles.subtitleBox) }}>
          <p className="text-base sm:text-xl font-bold">{game.title} {content.subtitleText}</p>
          <p className="text-[10px] sm:text-xs mt-1">{content.keywordsText}</p>
        </div>

        <GameHeader game={game} design={design} anchorId="header-top" jumpHref="#bottom" jumpLabel={content.goToBottomLabel} />

        {entries.length === 0 ? (
          <div className="text-black text-center py-8 text-base font-bold" style={toCss(styles.resultBox)}>
            {content.emptyMessage}
          </div>
        ) : (
          <div className="bg-black p-1 sm:p-2 mx-auto" style={{ maxWidth: "605px" }}>
            <table className="w-full table-fixed border-collapse bg-white" style={toCss(styles.tableBorder)}>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
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
