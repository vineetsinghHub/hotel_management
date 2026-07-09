import AdminLayout from "@/admin/components/AdminLayout";
import { events } from "@/admin/adminMockData";
export default function Events() {
  return (
    <AdminLayout pageTitle="Events & Weddings">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((e) => (
          <div key={e.id} className="p-6 bg-white rounded-[16px] border border-slate-200" data-testid={`event-${e.id}`}>
            <div className="flex items-start justify-between">
              <div><p className="text-eyebrow text-[#C9A227]">{e.type}</p><h3 className="mt-1 font-serif text-2xl text-slate-900">{e.title}</h3></div>
              <span className="text-[10px] tracking-widest uppercase text-slate-400">{e.id}</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-[10px] tracking-widest uppercase text-slate-400">Date</p><p className="mt-1 font-mono text-slate-900">{e.date}</p></div>
              <div><p className="text-[10px] tracking-widest uppercase text-slate-400">Guests</p><p className="mt-1 font-mono text-slate-900">{e.guests}</p></div>
              <div><p className="text-[10px] tracking-widest uppercase text-slate-400">Venue</p><p className="mt-1 text-slate-900">{e.venue}</p></div>
              <div><p className="text-[10px] tracking-widest uppercase text-slate-400">Planner</p><p className="mt-1 text-slate-900">{e.planner}</p></div>
            </div>
            <div className="mt-5 pt-5 border-t border-slate-100 flex items-baseline justify-between">
              <span className="text-eyebrow text-slate-500">Contracted revenue</span>
              <span className="font-mono text-2xl text-slate-900">₹{(e.revenue/100000).toFixed(1)}L</span>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
