"use client";
import { useState } from "react";

type FAQItem = { q: string; a: string };

const FAQ1: FAQItem[] = [
  { q: "What are the primary mechanics and rules of the classic Matka game?", a: "The classic Matka game involves picking a number between 0 and 9 for both an opening and closing draw. The two digits form a Jodi (pair) and three-digit Panna. Results are declared twice daily. Players win based on how accurately they predicted the Single, Jodi or Panna combination." },
  { q: "How do participants select digits and calculate card combinations?", a: "Players choose any digit from 0 to 9 for the open draw and another for the close draw. The sum of three randomly picked digits gives the final single digit. For example, if you pick 1, 2, 3 — the sum is 6, so the open result is 1+2+3=6. The three digits combined form the Panna (123) and the single digit (6)." },
  { q: "What crucial parameters should you evaluate before exploring online markets?", a: "Before playing any online Matka market, verify the platform's result update speed, chart history depth, reputation among players, and whether it is completely free. SattaMatkaDpboss.Mobi has been trusted since 2012 for fast, free, and accurate results across 50+ markets." },
  { q: "How do numbered slips and draw outcomes determine a winner?", a: "In the traditional format, numbered chits were drawn from a matka (earthen pot). Today, the draw is managed by market organizers and declared at fixed times. Your selection is compared against the declared result — if your Single, Jodi or Panna matches, you win based on the applicable payout rate." },
  { q: "Can expert guessing forums guarantee consistent victories in speculative games?", a: "No guessing forum can guarantee wins. Forums and guessing experts share pattern-based predictions drawn from historical chart data and open/close trends. They are starting points for informed decisions, not certainties. Always treat guessing tips as community insights, not guaranteed outcomes." },
  { q: "How does community engagement influence digital search variations?", a: "When millions of players search for terms like 'kalyan matka result today', 'dpboss 143', or 'satta matta matka', they shape the most searched keywords in the Matka ecosystem. Community engagement drives faster result coverage, more guessing forum activity, and wider chart record availability on platforms like DPBoss." },
  { q: "How has modern internet infrastructure affected historical lottery systems?", a: "The internet transformed Matka from a localized street game into a nationwide digital system. Results that once took hours to spread across cities now reach every mobile screen within seconds. Platforms like SattaMatkaDpboss.Mobi provide instant results, 68+ years of chart records, and free guessing — all of which were impossible before digital infrastructure." },
];

const FAQ_MAIN: FAQItem[] = [
  { q: "Q1. WHAT IS DPBOSS AND WHY DO MILLIONS OF PLAYERS VISIT IT EVERY DAY?", a: "DPBoss is one of India's oldest and most trusted Satta Matka result platforms, running since 2012. It covers 50 plus Matka markets including Kalyan, Milan, Rajdhani, Time Bazar and Main Bazar — all updated the moment results are declared. No login required, no payment, no membership. That is exactly why millions of players bookmark SattaMatkaDpboss.Mobi and come back every single day." },
  { q: "Q2. WHAT IS KALYAN MATKA AND WHEN DOES ITS RESULT COME?", a: "Kalyan Matka is India's most popular and most followed Satta Matka market, started in 1962 by Kalyanji Bhagat. The Kalyan result is declared twice a day — once in the evening and once at night. On DPBoss, the Kalyan result is updated the moment it is declared, making it the fastest and most reliable place to check Kalyan Matka result online." },
  { q: "Q3. WHAT IS SATTA MATKA AND HOW DOES IT WORK?", a: "Satta Matka is a number-based game that originated in India in the 1960s. Players select digits between 0 and 9, form combinations, and wait for the official result to match their selection. The game has different bet types including Single, Jodi and Panna. Today, DPBoss publishes live results for all major Matka markets so players across India can check outcomes instantly from their mobile phone." },
  { q: "Q4. WHAT IS THE DIFFERENCE BETWEEN JODI, PANNA AND SINGLE IN SATTA MATKA?", a: "Single means any one digit between 0 and 9. Jodi means a pair of two digits between 00 and 99, for example 45 or 72. Panna or Patti is a three-digit combination like 128 or 356. Every Matka market declares all three types in each result session. DPBoss displays Single, Jodi and Panna clearly for every market on the same page in real time." },
  { q: "Q5. WHAT IS OPEN TO CLOSE IN SATTA MATKA?", a: "Open To Close, also known as OTC, is a prediction method where players try to predict both the opening digit and the closing digit of a Matka market session. Knowing the right open and close significantly narrows down Jodi and Panna selection. DPBoss updates Fix 3 Ank Open To Close free for all major markets twice daily — day markets by 2 PM and night markets by 8 PM." },
  { q: "Q6. WHAT IS THE 220 PATTI CHART IN SATTA MATKA?", a: "In Satta Matka there are exactly 220 valid three-digit numbers known as Panna or Patti. Every result panel number must come from this fixed set of 220 combinations. These numbers are grouped digit-wise from 0 to 9 based on the sum of their digits. DPBoss provides the complete All Panna Record on a dedicated page, available free for all players with no login needed." },
  { q: "Q7. IS EVERYTHING ON SATTAMATKADPBOSS.MOBI COMPLETELY FREE?", a: "Yes, absolutely everything on SattaMatkaDpboss.Mobi is 100% free. Live results, Jodi charts, Panel charts, Weekly Jodi Panna predictions, Open To Close daily tips, 220 Patti record and Guessing Forum — all of it is available without any payment, registration or membership fees since 2012." },
  { q: "Q8. HOW QUICKLY DOES DPBOSS UPDATE SATTA MATKA RESULTS?", a: "DPBoss updates every Satta Matka result the moment it is officially declared by the respective market — zero delay. Among all Satta Matka result platforms in India, DPBoss is widely recognized as one of the fastest. The site is also optimized for mobile and loads quickly even on slow internet, which is why it remains the first choice for players across every state in India." },
];

