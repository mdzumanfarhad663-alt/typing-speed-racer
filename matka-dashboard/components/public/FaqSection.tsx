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
            className="cursor-pointer select-none flex items-start gap-2 py-2 px-3"
            style={{ background: "#fff" }}
            onClick={() => setOpen(open === i ? null : i)}
          >
            {bulletStyle && <span className="mt-0.5 text-sm">•</span>}
            <span
              className="flex-1 font-bold"
              style={{
                color: bulletStyle ? "#000" : "#d70544",
                fontSize: bulletStyle ? "0.85rem" : "0.95rem",
                textTransform: bulletStyle ? "none" : "uppercase",
              }}
            >
              {item.q}
              {!bulletStyle && (
                <span className="float-right font-normal text-gray-400 ml-2">
                  {open === i ? "▲" : "▼"}
                </span>
              )}
            </span>
            {bulletStyle && (
              <span className="text-gray-400 text-xs mt-0.5">{open === i ? "▲" : "▼"}</span>
            )}
          </div>
          {open === i && (
            <div
              className="px-4 py-3 text-sm"
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
          className="text-center py-3 px-4"
          style={{ borderTop: "1px solid #000", borderBottom: "1px solid #000", ...toCss(styles.header) }}
        >
          <span className="font-bold text-sm sm:text-base" style={{ letterSpacing: "1px" }}>
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
        className="my-4 px-4 py-4 text-sm"
        style={{ background: "#fff", color: "#000", lineHeight: 1.8 }}
      >
        <p className="font-bold mb-3 text-center" style={{ color: "#00008b" }}>
          Satta Matka | Satta Market | 220 Patti | Satta Matta Matka | Kalyan Satta Matka Result | Kalyan Matka | DPBoss
        </p>
        <p className="mb-3 text-justify">
          SattaMatkaDpboss.Mobi is one of India&apos;s most visited platforms for live Satta Matka results and free guessing tips. We cover all major markets including Kalyan Matka, Milan Day, Milan Night, Rajdhani Day, Rajdhani Night, Time Bazar, and Main Bazar — delivering the fastest result updates available online. Our experienced team shares daily free Kalyan guessing, weekly jodi panna charts, and open to close tips to help players make smarter decisions every single day.
        </p>
        <p className="mb-3 text-justify">
          DPBoss is recognized as India&apos;s leading Matka result platform for players who search terms like Indian satta matka, satta matka king, matka result live, and Kalyan matka result today. Our expert team shares daily free guessing for Kalyan open, Kalyan final ank, and Kalyan matka chart analysis — helping players make smarter decisions before every result window. Players looking for satta fix, dpboss guessing, and matka guessing 143 will find accurate and honest tips shared by experienced guessers in our free forum every single day.
        </p>
        <p className="mb-3 text-justify">
          Beyond Kalyan, DPBoss covers a wide range of popular markets including Madhur Matka, Sridevi Matka, Tara Matka, Star Matka, and Worli Matka. Players who follow madhur chart, sridevi chart, and tara satta matka results trust SattaMatkaDpboss.Mobi for the most current panna and jodi data available online. Our platform also serves players searching in regional languages including सट्टा मटका and मिलन मटका — making it one of the most inclusive and widely accessible Matka result sites in India.
        </p>
        <p className="text-justify">
          SattaMatkaDpboss.Mobi is also the go-to platform for players who search for satta matta matka 143, sattamatka 143, dpboss 143 guessing, golden matka, golden satta matka, and satta 143. Our free game zone, weekly jodi panna chart, and open to close daily tips make this platform the complete package for any serious Matka player. Bookmark SattaMatkaDpboss.Mobi today and get live matka updates, fast satta results, and free guessing tips delivered every single day without fail.
        </p>
      </div>
    </>
  );
}
