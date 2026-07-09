import AdminLayout from "@/admin/components/AdminLayout";
import { campaigns, statusColor } from "@/admin/adminMockData";
export default function Marketing() {
  return (
    <AdminLayout pageTitle="Marketing">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">Subscribers</p><p className="mt-2 font-mono text-3xl text-slate-900">18,240</p></div>
        <div className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">Avg open rate</p><p className="mt-2 font-mono text-3xl text-emerald-600">38.4%</p></div>
        <div className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">Attributed revenue</p><p className="mt-2 font-mono text-3xl text-slate-900">₹73L</p></div>
        <div className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">Active promo codes</p><p className="mt-2 font-mono text-3xl text-slate-900">6</p></div>
      </div>
      <div className="bg-white rounded-[16px] border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-serif text-xl text-slate-900">Campaigns</h3>
          <button className="text-xs bg-[#4F46E5] text-white px-4 py-2 rounded-full">+ New campaign</button>
        </div>
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-widest uppercase text-slate-400"><tr><th className="text-left px-5 py-3 font-medium">Campaign</th><th className="text-right font-medium">Audience</th><th className="text-right font-medium">Sent</th><th className="text-right font-medium">Opens</th><th className="text-right font-medium">Clicks</th><th className="text-right font-medium">Bookings</th><th className="text-right font-medium">Revenue</th><th className="text-center font-medium">Status</th></tr></thead>
          <tbody>
            {campaigns.map((c) => { const st = statusColor(c.status); return (
              <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50" data-testid={`camp-${c.id}`}>
                <td className="px-5 py-3"><p className="text-slate-900">{c.name}</p><p className="text-[10px] text-slate-500">{c.sent}</p></td>
                <td className="text-right font-mono">{c.audience.toLocaleString()}</td>
                <td className="text-right font-mono">{c.sent === "—" ? "—" : c.audience.toLocaleString()}</td>
                <td className="text-right font-mono">{c.opens.toLocaleString()}</td>
                <td className="text-right font-mono">{c.clicks.toLocaleString()}</td>
                <td className="text-right font-mono text-emerald-600">{c.bookings}</td>
                <td className="text-right font-mono text-slate-900">₹{(c.revenue/100000).toFixed(1)}L</td>
                <td className="text-center"><span className={`text-[10px] px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>{st.label}</span></td>
              </tr>);
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
