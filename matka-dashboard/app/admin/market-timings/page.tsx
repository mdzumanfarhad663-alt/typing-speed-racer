import { AdminNav } from "@/components/admin/AdminNav";
import { MarketTimingTable } from "@/components/admin/MarketTimingTable";

export default function MarketTimingsAdmin() {
  return (
    <main className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-5xl mx-auto p-3 sm:p-8">
        <MarketTimingTable />
      </div>
    </main>
  );
}
