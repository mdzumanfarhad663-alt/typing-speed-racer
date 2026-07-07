import { AdminNav } from "@/components/admin/AdminNav";
import { RowTable } from "@/components/admin/RowTable";

export default function MyGameAdmin() {
  return (
    <main className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-5xl mx-auto p-3 sm:p-8">
        <p className="text-sm text-gray-600 mb-3">
          All your game pages (Silon Day, Silon Night, …). Every game here shows in Live Matka Result.
          Use “+ Add row” to add a new game, and each game has its own Jodi chart and Panel chart pages.
        </p>
        <RowTable section="live_result" title="My Games" manualOnly />
      </div>
    </main>
  );
}
