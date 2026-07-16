// Static "Matka Rates Chart" section: what each game variation pays per 1/-.
const RATES = [
  { game: "Singles (Ank)", rate: "1:9", note: "You get 9/- for every 1/- played" },
  { game: "Jodi (Pair/Bracket)", rate: "1:90", note: "You get 90/- for every 1/- played" },
  { game: "Single Pana (SP)", rate: "1:140", note: "You get 140/- for every 1/- played" },
  { game: "Double Pana (DP)", rate: "1:280", note: "You get 280/- for every 1/- played" },
  { game: "Triple Pana (TP)", rate: "1:600", note: "You get 600/- for every 1/- played" },
  { game: "Half Sangam", rate: "1:1400", note: "You get 1400/- for every 1/- played (A and B pay the same)" },
  { game: "Sangam", rate: "1:15000", note: "You get 15000/- for every 1/- played" },
];

export function MatkaRatesChart() {
  return (
    <section className="header-box my-4">
      <div className="py-4 px-2 sm:px-6 text-center">
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "#0000ff" }}>
          MATKA RATES CHART
        </h2>
        <p className="text-xs sm:text-sm mt-2 mb-4">
          <b>Matka Rate</b> is the rate paid to the player if the number played exactly matches the
          result (win). There are 5 variations of the game — Singles, Jodi, Pana, Half Sangam and
          Sangam — and each variation has its own rate.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full max-w-2xl mx-auto border-collapse bg-white text-sm sm:text-base">
            <thead>
              <tr>
                <th className="border-2 border-black bg-black text-white px-2 py-2">Game Type</th>
                <th className="border-2 border-black bg-black text-white px-2 py-2">Rate</th>
                <th className="border-2 border-black bg-black text-white px-2 py-2">Payout</th>
              </tr>
            </thead>
            <tbody>
              {RATES.map((r, i) => (
                <tr key={r.game} style={{ background: i % 2 ? "#f5fffa" : "#ffffff" }}>
                  <td className="border border-gray-400 px-2 py-2 font-bold text-left sm:text-center" style={{ color: "#0000ff" }}>{r.game}</td>
                  <td className="border border-gray-400 px-2 py-2 font-bold whitespace-nowrap" style={{ color: "#ff0000" }}>{r.rate}</td>
                  <td className="border border-gray-400 px-2 py-2 text-xs sm:text-sm">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] sm:text-xs mt-3 text-gray-700">
          Pana note: the result pana is always exactly one of SP, DP or TP — never two or all three.
          You are paid as per the rate of that pana type.
        </p>
      </div>
    </section>
  );
}
