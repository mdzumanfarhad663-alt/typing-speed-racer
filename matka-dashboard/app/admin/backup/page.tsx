import { AdminNav } from "@/components/admin/AdminNav";
import { BackupManager } from "@/components/admin/BackupManager";

export default function BackupAdmin() {
  return (
    <main className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-5xl mx-auto p-3 sm:p-8">
        <h1 className="text-3xl font-bold mb-4">Backup</h1>
        <BackupManager />
      </div>
    </main>
  );
}
