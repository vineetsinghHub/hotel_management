import { useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@/admin/components/AdminLayout";
import { housekeeping, statusColor } from "@/admin/adminMockData";
export default function Housekeeping() {
  const [rows, setRows] = useState(housekeeping);
  const setStatus = (id, to) => { setRows((s) => s.map((r) => r.id === id ? { ...r, status: to } : r)); toast.success(`Room ${rows.find((r) => r.id === id)?.number} → ${to}`); };
  return (
    <AdminLayout pageTitle="Housekeeping">
      <div className="bg-white rounded-[16px] border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-widest uppercase text-slate-400 bg-slate-50"><tr><th className="text-left px-5 py-3 font-medium">Room</th><th className="text-left font-medium">Type</th><th className="text-left font-medium">Status</th><th className="text-left font-medium">Attendant</th><th className="text-left font-medium">ETA</th><th className="text-left font-medium">Priority</th><th className="text-right px-5 font-medium">Actions</th></tr></thead>
          <tbody>
            {rows.map((r) => { const st = statusColor(r.status); return (
              <tr key={r.id} className="border-t border-slate-100" data-testid={`hk-${r.id}`}>
                <td className="px-5 py-3 font-serif text-lg text-slate-900">{r.number}</td>
                <td className="text-slate-600 text-xs">{r.type}</td>
                <td><span className={`text-[10px] px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>{st.label}</span></td>
                <td className="text-slate-700 text-xs">{r.attendant}</td>
                <td className="text-slate-500 text-xs font-mono">{r.eta}</td>
                <td><span className={`text-[10px] px-2 py-0.5 rounded-full ${r.priority === "high" ? "bg-rose-50 text-rose-700" : r.priority === "medium" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{r.priority}</span></td>
                <td className="px-5 text-right space-x-2">
                  <button onClick={() => setStatus(r.id, "clean")} className="text-xs px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50">Mark clean</button>
                  <button onClick={() => setStatus(r.id, "inspected")} className="text-xs px-3 py-1.5 rounded-full bg-[#4F46E5] text-white">Inspect</button>
                </td>
              </tr>);
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
