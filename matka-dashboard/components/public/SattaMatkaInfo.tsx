import type { SectionResolver } from "@/lib/resolveStyle";
import { toCss } from "@/lib/resolveStyle";
import type { MarketTiming } from "@/lib/schema";

const DEFAULT_MARKET_TIMINGS: Array<[string, string, string, string]> = [
  ["Time Bazar", "01:00 PM", "02:00 PM", "Mon–Sat"],
  ["Milan Day", "3:00 PM", "5:00 PM", "Mon–Sat"],
  ["Rajdhani Day", "3:15 PM", "5:15 PM", "Mon–Sat"],
  ["Kalyan", "3:45 PM", "5:45 PM", "Mon–Sat"],
  ["Madhur Day", "1:30 PM", "2:30 PM", "Daily"],
  ["Supreme Day", "3:30 PM", "5:30 PM", "Daily"],
  ["Sridevi", "11:30 AM", "12:30 PM", "Daily"],
  ["Day Bombay", "12:00 PM", "2:00 PM", "Daily"],
  ["Main Mumbai", "9:30 PM", "11:45 PM", "Mon–Fri"],
  ["Milan Night", "9:00 PM", "11:00 PM", "Mon–Sat"],
  ["Rajdhani Night", "9:30 PM", "11:45 PM", "Mon–Fri"],
  ["Madhur Night", "8:30 PM", "10:30 PM", "Mon–Sat"],
  ["Supreme Night", "8:30 PM", "10:30 PM", "Daily"],
  ["Sridevi Night", "7:15 PM", "8:15 PM", "Daily"],
  ["Night Bombay", "8:00 PM", "10:00 PM", "Daily"],
  ["KBC Bombay", "1:30 PM", "2:30 PM", "Daily"],
  ["Malamal Bombay", "11:40 AM", "12:40 PM", "Daily"],
  ["CMM Matka", "5:00 PM", "7:00 PM", "Daily"],
  ["Main Bazar", "9:35 PM", "12:05 AM", "Mon–Fri"],
];

