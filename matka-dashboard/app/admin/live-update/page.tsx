import { AdminNav } from "@/components/admin/AdminNav";
import { RowTable } from "@/components/admin/RowTable";

export default function LiveUpdateAdmin() {
  return (
    <main className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-5xl mx-auto p-8">
        <p className="text-sm text-gray-500 mb-4">
          Rows with <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs">auto</span> badge are synced from the source site — their result value updates automatically on Refresh.
          Manually added rows are never overwritten.
        </p>
        <RowTable section="live_update" />
      </div>
    </main>
  );
}
