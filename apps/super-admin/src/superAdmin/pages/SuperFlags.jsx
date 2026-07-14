import { useState } from "react";
import { toast } from "sonner";
import SuperAdminLayout from "@aura/super-admin/superAdmin/SuperAdminLayout";
import { featureFlags as seed, platformTenants } from "@aura/super-admin/superAdmin/superAdminMockData";

export default function SuperFlags() {
  const [flags, setFlags] = useState(seed);
  const [expanded, setExpanded] = useState(null);
  const [q, setQ] = useState("");

  const visible = flags.filter((f) => !q || f.label.toLowerCase().includes(q.toLowerCase()) || f.key.includes(q.toLowerCase()));

  const toggle = (key) => {
    setFlags((s) => s.map((f) => f.key === key ? { ...f, enabled: !f.enabled } : f));
    const f = flags.find((x) => x.key === key);
    toast.success(`${f.label} ${!f.enabled ? "enabled" : "disabled"}`);
  };

  return (
    <SuperAdminLayout pageTitle="Feature flags">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-400">Global toggles + per-tenant rollout controls. Changes are audited.</p>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search flags…" className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white outline-none w-64" data-testid="flags-search" />
      </div>

      <div className="space-y-3">
        {visible.map((f) => (
          <div key={f.key} className="p-5 rounded-[16px] bg-white/5 border border-white/10" data-testid={`flag-${f.key}`}>
            <div className="flex items-center gap-4">
              <span className={`w-10 h-10 rounded-full grid place-items-center flex-shrink-0 ${f.enabled ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-slate-500"}`}>
                <i className="fa-solid fa-flag text-sm"></i>
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-white font-medium">{f.label}</p>
                  <code className="text-[10px] text-slate-500 font-mono">{f.key}</code>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Rollout: <span className="text-slate-200 font-mono">{f.rollout}</span>
                  {" · "}
                  {f.tenants.includes("*")
                    ? <span>All tenants</span>
                    : f.tenants.length === 0
                      ? <span>No tenants</span>
                      : <span>{f.tenants.length} tenant{f.tenants.length !== 1 ? "s" : ""}</span>
                  }
                </p>
              </div>
              <button
                onClick={() => setExpanded((e) => e === f.key ? null : f.key)}
                className="px-3 py-1.5 rounded-full text-xs border border-white/10 hover:bg-white/10 text-slate-300"
                data-testid={`flag-expand-${f.key}`}
              >
                {expanded === f.key ? "Collapse" : "Manage"}
              </button>
              <button
                onClick={() => toggle(f.key)}
                className={`w-12 h-6 rounded-full relative transition-colors ${f.enabled ? "bg-emerald-500" : "bg-slate-700"}`}
                aria-label={`Toggle ${f.label}`}
                data-testid={`flag-toggle-${f.key}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${f.enabled ? "left-7" : "left-1"}`}></span>
              </button>
            </div>

            {expanded === f.key && (
              <div className="mt-4 pt-4 border-t border-white/5" data-testid={`flag-panel-${f.key}`}>
                <p className="text-eyebrow text-brand-accent mb-3">Tenant overrides</p>
                <div className="flex flex-wrap gap-2">
                  {platformTenants.slice(0, 8).map((t) => {
                    const on = f.tenants.includes("*") || f.tenants.includes(t.slug);
                    return (
                      <button
                        key={t.slug}
                        onClick={() => toast.info(`Override for ${t.brandName} ${on ? "removed" : "added"} (mock)`)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${on ? "border-brand-primary bg-brand-primary/15 text-white" : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"}`}
                        data-testid={`flag-tenant-${f.key}-${t.slug}`}
                      >
                        {t.brandName}
                        {on && <i className="fa-solid fa-check ml-1.5 text-[8px] text-emerald-400"></i>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </SuperAdminLayout>
  );
}
