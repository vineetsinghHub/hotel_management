// Subscription tier gating — Basic vs Pro.
// Small hoteliers land on Basic; when they hit a premium module we display an
// upsell-locked screen instead of the feature. Toggle-able from Settings.

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
    softLock: true, // still accessible, just limits inside
  },
};

export const getTier = () => {
  try { return localStorage.getItem(TIER_KEY) || "basic"; } catch (e) { return "basic"; }
};
export const setTier = (t) => localStorage.setItem(TIER_KEY, t);
export const isPro = () => getTier() === "pro";
export const isProModule = (routeKey) => Boolean(PRO_MODULES[routeKey]);
export const canAccessModule = (routeKey) => {
  const info = PRO_MODULES[routeKey];
  if (!info) return true; // free module
  if (info.softLock) return true; // page opens but shows partial content
  return isPro();
};
