import { AdminNav } from "@/components/admin/AdminNav";
import { RowTable } from "@/components/admin/RowTable";

export default function FreeZoneAdmin() {
  return (
    <main className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-5xl mx-auto p-3 sm:p-8">
        <RowTable section="free_zone" />
      </div>
    </main>
  );
}
