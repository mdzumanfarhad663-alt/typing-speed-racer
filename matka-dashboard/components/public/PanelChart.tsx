import type { PanelDay, PanelEntry, Row } from "@/lib/schema";
import { RefreshButton } from "./RefreshButton";

const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

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

export function PanelChart({ game, entries }: { game: Row; entries: PanelEntry[] }) {
  return (
    <main className="min-h-screen bg-black text-white p-2">
      <div className="w-full">
        <div id="top" className="text-center py-3 sm:py-4 px-2" style={{ background: "#0c0361", border: "3px solid #ff0000" }}>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold px-2" style={{ color: "#ff0000" }}>
            {game.title.toUpperCase()} PANEL CHART
          </h1>
        </div>
        <div className="text-center py-2 sm:py-3 px-4" style={{ background: "#0c0361", border: "3px solid #ff0000", borderTop: "none" }}>
          <p className="text-base sm:text-xl font-bold text-white">{game.title} Jodi Patti chart</p>
          <p className="text-[10px] sm:text-xs text-white mt-1">
            panel chart, jodi patti record chart, satta panel chart, panel chart for matka
          </p>
        </div>

        <GameHeader game={game} anchorId="header-top" jumpHref="#bottom" jumpLabel="Go to Bottom" />

        {entries.length === 0 ? (
          <div className="text-black text-center py-8 text-base font-bold" style={{ background: "#ffff00", border: "4px double #b22222" }}>
            No panel data yet. Admin can add weekly entries from the admin panel.
          </div>
        ) : (
          <div className="bg-black p-1 sm:p-2 mx-auto" style={{ maxWidth: "605px" }}>
            <table className="w-full table-fixed border-collapse bg-white" style={{ border: "4px groove #893bff" }}>
              <thead>
                <tr>
                  <th
                    className="p-0.5 sm:p-1.5 text-[9px] sm:text-base font-bold italic"
                    style={{ border: "1px solid #ddd", fontFamily: "Georgia, serif" }}
                  >
                    Date
                  </th>
                  {DAY_LABELS.map((label) => (
                    <th
                      key={label}
                      className="p-0.5 sm:p-1.5 text-[9px] sm:text-base font-bold italic"
                      style={{ border: "1px solid #ddd", fontFamily: "Georgia, serif" }}
                    >
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

        <GameHeader game={game} anchorId="bottom" jumpHref="#top" jumpLabel="Go to Top" />

        <div className="text-center py-3" style={{ background: "#0c0361", border: "3px solid #ff0000", borderTop: "none" }}>
          <a href="/" className="text-yellow-300 underline font-bold text-sm">← Back to dashboard</a>
        </div>
      </div>
    </main>
  );
}
