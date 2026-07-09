import { useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@/admin/components/AdminLayout";
import { arrivals, statusColor } from "@/admin/adminMockData";

export default function FrontDesk() {
  const [rows, setRows] = useState(arrivals);
  const check = (id, to) => { setRows((s) => s.map((r) => r.id === id ? { ...r, status: to } : r)); toast.success(`Reservation ${id} → ${to.replace("_"," ")}`); };
  return (
    <AdminLayout pageTitle="Front Desk">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { l: "Arrivals today", v: 12, c: "#4F46E5" },
          { l: "Departures today", v: 7, c: "#F43F5E" },
          { l: "Awaiting check-in", v: 4, c: "#C9A227" },
          { l: "Walk-ins", v: 2, c: "#10B981" },
        ].map((k) => <div key={k.l} className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">{k.l}</p><p className="mt-2 font-mono text-3xl text-slate-900" style={{ color: k.c }}>{k.v}</p></div>)}
      </div>
      <div className="bg-white rounded-[16px] border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div><p className="text-eyebrow text-[#C9A227]">Today&apos;s activity</p><h3 className="mt-1 font-serif text-xl text-slate-900">Arrivals & Departures</h3></div>
        </div>
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-widest uppercase text-slate-400"><tr><th className="text-left px-5 py-3 font-medium">Guest</th><th className="text-left font-medium">Room</th><th className="text-left font-medium">Dates</th><th className="text-left font-medium">Status</th><th className="text-right px-5 font-medium">Action</th></tr></thead>
          <tbody>
            {rows.map((a) => { const st = statusColor(a.status); return (
              <tr key={a.id} className="border-t border-slate-100" data-testid={`fd-row-${a.id}`}>
                <td className="px-5 py-3"><p className="text-slate-900">{a.guest}</p><p className="text-[10px] text-slate-500 font-mono">{a.id}</p></td>
                <td><p className="text-slate-900">{a.room}</p><p className="text-[10px] text-slate-500">{a.roomType}</p></td>
                <td className="text-slate-600 text-xs">{a.checkIn} — {a.checkOut}</td>
                <td><span className={`text-[10px] px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>{st.label}</span></td>
                <td className="px-5 text-right space-x-2">
                  {a.status === "confirmed" && <button onClick={() => check(a.id, "checked_in")} className="text-xs px-3 py-1.5 rounded-full bg-[#4F46E5] text-white" data-testid={`checkin-${a.id}`}>Check in</button>}
                  {a.status === "checked_in" && <button onClick={() => check(a.id, "checked_out")} className="text-xs px-3 py-1.5 rounded-full bg-slate-900 text-white" data-testid={`checkout-${a.id}`}>Check out</button>}
                  <button onClick={() => toast.info("Folio opened")} className="text-xs px-3 py-1.5 rounded-full border border-slate-200">Folio</button>
                </td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
