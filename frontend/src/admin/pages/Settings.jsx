import { useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@/admin/components/AdminLayout";
export default function Settings() {
  const [prop, setProp] = useState({ name: "Aura Hotels", tagline: "Timeless Heritage & Luxury", currency: "INR", timezone: "Asia/Kolkata", language: "English", taxRate: 18 });
  const [ints, setInts] = useState({ stripe: true, gmail: true, whatsapp: false, google_analytics: true, booking_com: true });
  return (
    <AdminLayout pageTitle="Settings">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-white rounded-[16px] border border-slate-200">
            <p className="text-eyebrow text-[#C9A227]">Property</p>
            <h3 className="mt-1 font-serif text-xl text-slate-900">Basic information</h3>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { k: "name", l: "Property name" }, { k: "tagline", l: "Tagline" },
                { k: "currency", l: "Currency" }, { k: "timezone", l: "Timezone" },
                { k: "language", l: "Default language" }, { k: "taxRate", l: "Tax rate (%)" },
              ].map((f) => (
                <div key={f.k}>
                  <label className="text-eyebrow text-slate-500">{f.l}</label>
                  <input value={prop[f.k]} onChange={(e) => setProp({...prop, [f.k]: e.target.value})} className="mt-2 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5]" data-testid={`prop-${f.k}`} />
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end"><button onClick={() => toast.success("Property settings saved")} className="px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm" data-testid="save-property">Save</button></div>
          </div>
          <div className="p-6 bg-white rounded-[16px] border border-slate-200">
            <p className="text-eyebrow text-[#C9A227]">Integrations</p>
            <h3 className="mt-1 font-serif text-xl text-slate-900">Connected services</h3>
            <div className="mt-4 divide-y divide-slate-100">
              {Object.entries(ints).map(([k, v]) => (
                <div key={k} className="py-4 flex items-center justify-between">
                  <div><p className="text-sm text-slate-900 capitalize">{k.replace(/_/g, " ")}</p><p className="text-xs text-slate-500">{v ? "Connected" : "Not connected"}</p></div>
                  <button onClick={() => { setInts({...ints, [k]: !v}); toast.success(`${k} ${!v ? "connected" : "disconnected"}`); }} className={`w-10 h-5 rounded-full relative ${v ? "bg-[#4F46E5]" : "bg-slate-200"}`} data-testid={`int-${k}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${v ? "left-[22px]" : "left-0.5"}`}></span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="p-6 bg-white rounded-[16px] border border-slate-200">
            <p className="text-eyebrow text-[#C9A227]">Audit</p>
            <h3 className="mt-1 font-serif text-xl text-slate-900">Activity log</h3>
            <ul className="mt-4 space-y-3 text-xs">
              {[
                ["Anjali Desai", "changed role of Ravi Menon → Front Desk", "2 min ago"],
                ["Sunita Rao", "downloaded INV-2026-0092", "18 min ago"],
                ["Meera Kaur", "marked Room 106 inspected", "24 min ago"],
                ["Karan Malhotra", "sent 'Diwali Preview' campaign", "1 h ago"],
              ].map(([w, d, t], i) => (
                <li key={i} className="pb-3 border-b border-slate-100 last:border-0">
                  <p className="text-slate-900">{w}</p>
                  <p className="text-slate-500">{d}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{t}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
