"use client";
import { useState } from "react";

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
    rows: [
      ["Singles (Ank)", "1:9", "You get 9/- for every 1/- played"],
      ["Jodi (Pair/Bracket)", "1:90", "You get 90/- for every 1/- played"],
      ["Single Pana (SP)", "1:140", "You get 140/- for every 1/- played"],
      ["Double Pana (DP)", "1:280", "You get 280/- for every 1/- played"],
      ["Triple Pana (TP)", "1:600", "You get 600/- for every 1/- played"],
      ["Half Sangam", "1:1400", "You get 1400/- for every 1/- played (A and B pay the same)"],
      ["Sangam", "1:15000", "You get 15000/- for every 1/- played"],
    ],
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
    rows: [
      ["सिंगल्स (अंक)", "1:9", "हर 1/- पर 9/- मिलते हैं"],
      ["जोड़ी (पेयर/ब्रैकेट)", "1:90", "हर 1/- पर 90/- मिलते हैं"],
      ["सिंगल पन्ना (SP)", "1:140", "हर 1/- पर 140/- मिलते हैं"],
      ["डबल पन्ना (DP)", "1:280", "हर 1/- पर 280/- मिलते हैं"],
      ["ट्रिपल पन्ना (TP)", "1:600", "हर 1/- पर 600/- मिलते हैं"],
      ["हाफ संगम", "1:1400", "हर 1/- पर 1400/- मिलते हैं (A और B की रेट समान)"],
      ["संगम", "1:15000", "हर 1/- पर 15000/- मिलते हैं"],
    ],
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
    rows: [
      ["সিঙ্গেলস (অঙ্ক)", "1:9", "প্রতি 1/- এ 9/- পাবেন"],
      ["জোড়ি (পেয়ার/ব্র্যাকেট)", "1:90", "প্রতি 1/- এ 90/- পাবেন"],
      ["সিঙ্গেল পান্না (SP)", "1:140", "প্রতি 1/- এ 140/- পাবেন"],
      ["ডাবল পান্না (DP)", "1:280", "প্রতি 1/- এ 280/- পাবেন"],
      ["ট্রিপল পান্না (TP)", "1:600", "প্রতি 1/- এ 600/- পাবেন"],
      ["হাফ সঙ্গম", "1:1400", "প্রতি 1/- এ 1400/- পাবেন (A ও B একই রেট)"],
      ["সঙ্গম", "1:15000", "প্রতি 1/- এ 15000/- পাবেন"],
    ],
    note: "পান্না নোট: রেজাল্ট পান্না সবসময় SP, DP বা TP-এর মধ্যে ঠিক একটিই হয় — কখনো দুটি বা তিনটি নয়। সেই পান্না ধরনের রেট অনুযায়ীই পেমেন্ট হয়।",
  },
} as const;

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिंदी" },
  { code: "bn", label: "বাংলা" },
];

export function MatkaRatesChart() {
  const [lang, setLang] = useState<Lang>("en");
  const t = T[lang];
  return (
    <section className="header-box my-4">
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
              {t.rows.map((r, i) => (
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
