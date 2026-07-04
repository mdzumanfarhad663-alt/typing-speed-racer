import type { CSSProperties } from "react";
import type { SectionResolver } from "@/lib/resolveStyle";
import { toCss } from "@/lib/resolveStyle";

type ChartLink = { label: string; href: string };

const SATTA_JODI: ChartLink[] = [
  { label: "Kalyan Chart", href: "https://sattamatkadpboss.mobi/record/kalyan-chart.php" },
  { label: "Main Bazar Chart", href: "https://sattamatkadpboss.mobi/main-bazar-chart.php" },
  { label: "Main Ratan Chart", href: "https://sattamatkadpboss.mobi/record/main-ratan-chart.php" },
  { label: "Main Mumbai Chart", href: "https://sattamatkadpboss.mobi/record/main-mumbai-chart.php" },
  { label: "Time Bazar Chart", href: "https://sattamatkadpboss.mobi/record/time-bazar-chart.php" },
  { label: "Sridevi Satta Chart", href: "https://sattamatkadpboss.mobi/record/sridevi-satta-jodi-chart.php" },
  { label: "Sridevi Night Chart", href: "https://sattamatkadpboss.mobi/record/sridevi-night-chart.php" },
  { label: "Kalyan Night Chart", href: "https://sattamatkadpboss.mobi/record/kalyan-night-chart.php" },
  { label: "Kalyan Morning Chart", href: "https://sattamatkadpboss.mobi/record/kalyan-morning-chart.php" },
  { label: "Madhur Morning Chart", href: "https://sattamatkadpboss.mobi/madhur-morning-chart.php" },
  { label: "Milan Day Chart", href: "https://sattamatkadpboss.mobi/record/milan-day-chart.php" },
  { label: "Milan Night Chart", href: "https://sattamatkadpboss.mobi/record/milan-night-chart.php" },
  { label: "Madhur Day Chart", href: "https://sattamatkadpboss.mobi/madhur-day-chart.php" },
  { label: "Madhur Night Chart", href: "https://sattamatkadpboss.mobi/madhur-night-chart.php" },
  { label: "Supreme Day Chart", href: "https://sattamatkadpboss.mobi/supreme-day-chart.php" },
  { label: "Supreme Night Chart", href: "https://sattamatkadpboss.mobi/supreme-night-chart.php" },
  { label: "Rajdhani Day Chart", href: "https://sattamatkadpboss.mobi/record/rajdhani-day-chart.php" },
  { label: "Rajdhani Night Chart", href: "https://sattamatkadpboss.mobi/record/rajdhani-night-chart.php" },
  { label: "Syndicate Night Chart", href: "https://sattamatkadpboss.mobi/record/syndicate-night-chart.php" },
  { label: "Morning Syndicate Chart", href: "https://sattamatkadpboss.mobi/record/morning-syndicate-chart.php" },
];

const SATTA_PANEL: ChartLink[] = [
  { label: "Kalyan Panel Chart", href: "https://sattamatkadpboss.mobi/record/kalyan-penal-chart.php" },
  { label: "Main Bazar Panel Chart", href: "https://sattamatkadpboss.mobi/main-bazar-panel-chart.php" },
  { label: "Main Ratan Penal Chart", href: "https://sattamatkadpboss.mobi/record/main-ratan-penal-chart.php" },
  { label: "Main Bombay Panel Chart", href: "https://sattamatkadpboss.mobi/main-bombay-panel-chart.php" },
  { label: "Time Bazar Panel Chart", href: "https://sattamatkadpboss.mobi/time-bazar-panel-chart.php" },
  { label: "Sridevi Satta Penal Chart", href: "https://sattamatkadpboss.mobi/record/sridevi-satta-penal-chart.php" },
  { label: "Sridevi Night Penal Chart", href: "https://sattamatkadpboss.mobi/record/sridevi-night-satta-penal-chart.php" },
  { label: "Kalyan Night Penal Chart", href: "https://sattamatkadpboss.mobi/record/kalyan-night-penal-chart.php" },
  { label: "Kalyan Morning Penal Chart", href: "https://sattamatkadpboss.mobi/record/kalyan-morning-penal-chart.php" },
  { label: "Madhur Morning Panel Chart", href: "https://sattamatkadpboss.mobi/madhur-morning-penal-chart.php" },
  { label: "Milan Day Panel Chart", href: "https://sattamatkadpboss.mobi/record/milan-day-penal-chart.php" },
  { label: "Milan Night Panel Chart", href: "https://sattamatkadpboss.mobi/record/milan-night-penal-chart.php" },
  { label: "Madhur Day Panel Chart", href: "https://sattamatkadpboss.mobi/madhur-day-panel-chart.php" },
  { label: "Madhur Night Panel Chart", href: "https://sattamatkadpboss.mobi/madhur-night-panel-chart.php" },
  { label: "Supreme Day Panel Chart", href: "https://sattamatkadpboss.mobi/supreme-day-panel-chart.php" },
  { label: "Supreme Night Panel Chart", href: "https://sattamatkadpboss.mobi/supreme-night-panel-chart.php" },
  { label: "Rajdhani Day Panel Chart", href: "https://sattamatkadpboss.mobi/record/rajdhani-day-penal-chart.php" },
  { label: "Rajdhani Night Panel Chart", href: "https://sattamatkadpboss.mobi/record/rajdhani-night-penal-chart.php" },
  { label: "Syndicate Night Panel Chart", href: "https://sattamatkadpboss.mobi/record/syndicate-night-penal-chart.php" },
  { label: "Morning Syndicate Panel Chart", href: "https://sattamatkadpboss.mobi/record/morning-syndicate-penal-chart.php" },
];