export function SattaMatkaInfo({ resolve, marketTimings }: { resolve: SectionResolver; marketTimings?: MarketTiming[] }) {
  const { styles } = resolve("satta_matka_info");
  const rows = marketTimings && marketTimings.length > 0
    ? marketTimings.map((m) => [m.marketName, m.openTime, m.closeTime, m.status] as const)
    : DEFAULT_MARKET_TIMINGS;
  return (
    <div
      className="my-[7px] p-3 sm:p-4"
      style={{
        fontFamily: "Arial, sans-serif",
        fontStyle: "normal",
        fontSize: "13px",
        lineHeight: 1.6,
        ...toCss(styles.container),
      }}
    >
      <style>{`
        .ansh-h2 { text-align:center; font-style:normal; margin-top:15px; margin-bottom:10px; color:#00f; font-size:1.1rem; font-weight:700; }
        .ansh-p { text-align:justify; font-style:normal; line-height:1.6; margin-bottom:12px; }
        .ansh-ul { text-align:left; padding-left:20px; margin-bottom:12px; }
        .ansh-li { font-style:normal; margin-bottom:5px; }
        .ansh-hr { border:none; border-top:1px solid #ccc; margin:12px 0; }
        .ansh-table { margin:15px auto; text-align:center; width:100%; max-width:600px; border-collapse:collapse; font-size:small; }
        .ansh-table th, .ansh-table td { border:1px solid #999; padding:4px 8px; }
        .ansh-table thead { background:#eee; }
      `}</style>

      {/* What is Satta Matka */}
      <h2 className="ansh-h2">What is Satta Matka?</h2>
      <p className="ansh-p"><strong>Satta matka</strong> is India&apos;s most-played number-based game, born in Mumbai in the 1960s. It started as betting on cotton prices between Bombay and New York. When the New York Cotton Exchange cut the feed in 1961, organizers like <strong>Ratan Khatri</strong> and <strong>Kalyanji Bhagat</strong> replaced cotton rates with random number draws from an earthen pot - the <em>matka</em>.</p>
      <p className="ansh-p">Today, <strong>matka</strong> runs on a simple open/close format. Players pick a number between 0–9 for the open draw and another for the close draw. The two digits combine into a <strong>jodi</strong> (pair). A three-digit <strong>panel</strong> adds another layer. Results are declared twice daily across dozens of markets.</p>
      <p className="ansh-p"><strong>Sattamatka</strong> has evolved far beyond its Bombay roots. Millions play <strong>aaj ka satta matka</strong> across Kalyan, Milan, Rajdhani, Main Bazar, and 45+ other markets every single day. The game is also known as <strong>satta batta</strong> or <strong>satta matta matka</strong> in different regions - same rules, same excitement.</p>
      <p className="ansh-p"><strong>Satta 143</strong> is a shorthand the community uses for a &ldquo;sure&rdquo; or expert-level prediction. You&apos;ll see it everywhere on guessing forums and result pages.</p>
      <hr className="ansh-hr" />

      {/* DPBoss */}
      <h2 className="ansh-h2">DPBoss – India&apos;s Fastest Matka Result Platform</h2>
      <p className="ansh-p"><strong>DPBoss</strong> has been the go-to name for <strong>dpboss matka</strong> players for years. When numbers drop, <strong>dp boss live</strong> updates within seconds - no delay, no login, no fee.</p>
      <p className="ansh-p"><strong>Aaj ka dpboss</strong> is what millions search the moment a market closes. The platform covers every major and minor bazar, making it the single stop for <strong>dp boss satta matka</strong> across all regions.</p>
      <p className="ansh-p">What makes <strong>dp matka boss</strong> stand out:</p>
      <ul className="ansh-ul">
        <li className="ansh-li"><strong>50+ markets</strong> covered daily - from Kalyan to CMM Matka</li>
        <li className="ansh-li"><strong>68+ chart records</strong> going back years - free historical data</li>
        <li className="ansh-li"><strong>No login required</strong> - open the site, see the result</li>
        <li className="ansh-li"><strong>100% free</strong> - charts, panels, guessing tips, all at zero cost</li>
        <li className="ansh-li"><strong>dp boss net matka</strong> updates faster than any WhatsApp group</li>
      </ul>
      <table className="ansh-table">
        <thead><tr><th>Feature</th><th>Detail</th></tr></thead>
        <tbody>
          <tr><td>Markets covered</td><td><strong>50+</strong></td></tr>
          <tr><td>Chart records</td><td><strong>68+ years</strong> of data</td></tr>
          <tr><td>Login required</td><td>No</td></tr>
          <tr><td>Cost</td><td><strong>Free</strong></td></tr>
          <tr><td>Result speed</td><td><strong>Fastest in India</strong></td></tr>
          <tr><td>Platforms</td><td>Mobile &amp; desktop</td></tr>
        </tbody>
      </table>
      <p className="ansh-p"><strong>Boss dpboss</strong>, <strong>dpboss dp</strong>, <strong>dp dpboss</strong> - whatever you call it, the result is the same: accurate, instant, trusted.</p>
      <hr className="ansh-hr" />

      {/* Kalyan */}
      <h2 className="ansh-h2">Kalyan Matka Result Today</h2>
      <p className="ansh-p"><strong>Kalyan matka</strong> is the king of all markets. Launched by Kalyanji Bhagat in the 1960s, <strong>Kalyan bazar</strong> runs six days a week and draws the largest player base in India.</p>
      <p className="ansh-p"><strong>Kalyan open</strong> is declared at <strong>3:45 PM</strong>. <strong>Kalyan result</strong> (close) follows at <strong>5:45 PM</strong>. These are the two most-watched moments of the matka day.</p>
      <p className="ansh-p"><strong>Day Kalyan open</strong> is where serious players focus first. <strong>Boss Kalyan</strong> tips and <strong>dp kalyan</strong> guessing numbers flood forums from noon onward. <strong>7 matka kalyan</strong> refers to the weekly cycle - seven days of opportunity, with Kalyan anchoring the schedule.</p>
      <p className="ansh-p"><strong>DPBoss Kalyan</strong> posts the result the instant it&apos;s declared. <strong>Dpboss 143 kalyan</strong> is the expert-prediction tag for Kalyan&apos;s most reliable guessing numbers.</p>
      <p className="ansh-p">For historical analysis, the <strong>dp kalyan chart</strong> and <strong>dp boss kalyan panel chart</strong> go back decades. The <strong>boss matka kalyan chart</strong> lets you spot patterns, track jodi frequency, and study open/close trends - all free, all on one page.</p>
      <hr className="ansh-hr" />

      {/* Bombay */}
      <h2 className="ansh-h2">Bombay Matka Result Today</h2>
      <p className="ansh-p"><strong>Bombay matka</strong> is the second pillar of the matka world. Multiple Bombay markets run through the day and night, each with its own timing and player base.</p>
      <p className="ansh-p"><strong>Bombay matka open</strong> numbers are watched closely by players who prefer faster-paced markets. Key Bombay markets on DPBoss:</p>
      <ul className="ansh-ul">
        <li className="ansh-li"><strong>Day Bombay</strong> - afternoon session</li>
        <li className="ansh-li"><strong>Night Bombay</strong> - evening/night session</li>
        <li className="ansh-li"><strong>KBC Bombay</strong> - high-stakes variant</li>
        <li className="ansh-li"><strong>Malamal Bombay</strong> - popular mid-tier market</li>
        <li className="ansh-li"><strong>CMM Matka</strong> - consistent daily market</li>
      </ul>
      <p className="ansh-p"><strong>BK matka</strong> and <strong>BP matka</strong> are Bombay-region variants with dedicated followings. Results for all of these post on <strong>dp boss satta matka com</strong> the moment they&apos;re declared - no waiting, no guesswork.</p>
      <hr className="ansh-hr" />

      {/* All Matka */}
      <h2 className="ansh-h2">All Matka Result – 50+ Markets Live</h2>
      <p className="ansh-p"><strong>All satta matka</strong> markets in one place - that&apos;s the DPBoss promise. Whether you follow <strong>all world matka</strong> or stick to one bazar, every <strong>matka result</strong> is here.</p>
      <p className="ansh-p"><strong>Satta result</strong> - <strong>अभी देखें</strong> - posts live as each market closes. <strong>Satka matka result</strong> and <strong>satta dp</strong> numbers update in real time. <strong>Boss matka result today</strong> covers every market without exception.</p>
      <p className="ansh-p"><strong>Satta satta</strong> players who track multiple markets will find the full schedule below:</p>
      <table className="ansh-table">
        <thead><tr><th>Market Name</th><th>Open Time</th><th>Close Time</th><th>Status</th></tr></thead>
        <tbody>
          {rows.map(([name, open, close, status], i) => (
            <tr key={i}><td><strong>{name}</strong></td><td>{open}</td><td>{close}</td><td>{status}</td></tr>
          ))}
        </tbody>
      </table>
      <p className="ansh-p" style={{ textAlign: "center" }}><small>Times are approximate. Always verify on the live result panel above.</small></p>
      <hr className="ansh-hr" />

      {/* Boss Matka 143 */}
      <h2 className="ansh-h2">Boss Matka 143 – DPBoss 143 Guessing</h2>
      <p className="ansh-p"><strong>143</strong> is the most iconic number in matka culture. In the <strong>boss matka 143</strong> community, it signals a <strong>high-confidence prediction</strong> - a number the experts back hard.</p>
      <p className="ansh-p"><strong>Bossmatkà 143</strong> and <strong>boosmatkacom 143</strong> are search terms players use to find the day&apos;s top guessing tips. <strong>Satta matta matka 143</strong> combines the regional name with the expert-prediction tag. <strong>Satta 143</strong> is shorthand for &ldquo;this one&apos;s solid.&rdquo;</p>
      <p className="ansh-p"><strong>DPBoss 143 kalyan</strong> is the most-searched guessing tag for Kalyan market. <strong>143 dpboss matka</strong> tips include:</p>
      <ul className="ansh-ul">
        <li className="ansh-li"><strong>Fix jodi</strong> - a two-digit pair backed by pattern analysis</li>
        <li className="ansh-li"><strong>Panel chart reading</strong> - spotting repeating open/close combinations</li>
        <li className="ansh-li"><strong>Daily guessing numbers</strong> - updated every morning before markets open</li>
      </ul>
      <p className="ansh-p">These aren&apos;t guarantees. They&apos;re community-sourced insights based on historical data. Use them as a starting point, not a certainty.</p>
      <hr className="ansh-hr" />

      {/* Matka Charts */}
      <h2 className="ansh-h2">Matka Charts – Free Historical Records</h2>
      <p className="ansh-p">A <strong>satta matka chart</strong> is the most powerful tool a serious player has. DPBoss hosts <strong>68+ chart records</strong> - free, no login, no paywall.</p>
      <p className="ansh-p">The <strong>dp kalyan chart</strong> is the most-viewed. It shows every Kalyan open/close result going back years. The <strong>boss matka kalyan chart</strong> and <strong>dp boss kalyan panel chart</strong> let you track jodi patterns, panel frequency, and seasonal trends.</p>
      <p className="ansh-p">Other key charts available:</p>
      <ul className="ansh-ul">
        <li className="ansh-li"><strong>Milan Chart</strong> - Day and Night</li>
        <li className="ansh-li"><strong>Rajdhani Chart</strong> - Day and Night</li>
        <li className="ansh-li"><strong>Main Bazar Chart</strong> - full history</li>
        <li className="ansh-li"><strong>Bombay Chart</strong> - all Bombay variants</li>
        <li className="ansh-li"><strong>Kalyan Panel Chart</strong> - three-digit panel records</li>
      </ul>
      <p className="ansh-p"><strong>Kalyan panel chart</strong> analysis is where experienced players spend most of their time. Patterns repeat. History matters. The data is all here - free.</p>
      <hr className="ansh-hr" />

      {/* Guessing Forum */}
      <h2 className="ansh-h2">Satta Matka Guessing Forum</h2>
      <p className="ansh-p">The DPBoss <strong>matka guessing</strong> forum is updated daily. Community experts post <strong>fix jodi</strong> predictions, open/close guesses, and panel tips before each market opens.</p>
      <p className="ansh-p"><strong>Expert tips</strong> are crowd-sourced and pattern-based - drawn from chart history, not luck. <strong>Free daily guessing</strong> numbers cover all major markets: Kalyan, Milan, Rajdhani, Main Bazar, and Bombay variants.</p>
      <p className="ansh-p">The forum is open to all. No registration, no fee. Post your own analysis or follow the top contributors. Numbers update every morning - check before <strong>10 AM</strong> for the best early tips.</p>
    </div>
  );
}
