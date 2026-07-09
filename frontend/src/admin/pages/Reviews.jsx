import { useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@/admin/components/AdminLayout";
import { reviews } from "@/admin/adminMockData";
export default function Reviews() {
  const [rows, setRows] = useState(reviews);
  const respond = (id) => { setRows((s) => s.map((r) => r.id === id ? { ...r, responded: true } : r)); toast.success("Response posted"); };
  return (
    <AdminLayout pageTitle="Reviews">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">Overall rating</p><p className="mt-2 font-mono text-3xl text-slate-900">4.98<span className="text-base text-slate-500"> /5</span></p></div>
        <div className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">Reviews · 30d</p><p className="mt-2 font-mono text-3xl text-slate-900">148</p></div>
        <div className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">Response rate</p><p className="mt-2 font-mono text-3xl text-emerald-600">92%</p></div>
        <div className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">Awaiting reply</p><p className="mt-2 font-mono text-3xl text-rose-600">{rows.filter((r) => !r.responded).length}</p></div>
      </div>
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.id} className="p-6 bg-white rounded-[16px] border border-slate-200" data-testid={`rev-${r.id}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-slate-100 grid place-items-center font-serif text-slate-700">{r.guest[0]}</span>
                  <div>
                    <p className="text-slate-900 font-medium">{r.guest}</p>
                    <p className="text-[10px] text-slate-500 tracking-widest uppercase">{r.channel} · {r.date}</p>
                  </div>
                </div>
              </div>
              <div className="flex text-[#C9A227]">{Array.from({ length: 5 }).map((_, i) => <i key={i} className={`fa-solid fa-star text-xs ${i < r.rating ? "" : "text-slate-200"}`}></i>)}</div>
            </div>
            <p className="mt-4 font-serif text-lg text-slate-900">&ldquo;{r.title}&rdquo;</p>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{r.body}</p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              {r.responded ? <p className="text-xs text-emerald-600"><i className="fa-solid fa-check mr-1"></i>Responded</p> : <p className="text-xs text-rose-600"><i className="fa-solid fa-clock mr-1"></i>Awaiting response</p>}
              {!r.responded && <button onClick={() => respond(r.id)} className="text-xs bg-[#4F46E5] text-white px-4 py-2 rounded-full" data-testid={`respond-${r.id}`}>Respond</button>}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
