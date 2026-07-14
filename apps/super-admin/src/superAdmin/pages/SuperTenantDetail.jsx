import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import SuperAdminLayout from "@aura/super-admin/superAdmin/SuperAdminLayout";
import { platformTenants, statusPill, churnPill } from "@aura/super-admin/superAdmin/superAdminMockData";
import { getTenant } from "@aura/shared/tenants/tenantRegistry";

export default function SuperTenantDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const t = platformTenants.find((x) => x.slug === slug);
  const cfg = getTenant(slug);

  if (!t) {
    return (
      <SuperAdminLayout pageTitle="Tenant not found">
        <div className="text-center py-16" data-testid="tenant-detail-404">
          <p className="text-slate-500">No tenant with slug "{slug}"</p>
          <Link to="/super-admin/tenants" className="mt-4 inline-block text-[#818CF8] text-sm hover:underline">← Back to tenants</Link>
        </div>
      </SuperAdminLayout>
    );
  }

  const status = statusPill(t.status);
  const churn = churnPill(t.churn);
  const primary = cfg?.theme?.["brand-primary"] || "#4F46E5";
  const accent = cfg?.theme?.["brand-accent"] || "#C9A227";

  return (
    <SuperAdminLayout
      pageTitle={t.brandName}
      rightSlot={
        <div className="flex items-center gap-2">
          <a href={`/t/${t.slug}`} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-2" data-testid="tenant-detail-preview">
            <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>Preview storefront
          </a>
          <button onClick={() => toast.success(`Impersonating ${t.brandName}`)} className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-2" data-testid="tenant-detail-impersonate">
            <i className="fa-solid fa-user-secret text-[10px]"></i>Impersonate
          </button>
          {t.status === "active" ? (
            <button onClick={() => toast.warning(`Suspended ${t.brandName} (mock)`)} className="px-4 py-2 rounded-full bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs flex items-center gap-2" data-testid="tenant-detail-suspend">
              <i className="fa-solid fa-pause text-[10px]"></i>Suspend
            </button>
          ) : (
            <button onClick={() => toast.success(`Reactivated ${t.brandName} (mock)`)} className="px-4 py-2 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2" data-testid="tenant-detail-reactivate">
              <i className="fa-solid fa-play text-[10px]"></i>Reactivate
            </button>
          )}
        </div>
      }
    >
      <Link to="/super-admin/tenants" className="text-xs text-slate-400 hover:text-white mb-4 inline-block">← All tenants</Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Identity card */}
        <div className="lg:col-span-2 p-6 rounded-[16px] bg-white/5 border border-white/10">
          <div className="flex items-start gap-5">
            <span className="w-20 h-20 rounded-[16px] grid place-items-center flex-shrink-0 font-serif text-3xl text-slate-900" style={{ backgroundColor: accent }}>{t.brandName[0]}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif text-3xl text-white">{t.brandName}</h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>{status.label}</span>
                <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 rounded font-medium ${t.tier === "pro" ? "bg-gradient-to-r from-brand-accent to-brand-accent-hover text-slate-900" : "bg-slate-700 text-slate-300"}`}>{t.tier}</span>
              </div>
              <p className="mt-1 text-sm text-slate-400 font-mono">/t/{t.slug} · {t.template} template</p>
              <p className="mt-3 text-sm text-slate-300">{cfg?.tagline}</p>

              <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                <Stat label="MRR" value={`₹${(t.mrr / 1000).toFixed(1)}K`} />
                <Stat label="Users" value={t.users} />
                <Stat label="Health" value={`${t.health}%`} />
                <Stat label="NPS" value={t.nps} />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-slate-300">
                  <i className="fa-solid fa-swatchbook mr-1.5" style={{ color: primary }}></i>Brand: <code className="font-mono">{primary}</code>
                </span>
                <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-slate-300">
                  <i className="fa-solid fa-calendar-days mr-1.5 text-slate-500"></i>Signed up {t.signedUp}
                </span>
                <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-slate-300">
                  <i className="fa-solid fa-signal mr-1.5 text-emerald-400"></i>Active {t.lastActive}
                </span>
                <span className={`text-[10px] px-2 py-1 rounded ${churn.bg} ${churn.text}`}>
                  Churn: {churn.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Billing */}
        <div className="p-6 rounded-[16px] bg-white/5 border border-white/10">
          <p className="text-eyebrow text-brand-accent">Billing</p>
          <h3 className="mt-1 font-serif text-xl text-white">Current plan</h3>
          <p className="mt-2 text-sm text-slate-400">Aura {t.tier === "pro" ? "Pro" : "Basic"} · ₹{t.mrr.toLocaleString()}/month</p>
          <ul className="mt-4 space-y-2 text-xs">
            <li className="flex items-center justify-between text-slate-400"><span>Next invoice</span><span className="text-white font-mono">Mar 01</span></li>
            <li className="flex items-center justify-between text-slate-400"><span>Last payment</span><span className="text-emerald-400 font-mono">Feb 01</span></li>
            <li className="flex items-center justify-between text-slate-400"><span>Payment method</span><span className="text-white">Visa •• 4242</span></li>
            <li className="flex items-center justify-between text-slate-400"><span>Auto-renew</span><span className="text-emerald-400">On</span></li>
          </ul>
          <button className="mt-5 w-full py-2 rounded-full border border-white/10 hover:bg-white/10 text-slate-300 text-xs" data-testid="view-invoices">View invoices</button>
        </div>
      </div>

      {/* Modules & feature flags */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-6 rounded-[16px] bg-white/5 border border-white/10">
          <p className="text-eyebrow text-brand-accent">Modules enabled</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(cfg?.enabledModules || {}).map(([m, on]) => (
              <span key={m} className={`text-[11px] px-3 py-1.5 rounded-full ${on ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-700 text-slate-500 line-through"}`} data-testid={`module-${m}`}>
                {m}
              </span>
            ))}
          </div>
        </div>
        <div className="p-6 rounded-[16px] bg-white/5 border border-white/10">
          <p className="text-eyebrow text-brand-accent">Danger zone</p>
          <p className="text-xs text-slate-400 mt-2">Destructive actions require a support ticket.</p>
          <div className="mt-4 space-y-2">
            <button onClick={() => toast.error("Data export queued — you'll receive a link via email")} className="w-full text-left px-4 py-2.5 rounded-[10px] bg-white/5 hover:bg-white/10 text-sm text-slate-200 flex items-center gap-3" data-testid="export-data">
              <i className="fa-solid fa-download text-brand-accent"></i>Export all data (JSON)
            </button>
            <button onClick={() => toast.error("Deletion is disabled in preview")} className="w-full text-left px-4 py-2.5 rounded-[10px] bg-rose-500/10 hover:bg-rose-500/15 text-sm text-rose-300 flex items-center gap-3" data-testid="delete-tenant">
              <i className="fa-solid fa-trash text-rose-400"></i>Delete tenant permanently
            </button>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}

const Stat = ({ label, value }) => (
  <div className="p-3 rounded-[10px] bg-white/5 border border-white/5">
    <p className="text-[9px] tracking-widest uppercase text-slate-500">{label}</p>
    <p className="mt-1 font-mono text-lg text-white">{value}</p>
  </div>
);
