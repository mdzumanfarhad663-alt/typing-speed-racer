import * as cheerio from "cheerio";

export type ScrapedResult = {
  gameTitle: string;
  resultValue: string;
  timeRange: string;
  jodiUrl: string;
  panelUrl: string;
  sourceKey: string; // slug used for upsert
};

export type ScrapedJodiRow = { label: string; values: string[] };

export type ScrapedJodiTable = {
  gameName: string;
  rows: ScrapedJodiRow[];
};

const SOURCE_URL = "https://sattamatkadpboss.mobi/";
const FETCH_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  Referer: "https://www.google.com/",
};

function toSourceKey(title: string): string {
  return title.trim().toUpperCase().replace(/\s+/g, "_");
}

export async function scrapeMainResults(): Promise<ScrapedResult[]> {
  let html: string;
  try {
    const res = await fetch(SOURCE_URL, { headers: FETCH_HEADERS, cache: "no-store" });
    if (!res.ok) return [];
    html = await res.text();
  } catch {
    return [];
  }

  const $ = cheerio.load(html);
  const results: ScrapedResult[] = [];

  // Each game is inside a div.news2
  $("div.news2").each((_i, el) => {
    const spans = $(el).find("span");
    // span[color=blue] = title, span[color=black] = result, span[color=red] = time
    let gameTitle = "";
    let resultValue = "";
    let timeRange = "";

    spans.each((_j, span) => {
      const color = $(span).attr("style") ?? "";
      const text = $(span).text().trim();
      if (color.includes("color:blue")) gameTitle = text;
      else if (color.includes("color:black")) resultValue = text;
      else if (color.includes("color:red")) timeRange = text;
    });

    const jodiUrl = $(el).find("div.jodichartleft a").attr("href") ?? "";
    const panelUrl = $(el).find("div.panelchartright a").attr("href") ?? "";

    if (!gameTitle || !resultValue) return;

    results.push({
      gameTitle,
      resultValue,
      timeRange,
      jodiUrl,
      panelUrl,
      sourceKey: toSourceKey(gameTitle),
    });
  });

  return results;
}

export async function scrapeJodiTable(jodiPageUrl: string): Promise<ScrapedJodiTable | null> {
  let html: string;
  try {
    const res = await fetch(jodiPageUrl, { headers: FETCH_HEADERS, cache: "no-store" });
    if (!res.ok) return null;
    html = await res.text();
  } catch {
    return null;
  }

  const $ = cheerio.load(html);
  const gameName = $("title").text().split("|")[0].trim();
  const rows: ScrapedJodiRow[] = [];

  // Jodi chart pages typically have a table with rows of date + values
  $("table tr").each((_i, tr) => {
    const cells = $(tr).find("td");
    if (cells.length < 2) return;
    const label = $(cells[0]).text().trim();
    const values: string[] = [];
    cells.each((_j, td) => {
      if (_j > 0) values.push($(td).text().trim());
    });
    if (label) rows.push({ label, values });
  });

  if (rows.length === 0) return null;
  return { gameName, rows };
}
