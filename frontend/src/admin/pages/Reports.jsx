import AdminLayout from "@/admin/components/AdminLayout";
export default function Reports() {
  const bars = [12, 18, 14, 22, 28, 32, 30, 38, 42, 39, 45, 52];
  return (
    <AdminLayout pageTitle="Reports & Analytics">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { l: "RevPAR", v: "₹7,760", d: "+18%", c: "#4F46E5" },
          { l: "ADR", v: "₹8,920", d: "+12%", c: "#C9A227" },
          { l: "Occupancy", v: "87%", d: "+6pp", c: "#10B981" },
          { l: "GOP Margin", v: "42%", d: "+3pp", c: "#F97316" },
        ].map((k) => <div key={k.l} className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">{k.l}</p><p className="mt-2 font-mono text-3xl text-slate-900">{k.v}</p><p className="text-xs text-emerald-600 mt-1">{k.d} YoY</p></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-6 bg-white rounded-[16px] border border-slate-200">
          <p className="text-eyebrow text-[#C9A227]">Monthly revenue</p>
          <h3 className="mt-1 font-serif text-xl text-slate-900">Rolling 12 months</h3>
          <div className="mt-6 flex items-end gap-2 h-48">
            {bars.map((b, i) => <div key={i} className="flex-1 bg-gradient-to-t from-[#4F46E5]/70 to-[#4F46E5] rounded-t-[4px]" style={{ height: `${(b/52)*100}%` }}></div>)}
          </div>
        </div>
        <div className="p-6 bg-white rounded-[16px] border border-slate-200">
          <p className="text-eyebrow text-[#C9A227]">Revenue by segment</p>
          <h3 className="mt-1 font-serif text-xl text-slate-900">This year</h3>
          <ul className="mt-5 space-y-3">
            {[
              { l: "Rooms", v: 62, c: "#4F46E5" },
              { l: "F&B", v: 22, c: "#F97316" },
              { l: "Spa", v: 8, c: "#EC4899" },
              { l: "Events", v: 5, c: "#C9A227" },
              { l: "Retail", v: 3, c: "#10B981" },
            ].map((s) => (
              <li key={s.l}>
                <div className="flex items-center justify-between text-sm mb-1"><span className="text-slate-700">{s.l}</span><span className="font-mono text-slate-900">{s.v}%</span></div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${s.v}%`, backgroundColor: s.c }}></div></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
