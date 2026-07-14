import { useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@/admin/components/AdminLayout";
import ReadOnlyBanner, { useReadOnly } from "@/admin/components/ReadOnlyBanner";
import ServiceClosurePanel from "@/admin/components/ServiceClosurePanel";
import { menuItems } from "@/admin/adminMockData";
import { useTenant } from "@/tenants/TenantProvider";
export default function Restaurant() {
  const { tenant } = useTenant();
  const slug = tenant?.slug || "aura";
  const [items, setItems] = useState(menuItems);
  const [cat, setCat] = useState("All");
  const readOnly = useReadOnly();
  const cats = ["All", ...new Set(menuItems.map((m) => m.category))];
  const vis = items.filter((m) => cat === "All" || m.category === cat);
  const toggle = (id) => {
    if (readOnly) { toast.error("Read-only mode — updates disabled"); return; }
    setItems((s) => s.map((m) => m.id === id ? { ...m, active: !m.active } : m));
    toast.success("Menu updated");
  };
  return (
    <AdminLayout pageTitle="Restaurant · Menu">
      <ReadOnlyBanner />
      <div className="mb-6">
        <ServiceClosurePanel tenantSlug={slug} service="dining" />
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {cats.map((c) => <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-full text-xs ${cat === c ? "bg-slate-900 text-white" : "bg-white border border-slate-200"}`} data-testid={`cat-${c}`}>{c}</button>)}
        {!readOnly && <button className="ml-auto text-xs bg-[#4F46E5] text-white px-4 py-2 rounded-full" data-testid="new-dish-btn">+ New dish</button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vis.map((m) => (
          <div key={m.id} className="p-5 bg-white rounded-[16px] border border-slate-200" data-testid={`menu-${m.id}`}>
            <div className="flex items-start justify-between">
              <div><p className="font-serif text-xl text-slate-900">{m.name}</p><p className="text-[10px] tracking-widest uppercase text-slate-500 mt-1">{m.category}</p></div>
              <button onClick={() => toggle(m.id)} disabled={readOnly} className={`w-10 h-5 rounded-full relative ${readOnly ? "opacity-50 cursor-not-allowed" : ""} ${m.active ? "bg-[#4F46E5]" : "bg-slate-200"}`}><span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${m.active ? "left-[22px]" : "left-0.5"}`}></span></button>
            </div>
            <p className="mt-3 text-xs text-slate-500">{m.ingredients}</p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-baseline justify-between">
              <div><p className="text-[10px] tracking-widest uppercase text-slate-400">Price</p><p className="font-mono text-lg text-slate-900">₹{(m.price/100).toFixed(0)}</p></div>
              <div className="text-right"><p className="text-[10px] tracking-widest uppercase text-slate-400">Cost</p><p className="font-mono text-sm text-slate-500">₹{(m.cost/100).toFixed(0)}</p></div>
              <div className="text-right"><p className="text-[10px] tracking-widest uppercase text-slate-400">Margin</p><p className="font-mono text-sm text-emerald-600">{Math.round((1 - m.cost / m.price) * 100)}%</p></div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
