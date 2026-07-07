"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/record", label: "Record" },
  { href: "/admin/live-results", label: "Live Result" },
  { href: "/admin/market-timings", label: "Market Timings" },
  { href: "/admin/live-update", label: "Top Live Update", accent: true },
  { href: "/admin/result-box-design", label: "Result Box Design" },
  { href: "/admin/design", label: "Home Page Design" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const linkClass = (l: { href: string; accent?: boolean }) => {
    if (l.accent) {
      return pathname === l.href
        ? "bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap"
        : "text-red-500 hover:text-white hover:bg-red-600 px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors";
    }
    return pathname === l.href
      ? "bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap"
      : "text-gray-300 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors";
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-2.5 md:px-6 shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between gap-4">
        <span className="font-bold text-lg tracking-wide shrink-0">
          <span className="text-blue-400">Matka</span> Admin
        </span>

        <button
          className="lg:hidden p-2 -mr-2"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block w-6 h-0.5 bg-white mb-1.5" />
          <span className="block w-6 h-0.5 bg-white mb-1.5" />
          <span className="block w-6 h-0.5 bg-white" />
        </button>

        <div className="hidden lg:flex items-center gap-1 flex-wrap">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l)}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex gap-3 items-center shrink-0">
          <Link href="/" className="text-gray-300 hover:text-white text-sm whitespace-nowrap">View Public →</Link>
          <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors">Logout</button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden flex flex-col gap-1 pt-3 pb-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={linkClass(l)}>
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-4 pt-3 border-t border-white/20 mt-2">
            <Link href="/" className="text-gray-300 hover:text-white text-sm" onClick={() => setOpen(false)}>View Public →</Link>
            <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-full text-sm font-semibold">Logout</button>
          </div>
        </div>
      )}
    </nav>
  );
}
