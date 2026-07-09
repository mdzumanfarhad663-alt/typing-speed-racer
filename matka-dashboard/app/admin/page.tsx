import { AdminNav } from "@/components/admin/AdminNav";
import { ScrapeButton } from "@/components/admin/ScrapeButton";
import { LiveUpdateToggles } from "@/components/admin/LiveUpdateToggles";

export default function AdminHome() {
  return (
    <main className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-5xl mx-auto p-3 sm:p-8">
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
          <LiveUpdateToggles />
        </div>
      </div>
    </main>
  );
}
