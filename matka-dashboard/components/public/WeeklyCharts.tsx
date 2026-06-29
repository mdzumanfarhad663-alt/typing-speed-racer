const PANEL_ROWS = [
  "0 => 145 235 334 488 668",
  "1 => 128 245 399 588 669",
  "2 => 237 390 110 499 688",
  "3 => 148 490 166 445 788",
  "4 => 130 347 266 455 699",
  "5 => 230 348 177 447 799",
  "6 => 259 367 114 880 899",
  "7 => 160 278 223 449 566",
  "8 => 279 378 116 440 800",
  "9 => 135 469 225 577 667",
];

const JODI_ROWS = [
  "61 62 15 16",
  "95 96 42 48",
  "24 25 75 73",
  "53 56 08 06",
  "85 86 37 39",
  "15 38 54 76",
];

const OTC_ROWS = [
  "Mon. => 2-5-6-7",
  "Tues. => 1-4-5-8",
  "Wed. => 3-5-6-7",
  "Thur. => 0-2-4-6",
  "Fri. => 2-4-5-8",
  "Sat. => 0-1-5-8",
  "Sun. => 0-2-5-7",
];

const BORDER_STYLE = "3px solid #8b0000";
const HEADER_BG = "linear-gradient(180deg, #ffd966 0%, #f4c430 100%)";

function ChartBlock({
  heading,
  rows,
}: {
  heading: string;
  rows: string[];
}) {
  return (
    <div className="my-4" style={{ border: BORDER_STYLE, borderRadius: 3, overflow: "hidden" }}>
      {/* Gold header */}
      <div
        className="text-center px-4 py-3"
        style={{ background: HEADER_BG, borderBottom: BORDER_STYLE }}
      >
        <span
          className="font-bold italic text-sm sm:text-base"
          style={{ color: "#000", textShadow: "1px 1px 0 rgba(255,255,255,0.4)" }}
        >
          {heading}
        </span>
      </div>
      {/* White body */}
      <div
        className="text-center py-4 px-4"
        style={{ background: "#fffff5" }}
      >
        {rows.map((line, i) => (
          <div
            key={i}
            className="font-bold italic text-base sm:text-lg leading-relaxed"
            style={{ color: "#000" }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

export function WeeklyCharts() {
  return (
    <>
      <ChartBlock
        heading="Weekly Panel Or Patti Chart From 29-06-2026 To 05-07-2026 For Kalyan, Milan, Kalyan Night, Rajdhani Night, Time Bazar, Main Bazar Market"
        rows={PANEL_ROWS}
      />
      <ChartBlock
        heading="Weekly Jodi Chart From 29-06-2026 To 05-07-2026 For Kalyan, Milan, Kalyan Night, Rajdhani Night, Time Bazar, Main Bazar Market"
        rows={JODI_ROWS}
      />
      <ChartBlock
        heading="Weekly Number Open To Close From 29-06-2026 To 05-07-2026 For Kalyan, Milan, Kalyan Night, Rajdhani Night, Time Bazar, Main Bazar Market"
        rows={OTC_ROWS}
      />
    </>
  );
}