const FAQ3: FAQItem[] = [
  { q: "What is DP Boss 143 and what updates does it provide?", a: "DP Boss 143 is the expert-level prediction tag used by the DPBoss guessing community. The number 143 signals a high-confidence fix jodi or panel tip. Updates include daily fix jodi predictions for Kalyan, Milan and Main Bazar, open/close guessing numbers, and weekly panna tips — all free, all on SattaMatkaDpboss.Mobi." },
  { q: "What is DPBoss and how does it work?", a: "DPBoss is India's most visited Satta Matka result platform. It aggregates live results from all major markets, updates them the moment they are declared, and presents them alongside free chart records, guessing forum tips, and weekly jodi panna predictions. No login, no fee, no delay." },
  { q: "What is Kalyan Matka and how are its results declared?", a: "Kalyan Matka is a six-day-a-week market started by Kalyanji Bhagat in 1962. The market organizer declares the open result at 3:45 PM and the close result at 5:45 PM. DPBoss publishes the Kalyan result the moment it is officially announced — making it the fastest Kalyan result platform in India." },
  { q: "Where can I find today's live results for all major markets?", a: "All live results are available right here on SattaMatkaDpboss.Mobi. The page auto-updates the moment each market declares its result. You can find Kalyan, Milan Day, Milan Night, Rajdhani Day, Rajdhani Night, Main Bazar, Time Bazar, Sridevi, Madhur and all other major markets on the same page." },
  { q: "What is the history behind the online transformation of Satta Matka?", a: "Satta Matka began as a street-based betting game in 1960s Mumbai. Ratan Khatri formalized the draw system using earthen pots (matkas). As internet connectivity spread across India in the 2000s, result platforms moved online. DPBoss launched in 2012 and has been at the forefront of digital Matka result delivery ever since." },
  { q: "Is SattaMatkaDpboss.Mobi a reliable DP Boss Net alternative?", a: "SattaMatkaDpboss.Mobi is not an alternative — it is the original and most trusted DPBoss platform. Running since 2012, it is the go-to source for dpboss matka, dp boss net, and dpboss satta results. Every result, every chart, every guessing tip on this site is free and updated in real time." },
];

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
                fontStyle: "italic",
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
                fontStyle: "italic",
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

export function FaqSection() {
  return (
    <>
      {/* Section 1 — simple bullet accordion */}
      <div className="my-4" style={{ border: "1px solid #dc1f44", background: "#fff" }}>
        <Accordion items={FAQ1} bulletStyle />
      </div>

      {/* Section 2 — colored header + Q1-Q8 */}
      <div className="my-4">
        <div
          className="text-center py-3 px-4"
          style={{
            background: "linear-gradient(90deg, #000030 0%, #0d0d7a 50%, #000030 100%)",
            borderTop: "3px solid #f00",
            borderBottom: "3px solid #f00",
          }}
        >
          <span
            className="font-bold italic text-sm sm:text-base"
            style={{ color: "#ffd700", textShadow: "1px 1px 2px #000", letterSpacing: "1px" }}
          >
            FREQUENTLY ASKED QUESTIONS — SATTA MATKA DPBOSS
          </span>
        </div>
        <div style={{ border: "1px solid #dc1f44", background: "#fff" }}>
          <Accordion items={FAQ_MAIN} />
        </div>
      </div>

      {/* Section 3 — second bullet accordion */}
      <div className="my-4" style={{ border: "1px solid #dc1f44", background: "#fff" }}>
        <Accordion items={FAQ3} bulletStyle />
      </div>

      {/* Section 4 — plain text + nav links */}
      <div
        className="my-4 px-4 py-4 text-sm"
        style={{ background: "#fff", color: "#000", fontStyle: "italic", lineHeight: 1.8 }}
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
