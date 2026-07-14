import { create } from "zustand";
import { DEFAULT_TENANT, getTenant } from "@aura/shared/tenants/tenantRegistry";

// Zustand store — single source of truth for the currently active tenant.
// Components subscribe via `useTenantStore((s) => s.tenant)` for surgical
// re-renders. Theme application lives outside the store to keep it a pure
// data layer (no side effects).

export const useTenantStore = create((set) => ({
  tenant: DEFAULT_TENANT,
  status: "ready", // "loading" | "ready" | "not_found"

  loadTenant: (slug) => {
    if (!slug) {
      set({ tenant: DEFAULT_TENANT, status: "ready" });
      return DEFAULT_TENANT;
    }
    const t = getTenant(slug);
    if (!t) {
      set({ status: "not_found" });
      return null;
    }
    set({ tenant: t, status: "ready" });
    return t;
  },
}));
