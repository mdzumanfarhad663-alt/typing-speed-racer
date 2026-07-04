import type { CSSProperties } from "react";
import type { SectionResolver } from "@/lib/resolveStyle";
import { toCss } from "@/lib/resolveStyle";

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

const BORDER_STYLE = "1px solid #ddd";

function ChartBlock({
  heading,
  rows,
  headerStyle,
}: {
  heading: string;
  rows: string[];
  headerStyle: CSSProperties;
}) {
  return (
    <div className="my-4" style={{ border: BORDER_STYLE, borderRadius: 3, overflow: "hidden" }}>
      {/* Header */}
      <div className="text-center px-4 py-3" style={{ borderBottom: BORDER_STYLE, ...headerStyle }}>
        <span className="font-bold text-sm sm:text-base">{heading}</span>
      </div>
      {/* White body */}
      <div className="text-center py-2.5 px-4" style={{ background: "#fff" }}>
        {rows.map((line, i) => (
          <div key={i} className="font-bold text-base sm:text-lg leading-relaxed" style={{ color: "#000" }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

export function WeeklyCharts({ resolve }: { resolve: SectionResolver }) {
  const { styles, content } = resolve("weekly_charts");
  const headerStyle = toCss(styles.header);
  return (
    <>
      <ChartBlock heading={content.panelHeading} rows={PANEL_ROWS} headerStyle={headerStyle} />
      <ChartBlock heading={content.jodiHeading} rows={JODI_ROWS} headerStyle={headerStyle} />
      <ChartBlock heading={content.otcHeading} rows={OTC_ROWS} headerStyle={headerStyle} />
    </>
  );
}
