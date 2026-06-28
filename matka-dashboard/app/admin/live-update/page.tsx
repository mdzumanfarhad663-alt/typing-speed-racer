import { AdminNav } from "@/components/admin/AdminNav";
import { RowTable } from "@/components/admin/RowTable";

export default function LiveUpdateAdmin() {
  return (
    <main className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-2">📡 Top Live Update</h1>
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6 text-sm text-blue-900">
          <strong>How it works:</strong>
          <ul className="list-disc ml-5 mt-1 space-y-1">
            <li>Rows with the <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs font-semibold">auto</span> badge are synced from the source site — their result updates automatically when you click Refresh from Source.</li>
            <li>Rows you add manually are <strong>never overwritten</strong> by the scraper.</li>
            <li>Any game added here (manual or auto) also appears in the <strong>Live Matka Result</strong> list automatically.</li>
            <li>Drag the ⋮⋮ handle to reorder games in the Live Update band.</li>
          </ul>
        </div>
        <RowTable section="live_update" />
      </div>
    </main>
  );
}
