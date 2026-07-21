"use client";

/** Normal browser time input. value/onChange use "HH:MM" (24h), same as a native <input type="time">. */
export function EasyTimePicker({
  label,
  value,
  disabled,
  onChange,
}: {
  label?: string;
  value: string;
  disabled?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-1.5">
      {label && <span className="text-xs font-semibold text-gray-600 shrink-0">{label}</span>}
      <input
        type="time"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-md px-1.5 py-1 text-sm bg-white"
        aria-label={label || "Time"}
      />
    </label>
  );
}
