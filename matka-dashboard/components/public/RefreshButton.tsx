"use client";

export function RefreshButton({ label = "Refresh Result" }: { label?: string }) {
  return (
    <button
      onClick={() => window.location.reload()}
      className="bg-gradient-to-b from-yellow-700 to-yellow-900 text-white italic font-bold px-6 py-2 rounded-full border border-black shadow-md hover:opacity-90"
    >
      {label}
    </button>
  );
}
