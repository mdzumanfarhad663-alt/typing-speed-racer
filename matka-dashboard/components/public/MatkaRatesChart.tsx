"use client";
import { useState } from "react";
import { DEFAULT_MATKA_RATE_ROWS, rateAmount, type MatkaRateRow } from "@/lib/matkaRates";

// Static "Matka Rates Chart" section: what each game variation pays per 1/-.
// Viewer-side translate toggle: English (default), Hindi, Bangla.
type Lang = "en" | "hi" | "bn";

const T = {
  en: {
    title: "MATKA RATES CHART",
    intro: (
      <>
        <b>Matka Rate</b> is the rate paid to the player if the number played exactly matches the
        result (win). There are 5 variations of the game — Singles, Jodi, Pana, Half Sangam and
        Sangam — and each variation has its own rate.
      </>
    ),
    headers: ["Game Type", "Rate", "Payout"],
    names: {} as Record<string, string>,
    payout: (n: string) => `You get ${n}/- for every 1/- played`,
    halfSangamSuffix: " (A and B pay the same)",
    note: "Pana note: the result pana is always exactly one of SP, DP or TP — never two or all three. You are paid as per the rate of that pana type.",
  },
  hi: {
    title: "मटका रेट चार्ट",
    intro: (
      <>
        <b>मटका रेट</b> वह दर है जो खिलाड़ी को तब मिलती है जब खेला गया नंबर रिज़ल्ट से बिल्कुल मेल
        खाता है (जीत)। खेल की 5 किस्में हैं — सिंगल्स, जोड़ी, पन्ना, हाफ संगम और संगम — और हर किस्म
        की अपनी रेट होती है।
      </>
    ),
    headers: ["गेम का प्रकार", "रेट", "भुगतान"],
    names: {
      "Singles (Ank)": "सिंगल्स (अंक)",
      "Jodi (Pair/Bracket)": "जोड़ी (पेयर/ब्रैकेट)",
      "Single Pana (SP)": "सिंगल पन्ना (SP)",
      "Double Pana (DP)": "डबल पन्ना (DP)",
      "Triple Pana (TP)": "ट्रिपल पन्ना (TP)",
      "Half Sangam": "हाफ संगम",
      "Sangam": "संगम",
    } as Record<string, string>,
    payout: (n: string) => `हर 1/- पर ${n}/- मिलते हैं`,
    halfSangamSuffix: " (A और B की रेट समान)",
    note: "पन्ना नोट: रिज़ल्ट पन्ना हमेशा SP, DP या TP में से सिर्फ एक होता है — दो या तीनों कभी नहीं। भुगतान उसी पन्ना प्रकार की रेट से होता है।",
  },
  bn: {
    title: "মটকা রেট চার্ট",
    intro: (
      <>
        <b>মটকা রেট</b> হলো সেই হার যা খেলোয়াড় পায় যখন খেলা নম্বর রেজাল্টের সাথে হুবহু মিলে যায়
        (জয়)। খেলার ৫টি ধরন আছে — সিঙ্গেলস, জোড়ি, পান্না, হাফ সঙ্গম ও সঙ্গম — প্রতিটির নিজস্ব রেট।
      </>
    ),
    headers: ["গেমের ধরন", "রেট", "পেআউট"],
    names: {
      "Singles (Ank)": "সিঙ্গেলস (অঙ্ক)",
      "Jodi (Pair/Bracket)": "জোড়ি (পেয়ার/ব্র্যাকেট)",
      "Single Pana (SP)": "সিঙ্গেল পান্না (SP)",
      "Double Pana (DP)": "ডাবল পান্না (DP)",
      "Triple Pana (TP)": "ট্রিপল পান্না (TP)",
      "Half Sangam": "হাফ সঙ্গম",
      "Sangam": "সঙ্গম",
    } as Record<string, string>,
    payout: (n: string) => `প্রতি 1/- এ ${n}/- পাবেন`,
    halfSangamSuffix: " (A ও B একই রেট)",
    note: "পান্না নোট: রেজাল্ট পান্না সবসময় SP, DP বা TP-এর মধ্যে ঠিক একটিই হয় — কখনো দুটি বা তিনটি নয়। সেই পান্না ধরনের রেট অনুযায়ীই পেমেন্ট হয়।",
  },
} as const;

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिंदी" },
  { code: "bn", label: "বাংলা" },
];

export function MatkaRatesChart({ rateRows = DEFAULT_MATKA_RATE_ROWS }: { rateRows?: MatkaRateRow[] }) {
  const [lang, setLang] = useState<Lang>("en");
  const t = T[lang];
  const rows = rateRows.map((r) => {
    // Default game names translate; custom admin-added names show as typed.
    const game = t.names[r.game] ?? r.game;
    const isHalfSangam = /half\s*sangam/i.test(r.game);
    return [game, r.rate, t.payout(rateAmount(r.rate)) + (isHalfSangam ? t.halfSangamSuffix : "")] as const;
  });
  return (
    <section className="header-box my-[7px]">
      <div className="py-4 px-2 sm:px-6 text-center">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "#0000ff" }}>
            {t.title}
          </h2>
          <div className="inline-flex rounded-full border border-blue-300 bg-white p-0.5" role="group" aria-label="Translate">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full font-semibold transition-colors ${
                  lang === l.code ? "bg-blue-700 text-white" : "text-blue-700 hover:bg-blue-100"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs sm:text-sm mt-2 mb-4">{t.intro}</p>
        <div className="overflow-x-auto">
          <table className="w-full max-w-2xl mx-auto border-collapse bg-white text-sm sm:text-base">
            <thead>
              <tr>
                {t.headers.map((h) => (
                  <th key={h} className="border-2 border-black bg-black text-white px-2 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r[0]} style={{ background: i % 2 ? "#f5fffa" : "#ffffff" }}>
                  <td className="border border-gray-400 px-2 py-2 font-bold text-left sm:text-center" style={{ color: "#0000ff" }}>{r[0]}</td>
                  <td className="border border-gray-400 px-2 py-2 font-bold whitespace-nowrap" style={{ color: "#ff0000" }}>{r[1]}</td>
                  <td className="border border-gray-400 px-2 py-2 text-xs sm:text-sm">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] sm:text-xs mt-3 text-gray-700">{t.note}</p>
      </div>
    </section>
  );
}
