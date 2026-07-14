import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { listTenants } from "@aura/shared/tenants/tenantRegistry";

// Preview-only tenant switcher — floating pill in the bottom-left of the
// guest storefront. Lets you jump between sample tenants without editing
// the URL by hand. Hidden on admin/super-admin routes.
export const TenantSwitcher = () => {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { slug } = useParams();
  const [open, setOpen] = useState(false);
  const tenants = listTenants();

  // Preview-only surface: hide in production builds and on admin/super-admin.
  if (process.env.NODE_ENV === "production" && process.env.REACT_APP_SHOW_TENANT_SWITCHER !== "true") return null;
  if (pathname.startsWith("/admin") || pathname.startsWith("/super-admin")) return null;
  // Hide when the storefront is embedded (Super Admin "Preview as tenant" iframe).
  if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("embed") === "1") return null;

  const activeSlug = slug || "aura";
  const active = tenants.find((t) => t.slug === activeSlug) || tenants[0];
  const rest = tenants.filter((t) => t.slug !== active.slug);

  const switchTo = (t) => {
    const rest = pathname.replace(/^\/t\/[^/]+/, "") || "/";
    nav(`/t/${t.slug}${rest === "/" ? "" : rest}`);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[60] print:hidden" data-testid="tenant-switcher">
      {open && (
        <div className="mb-2 min-w-[240px] bg-brand-surface-elev border border-brand-border rounded-[16px] shadow-[0_20px_50px_rgba(15,23,42,0.15)] overflow-hidden">
          <p className="px-4 pt-3 pb-2 text-[10px] tracking-widest uppercase text-brand-ink-soft">Preview as</p>
          {rest.map((t) => (
            <button
              key={t.slug}
              onClick={() => switchTo(t)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-brand-primary-soft"
              data-testid={`tenant-option-${t.slug}`}
            >
              <span
                className="w-4 h-4 rounded-full border border-brand-border flex-shrink-0"
                style={{ backgroundColor: t.theme["brand-primary"] }}
              ></span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-brand-ink truncate">{t.brandName}</p>
                <p className="text-[10px] text-brand-ink-soft truncate">/{t.slug} · {t.template}</p>
              </div>
              <span className={`text-[9px] tracking-widest uppercase px-1.5 py-0.5 rounded ${t.tier === "pro" ? "bg-gradient-to-r from-brand-accent to-brand-accent-hover text-slate-900" : "bg-slate-200 text-slate-600"}`}>{t.tier}</span>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-surface-elev border border-brand-border shadow-[0_10px_28px_rgba(15,23,42,0.10)] hover:shadow-[0_16px_40px_rgba(15,23,42,0.15)] transition-shadow"
        data-testid="tenant-switcher-toggle"
      >
        <span
          className="w-3 h-3 rounded-full border border-brand-border"
          style={{ backgroundColor: active.theme["brand-primary"] }}
        ></span>
        <span className="text-xs text-brand-ink font-medium max-w-[160px] truncate">{active.brandName}</span>
        <i className={`fa-solid fa-chevron-${open ? "down" : "up"} text-[9px] text-brand-ink-soft`}></i>
      </button>
    </div>
  );
};

export default TenantSwitcher;
