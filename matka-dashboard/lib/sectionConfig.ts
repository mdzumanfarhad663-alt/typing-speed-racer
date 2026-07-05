import type { StyleSlot } from "@/lib/schema";

export type ContentFieldType = "text" | "textarea" | "list";
export type ContentFieldDef = { key: string; label: string; type: ContentFieldType; default: string };
export type StyleSlotDef = { key: string; label: string; default: StyleSlot };

export type SectionConfigEntry = {
  key: string;
  label: string;
  styleSlots: StyleSlotDef[];
  contentFields: ContentFieldDef[];
};

const FAQ1_DEFAULT = [
  { q: "What are the primary mechanics and rules of the classic Matka game?", a: "The classic Matka game involves picking a number between 0 and 9 for both an opening and closing draw. The two digits form a Jodi (pair) and three-digit Panna. Results are declared twice daily. Players win based on how accurately they predicted the Single, Jodi or Panna combination." },
  { q: "How do participants select digits and calculate card combinations?", a: "Players choose any digit from 0 to 9 for the open draw and another for the close draw. The sum of three randomly picked digits gives the final single digit. For example, if you pick 1, 2, 3 — the sum is 6, so the open result is 1+2+3=6. The three digits combined form the Panna (123) and the single digit (6)." },
  { q: "What crucial parameters should you evaluate before exploring online markets?", a: "Before playing any online Matka market, verify the platform's result update speed, chart history depth, reputation among players, and whether it is completely free. SattaMatkaDpboss.Mobi has been trusted since 2012 for fast, free, and accurate results across 50+ markets." },
  { q: "How do numbered slips and draw outcomes determine a winner?", a: "In the traditional format, numbered chits were drawn from a matka (earthen pot). Today, the draw is managed by market organizers and declared at fixed times. Your selection is compared against the declared result — if your Single, Jodi or Panna matches, you win based on the applicable payout rate." },
  { q: "Can expert guessing forums guarantee consistent victories in speculative games?", a: "No guessing forum can guarantee wins. Forums and guessing experts share pattern-based predictions drawn from historical chart data and open/close trends. They are starting points for informed decisions, not certainties. Always treat guessing tips as community insights, not guaranteed outcomes." },
  { q: "How does community engagement influence digital search variations?", a: "When millions of players search for terms like 'kalyan matka result today', 'dpboss 143', or 'satta matta matka', they shape the most searched keywords in the Matka ecosystem. Community engagement drives faster result coverage, more guessing forum activity, and wider chart record availability on platforms like DPBoss." },
  { q: "How has modern internet infrastructure affected historical lottery systems?", a: "The internet transformed Matka from a localized street game into a nationwide digital system. Results that once took hours to spread across cities now reach every mobile screen within seconds. Platforms like SattaMatkaDpboss.Mobi provide instant results, 68+ years of chart records, and free guessing — all of which were impossible before digital infrastructure." },
];

