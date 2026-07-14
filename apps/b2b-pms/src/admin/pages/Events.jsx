import AdminLayout from "@aura/b2b-pms/admin/components/AdminLayout";
import ReadOnlyBanner, { useReadOnly } from "@aura/b2b-pms/admin/components/ReadOnlyBanner";
import { events } from "@aura/shared/admin/adminMockData";
import { toast } from "sonner";

export default function Events() {
  const readOnly = useReadOnly();

  return (
    <AdminLayout pageTitle="Events & Weddings">
      <ReadOnlyBanner />
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-eyebrow text-brand-accent">{events.length} contracted events</p>
          <h2 className="mt-1 font-serif text-2xl text-slate-900">Ceremonies, banquets & corporate offsites</h2>
        </div>
        {!readOnly && (
          <button
            onClick={() => toast.success("New event form opened")}
            className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-sm px-5 py-2.5 rounded-full shadow-[0_6px_20px_rgba(79,70,229,0.28)]"
            data-testid="new-event-btn"
          >
            <i className="fa-solid fa-plus text-[10px]"></i>New event
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((e) => (
          <div key={e.id} className="p-6 bg-white rounded-[16px] border border-slate-200" data-testid={`event-${e.id}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-eyebrow text-brand-accent">{e.type}</p>
                <h3 className="mt-1 font-serif text-2xl text-slate-900">{e.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <button
                    onClick={() => toast.success(`Edit form for ${e.title}`)}
                    className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50 grid place-items-center text-slate-500"
                    aria-label="Edit event"
                    data-testid={`edit-event-${e.id}`}
                  >
                    <i className="fa-solid fa-pen text-[10px]"></i>
                  </button>
                )}
                <span className="text-[10px] tracking-widest uppercase text-slate-400">{e.id}</span>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-[10px] tracking-widest uppercase text-slate-400">Date</p><p className="mt-1 font-mono text-slate-900">{e.date}</p></div>
              <div><p className="text-[10px] tracking-widest uppercase text-slate-400">Guests</p><p className="mt-1 font-mono text-slate-900">{e.guests}</p></div>
              <div><p className="text-[10px] tracking-widest uppercase text-slate-400">Venue</p><p className="mt-1 text-slate-900">{e.venue}</p></div>
              <div><p className="text-[10px] tracking-widest uppercase text-slate-400">Planner</p><p className="mt-1 text-slate-900">{e.planner}</p></div>
            </div>
            <div className="mt-5 pt-5 border-t border-slate-100 flex items-baseline justify-between">
              <span className="text-eyebrow text-slate-500">Contracted revenue</span>
              <span className="font-mono text-2xl text-slate-900">₹{(e.revenue / 100000).toFixed(1)}L</span>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