const OTHER_JODI: ChartLink[] = [
  { label: "Dabra Chart", href: "https://sattamatkadpboss.mobi/record/dabra-chart.php" },
  { label: "Deluxe Chart", href: "https://sattamatkadpboss.mobi/deluxe-chart.php" },
  { label: "Khajana Chart", href: "https://sattamatkadpboss.mobi/record/khajana-chart.php" },
  { label: "Prabhat Chart", href: "https://sattamatkadpboss.mobi/record/prabhat-chart.php" },
  { label: "Balaji Day Chart", href: "https://sattamatkadpboss.mobi/record/balaji-day-chart.php" },
  { label: "Maharani Chart", href: "https://sattamatkadpboss.mobi/maharani-chart.php" },
  { label: "Star Morning Chart", href: "https://sattamatkadpboss.mobi/record/star-morning-chart.php" },
  { label: "Prabhat Night Chart", href: "https://sattamatkadpboss.mobi/record/prabhat-night-chart.php" },
  { label: "Karodpati Chart", href: "https://sattamatkadpboss.mobi/record/karodpati-chart.php" },
  { label: "Kbc Bombay Chart", href: "https://sattamatkadpboss.mobi/record/kbc-bombay-chart.php" },
  { label: "Maharani Day Chart", href: "https://sattamatkadpboss.mobi/maharani-day-chart.php" },
  { label: "Maharani Night Chart", href: "https://sattamatkadpboss.mobi/maharani-night-chart.php" },
  { label: "Karnataka Day Chart", href: "https://sattamatkadpboss.mobi/karnataka-day-chart.php" },
  { label: "Karnataka Night Chart", href: "https://sattamatkadpboss.mobi/karnataka-night-chart.php" },
  { label: "Raja Rani Morning Chart", href: "https://sattamatkadpboss.mobi/record/raja-rani-morning-chart.php" },
];

const OTHER_PANEL: ChartLink[] = [
  { label: "Dabra Penal Chart", href: "https://sattamatkadpboss.mobi/record/dabra-penal-chart.php" },
  { label: "Deluxe Panel Chart", href: "https://sattamatkadpboss.mobi/deluxe-panel-chart.php" },
  { label: "Khajana Panel Chart", href: "https://sattamatkadpboss.mobi/record/khajana-penal-chart.php" },
  { label: "Prabhat Panel Chart", href: "https://sattamatkadpboss.mobi/record/prabhat-panel-chart.php" },
  { label: "Maharani Panel Chart", href: "https://sattamatkadpboss.mobi/maharani-panel-chart.php" },
  { label: "Karodpati Penal Chart", href: "https://sattamatkadpboss.mobi/record/amar-jyoti-penal-chart.php" },
  { label: "Star Morning Panel Chart", href: "https://sattamatkadpboss.mobi/record/star-morning-panel-chart.php" },
  { label: "Prabhat Night Panel Chart", href: "https://sattamatkadpboss.mobi/record/prabhat-night-panel-chart.php" },
  { label: "Kbc Bombay Penal Chart", href: "https://sattamatkadpboss.mobi/record/kbc-bombay-penal-chart.php" },
  { label: "Karnataka Day Panel Chart", href: "https://sattamatkadpboss.mobi/karnataka-day-panel-chart.php" },
  { label: "Karnataka Night Panel Chart", href: "https://sattamatkadpboss.mobi/karnataka-night-panel-chart.php" },
  { label: "Maharani Day Panel Chart", href: "https://sattamatkadpboss.mobi/maharani-day-panel-chart.php" },
  { label: "Maharani Night Panel Chart", href: "https://sattamatkadpboss.mobi/maharani-night-panel-chart.php" },
  { label: "Raja Rani Morning Panel Chart", href: "https://sattamatkadpboss.mobi/record/raja-rani-morning-panel-chart.php" },
];

// Link colors alternate to match source site style
const LINK_COLORS = ["#00f", "#8b0000", "#0000aa", "#cc6600", "#00008b", "#b8860b"];

function ChartSection({ heading, links, headerStyle }: { heading: string; links: ChartLink[]; headerStyle: CSSProperties }) {
  return (
    <div className="my-4">
      <div className="px-3 py-1" style={headerStyle}>
        <span className="font-bold text-sm sm:text-base">{heading}</span>
      </div>
      {links.map((item, i) => (
        <div key={i} className="text-center py-2 px-4" style={{ background: i % 2 === 0 ? "#f7f7f7" : "#fff", borderBottom: "1px solid #eee" }}>
          <span className="arrow-icon" />
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-sm sm:text-base hover:underline"
            style={{ color: LINK_COLORS[i % LINK_COLORS.length] }}
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
      <ChartSection heading={content.jodiHeading} links={SATTA_JODI} headerStyle={headerStyle} />
      <ChartSection heading={content.panelHeading} links={SATTA_PANEL} headerStyle={headerStyle} />
      <ChartSection heading={content.otherJodiHeading} links={OTHER_JODI} headerStyle={headerStyle} />
      <ChartSection heading={content.otherPanelHeading} links={OTHER_PANEL} headerStyle={headerStyle} />
    </>
  );
}
