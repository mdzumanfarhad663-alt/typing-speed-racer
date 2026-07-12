"use client";
import { useEffect, useState } from "react";

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Avoid a server/client mismatch: render nothing until mounted.
  if (!now) return null;

  const time = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });

  return (
    <div
      className="absolute top-2 right-2 sm:top-3 sm:right-4 bg-black/80 text-white rounded-full px-3 py-1 text-xs sm:text-sm font-bold tracking-wide"
      style={{ fontFamily: "monospace" }}
    >
      🕒 {time}
    </div>
  );
}
