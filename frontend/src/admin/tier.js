// Subscription tier gating — Basic vs Pro.
// Reactive: components subscribe via `subscribe()` (or the `useTier()` hook)
// and see tier changes instantly, no page reload.

const TIER_KEY = "aura_admin_tier";

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

// Route keys that are locked behind Pro tier.
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

// ── Reactive tier store ────────────────────────────────────────────────────
let _tier = "basic";
try { _tier = localStorage.getItem(TIER_KEY) || "basic"; } catch (e) {}
const listeners = new Set();

export const getTier = () => _tier;
export const setTier = (t) => {
  _tier = t;
  try { localStorage.setItem(TIER_KEY, t); } catch (e) {}
  listeners.forEach((cb) => cb(_tier));
};
export const subscribeTier = (cb) => { listeners.add(cb); return () => listeners.delete(cb); };

export const isPro = (t = _tier) => t === "pro";
export const isProModule = (routeKey) => Boolean(PRO_MODULES[routeKey]);
export const canAccessModule = (routeKey, t = _tier) => {
  const info = PRO_MODULES[routeKey];
  if (!info) return true;
  if (info.softLock) return true;
  return isPro(t);
};

// React hook for components that need to react to tier changes.
import { useEffect, useState } from "react";
export const useTier = () => {
  const [tier, setTierState] = useState(_tier);
  useEffect(() => subscribeTier(setTierState), []);
  return { tier, isPro: tier === "pro", setTier };
};
