"use client";
import { useEffect, useRef, useState } from "react";
import type { Row } from "@/lib/types";
import type { MarketTiming } from "@/lib/schema";

type Msg = { from: "bot" | "user"; text: string };
type Lang = "en" | "hi" | "bn";

// All bot text in the three supported languages.
const T = {
  en: {
    header: "Live Chat",
    sub: "Site Assistant • Online",
    welcome: '👋 Hi! I am the site assistant. Ask me anything — e.g. "Kalyan result", "market timings", "what is panel chart", or type "help".',
    quick: ["Live results", "Market timings", "Lucky ank", "Help"],
    placeholder: "Type your question…",
    send: "Send",
    notDeclared: (g: string) => `${g} result is not declared yet. Results update automatically — keep this page open.`,
    help: 'I can tell you:\n• Any game result — type the game name (e.g. "Kalyan result")\n• "market timings" — open/close times\n• "lucky ank" — today\'s ank\n• "panel chart" / "jodi chart" — what they are\n• "refresh" — how results update',
    timingsLoading: "Market timing list is loading — please try again in a moment.",
    timingsTitle: "🕐 Market timings:",
    luckyToday: (a: string, f: string) => `🍀 Today's ank: ${a}${f ? ` | Final ank: ${f}` : ""}. Play responsibly!`,
    luckyWhere: "Today's lucky ank is shown in the top band of the home page.",
    panel: "📋 A Panel chart shows each day's open panna, jodi and close panna, week by week. Open any game in the chart records section to see its full panel chart.",
    jodi: "🔢 A Jodi chart shows the 2-digit jodi for every day, week by week. The jodi comes from the open and close panna anks. Find jodi charts in the chart records section.",
    panna: "A panna (patti) is a 3-digit number. Its ank = last digit of the digit sum (e.g. 368 → 3+6+8 = 17 → ank 7). There are 220 pannas in total.",
    refresh: "🔄 Results refresh automatically every few seconds while the page is open — no need to reload. Panel and jodi chart pages also auto-refresh.",
    resultsLoading: "Results are loading — one moment please.",
    latest: "📊 Latest results:",
    typeGame: "Type a game name for a specific result.",
    contact: "📞 See the contact / forum section further down the home page to reach the site team or post your guesses.",
    hello: 'Hello! 😊 Ask me about any game result, market timings, or charts. Type "help" to see what I can do.',
    fallback: 'Sorry, I did not understand that. Type "help" to see what I can answer, or type a game name for its result.',
  },
  hi: {
    header: "लाइव चैट",
    sub: "साइट सहायक • ऑनलाइन",
    welcome: '👋 नमस्ते! मैं साइट सहायक हूँ। कुछ भी पूछें — जैसे "Kalyan result", "market timing", "panel chart क्या है", या "help" लिखें।',
    quick: ["लाइव रिज़ल्ट", "मार्केट टाइमिंग", "लकी अंक", "मदद"],
    placeholder: "अपना सवाल लिखें…",
    send: "भेजें",
    notDeclared: (g: string) => `${g} का रिज़ल्ट अभी घोषित नहीं हुआ है। रिज़ल्ट अपने आप अपडेट होते हैं — पेज खुला रखें।`,
    help: 'मैं बता सकता हूँ:\n• किसी भी गेम का रिज़ल्ट — गेम का नाम लिखें (जैसे "Kalyan result")\n• "market timing" — खुलने/बंद होने का समय\n• "लकी अंक" — आज का अंक\n• "panel chart" / "jodi chart" — ये क्या हैं\n• "refresh" — रिज़ल्ट कैसे अपडेट होते हैं',
    timingsLoading: "मार्केट टाइमिंग लोड हो रही है — थोड़ी देर में फिर कोशिश करें।",
    timingsTitle: "🕐 मार्केट टाइमिंग:",
    luckyToday: (a: string, f: string) => `🍀 आज का अंक: ${a}${f ? ` | फाइनल अंक: ${f}` : ""}। समझदारी से खेलें!`,
    luckyWhere: "आज का लकी अंक होम पेज के ऊपर वाले बैंड में दिखता है।",
    panel: "📋 पैनल चार्ट में हर दिन का ओपन पन्ना, जोड़ी और क्लोज़ पन्ना हफ्ते-दर-हफ्ते दिखता है। चार्ट रिकॉर्ड सेक्शन में किसी भी गेम का पूरा पैनल चार्ट देखें।",
    jodi: "🔢 जोड़ी चार्ट में हर दिन की 2-अंकों की जोड़ी हफ्ते-दर-हफ्ते दिखती है। जोड़ी ओपन और क्लोज़ पन्ने के अंक से बनती है। जोड़ी चार्ट, चार्ट रिकॉर्ड सेक्शन में हैं।",
    panna: "पन्ना (पत्ती) 3 अंकों की संख्या है। इसका अंक = अंकों के योग का आखिरी अंक (जैसे 368 → 3+6+8 = 17 → अंक 7)। कुल 220 पन्ने होते हैं।",
    refresh: "🔄 पेज खुला रहने पर रिज़ल्ट हर कुछ सेकंड में अपने आप अपडेट होते हैं — रीलोड की ज़रूरत नहीं। पैनल और जोड़ी चार्ट पेज भी ऑटो-रिफ्रेश होते हैं।",
    resultsLoading: "रिज़ल्ट लोड हो रहे हैं — एक पल रुकें।",
    latest: "📊 ताज़ा रिज़ल्ट:",
    typeGame: "किसी गेम का रिज़ल्ट देखने के लिए उसका नाम लिखें।",
    contact: "📞 साइट टीम से संपर्क करने या अपनी गेसिंग पोस्ट करने के लिए होम पेज पर नीचे संपर्क/फोरम सेक्शन देखें।",
    hello: 'नमस्ते! 😊 किसी भी गेम का रिज़ल्ट, मार्केट टाइमिंग या चार्ट के बारे में पूछें। "help" लिखकर देखें कि मैं क्या-क्या कर सकता हूँ।',
    fallback: 'माफ़ कीजिए, मैं समझ नहीं पाया। "help" लिखें या किसी गेम का नाम लिखकर उसका रिज़ल्ट पूछें।',
  },
  bn: {
    header: "লাইভ চ্যাট",
    sub: "সাইট সহকারী • অনলাইন",
    welcome: '👋 হ্যালো! আমি সাইট সহকারী। যেকোনো কিছু জিজ্ঞেস করুন — যেমন "Kalyan result", "market timing", "panel chart কী", অথবা "help" লিখুন।',
    quick: ["লাইভ রেজাল্ট", "মার্কেট টাইমিং", "লাকি অঙ্ক", "সাহায্য"],
    placeholder: "আপনার প্রশ্ন লিখুন…",
    send: "পাঠান",
    notDeclared: (g: string) => `${g}-এর রেজাল্ট এখনো ঘোষণা হয়নি। রেজাল্ট নিজে থেকেই আপডেট হয় — পেজটি খোলা রাখুন।`,
    help: 'আমি জানাতে পারি:\n• যেকোনো গেমের রেজাল্ট — গেমের নাম লিখুন (যেমন "Kalyan result")\n• "market timing" — খোলা/বন্ধের সময়\n• "লাকি অঙ্ক" — আজকের অঙ্ক\n• "panel chart" / "jodi chart" — এগুলো কী\n• "refresh" — রেজাল্ট কীভাবে আপডেট হয়',
    timingsLoading: "মার্কেট টাইমিং লোড হচ্ছে — একটু পরে আবার চেষ্টা করুন।",
    timingsTitle: "🕐 মার্কেট টাইমিং:",
    luckyToday: (a: string, f: string) => `🍀 আজকের অঙ্ক: ${a}${f ? ` | ফাইনাল অঙ্ক: ${f}` : ""}। বুঝে খেলুন!`,
    luckyWhere: "আজকের লাকি অঙ্ক হোম পেজের উপরের ব্যান্ডে দেখা যায়।",
    panel: "📋 প্যানেল চার্টে প্রতিদিনের ওপেন পান্না, জোড়ি ও ক্লোজ পান্না সপ্তাহ ধরে দেখা যায়। চার্ট রেকর্ড সেকশনে যেকোনো গেমের পুরো প্যানেল চার্ট দেখুন।",
    jodi: "🔢 জোড়ি চার্টে প্রতিদিনের ২-অঙ্কের জোড়ি সপ্তাহ ধরে দেখা যায়। জোড়ি আসে ওপেন ও ক্লোজ পান্নার অঙ্ক থেকে। জোড়ি চার্ট পাবেন চার্ট রেকর্ড সেকশনে।",
    panna: "পান্না (পাত্তি) হলো ৩ অঙ্কের সংখ্যা। এর অঙ্ক = অঙ্কগুলোর যোগফলের শেষ অঙ্ক (যেমন 368 → 3+6+8 = 17 → অঙ্ক 7)। মোট 220টি পান্না আছে।",
    refresh: "🔄 পেজ খোলা থাকলে রেজাল্ট কয়েক সেকেন্ড পরপর নিজে থেকেই আপডেট হয় — রিলোড লাগে না। প্যানেল ও জোড়ি চার্ট পেজও অটো-রিফ্রেশ হয়।",
    resultsLoading: "রেজাল্ট লোড হচ্ছে — একটু অপেক্ষা করুন।",
    latest: "📊 সর্বশেষ রেজাল্ট:",
    typeGame: "নির্দিষ্ট রেজাল্ট দেখতে গেমের নাম লিখুন।",
    contact: "📞 সাইট টিমের সাথে যোগাযোগ বা গেসিং পোস্ট করতে হোম পেজের নিচে কন্টাক্ট/ফোরাম সেকশন দেখুন।",
    hello: 'হ্যালো! 😊 যেকোনো গেমের রেজাল্ট, মার্কেট টাইমিং বা চার্ট নিয়ে জিজ্ঞেস করুন। "help" লিখে দেখুন আমি কী কী পারি।',
    fallback: 'দুঃখিত, বুঝতে পারিনি। "help" লিখুন, অথবা গেমের নাম লিখে তার রেজাল্ট জিজ্ঞেস করুন।',
  },
} as const;

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिंदी" },
  { code: "bn", label: "বাংলা" },
];

