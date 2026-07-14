// Mocked platform-wide data for the Super Admin Hub. Combines the tenants
// registered in tenantRegistry with additional operator metadata (MRR,
// health, activity, churn indicators).

import { listTenants } from "@aura/shared/tenants/tenantRegistry";

// ── Extend base tenants with platform ops metadata ────────────────────────
const seedMeta = {
  aura: { mrr: 4999, users: 42, health: 98, status: "active", signedUp: "2024-11-08", lastActive: "3 min ago", nps: 68, churn: "low" },
  bhairavgarh: { mrr: 14999, users: 68, health: 99, status: "active", signedUp: "2025-01-14", lastActive: "1 min ago", nps: 74, churn: "low" },
  hillhaven: { mrr: 4999, users: 12, health: 88, status: "active", signedUp: "2025-06-22", lastActive: "34 min ago", nps: 52, churn: "medium" },
};

// Additional simulated tenants to fill out the grid.
const extraTenants = [
  { slug: "kalinga-court", brandName: "Kalinga Court", template: "heritage", tier: "pro", mrr: 14999, users: 51, health: 97, status: "active", signedUp: "2025-02-11", lastActive: "12 min ago", nps: 71, churn: "low" },
  { slug: "vayu-retreats", brandName: "Vayu Retreats", template: "luxury", tier: "basic", mrr: 4999, users: 22, health: 92, status: "active", signedUp: "2025-04-30", lastActive: "2 hrs ago", nps: 61, churn: "low" },
  { slug: "himalaya-camps", brandName: "Himalaya Camps", template: "basic", tier: "basic", mrr: 4999, users: 8, health: 78, status: "trial", signedUp: "2026-01-19", lastActive: "1 day ago", nps: 44, churn: "high" },
  { slug: "coastline-6", brandName: "Coastline No. 6", template: "luxury", tier: "pro", mrr: 14999, users: 34, health: 100, status: "active", signedUp: "2025-03-04", lastActive: "5 min ago", nps: 82, churn: "low" },
  { slug: "kabini-wilds", brandName: "Kabini Wilds", template: "heritage", tier: "basic", mrr: 4999, users: 19, health: 95, status: "active", signedUp: "2025-08-17", lastActive: "44 min ago", nps: 66, churn: "low" },
  { slug: "sundara-spa", brandName: "Sundara Spa Resort", template: "luxury", tier: "pro", mrr: 14999, users: 47, health: 96, status: "active", signedUp: "2024-12-01", lastActive: "18 min ago", nps: 70, churn: "low" },
  { slug: "the-mint-house", brandName: "The Mint House", template: "basic", tier: "basic", mrr: 4999, users: 5, health: 62, status: "suspended", signedUp: "2025-09-25", lastActive: "12 days ago", nps: 28, churn: "high" },
  { slug: "old-goa-manor", brandName: "Old Goa Manor", template: "heritage", tier: "pro", mrr: 14999, users: 29, health: 94, status: "active", signedUp: "2025-05-16", lastActive: "6 min ago", nps: 69, churn: "low" },
  { slug: "kanha-lodge", brandName: "Kanha Safari Lodge", template: "basic", tier: "basic", mrr: 4999, users: 11, health: 85, status: "active", signedUp: "2025-10-08", lastActive: "3 hrs ago", nps: 58, churn: "medium" },
];

export const platformTenants = [
  ...listTenants().map((t) => ({
    slug: t.slug,
    brandName: t.brandName,
    template: t.template,
    tier: t.tier,
    ...seedMeta[t.slug],
  })),
  ...extraTenants,
];

// ── Aggregate platform KPIs (computed from tenants above) ────────────────
export const platformKpis = () => {
  const active = platformTenants.filter((t) => t.status === "active");
  const trial = platformTenants.filter((t) => t.status === "trial");
  const suspended = platformTenants.filter((t) => t.status === "suspended");
  const totalMrr = active.reduce((s, t) => s + t.mrr, 0);
  const avgHealth = Math.round(platformTenants.reduce((s, t) => s + t.health, 0) / platformTenants.length);
  const avgNps = Math.round(platformTenants.reduce((s, t) => s + t.nps, 0) / platformTenants.length);
  const users = platformTenants.reduce((s, t) => s + t.users, 0);
  return {
    tenants: platformTenants.length,
    active: active.length,
    trial: trial.length,
    suspended: suspended.length,
    mrr: totalMrr,
    arr: totalMrr * 12,
    avgHealth,
    avgNps,
    users,
    churnRate: 2.1, // simulated %
    uptime: 99.982,
  };
};

