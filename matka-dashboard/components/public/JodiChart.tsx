import type { JodiEntry, Row } from "@/lib/schema";
import { RefreshButton } from "./RefreshButton";

function GameHeader({ game, anchorId, jumpHref, jumpLabel }: { game: Row; anchorId: string; jumpHref: string; jumpLabel: string }) {
  return (
    <div id={anchorId}>
      <div
        className="text-black text-center py-4 sm:py-6 px-4"
        style={{ background: "#ffff00", border: "4px double #b22222" }}
      >
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
          style={{ background: "#fff", color: "#ff0000", borderRadius: 4 }}
        >
          {jumpLabel}
        </a>
      </div>
    </div>
  );
}

export function JodiChart({ game, entries }: { game: Row; entries: JodiEntry[] }) {
  return (
    <main className="min-h-screen bg-black text-white p-2">
      <div className="mx-auto" style={{ width: "605.84px", maxWidth: "100%" }}>
        <div id="top" className="text-center py-3 sm:py-4 px-2" style={{ background: "#0c0361", border: "3px solid #ff0000" }}>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold px-2" style={{ color: "#ff0000" }}>
            {game.title.toUpperCase()} CHART
          </h1>
        </div>
        <div className="text-center py-2 sm:py-3 px-4" style={{ background: "#0c0361", border: "3px solid #ff0000", borderTop: "none" }}>
          <p className="text-base sm:text-xl font-bold text-white">{game.title} Jodi Matka Chart</p>
          <p className="text-[10px] sm:text-xs text-white mt-1">
            jodi chart, jodi matka chart, jodi record chart, jodi patti chart
          </p>
        </div>

        <GameHeader game={game} anchorId="header-top" jumpHref="#bottom" jumpLabel="Go to Bottom" />

        {entries.length === 0 ? (
          <div className="text-black text-center py-8 text-base font-bold" style={{ background: "#ffff00", border: "4px double #b22222" }}>
            No jodi data yet. Admin can add weekly entries from the admin panel.
          </div>
        ) : (
          <div className="bg-black p-1 sm:p-2">
            <table className="w-full table-fixed border-collapse bg-white" style={{ border: "4px groove #893bff" }}>
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

        <GameHeader game={game} anchorId="bottom" jumpHref="#top" jumpLabel="Go to Top" />

        <div className="text-center py-3" style={{ background: "#0c0361", border: "3px solid #ff0000", borderTop: "none" }}>
          <a href="/" className="text-yellow-300 underline font-bold text-sm">← Back to dashboard</a>
        </div>
      </div>
    </main>
  );
}
