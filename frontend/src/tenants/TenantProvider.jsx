import { createContext, useContext, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useTenantStore } from "@/tenants/tenantStore";
import { applyTenantTheme } from "@/tenants/applyTheme";
import { DEFAULT_TENANT, getTenant } from "@/tenants/tenantRegistry";

// Public context that any component can consume.
const TenantContext = createContext({ tenant: DEFAULT_TENANT });

// TenantProvider resolves the tenant from the URL slug (path-based routing:
// /t/:slug/…) and applies its theme. If no slug is present it defaults to
// the Aura tenant so the app never renders unstyled.
export const TenantProvider = ({ children }) => {
  const { slug } = useParams();
  const tenant = useTenantStore((s) => s.tenant);
  const status = useTenantStore((s) => s.status);
  const loadTenant = useTenantStore((s) => s.loadTenant);

  useEffect(() => {
    loadTenant(slug);
  }, [slug, loadTenant]);

  useEffect(() => {
    if (tenant) applyTenantTheme(tenant);
  }, [tenant]);

  const value = useMemo(() => ({ tenant, status }), [tenant, status]);

  // Show 404 for unknown tenant slugs.
  if (status === "not_found") {
    const target = getTenant("aura") || DEFAULT_TENANT;
    return (
      <div className="min-h-screen grid place-items-center bg-brand-surface px-6" data-testid="tenant-not-found">
        <div className="max-w-md text-center">
          <p className="text-eyebrow text-brand-accent">404</p>
          <h2 className="mt-1 font-serif text-3xl text-brand-ink">Property not found</h2>
          <p className="mt-2 text-sm text-brand-ink-soft">We couldn't find a hotel with slug "{slug}". Try one of our sample properties instead.</p>
          <Link to={`/t/${target.slug}`} className="mt-6 inline-block px-6 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-brand-primary-fg text-sm">Visit {target.brandName}</Link>
        </div>
      </div>
    );
  }

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

export const useTenant = () => useContext(TenantContext);
