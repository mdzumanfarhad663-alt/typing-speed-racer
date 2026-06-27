import { AdminNav } from "@/components/admin/AdminNav";
import { RowTable } from "@/components/admin/RowTable";

export default function LiveResultsAdmin() {
  return (
    <main className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-5xl mx-auto p-8">
        <RowTable section="live_result" />
      </div>
    </main>
  );
}
