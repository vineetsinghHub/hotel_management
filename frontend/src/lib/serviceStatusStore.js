// Service status store — controls whether an ancillary service (spa, dining,
// restaurant, experiences, etc.) is currently accepting new bookings.
// Toggling a service to "closed" from the admin console (e.g. AdminSpa) blocks
// new reservations across the entire guest storefront in real-time.
//
// Keyed per-tenant so different hotels' closures don't leak into each other.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Every service starts open. Adding a new service? Just reference it — a
// missing key is treated as "open" by isServiceOpen().
const useServiceStatusStore = create(
  persist(
    (set) => ({
      // Shape: { [tenantSlug]: { [service]: { status: "open"|"closed", note?: string, closedAt?: iso } } }
      byTenant: {},
      setStatus: (tenantSlug, service, status, note) =>
        set((s) => {
          const prev = s.byTenant[tenantSlug] || {};
          return {
            byTenant: {
              ...s.byTenant,
              [tenantSlug]: {
                ...prev,
                [service]: {
                  status,
                  note: note || null,
                  closedAt: status === "closed" ? new Date().toISOString() : null,
                },
              },
            },
          };
        }),
      resetTenant: (tenantSlug) =>
        set((s) => {
          const next = { ...s.byTenant };
          delete next[tenantSlug];
          return { byTenant: next };
        }),
    }),
    {
      name: "aura_service_status_v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ── Public helpers ──────────────────────────────────────────────────────────

export const SERVICE_KEYS = ["spa", "dining", "restaurant", "experiences", "roomservice"];

export const SERVICE_META = {
  spa: { label: "Spa", icon: "spa", guestPath: "spa" },
  dining: { label: "Dining", icon: "utensils", guestPath: "dining" },
  restaurant: { label: "Restaurant", icon: "wine-glass", guestPath: "dining" },
  experiences: { label: "Experiences", icon: "compass", guestPath: "experiences" },
  roomservice: { label: "Room Service", icon: "bell-concierge", guestPath: "dashboard" },
};

// Frozen default so every "open, never-touched" service returns the SAME
// object reference. Critical — Zustand's useSyncExternalStore compares
// snapshots by identity, so returning a fresh { status: "open" } object on
// every render causes an infinite loop ("The result of getSnapshot should
// be cached…"). Keeping this object frozen and shared side-steps that.
const OPEN_DEFAULT = Object.freeze({ status: "open", note: null, closedAt: null });

// Non-reactive read (use inside handlers, effects, non-component code).
export const getServiceStatus = (tenantSlug, service) => {
  const map = useServiceStatusStore.getState().byTenant[tenantSlug];
  return (map && map[service]) || OPEN_DEFAULT;
};

export const setServiceStatus = (tenantSlug, service, status, note) =>
  useServiceStatusStore.getState().setStatus(tenantSlug, service, status, note);

// ── React hooks ────────────────────────────────────────────────────────────

// Subscribes to a single service's status for a specific tenant.
// Returns OPEN_DEFAULT (a stable frozen object) whenever the tenant has
// never touched this service — avoids the getSnapshot infinite-loop trap.
export const useServiceStatus = (tenantSlug, service) =>
  useServiceStatusStore((s) => s.byTenant[tenantSlug]?.[service] || OPEN_DEFAULT);

// Frozen empty map for tenants with zero closures — same reasoning as above.
const EMPTY_MAP = Object.freeze({});

// Subscribes to the entire status map for a tenant (used by admin dashboards).
export const useTenantServiceStatuses = (tenantSlug) =>
  useServiceStatusStore((s) => s.byTenant[tenantSlug] || EMPTY_MAP);

// Convenience — is this service currently accepting bookings?
export const isServiceOpen = (tenantSlug, service) =>
  (getServiceStatus(tenantSlug, service).status || "open") !== "closed";
