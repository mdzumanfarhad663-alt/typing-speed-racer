import type { CSSProperties } from "react";
import type { SectionResolver } from "@/lib/resolveStyle";
import { toCss, parseList } from "@/lib/resolveStyle";

type ChartLink = { label: string; href: string };

// Link colors alternate to match source site style
const LINK_COLORS = ["#00f", "#8b0000", "#0000aa", "#cc6600", "#00008b", "#b8860b"];

function ChartSection({ heading, links, headerStyle }: { heading: string; links: ChartLink[]; headerStyle: CSSProperties }) {
  return (
    <div className="my-[18px]">
      <div className="px-3 py-1" style={headerStyle}>
        <span className="font-bold text-sm sm:text-base">{heading}</span>
      </div>
      {links.map((item, i) => (
        <div key={i} className="text-center py-1 px-4" style={{ background: "#fff", border: "2px groove #ff0000", margin: "2px 0" }}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:underline"
            style={{ color: LINK_COLORS[i % LINK_COLORS.length], fontSize: "20px" }}
          >
            {item.label}
          </a>
        </div>
      ))}
    </div>
  );
}

export function ChartRecords({ resolve }: { resolve: SectionResolver }) {
  const { styles, content } = resolve("chart_records");
  const headerStyle = toCss(styles.header);
  return (
    <>
      <ChartSection heading={content.jodiHeading} links={parseList<ChartLink>(content.jodiLinks)} headerStyle={headerStyle} />
      <ChartSection heading={content.panelHeading} links={parseList<ChartLink>(content.panelLinks)} headerStyle={headerStyle} />
      <ChartSection heading={content.otherJodiHeading} links={parseList<ChartLink>(content.otherJodiLinks)} headerStyle={headerStyle} />
      <ChartSection heading={content.otherPanelHeading} links={parseList<ChartLink>(content.otherPanelLinks)} headerStyle={headerStyle} />
    </>
  );
}
