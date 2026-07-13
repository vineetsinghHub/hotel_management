// Subscription tier gating — Basic vs Pro.
// Backed by Zustand with a localStorage bridge. Consumers use the reactive
// `useTier()` hook or the imperative `getTier()/setTier()` helpers.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const TIERS = {
  BASIC: {
    key: "basic",
    label: "Basic",
    price: "₹4,999 / month",
    color: "#64748B",
    tagline: "Everything a boutique property needs to run day-to-day.",
    features: [
      "Front desk, reservations, rooms",
      "Guest CRM (up to 500 profiles)",
      "Housekeeping & inventory",
      "Basic invoicing & tax reports",
      "Email & SMS templates",
    ],
  },
  PRO: {
    key: "pro",
    label: "Pro",
    price: "₹14,999 / month",
    color: "#4F46E5",
    tagline: "Multi-channel distribution, advanced analytics, unlimited scale.",
    features: [
      "Everything in Basic",
      "OTA sync (Booking.com, Expedia, Agoda, MMT)",
      "Master rate calendar & yield rules",
      "Report Builder & custom exports",
      "Multi-channel marketing (WhatsApp, campaigns)",
      "Broadcast messaging",
      "Priority support",
    ],
  },
};

export const PRO_MODULES = {
  "rate-channel": {
    title: "Rate & Channel Manager",
    hook: "Sync rates and inventory to every OTA in one click.",
    reason: "OTA syncing is a Pro-only capability — most hotels see 30–40% more bookings after connecting Booking.com, Expedia and MMT.",
    icon: "money-bill-trend-up",
  },
  "reports": {
    title: "Advanced Reports",
    hook: "Build custom exports, night-audit PDFs and revenue drill-downs.",
    reason: "The Report Builder is a Pro feature — Basic still shows an at-a-glance summary on the Dashboard.",
    icon: "chart-line",
  },
  "marketing": {
    title: "Marketing Automation",
    hook: "Launch multi-channel campaigns and win back past guests.",
    reason: "Segmented campaigns, A/B tests and revenue attribution are Pro-only.",
    icon: "bullhorn",
  },
  "messages": {
    title: "Broadcast & Templates",
    hook: "Reach every in-house guest across email, SMS and WhatsApp.",
    reason: "Templated broadcasts and WhatsApp channel are Pro-only. You can still reply 1:1 on Basic.",
    icon: "comments",
    softLock: true,
  },
};

// ── Zustand store (persisted) ─────────────────────────────────────────────
export const useTierStore = create(
  persist(
    (set) => ({
      tier: "basic",
      setTier: (t) => set({ tier: t }),
    }),
    {
      name: "aura_admin_tier_v2",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ── Imperative API (kept for backwards compatibility) ─────────────────────
export const getTier = () => useTierStore.getState().tier;
export const setTier = (t) => useTierStore.getState().setTier(t);
export const subscribeTier = (cb) => useTierStore.subscribe((s) => cb(s.tier));

export const isPro = (t = getTier()) => t === "pro";
export const isProModule = (routeKey) => Boolean(PRO_MODULES[routeKey]);
export const canAccessModule = (routeKey, t = getTier()) => {
  const info = PRO_MODULES[routeKey];
  if (!info) return true;
  if (info.softLock) return true;
  return isPro(t);
};

// React hook — components can pick the whole tuple or a single field.
export const useTier = () => {
  const tier = useTierStore((s) => s.tier);
  return { tier, isPro: tier === "pro", setTier };
};