const FAQ_MAIN_DEFAULT = [
  { q: "Q1. WHAT IS DPBOSS AND WHY DO MILLIONS OF PLAYERS VISIT IT EVERY DAY?", a: "DPBoss is one of India's oldest and most trusted Satta Matka result platforms, running since 2012. It covers 50 plus Matka markets including Kalyan, Milan, Rajdhani, Time Bazar and Main Bazar — all updated the moment results are declared. No login required, no payment, no membership. That is exactly why millions of players bookmark SattaMatkaDpboss.Mobi and come back every single day." },
  { q: "Q2. WHAT IS KALYAN MATKA AND WHEN DOES ITS RESULT COME?", a: "Kalyan Matka is India's most popular and most followed Satta Matka market, started in 1962 by Kalyanji Bhagat. The Kalyan result is declared twice a day — once in the evening and once at night. On DPBoss, the Kalyan result is updated the moment it is declared, making it the fastest and most reliable place to check Kalyan Matka result online." },
  { q: "Q3. WHAT IS SATTA MATKA AND HOW DOES IT WORK?", a: "Satta Matka is a number-based game that originated in India in the 1960s. Players select digits between 0 and 9, form combinations, and wait for the official result to match their selection. The game has different bet types including Single, Jodi and Panna. Today, DPBoss publishes live results for all major Matka markets so players across India can check outcomes instantly from their mobile phone." },
  { q: "Q4. WHAT IS THE DIFFERENCE BETWEEN JODI, PANNA AND SINGLE IN SATTA MATKA?", a: "Single means any one digit between 0 and 9. Jodi means a pair of two digits between 00 and 99, for example 45 or 72. Panna or Patti is a three-digit combination like 128 or 356. Every Matka market declares all three types in each result session. DPBoss displays Single, Jodi and Panna clearly for every market on the same page in real time." },
  { q: "Q5. WHAT IS OPEN TO CLOSE IN SATTA MATKA?", a: "Open To Close, also known as OTC, is a prediction method where players try to predict both the opening digit and the closing digit of a Matka market session. Knowing the right open and close significantly narrows down Jodi and Panna selection. DPBoss updates Fix 3 Ank Open To Close free for all major markets twice daily — day markets by 2 PM and night markets by 8 PM." },
  { q: "Q6. WHAT IS THE 220 PATTI CHART IN SATTA MATKA?", a: "In Satta Matka there are exactly 220 valid three-digit numbers known as Panna or Patti. Every result panel number must come from this fixed set of 220 combinations. These numbers are grouped digit-wise from 0 to 9 based on the sum of their digits. DPBoss provides the complete All Panna Record on a dedicated page, available free for all players with no login needed." },
  { q: "Q7. IS EVERYTHING ON SATTAMATKADPBOSS.MOBI COMPLETELY FREE?", a: "Yes, absolutely everything on SattaMatkaDpboss.Mobi is 100% free. Live results, Jodi charts, Panel charts, Weekly Jodi Panna predictions, Open To Close daily tips, 220 Patti record and Guessing Forum — all of it is available without any payment, registration or membership fees since 2012." },
  { q: "Q8. HOW QUICKLY DOES DPBOSS UPDATE SATTA MATKA RESULTS?", a: "DPBoss updates every Satta Matka result the moment it is officially declared by the respective market — zero delay. Among all Satta Matka result platforms in India, DPBoss is widely recognized as one of the fastest. The site is also optimized for mobile and loads quickly even on slow internet, which is why it remains the first choice for players across every state in India." },
];

const FAQ3_DEFAULT = [
  { q: "What is DP Boss 143 and what updates does it provide?", a: "DP Boss 143 is the expert-level prediction tag used by the DPBoss guessing community. The number 143 signals a high-confidence fix jodi or panel tip. Updates include daily fix jodi predictions for Kalyan, Milan and Main Bazar, open/close guessing numbers, and weekly panna tips — all free, all on SattaMatkaDpboss.Mobi." },
  { q: "What is DPBoss and how does it work?", a: "DPBoss is India's most visited Satta Matka result platform. It aggregates live results from all major markets, updates them the moment they are declared, and presents them alongside free chart records, guessing forum tips, and weekly jodi panna predictions. No login, no fee, no delay." },
  { q: "What is Kalyan Matka and how are its results declared?", a: "Kalyan Matka is a six-day-a-week market started by Kalyanji Bhagat in 1962. The market organizer declares the open result at 3:45 PM and the close result at 5:45 PM. DPBoss publishes the Kalyan result the moment it is officially announced — making it the fastest Kalyan result platform in India." },
  { q: "Where can I find today's live results for all major markets?", a: "All live results are available right here on SattaMatkaDpboss.Mobi. The page auto-updates the moment each market declares its result. You can find Kalyan, Milan Day, Milan Night, Rajdhani Day, Rajdhani Night, Main Bazar, Time Bazar, Sridevi, Madhur and all other major markets on the same page." },
  { q: "What is the history behind the online transformation of Satta Matka?", a: "Satta Matka began as a street-based betting game in 1960s Mumbai. Ratan Khatri formalized the draw system using earthen pots (matkas). As internet connectivity spread across India in the 2000s, result platforms moved online. DPBoss launched in 2012 and has been at the forefront of digital Matka result delivery ever since." },
  { q: "Is SattaMatkaDpboss.Mobi a reliable DP Boss Net alternative?", a: "SattaMatkaDpboss.Mobi is not an alternative — it is the original and most trusted DPBoss platform. Running since 2012, it is the go-to source for dpboss matka, dp boss net, and dpboss satta results. Every result, every chart, every guessing tip on this site is free and updated in real time." },
];

