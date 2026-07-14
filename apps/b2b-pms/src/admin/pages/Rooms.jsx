import AdminLayout from "@aura/b2b-pms/admin/components/AdminLayout";
import { roomsInventory, statusColor } from "@aura/shared/admin/adminMockData";

export default function Rooms() {
  return (
    <AdminLayout pageTitle="Rooms & Inventory">
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
        {["clean","dirty","inspected","occupied","ooo"].map((s) => {
          const n = roomsInventory.filter((r) => r.status === s).length; const st = statusColor(s);
          return <div key={s} className={`p-4 rounded-[14px] ${st.bg} border border-transparent`}><p className={`text-[10px] tracking-widest uppercase ${st.text}`}>{st.label}</p><p className="mt-2 font-mono text-3xl text-slate-900">{n}</p></div>;
        })}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {roomsInventory.map((r) => { const st = statusColor(r.status); return (
          <div key={r.id} className="p-4 bg-white rounded-[14px] border border-slate-200 hover:border-slate-300" data-testid={`room-${r.id}`}>
            <div className="flex items-center justify-between"><p className="font-serif text-2xl text-slate-900">{r.number}</p><span className={`text-[9px] px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>{st.label}</span></div>
            <p className="mt-1 text-xs text-slate-500">{r.type}</p>
            <p className="text-[10px] text-slate-400 mt-3 tracking-widest uppercase">Floor {r.floor}</p>
            <p className="mt-1 font-mono text-sm text-slate-900">₹{(r.rate/1000).toFixed(0)}K<span className="text-xs text-slate-500"> /nt</span></p>
            {r.guest !== "—" && <p className="mt-2 text-[10px] text-slate-500 truncate">👤 {r.guest}</p>}
          </div>
        );})}
      </div>
    </AdminLayout>
  );
}
