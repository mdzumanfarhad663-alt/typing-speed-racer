"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/lucky", label: "Lucky Number" },
  { href: "/admin/live-update", label: "Top Live Update" },
  { href: "/admin/live-results", label: "Live Results" },
  { href: "/admin/market-timings", label: "Market Timings" },
  { href: "/admin/design", label: "Design" },
  { href: "/admin/result-box-design", label: "Result Box Design" },
  { href: "/admin/record", label: "Record" },
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

  return (
    <nav className="bg-black text-white px-4 py-3 md:px-6">
      <div className="flex items-center justify-between md:gap-6">
        <span className="font-bold">Matka Admin</span>

        <button
          className="md:hidden p-2 -mr-2"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block w-6 h-0.5 bg-white mb-1.5" />
          <span className="block w-6 h-0.5 bg-white mb-1.5" />
          <span className="block w-6 h-0.5 bg-white" />
        </button>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={pathname === l.href ? "underline font-semibold" : "opacity-80 hover:opacity-100"}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex ml-auto gap-4 items-center">
          <Link href="/" className="opacity-80 hover:opacity-100 text-sm">View Public →</Link>
          <button onClick={logout} className="bg-red-600 px-3 py-1 rounded text-sm font-semibold">Logout</button>
        </div>
      </div>

      {open && (
        <div className="md:hidden flex flex-col gap-3 pt-4 pb-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={pathname === l.href ? "underline font-semibold" : "opacity-80 hover:opacity-100"}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-4 pt-2 border-t border-white/20 mt-1">
            <Link href="/" className="opacity-80 hover:opacity-100 text-sm" onClick={() => setOpen(false)}>View Public →</Link>
            <button onClick={logout} className="bg-red-600 px-3 py-1 rounded text-sm font-semibold">Logout</button>
          </div>
        </div>
      )}
    </nav>
  );
}
