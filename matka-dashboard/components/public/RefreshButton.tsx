"use client";

export function RefreshButton({ label = "Refresh Result" }: { label?: string }) {
  return (
    <button
      onClick={() => window.location.reload()}
      className="font-bold hover:opacity-90"
      style={{
        background: "linear-gradient(0deg, rgba(195,138,34,0.99) 0%, rgba(253,246,45,0.998) 100%)",
        color: "#000",
        border: "1px solid #f7dc6f",
        borderRadius: "1rem",
        padding: "0.25rem 0.75rem",
        marginTop: "0.25rem",
        fontSize: "1.4rem",
        boxShadow: "0 0 15px #000",
        display: "inline-block",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
