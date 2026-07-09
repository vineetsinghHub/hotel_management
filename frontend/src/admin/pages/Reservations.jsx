import { useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@/admin/components/AdminLayout";
import { arrivals, statusColor } from "@/admin/adminMockData";

export default function Reservations() {
  const [f, setF] = useState("all");
  const [q, setQ] = useState("");
  const rows = arrivals.filter((a) => (f === "all" || a.status === f) && (!q || a.guest.toLowerCase().includes(q.toLowerCase()) || a.id.toLowerCase().includes(q.toLowerCase())));
  return (
    <AdminLayout pageTitle="Reservations">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 flex-1 min-w-64">
          <i className="fa-solid fa-magnifying-glass text-xs text-slate-400"></i>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by guest or reservation ID..." className="flex-1 text-sm outline-none" data-testid="res-search" />
        </div>
        {["all","confirmed","checked_in","checked_out"].map((k) => (
          <button key={k} onClick={() => setF(k)} className={`px-4 py-2 text-xs rounded-full capitalize ${f === k ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600"}`} data-testid={`filter-${k}`}>{k.replace("_"," ")}</button>
        ))}
        <button onClick={() => toast.success("New reservation form opened")} className="ml-auto bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs px-4 py-2 rounded-full">+ Reservation</button>
      </div>
      <div className="bg-white rounded-[16px] border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-widest uppercase text-slate-400 bg-slate-50">
            <tr><th className="text-left px-5 py-3 font-medium">Reservation</th><th className="text-left font-medium">Guest</th><th className="text-left font-medium">Room</th><th className="text-left font-medium">Dates</th><th className="text-left font-medium">Status</th><th className="text-right px-5 font-medium">Total</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => { const st = statusColor(r.status); return (
              <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50" data-testid={`res-${r.id}`}>
                <td className="px-5 py-3 font-mono text-slate-900">{r.id}</td>
                <td>{r.guest}</td><td>{r.room} <span className="text-slate-500 text-xs">· {r.roomType}</span></td>
                <td className="text-slate-600 text-xs">{r.checkIn} — {r.checkOut}</td>
                <td><span className={`text-[10px] px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>{st.label}</span></td>
                <td className="px-5 text-right font-mono text-slate-900">₹{(r.total/1000).toFixed(1)}K</td>
              </tr>);
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
