import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { ScrapeButton } from "@/components/admin/ScrapeButton";

const sections = [
  { href: "/admin/lucky", title: "Lucky Number Band", desc: "Ank / Final Ank cards at top." },
  { href: "/admin/live-update", title: "Live Update", desc: "Highlighted live games (auto-synced from source + manual entries with drag reorder)." },
  { href: "/admin/live-results", title: "Live Matka Result", desc: "Main list of result cards with Jodi/Panel tags." },
  { href: "/admin/free-zone", title: "Open to Close Free Game Zone", desc: "Bottom forecast block with date + tips." },
];

export default function AdminHome() {
  return (
    <main className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

        {/* Auto-sync from source site */}
        <div className="bg-white border border-blue-200 rounded p-5 mb-8">
          <h2 className="font-bold text-lg mb-1">Auto-Sync Results</h2>
          <p className="text-sm text-gray-600 mb-3">
            Click to pull the latest game results from the source site and update Live Results automatically.
          </p>
          <ScrapeButton />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {sections.map((s) => (
            <Link key={s.href} href={s.href} className="bg-white border border-gray-300 rounded p-6 hover:shadow-md hover:border-black transition">
              <h2 className="font-bold text-lg mb-2">{s.title}</h2>
              <p className="text-sm text-gray-600">{s.desc}</p>
              <div className="mt-4 text-blue-700 underline text-sm">Manage rows →</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
