"use client";
import { useEffect, useRef, useState } from "react";
import type { Row } from "@/lib/types";
import type { MarketTiming } from "@/lib/schema";

type Msg = { from: "bot" | "user"; text: string };

const WELCOME: Msg = {
  from: "bot",
  text: "👋 Hi! I am the site assistant. Ask me anything — e.g. \"Kalyan result\", \"market timings\", \"what is panel chart\", or type \"help\".",
};

const QUICK = ["Live results", "Market timings", "Today lucky ank", "Help"];

export function ChatBot({ games, timings, ank }: { games: Row[]; timings: MarketTiming[]; ank: { ank: string; finalAnk: string } | null }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open, typing]);

  function answer(q: string): string {
    const t = q.toLowerCase().trim();

    // Game result: match a game title mentioned in the question
    const game = games.find((g) => g.title && t.includes(g.title.toLowerCase()));
    if (game && /result|kya|what|show|aaya|update/.test(t + " result")) {
      const val = game.resultValue?.trim();
      return val
        ? `📊 ${game.title}: ${val}${game.timeRange ? ` ${game.timeRange}` : ""}`
        : `${game.title} result is not declared yet. Results update automatically — keep this page open.`;
    }

    if (/help|menu|what can/.test(t)) {
      return "I can tell you:\n• Any game result — type the game name (e.g. \"Kalyan result\")\n• \"market timings\" — open/close times\n• \"lucky ank\" — today's ank\n• \"panel chart\" / \"jodi chart\" — what they are\n• \"refresh\" — how results update";
    }

    if (/timing|time table|open time|close time|kab|schedule/.test(t)) {
      if (!timings.length) return "Market timing list is loading — please try again in a moment.";
      const lines = timings.slice(0, 10).map((m) => `• ${m.marketName}: ${m.openTime} – ${m.closeTime} (${m.status})`);
      return `🕐 Market timings:\n${lines.join("\n")}`;
    }

    if (/lucky|ank|number today|aaj ka/.test(t)) {
      if (ank?.ank || ank?.finalAnk) {
        return `🍀 Today's ank: ${ank.ank || "—"}${ank.finalAnk ? ` | Final ank: ${ank.finalAnk}` : ""}. Play responsibly!`;
      }
      return "Today's lucky ank is shown in the top band of the home page.";
    }

    if (/panel/.test(t)) {
      return "📋 A Panel chart shows each day's open panna, jodi and close panna, week by week. Open any game in the chart records section to see its full panel chart.";
    }

    if (/jodi/.test(t)) {
      return "🔢 A Jodi chart shows the 2-digit jodi for every day, week by week. The jodi comes from the open and close panna anks. Find jodi charts in the chart records section.";
    }

    if (/panna|patti/.test(t)) {
      return "A panna (patti) is a 3-digit number. Its ank = last digit of the digit sum (e.g. 368 → 3+6+8 = 17 → ank 7). There are 220 pannas in total.";
    }

    if (/refresh|update|live|auto/.test(t)) {
      return "🔄 Results refresh automatically every few seconds while the page is open — no need to reload. Panel and jodi chart pages also auto-refresh.";
    }

    if (/result/.test(t)) {
      const withResult = games.filter((g) => g.resultValue?.trim()).slice(0, 8);
      if (!withResult.length) return "Results are loading — one moment please.";
      return `📊 Latest results:\n${withResult.map((g) => `• ${g.title}: ${g.resultValue}`).join("\n")}\nType a game name for a specific result.`;
    }

    if (/contact|admin|owner|guess/.test(t)) {
      return "📞 See the contact / forum section further down the home page to reach the site team or post your guesses.";
    }

    if (/hi|hello|hey|salam|namaste/.test(t)) {
      return "Hello! 😊 Ask me about any game result, market timings, or charts. Type \"help\" to see what I can do.";
    }

    return "Sorry, I did not understand that. Type \"help\" to see what I can answer, or type a game name for its result.";
  }

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    setInput("");
    setMsgs((m) => [...m, { from: "user", text: q }]);
    // Typing indicator so the reply feels like a live chat
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "bot", text: answer(q) }]);
    }, 900);
  }

  return (
    <>
      <style>{`
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
        .cb-panel { animation: cb-slide-up 0.25s ease-out; }
        .cb-msg { animation: cb-msg-in 0.25s ease-out; }
        .cb-typing span { animation: cb-dot 1.2s infinite; }
        .cb-typing span:nth-child(2) { animation-delay: 0.15s; }
        .cb-typing span:nth-child(3) { animation-delay: 0.3s; }
      `}</style>

      {/* Floating toggle button (bottom-left; refresh button owns bottom-right) */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat with us"
        style={{ position: "fixed", bottom: "20px", left: "10px", zIndex: 60 }}
        className="cb-fab w-14 h-14 rounded-full flex items-center justify-center shadow-xl text-white"
      >
        {/* Pulsing ring behind the icon */}
        <span className="cb-ring absolute inset-0 rounded-full bg-blue-500" aria-hidden />
        <span
          className="absolute inset-0 rounded-full"
          style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
          aria-hidden
        />
        <span className="relative">
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.9 3 3 6.5 3 10.8c0 2.4 1.2 4.5 3.2 5.9-.1.8-.5 2-1.6 3.1-.2.2 0 .6.3.6 2 0 3.6-.9 4.5-1.6.8.2 1.7.3 2.6.3 5.1 0 9-3.5 9-7.8S17.1 3 12 3z" />
              <circle cx="8.5" cy="11" r="1.1" fill="#fff" />
              <circle cx="12" cy="11" r="1.1" fill="#fff" />
              <circle cx="15.5" cy="11" r="1.1" fill="#fff" />
            </svg>
          )}
        </span>
        {/* Online dot */}
        {!open && <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white" aria-hidden />}
      </button>

      {open && (
        <div
          style={{ position: "fixed", bottom: "84px", left: "10px", zIndex: 60 }}
          className="cb-panel w-[92vw] max-w-xs bg-white border border-gray-300 rounded-xl shadow-2xl flex flex-col overflow-hidden"
        >
          <div className="text-white px-3 py-2 text-sm font-bold flex items-center gap-2" style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}>
            <span className="relative flex w-2.5 h-2.5">
              <span className="cb-ring absolute inline-flex h-full w-full rounded-full bg-green-300" />
              <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-green-400" />
            </span>
            Live Chat — Site Assistant
          </div>
          <div ref={bodyRef} className="h-72 overflow-y-auto p-2 space-y-2 bg-gray-50">
            {msgs.map((m, i) => (
              <div key={i} className={`cb-msg flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-pre-line max-w-[85%] ${
                    m.from === "user" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="cb-msg flex justify-start">
                <div className="cb-typing bg-white border border-gray-200 rounded-lg px-3 py-2 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1 px-2 py-1.5 bg-gray-50 border-t border-gray-200">
            {QUICK.map((q) => (
              <button key={q} onClick={() => send(q)} className="text-[11px] border border-blue-300 text-blue-700 rounded-full px-2 py-0.5 hover:bg-blue-50">
                {q}
              </button>
            ))}
          </div>
          <form
            className="flex border-t border-gray-200"
            onSubmit={(e) => { e.preventDefault(); send(input); }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              className="flex-1 px-3 py-2 text-sm outline-none"
            />
            <button type="submit" className="bg-blue-700 text-white px-4 text-sm font-bold">Send</button>
          </form>
        </div>
      )}
    </>
  );
}