const SEO_PARAGRAPH_DEFAULT =
  "SattaMatka-Dpboss.in And SattaMatkaDpboss.Mobi is India's fastest and most trusted platform for DPBoss Satta Matka result — Silon Day Night, Lucky Day Night, Kalyan Matka, Milan Day Night, Rajdhani Day Night, Main Bazar, Time Bazar and 50+ markets — all updated daily at lightning speed, 100% free. Get live Kalyan Matka result, DPBoss 143 guessing, free Matka Guessing Forum, complete Jodi Chart and Panel Chart records from 1974 to 2026, Morning Syndicate result, Syndicate Night result, Date Fix Matka and weekly jodi predictions — everything in one place. No login. No payment. Always free. India's most complete Satta Matka platform — 50+ markets, 68+ chart records, active guessing forum and expert fix jodi tips. We also provide Morning Syndicate and Matka Bazar Syndicate Night results directly from the Matka industry. Receive weekly game updates, Date Fix information and a free Matka Number Guessing Formula. Visit us daily for the fastest Matka tips and tricks. Bookmark this site for easy access. Thank you!";

export const SECTION_CONFIG: SectionConfigEntry[] = [
  {
    key: "hero_header",
    label: "Hero Header",
    styleSlots: [
      { key: "box1", label: "Top brand box", default: { backgroundColor: "#f5fffa", textColor: "#434142", fontStyle: "italic", textAlign: "center" } },
      { key: "box2", label: "SEO paragraph box", default: { backgroundColor: "#f5fffa", textColor: "#434142", fontStyle: "italic", textAlign: "left" } },
    ],
    contentFields: [
      { key: "line1", label: "Line 1", type: "text", default: "विश्व की पहली" },
      { key: "line2", label: "Line 2", type: "text", default: "भरोसेमन्द वेबसाइट" },
      { key: "brand1", label: "Brand line (red)", type: "text", default: "Satta Matka" },
      { key: "brand2", label: "Brand line (blue) 1", type: "text", default: "SattaMatka-Dpboss.in" },
      { key: "brand3", label: "Brand line (blue) 2", type: "text", default: "SattaMatkaDpboss.Mobi" },
      { key: "seoParagraph", label: "SEO paragraph", type: "textarea", default: SEO_PARAGRAPH_DEFAULT },
    ],
  },
  {
    key: "live_update_band",
    label: "Live Update Band",
    styleSlots: [{ key: "header", label: "Header band", default: { backgroundColor: "#ffc107", textColor: "#000000", fontWeight: "700", fontStyle: "italic", borderColor: "orange", borderWidth: "3px", borderStyle: "solid" } }],
    contentFields: [{ key: "heading", label: "Heading", type: "text", default: "📡 LIVE UPDATE" }],
  },
  {
    key: "lucky_band",
    label: "Lucky Number Band",
    styleSlots: [
      { key: "titleBand", label: "Title band", default: { backgroundColor: "#fae6e9", borderColor: "#956f13", borderWidth: "3px", borderStyle: "solid", textColor: "#000000", fontStyle: "italic" } },
      { key: "ankBox", label: "Ank table", default: { backgroundColor: "#fff", borderColor: "#ffa500", borderWidth: "3px", borderStyle: "solid" } },
    ],
    contentFields: [
      { key: "heading", label: "Heading", type: "text", default: "Today Satta Matka Lucky Number" },
      { key: "ankLabel", label: "Ank column label", type: "text", default: "Ank (शुभांक)" },
      { key: "finalAnkLabel", label: "Final Ank column label", type: "text", default: "Final Ank" },
    ],
  },
  {
    key: "promo_block",
    label: "Promo Block",
    styleSlots: [
      { key: "panel", label: "Panel background", default: { backgroundColor: "#08619a", textAlign: "center" } },
      { key: "button", label: "CTA button", default: { backgroundColor: "#833ab4", borderColor: "#f7dc6f", borderWidth: "1px", borderStyle: "solid", textColor: "#ffffff" } },
      { key: "trustedText", label: "Trusted text", default: { textColor: "#f4d03f" } },
    ],
    contentFields: [
      { key: "hindiText", label: "Hindi promo text", type: "textarea", default: "अब मटका खेलना हुआ आसान ! घर बैठे मटका खेलो अब मोबाइल एप्लीकेशन पे और जीतो ढेर सारी धनराशि। अभी डाउनलोड करो।" },
      { key: "buttonLabel", label: "Button label", type: "text", default: "Play Online Matka" },
      { key: "trustedLabel", label: "Trusted label", type: "text", default: "India's Biggest & Most Trusted" },
    ],
  },
  {
    key: "contact_forum",
    label: "Contact & Forum Section",
    styleSlots: [
      { key: "contactHeader", label: "Contact header", default: { backgroundColor: "#e30000", textColor: "#ffffff" } },
      { key: "contactSubHeader", label: "Contact sub-header", default: { backgroundColor: "#000000", textColor: "#ffffff" } },
      { key: "emailPill", label: "Email button", default: { backgroundColor: "#1f9d55", textColor: "#ffffff" } },
      { key: "forumHeader", label: "Forum header", default: { backgroundColor: "#0b6e4f", textColor: "#ffffff" } },
    ],
    contentFields: [
      { key: "contactHeading", label: "Contact heading", type: "text", default: "Contact For Any Support And Queries" },
      { key: "contactSubText", label: "Contact sub-text", type: "text", default: "Email us, and we will get back to you shortly." },
      { key: "email", label: "Support email", type: "text", default: "support@sattamatkadpboss.mobi" },
      { key: "forumHeading", label: "Forum heading", type: "text", default: "MEMBER'S FORUM AND FREE SATTA MATKA ZONE" },
    ],
  },
  {
    key: "weekly_charts",
    label: "Weekly Charts",
    styleSlots: [{ key: "header", label: "Header band", default: { backgroundColor: "#ffcc66", textColor: "#000000", borderColor: "#ddd", borderWidth: "1px", borderStyle: "solid" } }],
    contentFields: [
      { key: "panelHeading", label: "Panel chart heading", type: "textarea", default: "Weekly Panel Or Patti Chart From 29-06-2026 To 05-07-2026 For Kalyan, Milan, Kalyan Night, Rajdhani Night, Time Bazar, Main Bazar Market" },
      { key: "jodiHeading", label: "Jodi chart heading", type: "textarea", default: "Weekly Jodi Chart From 29-06-2026 To 05-07-2026 For Kalyan, Milan, Kalyan Night, Rajdhani Night, Time Bazar, Main Bazar Market" },
      { key: "otcHeading", label: "Open-to-close heading", type: "textarea", default: "Weekly Number Open To Close From 29-06-2026 To 05-07-2026 For Kalyan, Milan, Kalyan Night, Rajdhani Night, Time Bazar, Main Bazar Market" },
    ],
  },
  {
    key: "top_guessers",
    label: "Top Guessers",
    styleSlots: [
      { key: "topBar", label: "Top bar", default: { backgroundColor: "#ff0000", textColor: "#ffffff" } },
      { key: "leftHeader", label: "Left column header", default: { backgroundColor: "#00008b", textColor: "#ffffff" } },
      { key: "leftRows", label: "Left column rows", default: { backgroundColor: "#008000", textColor: "#ffffff" } },
      { key: "rightHeader", label: "Right column header", default: { backgroundColor: "#00008b", textColor: "#ffffff" } },
      { key: "rightRows", label: "Right column rows", default: { backgroundColor: "#0000ff", textColor: "#ffffff" } },
    ],
    contentFields: [
      { key: "topBarLabel", label: "Top bar label", type: "text", default: "⇒ Top Guessers And Result King" },
      { key: "leftHeading", label: "Left column heading", type: "text", default: "TOP GUSSER" },
      { key: "rightHeading", label: "Right column heading", type: "text", default: "FAST RESULT" },
    ],
  },
  {
    key: "chart_records",
    label: "Chart Records",
    styleSlots: [{ key: "header", label: "Section headers", default: { backgroundColor: "purple", textColor: "#ffff00", borderColor: "#a52a2a", borderWidth: "2px", borderStyle: "inset" } }],
    contentFields: [
      { key: "jodiHeading", label: "Jodi chart records heading", type: "text", default: "⇛SATTA MATKA JODI CHART RECORDS" },
      { key: "panelHeading", label: "Panel chart records heading", type: "text", default: "⇛SATTA MATKA PANEL CHART RECORDS" },
      { key: "otherJodiHeading", label: "Other jodi chart heading", type: "text", default: "⇛OTHER MATKA BAZAR JODI CHART RECORDS" },
      { key: "otherPanelHeading", label: "Other panel chart heading", type: "text", default: "⇛OTHER MATKA BAZAR PANEL CHART RECORDS" },
    ],
  },
  {
    key: "satta_matka_info",
    label: "Satta Matka Info (SEO article)",
    styleSlots: [{ key: "container", label: "Article container", default: { backgroundColor: "#fdfefe", textColor: "#000000", borderColor: "#82e0aa", borderWidth: "2px", borderStyle: "inset" } }],
    contentFields: [],
  },
  {
    key: "faq_section",
    label: "FAQ Section",
    styleSlots: [
      { key: "header", label: "Section 2 header band", default: { backgroundColor: "#0b1f4d", textColor: "#ffd700" } },
      { key: "body", label: "Accordion body", default: { backgroundColor: "#ffffff", borderColor: "#dc1f44", borderWidth: "1px", borderStyle: "solid" } },
    ],
    contentFields: [
      { key: "headerLabel", label: "Header label", type: "text", default: "FREQUENTLY ASKED QUESTIONS — SATTA MATKA DPBOSS" },
      { key: "faq1Items", label: "FAQ Set 1 (Q/A pairs)", type: "list", default: JSON.stringify(FAQ1_DEFAULT) },
      { key: "faqMainItems", label: "FAQ Main (Q1–Q8)", type: "list", default: JSON.stringify(FAQ_MAIN_DEFAULT) },
      { key: "faq3Items", label: "FAQ Set 3", type: "list", default: JSON.stringify(FAQ3_DEFAULT) },
      { key: "seoKeywordsLine", label: "SEO keywords line (Section 4 title)", type: "text", default: "Satta Matka | Satta Market | 220 Patti | Satta Matta Matka | Kalyan Satta Matka Result | Kalyan Matka | DPBoss" },
      { key: "seoParagraph1", label: "SEO paragraph 1", type: "textarea", default: "SattaMatkaDpboss.Mobi is one of India's most visited platforms for live Satta Matka results and free guessing tips. We cover all major markets including Kalyan Matka, Milan Day, Milan Night, Rajdhani Day, Rajdhani Night, Time Bazar, and Main Bazar — delivering the fastest result updates available online. Our experienced team shares daily free Kalyan guessing, weekly jodi panna charts, and open to close tips to help players make smarter decisions every single day." },
      { key: "seoParagraph2", label: "SEO paragraph 2", type: "textarea", default: "DPBoss is recognized as India's leading Matka result platform for players who search terms like Indian satta matka, satta matka king, matka result live, and Kalyan matka result today. Our expert team shares daily free guessing for Kalyan open, Kalyan final ank, and Kalyan matka chart analysis — helping players make smarter decisions before every result window. Players looking for satta fix, dpboss guessing, and matka guessing 143 will find accurate and honest tips shared by experienced guessers in our free forum every single day." },
      { key: "seoParagraph3", label: "SEO paragraph 3", type: "textarea", default: "Beyond Kalyan, DPBoss covers a wide range of popular markets including Madhur Matka, Sridevi Matka, Tara Matka, Star Matka, and Worli Matka. Players who follow madhur chart, sridevi chart, and tara satta matka results trust SattaMatkaDpboss.Mobi for the most current panna and jodi data available online. Our platform also serves players searching in regional languages including सट्टा मटका and मिलन मटका — making it one of the most inclusive and widely accessible Matka result sites in India." },
      { key: "seoParagraph4", label: "SEO paragraph 4", type: "textarea", default: "SattaMatkaDpboss.Mobi is also the go-to platform for players who search for satta matta matka 143, sattamatka 143, dpboss 143 guessing, golden matka, golden satta matka, and satta 143. Our free game zone, weekly jodi panna chart, and open to close daily tips make this platform the complete package for any serious Matka player. Bookmark SattaMatkaDpboss.Mobi today and get live matka updates, fast satta results, and free guessing tips delivered every single day without fail." },
    ],
  },
  {
    key: "main_footer",
    label: "Main Footer",
    styleSlots: [
      { key: "wrapper", label: "Footer background", default: { backgroundColor: "#0b131e" } },
      { key: "disclaimerBox", label: "Disclaimer box", default: { backgroundColor: "#ffffff", borderColor: "#3d5afe", borderWidth: "1px", borderStyle: "solid" } },
      { key: "contactCard", label: "Contact card", default: { backgroundColor: "#ffffff" } },
      { key: "ratingsBox", label: "Ratings box", default: { backgroundColor: "#111111", borderColor: "#fbc02d", borderWidth: "2px", borderStyle: "solid" } },
    ],
    contentFields: [
      { key: "disclaimerTitle", label: "Disclaimer title", type: "text", default: "!! DISCLAIMER !!" },
      { key: "disclaimerText", label: "Disclaimer text (Hindi)", type: "textarea", default: "यह वेबसाइट (SattaMatkaDpboss.Mobi) केवल मनोरंजन और सूचना के उद्देश्य के लिए है। हम किसी भी अवैध सट्टा मटका व्यवसाय से नहीं जुड़े हैं। यहाँ दिखाए गए सभी परिणाम इंटरनेट पर उपलब्ध डेटा पर आधारित हैं। हम जुए या सट्टा खेलने का समर्थन नहीं करते हैं। कृपया अपने देश के कानूनों का पालन करें। किसी भी लाभ या हानि के लिए आप स्वयं जिम्मेदार होंगे।" },
      { key: "disclaimerNote", label: "Disclaimer note (English)", type: "textarea", default: "Note: This site is for educational purposes only. View at your own risk." },
      { key: "phone", label: "Contact phone", type: "text", default: "08829959562" },
      { key: "ownerName", label: "Site owner name", type: "text", default: "PRO. BIG BOSS SIR" },
      { key: "rating", label: "Rating score", type: "text", default: "4.9 / 5" },
      { key: "ratingVotes", label: "Rating votes text", type: "text", default: "(Based on 14,850 votes)" },
    ],
  },
  {
    key: "free_zone_block",
    label: "Free Zone Block",
    styleSlots: [{ key: "header", label: "Header", default: { backgroundColor: "#6c1d8b", textColor: "#fff200" } }],
    contentFields: [{ key: "heading", label: "Heading", type: "text", default: "⇛ OPEN TO CLOSE FREE GAME ZONE" }],
  },
  {
    key: "live_result_list",
    label: "Live Result List",
    styleSlots: [{ key: "header", label: "Header band", default: { backgroundColor: "#ffd400" } }],
    contentFields: [{ key: "heading", label: "Heading", type: "text", default: "📊 LIVE MATKA RESULT" }],
  },
];