export function ChatBot({ games, timings, ank }: { games: Row[]; timings: MarketTiming[]; ank: { ank: string; finalAnk: string } | null }) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: T.en.welcome }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open, typing]);

  function switchLang(l: Lang) {
    setLang(l);
    setMsgs((m) => [...m, { from: "bot", text: T[l].welcome }]);
  }

  function answer(q: string): string {
    const t = q.toLowerCase().trim();
    const s = T[lang];

    const game = games.find((g) => g.title && t.includes(g.title.toLowerCase()));
    if (game) {
      const val = game.resultValue?.trim();
      return val ? `📊 ${game.title}: ${val}${game.timeRange ? ` ${game.timeRange}` : ""}` : s.notDeclared(game.title);
    }

    if (/help|menu|what can|মদদ|সাহায্য|मदद/.test(t)) return s.help;

    if (/timing|time table|open time|close time|kab|schedule|টাইমিং|সময়|टाइमिंग|समय/.test(t)) {
      if (!timings.length) return s.timingsLoading;
      const lines = timings.slice(0, 10).map((m) => `• ${m.marketName}: ${m.openTime} – ${m.closeTime} (${m.status})`);
      return `${s.timingsTitle}\n${lines.join("\n")}`;
    }

    if (/lucky|ank|number today|aaj ka|লাকি|অঙ্ক|आज का|अंक/.test(t)) {
      if (ank?.ank || ank?.finalAnk) return s.luckyToday(ank.ank || "—", ank.finalAnk || "");
      return s.luckyWhere;
    }

    if (/panel|প্যানেল|पैनल/.test(t)) return s.panel;
    if (/jodi|জোড়ি|जोड़ी/.test(t)) return s.jodi;
    if (/panna|patti|পান্না|पन्ना/.test(t)) return s.panna;
    if (/refresh|update|live|auto|রিফ্রেশ|रिफ्रेश/.test(t)) return s.refresh;

    if (/result|রেজাল্ট|रिज़ल्ट|रिजल्ट/.test(t)) {
      const withResult = games.filter((g) => g.resultValue?.trim()).slice(0, 8);
      if (!withResult.length) return s.resultsLoading;
      return `${s.latest}\n${withResult.map((g) => `• ${g.title}: ${g.resultValue}`).join("\n")}\n${s.typeGame}`;
    }

    if (/contact|admin|owner|guess|যোগাযোগ|संपर्क/.test(t)) return s.contact;
    if (/^(hi|hello|hey|salam|namaste|নমস্কার|হ্যালো|नमस्ते)\b/.test(t)) return s.hello;

    return s.fallback;
  }

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    setInput("");
    setMsgs((m) => [...m, { from: "user", text: q }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "bot", text: answer(q) }]);
    }, 900);
  }

  const s = T[lang];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cb-pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          80% { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes cb-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes cb-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes cb-slide-up {
          from { transform: translateY(16px) scale(0.96); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes cb-msg-in {
          from { transform: translateY(8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .cb-fab { animation: cb-float 3s ease-in-out infinite; }
        .cb-fab:hover { animation-play-state: paused; }
        .cb-ring { animation: cb-pulse-ring 2s ease-out infinite; }
        .cb-panel { animation: cb-slide-up 0.25s ease-out; font-family: Segoe UI, system-ui, sans-serif; }
        .cb-msg { animation: cb-msg-in 0.25s ease-out; }
        .cb-typing span { animation: cb-dot 1.2s infinite; }
        .cb-typing span:nth-child(2) { animation-delay: 0.15s; }
        .cb-typing span:nth-child(3) { animation-delay: 0.3s; }
        .cb-body { background: linear-gradient(160deg, #eef2ff 0%, #f8fafc 60%, #eff6ff 100%); }
        .cb-body::-webkit-scrollbar { width: 5px; }
        .cb-body::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 99px; }
        .cb-bubble-bot { box-shadow: 0 1px 3px rgba(30, 64, 175, 0.08); }
        .cb-bubble-user { box-shadow: 0 2px 6px rgba(37, 99, 235, 0.35); }
      ` }} />

      {/* Floating toggle button (bottom-left; refresh button owns bottom-right) */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat with us"
        style={{ position: "fixed", bottom: "8px", left: "10px", zIndex: 60 }}
        className="cb-fab w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-xl text-white"
      >
        <span className="cb-ring absolute inset-0 rounded-full bg-blue-500" aria-hidden />
        <span className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }} aria-hidden />
        <span className="relative">
          {open ? (
            <svg className="w-4 h-4 sm:w-[22px] sm:h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg className="w-5 h-5 sm:w-[26px] sm:h-[26px]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.9 3 3 6.5 3 10.8c0 2.4 1.2 4.5 3.2 5.9-.1.8-.5 2-1.6 3.1-.2.2 0 .6.3.6 2 0 3.6-.9 4.5-1.6.8.2 1.7.3 2.6.3 5.1 0 9-3.5 9-7.8S17.1 3 12 3z" />
              <circle cx="8.5" cy="11" r="1.1" fill="#fff" />
              <circle cx="12" cy="11" r="1.1" fill="#fff" />
              <circle cx="15.5" cy="11" r="1.1" fill="#fff" />
            </svg>
          )}
        </span>
        {!open && <span className="absolute top-0 right-0 sm:top-0.5 sm:right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400 border-2 border-white" aria-hidden />}
      </button>

      {open && (
        <div
          style={{ position: "fixed", left: "10px", zIndex: 60 }}
          className="cb-panel bottom-[54px] sm:bottom-[66px] w-[94vw] max-w-sm bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-indigo-100"
        >
          {/* Header with avatar + language switcher */}
          <div className="px-3 py-2.5 flex items-center gap-2.5" style={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)" }}>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg shrink-0">🤖</div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-sm leading-tight">{s.header}</div>
              <div className="text-blue-100 text-[11px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                {s.sub}
              </div>
            </div>
            <div className="flex rounded-full bg-white/15 p-0.5" role="group" aria-label="Translate">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => switchLang(l.code)}
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold transition-colors ${
                    lang === l.code ? "bg-white text-blue-700" : "text-white hover:bg-white/20"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div ref={bodyRef} className="cb-body h-80 overflow-y-auto p-3 space-y-2.5">
            {msgs.map((m, i) => (
              <div key={i} className={`cb-msg flex items-end gap-1.5 ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                {m.from === "bot" && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] shrink-0 text-white" style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}>
                    🤖
                  </div>
                )}
                <div
                  className={`px-3.5 py-2 text-[13px] leading-relaxed whitespace-pre-line max-w-[82%] ${
                    m.from === "user"
                      ? "cb-bubble-user text-white rounded-2xl rounded-br-md"
                      : "cb-bubble-bot bg-white text-gray-800 rounded-2xl rounded-bl-md border border-indigo-50"
                  }`}
                  style={m.from === "user" ? { background: "linear-gradient(135deg, #2563eb, #4f46e5)" } : undefined}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="cb-msg flex items-end gap-1.5 justify-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] shrink-0 text-white" style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}>
                  🤖
                </div>
                <div className="cb-typing cb-bubble-bot bg-white border border-indigo-50 rounded-2xl rounded-bl-md px-3.5 py-2.5 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                </div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          <div className="flex flex-wrap gap-1.5 px-3 py-2 bg-white border-t border-indigo-50">
            {s.quick.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-[11px] font-semibold border border-indigo-200 text-indigo-700 rounded-full px-2.5 py-1 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <form className="flex items-center gap-2 px-2.5 py-2 border-t border-indigo-100 bg-white" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={s.placeholder}
              className="flex-1 px-3.5 py-2 text-[13px] rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              type="submit"
              aria-label={s.send}
              className="w-9 h-9 rounded-full text-white flex items-center justify-center shrink-0 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4l17.8-8a.5.5 0 000-.9L3.4 3.6a.5.5 0 00-.7.6L5 11l9 1-9 1-2.3 6.8a.5.5 0 00.7.6z" /></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
