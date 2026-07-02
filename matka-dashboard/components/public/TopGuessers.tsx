const GUESSERS = [
  "1-SURYA BHAI",
  "2- RUDRA PENAL KING",
  "3-SRS BHAI",
  "4-DANISH BHAI",
  "5-Jay~sir",
];

const FAST_RESULT = [
  "1.ADMIN SIR",
  "2.CO-ADMIN SIR",
  "3.S.KUMAR SIR",
  "4.VIP BHAI",
  "5.SURYA BHAI",
];

export function TopGuessers() {
  return (
    <div className="my-4" style={{ border: "2px solid #ff0000", overflow: "hidden" }}>
      {/* Red top bar */}
      <div
        className="px-3 py-1"
        style={{ background: "#ff0000" }}
      >
        <span className="font-bold text-white text-xs sm:text-sm">
          ⇒ Top Guessers And Result King
        </span>
      </div>

      {/* Two column grid */}
      <div className="grid grid-cols-2">
        {/* LEFT — TOP GUSSER */}
        <div>
          {/* Column header */}
          <div
            className="px-3 py-2"
            style={{ background: "#00004d" }}
          >
            <span className="font-bold text-white text-base sm:text-lg">
              TOP GUSSER
            </span>
          </div>
          {/* Rows */}
          {GUESSERS.map((name, i) => (
            <div
              key={i}
              className="px-3 py-2"
              style={{ background: "#008000", borderTop: "1px solid #005000" }}
            >
              <span className="font-bold text-white text-sm sm:text-base">
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* RIGHT — FAST RESULT */}
        <div style={{ borderLeft: "2px solid #ff0000" }}>
          {/* Column header */}
          <div
            className="px-3 py-2"
            style={{ background: "#00004d" }}
          >
            <span className="font-bold text-white text-base sm:text-lg">
              FAST RESULT
            </span>
          </div>
          {/* Rows */}
          {FAST_RESULT.map((name, i) => (
            <div
              key={i}
              className="px-3 py-2"
              style={{ background: "#0000ff", borderTop: "1px solid #0000aa" }}
            >
              <span className="font-bold text-white text-sm sm:text-base">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
