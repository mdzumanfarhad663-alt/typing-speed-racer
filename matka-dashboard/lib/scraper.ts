import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";

export type ScrapedResult = {
  gameTitle: string;
  resultValue: string;
  timeRange: string;
  jodiUrl: string;
  panelUrl: string;
  sourceKey: string;
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

function parseGameBlock($: cheerio.CheerioAPI, el: AnyNode): ScrapedResult | null {
  const spans = $(el).find("span");
  let gameTitle = "";
  let resultValue = "";
  let timeRange = "";

  spans.each((_j, span) => {
    const style = $(span).attr("style") ?? "";
    const text = $(span).text().trim();

    if (style.includes("color:black")) {
      resultValue = text;
    } else if (style.includes("font-size:small") && style.includes("color:red")) {
      timeRange = text;
    } else if (style.includes("color:") && !style.includes("color:white")) {
      // Any colored span that isn't white is a title candidate
      // (white is used on Jodi/Panel link text)
      if (!gameTitle && text.length > 1) gameTitle = text;
    }
  });

  const jodiUrl = $(el).find("div.jodichartleft a").attr("href") ?? "";
  const panelUrl = $(el).find("div.panelchartright a").attr("href") ?? "";

  if (!gameTitle || !resultValue) return null;

  return {
    gameTitle: gameTitle.trim(),
    resultValue: resultValue.trim(),
    timeRange: timeRange.trim(),
    jodiUrl,
    panelUrl,
    sourceKey: toSourceKey(gameTitle),
  };
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
  const seen = new Set<string>();

  // Source site uses two container classes: div.news2 and div.fix
  $("div.news2, div.fix").each((_i, el) => {
    const parsed = parseGameBlock($, el);
    if (!parsed) return;
    // Deduplicate by sourceKey
    if (seen.has(parsed.sourceKey)) return;
    seen.add(parsed.sourceKey);
    results.push(parsed);
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
