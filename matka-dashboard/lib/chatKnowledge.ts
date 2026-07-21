// Knowledge base for the site chat bot: every page/link on the site (footer
// nav + forum section) plus general "about this site" facts, each tagged
// with search keywords so the bot can match a visitor's question to it —
// exactly, or approximately when the wording doesn't match anything exactly.

export type Topic = {
  id: string;
  title: string;
  href?: string;
  answer: string;
  keywords: string[]; // extra words/phrases that should also trigger this topic
};

export const TOPICS: Topic[] = [
  {
    id: "satta-matka-chart",
    title: "Satta Matka Chart",
    href: "https://sattamatkadpboss.mobi/satta-matka-chart.php",
    answer: "📈 Satta Matka Chart — the full list of panel and jodi charts for every market on the site.",
    keywords: ["satta matka chart", "matka chart", "all matka charts", "charts page"],
  },
  {
    id: "tara-matka",
    title: "Tara Matka",
    href: "https://sattamatkadpboss.mobi/tara-matka-mumbai.php",
    answer: "🎯 Tara Matka (Mumbai) — a dedicated market page with its own live result and chart.",
    keywords: ["tara matka", "tara matka mumbai"],
  },
  {
    id: "fix-matka",
    title: "Fix Matka",
    href: "https://sattamatkadpboss.mobi/fix-matka-number.php",
    answer: "🔒 Fix Matka — fixed/confident number tips page.",
    keywords: ["fix matka", "fix number", "fixed number", "fix jodi"],
  },
  {
    id: "sitemap",
    title: "Sitemap",
    href: "https://sattamatkadpboss.mobi/sitemap_index.xml",
    answer: "🗺️ Sitemap — a full index of every page on the site, useful for search engines and quick navigation.",
    keywords: ["sitemap", "site map", "all pages"],
  },
  {
    id: "about-us",
    title: "About Us",
    href: "https://sattamatkadpboss.mobi/about-us.php",
    answer: "ℹ️ About Us — background on who runs this site and what it offers.",
    keywords: ["about us", "about", "who runs this site", "who are you"],
  },
  {
    id: "contact-us",
    title: "Contact Us",
    href: "https://sattamatkadpboss.mobi/contact.php",
    answer: "📞 Contact Us — reach the site team here, or use the Contact/Forum section on the home page.",
    keywords: ["contact us", "contact", "reach you", "support", "phone number", "email"],
  },
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    href: "https://sattamatkadpboss.mobi/privacy-policy.php",
    answer: "🔐 Privacy Policy — how the site handles visitor data.",
    keywords: ["privacy policy", "privacy", "data policy"],
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    href: "https://sattamatkadpboss.mobi/disclaimer.php",
    answer: "⚠️ Disclaimer — this site is for information/entertainment purposes; please read the full disclaimer for details.",
    keywords: ["disclaimer", "legal", "terms"],
  },
  {
    id: "guessing-forum",
    title: "Satta Matka Guessing Forum",
    href: "https://sattamatkadpboss.mobi/satta-matka-guessing-forum.php",
    answer: "💬 Satta Matka Guessing Forum — a free community forum where players share daily guessing and tips.",
    keywords: ["guessing forum", "forum", "guessing", "matka guessing", "community"],
  },
  {
    id: "open-to-close",
    title: "Daily 3 Ank Open To Close All Games",
    href: "https://sattamatkadpboss.mobi/open-to-close.php",
    answer: "🔢 Daily 3 Ank Open To Close — free daily 3-ank open-to-close tips for every game.",
    keywords: ["open to close", "3 ank", "daily ank", "open close"],
  },
  {
    id: "weekly-jodi-panna",
    title: "Weekly Jodi & Panna",
    href: "https://sattamatkadpboss.mobi/weekly-jodi-panna.php",
    answer: "🗓️ Weekly Jodi & Panna — a weekly summary of jodi and panna numbers across markets.",
    keywords: ["weekly jodi", "weekly panna", "jodi panna", "weekly chart"],
  },
  {
    id: "panna-record",
    title: "Satta 220 Patti Favourite Panna Chart",
    href: "https://sattamatkadpboss.mobi/all-panna-record.php",
    answer: "🎲 Satta 220 Patti — the complete favourite panna chart covering all 220 pannas.",
    keywords: ["220 patti", "220 panna", "favourite panna", "panna record", "all panna"],
  },
  {
    id: "matka-play",
    title: "Matka Play / App",
    href: "https://sattamatkadpboss.mobi/app-apna-release.apk",
    answer: "📱 You can download the official Matka Play app from the Matka Play or Play Online Matka button on the home page, or play with a trusted local agent.",
    keywords: ["matka play", "app", "download app", "apk", "play online", "download"],
  },
  {
    id: "site-overview",
    title: "About this website",
    answer:
      "🏠 This site (SattaMatka-Dpboss.in / SattaMatkaDpboss.Mobi) shows free, live Satta Matka results for 50+ markets (Kalyan, Milan, Rajdhani, Main Bazar and more), with panel charts, jodi charts, today's lucky ank, market timings, matka rates, a guessing forum, and daily open-to-close tips — 100% free, no login needed.",
    keywords: ["what is this site", "what is this website", "site info", "website information", "what do you offer", "what can i find here"],
  },
];

/** Score how well a query matches a topic: exact keyword substring beats fuzzy word overlap. */
function scoreTopic(query: string, topic: Topic): number {
  const q = query.toLowerCase();
  for (const kw of [topic.title.toLowerCase(), ...topic.keywords]) {
    if (q.includes(kw)) return 100 + kw.length; // exact/substring match, longer phrase wins ties
  }
  // Fuzzy fallback: word overlap between query and topic keywords/title.
  const qWords = new Set(q.split(/\W+/).filter((w) => w.length > 2));
  let overlap = 0;
  for (const kw of [topic.title, ...topic.keywords]) {
    for (const w of kw.toLowerCase().split(/\W+/)) {
      if (w.length > 2 && qWords.has(w)) overlap++;
    }
  }
  return overlap;
}

/** Best-matching topic for a free-text question, or null if nothing scores above zero. */
export function findTopic(query: string): Topic | null {
  let best: Topic | null = null;
  let bestScore = 0;
  for (const topic of TOPICS) {
    const score = scoreTopic(query, topic);
    if (score > bestScore) {
      best = topic;
      bestScore = score;
    }
  }
  return best;
}

export function formatTopicAnswer(topic: Topic, exact: boolean): string {
  const link = topic.href ? `\n🔗 ${topic.href}` : "";
  if (exact) return `${topic.answer}${link}`;
  return `I think you're asking about "${topic.title}":\n${topic.answer}${link}`;
}
