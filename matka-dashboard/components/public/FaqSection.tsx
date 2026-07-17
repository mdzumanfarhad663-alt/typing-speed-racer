"use client";
import { useState } from "react";
import type { SectionResolver } from "@/lib/resolveStyle";
import { toCss, parseList } from "@/lib/resolveStyle";

type FAQItem = { q: string; a: string };

function Accordion({ items, bulletStyle }: { items: FAQItem[]; bulletStyle?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ borderTop: i === 0 ? "1px solid #dc1f44" : "1px solid #dc1f44" }}>
          <div
            className="cursor-pointer select-none flex items-start gap-2 py-2 px-2.5 sm:px-3"
            style={{ background: "#fff" }}
            onClick={() => setOpen(open === i ? null : i)}
          >
            {bulletStyle && <span className="mt-0.5 text-sm sm:text-base shrink-0">•</span>}
            <span
              className="flex-1 min-w-0 font-bold break-words"
              style={{
                color: bulletStyle ? "#000" : "#d70544",
                fontSize: bulletStyle ? "clamp(0.9rem, 3.2vw, 1.05rem)" : "clamp(0.95rem, 3.5vw, 1.15rem)",
                textTransform: bulletStyle ? "none" : "uppercase",
              }}
            >
              {item.q}
              {!bulletStyle && (
                <span className="float-right font-normal text-gray-400 ml-2 shrink-0">
                  {open === i ? "▲" : "▼"}
                </span>
              )}
            </span>
            {bulletStyle && (
              <span className="text-gray-400 text-xs sm:text-sm mt-0.5 shrink-0">{open === i ? "▲" : "▼"}</span>
            )}
          </div>
          {open === i && (
            <div
              className="px-3 sm:px-4 py-3 text-sm sm:text-base break-words"
              style={{
                background: "#f9f9f9",
                borderTop: "1px solid #eee",
                color: "#333",
                lineHeight: 1.7,
              }}
            >
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function FaqSection({ resolve }: { resolve: SectionResolver }) {
  const { styles, content } = resolve("faq_section");
  const faq1 = parseList<FAQItem>(content.faq1Items);
  const faqMain = parseList<FAQItem>(content.faqMainItems);
  const faq3 = parseList<FAQItem>(content.faq3Items);

  return (
    <>
      {/* Section 1 — simple bullet accordion */}
      <div className="my-4" style={{ border: "1px solid #dc1f44", background: "#fff" }}>
        <Accordion items={faq1} bulletStyle />
      </div>

      {/* Section 2 — colored header + Q1-Q8 */}
      <div className="my-4">
        <div
          className="text-center py-3 px-2.5 sm:px-4"
          style={{ borderTop: "1px solid #000", borderBottom: "1px solid #000", ...toCss(styles.header) }}
        >
          <span className="font-bold text-sm sm:text-lg break-words" style={{ letterSpacing: "0.5px" }}>
            {content.headerLabel}
          </span>
        </div>
        <div style={toCss(styles.body)}>
          <Accordion items={faqMain} />
        </div>
      </div>

      {/* Section 3 — second bullet accordion */}
      <div className="my-4" style={{ border: "1px solid #dc1f44", background: "#fff" }}>
        <Accordion items={faq3} bulletStyle />
      </div>

      {/* Section 4 — plain text + nav links */}
      <div
        className="my-4 px-3 sm:px-4 py-4 text-sm sm:text-base"
        style={{ background: "#fff", color: "#000", lineHeight: 1.8 }}
      >
        <p className="font-bold mb-3 text-center whitespace-pre-wrap" style={{ color: "#00008b" }}>
          {content.seoKeywordsLine}
        </p>
        <p className="mb-3 text-justify whitespace-pre-wrap">
          {content.seoParagraph1}
        </p>
        <p className="mb-3 text-justify whitespace-pre-wrap">
          {content.seoParagraph2}
        </p>
        <p className="mb-3 text-justify whitespace-pre-wrap">
          {content.seoParagraph3}
        </p>
        <p className="text-justify whitespace-pre-wrap">
          {content.seoParagraph4}
        </p>
      </div>
    </>
  );
}
