import type { SectionResolver } from "@/lib/resolveStyle";
import { toCss } from "@/lib/resolveStyle";

export function HeroHeader({ resolve }: { resolve: SectionResolver }) {
  const { styles, content } = resolve("hero_header");
  return (
    <>
      <section className="header-box my-4">
        <div className="text-center py-4 px-4" style={toCss(styles.box1)}>
          <div className="text-base sm:text-lg">{content.line1}</div>
          <div className="text-base sm:text-lg">{content.line2}</div>
          <div className="text-xl sm:text-2xl font-bold mt-2" style={{ color: "#ff0000" }}>{content.brand1}</div>
          <div className="text-2xl sm:text-3xl font-bold" style={{ color: "#0000ff" }}>{content.brand2}</div>
          <div className="text-2xl sm:text-3xl font-bold" style={{ color: "#0000ff" }}>{content.brand3}</div>
        </div>
      </section>

      <section className="header-box my-4">
        <div className="py-4 px-4 sm:px-6 text-center text-xs sm:text-sm leading-relaxed" style={toCss(styles.box2)}>
          {content.seoParagraph}
        </div>
      </section>
    </>
  );
}