export type ChartKind = "panel" | "jodi";

export function chartSectionKey(kind: ChartKind, rowId: string): string {
  return `${kind}_chart_${rowId}`;
}

const CHART_KEY_RE = /^(panel|jodi)_chart_(.+)$/;

function buildChartConfig(kind: ChartKind, key: string): SectionConfigEntry {
  const styleSlots: StyleSlotDef[] = [
    { key: "topHeader", label: "Top title box", default: { backgroundColor: "#0c0361", textColor: "#ff0000", borderColor: "#ff0000", borderWidth: "3px", borderStyle: "solid", fontWeight: "700", fontStyle: "italic" } },
    { key: "subtitleBox", label: "Subtitle box", default: { backgroundColor: "#0c0361", textColor: "#ffffff" } },
    { key: "resultBox", label: "Yellow result box", default: { backgroundColor: "#ffff00", textColor: "#000000", borderColor: "#b22222", borderWidth: "4px", borderStyle: "double" } },
    { key: "goToPill", label: "Go to Bottom/Top pill", default: { backgroundColor: "#ffffff", textColor: "#ff0000" } },
    { key: "tableHeader", label: "Table header row", default: { backgroundColor: "#ffffff", textColor: "#000000", fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: "700", borderColor: "#dddddd", borderWidth: "1px", borderStyle: "solid" } },
    { key: "tableBorder", label: "Table outer border", default: { borderColor: "#893bff", borderWidth: "4px", borderStyle: "groove" } },
    { key: "footerBar", label: "Footer bar", default: { backgroundColor: "#0c0361", textColor: "#ffff00" } },
  ];

  const contentFields: ContentFieldDef[] = [
    { key: "titleSuffix", label: "Title suffix", type: "text", default: kind === "panel" ? "PANEL CHART" : "CHART" },
    { key: "subtitleText", label: "Subtitle text (after game name)", type: "text", default: kind === "panel" ? "Jodi Patti chart" : "Jodi Matka Chart" },
    {
      key: "keywordsText",
      label: "SEO keywords line",
      type: "textarea",
      default:
        kind === "panel"
          ? "panel chart, jodi patti record chart, satta panel chart, panel chart for matka"
          : "jodi chart, jodi matka chart, jodi record chart, jodi patti chart",
    },
    { key: "goToBottomLabel", label: "\"Go to Bottom\" label", type: "text", default: "Go to Bottom" },
    { key: "goToTopLabel", label: "\"Go to Top\" label", type: "text", default: "Go to Top" },
    {
      key: "emptyMessage",
      label: "Empty-state message",
      type: "textarea",
      default: kind === "panel" ? "No panel data yet. Admin can add weekly entries from the admin panel." : "No jodi data yet. Admin can add weekly entries from the admin panel.",
    },
    { key: "backLabel", label: "\"Back to dashboard\" label", type: "text", default: "← Back to dashboard" },
  ];

  if (kind === "panel") {
    contentFields.push({ key: "dayLabels", label: "Day header labels (comma-separated)", type: "text", default: "MON,TUE,WED,THU,FRI,SAT,SUN" });
  }

  return { key, label: `${kind === "panel" ? "Panel" : "Jodi"} Chart Page Design`, styleSlots, contentFields };
}

export function getSectionConfig(key: string): SectionConfigEntry | undefined {
  const found = SECTION_CONFIG.find((c) => c.key === key);
  if (found) return found;
  const m = key.match(CHART_KEY_RE);
  if (m) return buildChartConfig(m[1] as ChartKind, key);
  return undefined;
}

export function getSectionDefaults(key: string): { styles: Record<string, StyleSlot>; content: Record<string, string> } {
  const cfg = getSectionConfig(key);
  if (!cfg) return { styles: {}, content: {} };
  return {
    styles: Object.fromEntries(cfg.styleSlots.map((s) => [s.key, s.default])),
    content: Object.fromEntries(cfg.contentFields.map((f) => [f.key, f.default])),
  };
}