// 12-month MRR growth
export const mrrTrend = [
  { m: "Mar", v: 42000 }, { m: "Apr", v: 47000 }, { m: "May", v: 55000 }, { m: "Jun", v: 62000 },
  { m: "Jul", v: 68000 }, { m: "Aug", v: 74000 }, { m: "Sep", v: 78000 }, { m: "Oct", v: 82000 },
  { m: "Nov", v: 88000 }, { m: "Dec", v: 92000 }, { m: "Jan", v: 98000 }, { m: "Feb", v: platformKpis().mrr },
];

// Sign-ups over time
export const signupTrend = [
  { m: "Mar", v: 1 }, { m: "Apr", v: 2 }, { m: "May", v: 1 }, { m: "Jun", v: 2 },
  { m: "Jul", v: 1 }, { m: "Aug", v: 1 }, { m: "Sep", v: 2 }, { m: "Oct", v: 1 },
  { m: "Nov", v: 1 }, { m: "Dec", v: 1 }, { m: "Jan", v: 1 }, { m: "Feb", v: 0 },
];

// Global feature flags
export const featureFlags = [
  { key: "channel-mgr-mmt", label: "MakeMyTrip channel", enabled: true, rollout: "100%", tenants: ["*"] },
  { key: "channel-mgr-goibibo", label: "Goibibo channel", enabled: false, rollout: "0%", tenants: [] },
  { key: "guest-360-v2", label: "Guest 360 (v2 layout)", enabled: true, rollout: "42%", tenants: ["bhairavgarh", "coastline-6", "sundara-spa"] },
  { key: "spa-membership", label: "Spa membership program", enabled: true, rollout: "12%", tenants: ["sundara-spa"] },
  { key: "gpt-concierge", label: "GPT-powered concierge chat", enabled: false, rollout: "beta", tenants: ["coastline-6"] },
  { key: "loyalty-tiers", label: "Loyalty tiers UI", enabled: true, rollout: "100%", tenants: ["*"] },
  { key: "ada-audit", label: "ADA compliance audit tools", enabled: false, rollout: "0%", tenants: [] },
];

// Recent audit events for platform ops
export const platformAudit = [
  { id: "a1", when: "2 min ago", who: "Rohan Chatterjee", action: "upgraded tier", target: "himalaya-camps → Pro (trial)", color: "#10B981", icon: "arrow-up" },
  { id: "a2", when: "18 min ago", who: "Divya Iyer", action: "invoice paid", target: "coastline-6 · ₹14,999", color: "#4F46E5", icon: "circle-check" },
  { id: "a3", when: "42 min ago", who: "Ananya Bose", action: "provisioned tenant", target: "kanha-lodge", color: "#C9A227", icon: "plus" },
  { id: "a4", when: "2 hrs ago", who: "Rohan Chatterjee", action: "suspended tenant", target: "the-mint-house · non-payment", color: "#F43F5E", icon: "pause" },
  { id: "a5", when: "4 hrs ago", who: "Ananya Bose", action: "flag enabled", target: "spa-membership → sundara-spa", color: "#EC4899", icon: "flag" },
  { id: "a6", when: "yesterday", who: "Divya Iyer", action: "refund issued", target: "himalaya-camps · ₹4,999", color: "#F97316", icon: "rotate-left" },
];

// Status → visual color helper
export const statusPill = (s) => {
  switch (s) {
    case "active": return { bg: "bg-emerald-50", text: "text-emerald-700", label: "Active" };
    case "trial": return { bg: "bg-amber-50", text: "text-amber-700", label: "Trial" };
    case "suspended": return { bg: "bg-rose-50", text: "text-rose-700", label: "Suspended" };
    default: return { bg: "bg-slate-100", text: "text-slate-700", label: s };
  }
};

export const churnPill = (c) => {
  switch (c) {
    case "low": return { bg: "bg-emerald-50", text: "text-emerald-700", label: "Low" };
    case "medium": return { bg: "bg-amber-50", text: "text-amber-700", label: "Medium" };
    case "high": return { bg: "bg-rose-50", text: "text-rose-700", label: "High" };
    default: return { bg: "bg-slate-100", text: "text-slate-700", label: c };
  }
};
