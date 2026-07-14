import { useMemo, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@aura/b2b-pms/admin/components/AdminLayout";
import ServiceClosurePanel from "@aura/b2b-pms/admin/components/ServiceClosurePanel";
import { auditLog, AUDIT_ACTION_LABELS } from "@aura/shared/admin/adminMockData";
import { ROLES, roleLabel, roleColor } from "@aura/shared/admin/roles";
import { TIERS, getTier, setTier as persistTier } from "@aura/shared/admin/tier";
import { ProBadge } from "@aura/b2b-pms/admin/components/TierGate";
import { useTenant } from "@aura/shared/tenants/TenantProvider";

const ROLE_FILTERS = ["all", ...ROLES.map((r) => r.key)];
const ACTION_FILTERS = ["all", ...Object.keys(AUDIT_ACTION_LABELS)];
const RANGE_FILTERS = [
  { k: "today", label: "Today", days: 1 },
  { k: "7d", label: "Last 7 days", days: 7 },
  { k: "30d", label: "Last 30 days", days: 30 },
  { k: "all", label: "All time", days: null },
];

export default function Settings() {
  const { tenant } = useTenant();
  const slug = tenant?.slug || "aura";
  const [prop, setProp] = useState({ name: tenant?.brandName || "Aura Hotels", tagline: tenant?.tagline || "Timeless Heritage & Luxury", currency: "INR", timezone: "Asia/Kolkata", language: "English", taxRate: 18 });
  const [ints, setInts] = useState({ stripe: true, gmail: true, whatsapp: false, google_analytics: true, booking_com: true });
  const [tier, setTier] = useState(getTier());

  const switchTier = (t) => {
    persistTier(t);
    setTier(t);
    toast.success(`Switched to Aura ${t === "pro" ? "Pro" : "Basic"}`, { description: t === "pro" ? "All premium modules unlocked." : "Premium modules locked with upsell walls." });
  };

  return (
    <AdminLayout pageTitle="Settings">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Subscription tier */}
          <div className="p-6 bg-white rounded-[16px] border border-slate-200" data-testid="tier-settings">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-eyebrow text-brand-accent">Subscription</p>
                <h3 className="mt-1 font-serif text-xl text-slate-900">Your Aura plan</h3>
                <p className="mt-1 text-xs text-slate-500">Basic covers day-to-day operations. Pro unlocks OTA syncing, the master rate calendar, marketing automation and advanced reports.</p>
              </div>
              <span className={`text-[10px] tracking-[0.22em] uppercase px-3 py-1 rounded-full font-medium ${tier === "pro" ? "bg-gradient-to-r from-brand-accent to-brand-accent-hover text-slate-900" : "bg-slate-200 text-slate-700"}`}>{tier === "pro" ? "Pro" : "Basic"}</span>
            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {["BASIC", "PRO"].map((k) => {
                const t = TIERS[k];
                const isCurrent = tier === t.key;
                return (
                  <div
                    key={k}
                    className={`p-5 rounded-[16px] border transition-all ${isCurrent ? "border-brand-primary bg-gradient-to-br from-white to-indigo-50/40" : "border-slate-200 bg-brand-surface"}`}
                    data-testid={`tier-card-${t.key}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {t.key === "pro" && <i className="fa-solid fa-crown text-brand-accent"></i>}
                        <p className="font-serif text-xl text-slate-900">{t.label}</p>
                      </div>
                      {isCurrent && <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-white">Current</span>}
                    </div>
                    <p className="mt-1 text-xs text-slate-500 font-mono">{t.price}</p>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">{t.tagline}</p>
                    <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                      {t.features.map((f) => (
                        <li key={f} className="flex items-start gap-1.5"><i className={`fa-solid fa-check ${t.key === "pro" ? "text-brand-primary" : "text-emerald-500"} text-[9px] mt-0.5`}></i>{f}</li>
                      ))}
                    </ul>
                    {!isCurrent && (
                      <button
                        onClick={() => switchTier(t.key)}
                        className={`mt-4 w-full text-xs px-4 py-2 rounded-full ${t.key === "pro" ? "bg-brand-primary hover:bg-brand-primary-hover text-white" : "border border-slate-200 hover:bg-white text-slate-700"}`}
                        data-testid={`tier-switch-${t.key}`}
                      >
                        {t.key === "pro" ? "Upgrade to Pro" : "Downgrade to Basic"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service availability — cross-cutting closures that gate guest bookings */}
          <div className="p-6 bg-white rounded-[16px] border border-slate-200" data-testid="service-availability">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-eyebrow text-brand-accent">Availability</p>
                <h3 className="mt-1 font-serif text-xl text-slate-900">Service closures</h3>
                <p className="mt-1 text-xs text-slate-500 max-w-2xl">Temporarily block new guest reservations for any of these services. Closing a service instantly hides its bookings on the guest storefront and disables the Reserve buttons.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <ServiceClosurePanel tenantSlug={slug} service="spa" />
              <ServiceClosurePanel tenantSlug={slug} service="dining" />
              <ServiceClosurePanel tenantSlug={slug} service="experiences" />
            </div>
          </div>

          <div className="p-6 bg-white rounded-[16px] border border-slate-200">
            <p className="text-eyebrow text-brand-accent">Property</p>
            <h3 className="mt-1 font-serif text-xl text-slate-900">Basic information</h3>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { k: "name", l: "Property name" }, { k: "tagline", l: "Tagline" },
                { k: "currency", l: "Currency" }, { k: "timezone", l: "Timezone" },
                { k: "language", l: "Default language" }, { k: "taxRate", l: "Tax rate (%)" },
              ].map((f) => (
                <div key={f.k}>
                  <label className="text-eyebrow text-slate-500">{f.l}</label>
                  <input value={prop[f.k]} onChange={(e) => setProp({...prop, [f.k]: e.target.value})} className="mt-2 w-full bg-brand-surface border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-brand-primary" data-testid={`prop-${f.k}`} />
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end"><button onClick={() => toast.success("Property settings saved")} className="px-5 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-sm" data-testid="save-property">Save</button></div>
          </div>

          <div className="p-6 bg-white rounded-[16px] border border-slate-200">
            <p className="text-eyebrow text-brand-accent">Integrations</p>
            <h3 className="mt-1 font-serif text-xl text-slate-900">Connected services</h3>
            <div className="mt-4 divide-y divide-slate-100">
              {Object.entries(ints).map(([k, v]) => (
                <div key={k} className="py-4 flex items-center justify-between">
                  <div><p className="text-sm text-slate-900 capitalize">{k.replace(/_/g, " ")}</p><p className="text-xs text-slate-500">{v ? "Connected" : "Not connected"}</p></div>
                  <button onClick={() => { setInts({...ints, [k]: !v}); toast.success(`${k} ${!v ? "connected" : "disconnected"}`); }} className={`w-10 h-5 rounded-full relative ${v ? "bg-brand-primary" : "bg-slate-200"}`} data-testid={`int-${k}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${v ? "left-[22px]" : "left-0.5"}`}></span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <AuditPanel />
        </div>
      </div>
    </AdminLayout>
  );
}

const AuditPanel = () => {
  const [q, setQ] = useState("");
  const [roleF, setRoleF] = useState("all");
  const [actionF, setActionF] = useState("all");
  const [rangeF, setRangeF] = useState("all");

  const filtered = useMemo(() => {
    const cutoff = (() => {
      const range = RANGE_FILTERS.find((r) => r.k === rangeF);
      if (!range || !range.days) return null;
      return new Date(Date.now() - range.days * 86400000);
    })();
    return auditLog.filter((e) => {
      if (roleF !== "all" && e.role !== roleF) return false;
      if (actionF !== "all" && e.action !== actionF) return false;
      if (cutoff && new Date(e.ts) < cutoff) return false;
      if (q) {
        const s = q.toLowerCase();
        if (!e.actor.toLowerCase().includes(s) && !e.target.toLowerCase().includes(s) && !e.action.includes(s)) return false;
      }
      return true;
    });
  }, [q, roleF, actionF, rangeF]);

  const clearAll = () => { setQ(""); setRoleF("all"); setActionF("all"); setRangeF("all"); };
  const activeFilters = [q && "search", roleF !== "all" && "role", actionF !== "all" && "action", rangeF !== "all" && "range"].filter(Boolean).length;

  return (
    <div className="p-6 bg-white rounded-[16px] border border-slate-200" data-testid="audit-panel">
      <div className="flex items-center justify-between">
        <p className="text-eyebrow text-brand-accent">Audit</p>
        {activeFilters > 0 && (
          <button onClick={clearAll} className="text-[10px] text-slate-500 hover:text-slate-900" data-testid="audit-clear">Clear {activeFilters} filter{activeFilters > 1 ? "s" : ""}</button>
        )}
      </div>
      <h3 className="mt-1 font-serif text-xl text-slate-900">Activity log</h3>
      <p className="mt-1 text-xs text-slate-500">Every change made across the console.</p>

      {/* Search */}
      <div className="mt-4 flex items-center gap-2 bg-brand-surface border border-slate-200 rounded-full px-3 py-2">
        <i className="fa-solid fa-magnifying-glass text-xs text-slate-400"></i>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search actor, action, target..." className="flex-1 text-xs outline-none bg-transparent" data-testid="audit-search" />
        {q && <button onClick={() => setQ("")} className="text-slate-400 text-xs" data-testid="audit-clear-q"><i className="fa-solid fa-xmark text-[10px]"></i></button>}
      </div>

      {/* Range chips */}
      <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1" data-testid="audit-range-filters">
        {RANGE_FILTERS.map((r) => (
          <button key={r.k} onClick={() => setRangeF(r.k)} className={`text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap ${rangeF === r.k ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`} data-testid={`audit-range-${r.k}`}>{r.label}</button>
        ))}
      </div>

      {/* Role / Action selects */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        <select value={roleF} onChange={(e) => setRoleF(e.target.value)} className="bg-brand-surface border border-slate-200 rounded-full px-3 py-1.5 text-[11px] outline-none focus:border-brand-primary" data-testid="audit-role-filter">
          <option value="all">All actors</option>
          {ROLES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
        </select>
        <select value={actionF} onChange={(e) => setActionF(e.target.value)} className="bg-brand-surface border border-slate-200 rounded-full px-3 py-1.5 text-[11px] outline-none focus:border-brand-primary" data-testid="audit-action-filter">
          <option value="all">All actions</option>
          {ACTION_FILTERS.slice(1).map((a) => <option key={a} value={a}>{AUDIT_ACTION_LABELS[a]}</option>)}
        </select>
      </div>

      {/* Results */}
      <p className="mt-4 text-[10px] tracking-widest uppercase text-slate-400" data-testid="audit-result-count">
        {filtered.length} entr{filtered.length === 1 ? "y" : "ies"}
      </p>
      <ul className="mt-2 space-y-3 text-xs max-h-96 overflow-y-auto">
        {filtered.length === 0 ? (
          <li className="py-8 text-center text-slate-400" data-testid="audit-empty">
            <i className="fa-solid fa-inbox text-2xl"></i>
            <p className="mt-2">No entries match your filters.</p>
          </li>
        ) : filtered.map((e) => (
          <li key={e.id} className="pb-3 border-b border-slate-100 last:border-0" data-testid={`audit-row-${e.id}`}>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: roleColor(e.role) }}></span>
              <p className="text-slate-900 flex-1">{e.actor}</p>
              <span className="text-[9px] tracking-widest uppercase" style={{ color: roleColor(e.role) }}>{roleLabel(e.role)}</span>
            </div>
            <p className="mt-1 text-slate-600">
              <span className="text-[9px] tracking-widest uppercase text-brand-accent mr-1.5">{AUDIT_ACTION_LABELS[e.action] || e.action}</span>
              {e.target}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">{e.when}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
