"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/lucky", label: "Lucky Number" },
  { href: "/admin/live-update", label: "Top Live Update" },
  { href: "/admin/live-results", label: "Live Results" },
  { href: "/admin/free-zone", label: "Free Zone" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="bg-black text-white px-6 py-3 flex items-center gap-6">
      <span className="font-bold">Matka Admin</span>
      {links.map((l) => (
        <Link key={l.href} href={l.href} className={pathname === l.href ? "underline font-semibold" : "opacity-80 hover:opacity-100"}>
          {l.label}
        </Link>
      ))}
      <div className="ml-auto flex gap-4 items-center">
        <Link href="/" className="opacity-80 hover:opacity-100 text-sm">View Public →</Link>
        <button onClick={logout} className="bg-red-600 px-3 py-1 rounded text-sm font-semibold">Logout</button>
      </div>
    </nav>
  );
}
