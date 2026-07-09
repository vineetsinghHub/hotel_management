import AdminLayout from "@/admin/components/AdminLayout";
import { guests } from "@/admin/adminMockData";
const tierColor = (t) => ({ Diamond: "#8B5CF6", Platinum: "#4F46E5", Gold: "#C9A227", Silver: "#94A3B8" }[t] || "#64748B");
export default function Guests() {
  return (
    <AdminLayout pageTitle="Guests · CRM">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">Total Guests</p><p className="mt-2 font-mono text-3xl text-slate-900">{guests.length * 152}</p></div>
        <div className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">Platinum+ Members</p><p className="mt-2 font-mono text-3xl text-[#4F46E5]">142</p></div>
        <div className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">Repeat rate</p><p className="mt-2 font-mono text-3xl text-emerald-600">68%</p></div>
        <div className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">Avg lifetime value</p><p className="mt-2 font-mono text-3xl text-slate-900">₹2.4L</p></div>
      </div>
      <div className="bg-white rounded-[16px] border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-widest uppercase text-slate-400 bg-slate-50">
            <tr><th className="text-left px-5 py-3 font-medium">Guest</th><th className="text-left font-medium">Tier</th><th className="text-left font-medium">Stays</th><th className="text-left font-medium">Spend</th><th className="text-left font-medium">Country</th><th className="text-left font-medium">Last stay</th></tr>
          </thead>
          <tbody>
            {guests.map((g) => (
              <tr key={g.id} className="border-t border-slate-100 hover:bg-slate-50" data-testid={`guest-${g.id}`}>
                <td className="px-5 py-3"><p className="text-slate-900">{g.name}</p><p className="text-[10px] text-slate-500 font-mono">{g.id} · {g.email}</p></td>
                <td><span className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: tierColor(g.tier) }}>{g.tier}</span></td>
                <td className="font-mono text-slate-900">{g.stays}</td>
                <td className="font-mono text-slate-900">₹{(g.spend/1000).toFixed(0)}K</td>
                <td className="text-slate-600 text-xs">{g.country}</td>
                <td className="text-slate-500 text-xs">{g.lastStay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
