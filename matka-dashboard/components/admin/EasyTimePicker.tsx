"use client";
import { useState } from "react";

// "HH:MM" (24h) <-> simple 12h Hour / Minute / AM-PM parts, so admins pick
// from three short dropdowns instead of fighting a native time-wheel input.
export function to12h(hhmm: string): { hour: string; minute: string; ampm: "AM" | "PM" } {
  if (!hhmm) return { hour: "", minute: "", ampm: "AM" };
  const [h, m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12;
  return { hour: String(hour12), minute: String(m).padStart(2, "0"), ampm };
}

export function to24h(hour: string, minute: string, ampm: "AM" | "PM"): string {
  if (!hour || !minute) return "";
  let h = Number(hour) % 12;
  if (ampm === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${minute}`;
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

/** Hour / Minute / AM-PM dropdown trio. Calls onChange(v) with a "HH:MM" (24h) string, or "" if incomplete. */
export function EasyTimePicker({
  label,
  value: hhmm,
  disabled,
  onChange,
}: {
  label?: string;
  value: string;
  disabled?: boolean;
  onChange: (v: string) => void;
}) {
  const parsed = to12h(hhmm);
  const [hour, setHour] = useState(parsed.hour);
  const [minute, setMinute] = useState(parsed.minute);
  const [ampm, setAmpm] = useState<"AM" | "PM">(parsed.ampm);

  function commit(nextHour: string, nextMinute: string, nextAmpm: "AM" | "PM") {
    onChange(to24h(nextHour, nextMinute, nextAmpm));
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {label && <span className="text-xs font-semibold text-gray-600 shrink-0">{label}</span>}
      <select
        value={hour}
        disabled={disabled}
        className="border border-gray-300 rounded-md px-1.5 py-1 text-sm bg-white"
        aria-label={label ? `${label} hour` : "Hour"}
        onChange={(e) => {
          setHour(e.target.value);
          const m = minute || "00";
          if (!minute) setMinute(m);
          commit(e.target.value, m, ampm);
        }}
      >
        <option value="">--</option>
        {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
      </select>
      <span className="text-gray-400">:</span>
      <select
        value={minute}
        disabled={disabled}
        className="border border-gray-300 rounded-md px-1.5 py-1 text-sm bg-white"
        aria-label={label ? `${label} minute` : "Minute"}
        onChange={(e) => { setMinute(e.target.value); commit(hour, e.target.value, ampm); }}
      >
        <option value="">--</option>
        {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <select
        value={ampm}
        disabled={disabled}
        className="border border-gray-300 rounded-md px-1.5 py-1 text-sm bg-white font-semibold"
        aria-label={label ? `${label} AM/PM` : "AM/PM"}
        onChange={(e) => { const v = e.target.value as "AM" | "PM"; setAmpm(v); commit(hour, minute, v); }}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}
