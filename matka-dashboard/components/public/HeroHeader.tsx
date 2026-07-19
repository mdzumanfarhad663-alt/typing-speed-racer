import type { SectionResolver } from "@/lib/resolveStyle";
import { toCss } from "@/lib/resolveStyle";

// Brand/keyword phrases that should always render bold inside the SEO paragraph,
// regardless of what the admin edits the surrounding text to.
const SEO_BOLD_PHRASES = [
  "SattaMatkaDpboss.Mobi",
  "SattaMatka-Dpboss.in",
  "DPBoss Satta Matka",
  "Matka Guessing Forum",
  "Satta Matka",
];

function boldenPhrases(text: string, phrases: string[]) {
  if (!text) return text;
  const escaped = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "g");
  return text.split(re).map((part, i) =>
    phrases.includes(part) ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  );
}

export function HeroHeader({ resolve }: { resolve: SectionResolver }) {
  const { styles, content } = resolve("hero_header");
  return (
    <>
      <section className="header-box mt-1 mb-4">
        <div className="text-center py-4 px-4" style={toCss(styles.box1)}>
          <div className="text-base sm:text-lg">{content.line1}</div>
          <div className="text-base sm:text-lg">{content.line2}</div>
          <div className="text-xl sm:text-2xl font-bold mt-2" style={{ color: "#ff0000" }}>{content.brand1}</div>
          <div className="text-2xl sm:text-3xl font-bold" style={{ color: "#0000ff" }}>{content.brand2}</div>
          <div className="text-2xl sm:text-3xl font-bold" style={{ color: "#0000ff" }}>{content.brand3}</div>
        </div>
      </section>

      <section className="header-box my-[18px]">
        <div className="py-4 px-4 sm:px-6 text-center text-xs sm:text-sm leading-relaxed" style={toCss(styles.box2)}>
          {boldenPhrases(content.seoParagraph, SEO_BOLD_PHRASES)}
        </div>
      </section>
    </>
  );
}
