// ─────────────────────────────────────────────────────────────────────────────
// Tenant registry — the SaaS platform's list of configured properties.
// Each entry maps a URL slug to brand identity, template variant, feature
// flags, and subscription tier. In production this JSON comes from the
// Super-Admin API. For now we ship 3 fully-designed sample tenants.
// ─────────────────────────────────────────────────────────────────────────────

export const TEMPLATES = ["heritage", "luxury", "basic"];

export const DEFAULT_TENANT = {
  slug: "aura",
  brandName: "Aura Hotels",
  legalName: "Aura Hospitality Pvt Ltd",
  tagline: "Timeless Heritage & Luxury",
  template: "luxury",
  tier: "basic",
  locale: "en",
  city: "Mumbai",
  currency: "INR",
  timezone: "Asia/Kolkata",
  logo: null,
  favicon: "/favicon.ico",
  contact: {
    email: "concierge@aurahotels.com",
    phone: "+91 22 6234 5000",
    address: "Marine Drive, Mumbai 400020",
  },
  enabledModules: {
    rooms: true, dining: true, spa: true, experiences: true,
    events: true, gallery: true,
  },
  theme: {
    "brand-primary": "#4F46E5",
    "brand-primary-hover": "#4338CA",
    "brand-primary-fg": "#FFFFFF",
    "brand-primary-soft": "rgba(79, 70, 229, 0.12)",
    "brand-accent": "#C9A227",
    "brand-accent-hover": "#B08D1E",
    "brand-accent-soft": "rgba(201, 162, 39, 0.12)",
    "brand-ink": "#0F172A",
    "brand-ink-soft": "#64748B",
    "brand-surface": "#FAFAF8",
    "brand-surface-elev": "#FFFFFF",
    "brand-border": "#E2E8F0",
    "brand-radius": "20px",
    "brand-radius-sm": "12px",
    "brand-font-serif": "'Cormorant Garamond', serif",
    "brand-font-sans": "'Plus Jakarta Sans', sans-serif",
    "brand-template": "'luxury'",
  },
};

export const TENANTS = {
  aura: DEFAULT_TENANT,

  // ── Sample tenant #2: Heritage property (deep maroon + brass) ──────────
  bhairavgarh: {
    slug: "bhairavgarh",
    brandName: "Bhairavgarh Palace",
    legalName: "Bhairavgarh Heritage Estates",
    tagline: "A Rajputana Legend Since 1732",
    template: "heritage",
    tier: "pro",
    locale: "en",
    currency: "INR",
    timezone: "Asia/Kolkata",
    city: "Udaipur",
    logo: null,
    favicon: "/favicon.ico",
    contact: {
      email: "reservations@bhairavgarh.in",
      phone: "+91 141 555 2200",
      address: "City Palace Road, Udaipur 313001",
    },
    enabledModules: {
      rooms: true, dining: true, spa: true, experiences: true,
      events: true, gallery: true,
    },
    theme: {
      "brand-primary": "#7B2C2C",
      "brand-primary-hover": "#5F1F1F",
      "brand-primary-fg": "#FFFFFF",
      "brand-primary-soft": "rgba(123, 44, 44, 0.12)",
      "brand-accent": "#B8860B",
      "brand-accent-hover": "#9A700A",
      "brand-accent-soft": "rgba(184, 134, 11, 0.14)",
      "brand-ink": "#1B1310",
      "brand-ink-soft": "#6B5750",
      "brand-surface": "#FBF6EE",
      "brand-surface-elev": "#FFFFFF",
      "brand-border": "#E8DDCA",
      "brand-radius": "10px",
      "brand-radius-sm": "6px",
      "brand-font-serif": "'Cormorant Garamond', serif",
      "brand-font-sans": "'Plus Jakarta Sans', sans-serif",
      "brand-template": "'heritage'",
    },
  },

  // ── Sample tenant #3: Basic tier boutique (charcoal + emerald) ─────────
  hillhaven: {
    slug: "hillhaven",
    brandName: "Hill Haven Boutique",
    legalName: "Hill Haven Retreat LLP",
    tagline: "Quiet Comfort. Big Views.",
    template: "basic",
    tier: "basic",
    locale: "en",
    currency: "INR",
    timezone: "Asia/Kolkata",
    city: "Munnar",
    logo: null,
    favicon: "/favicon.ico",
    contact: {
      email: "stay@hillhaven.co",
      phone: "+91 98 1234 5678",
      address: "MG Road, Munnar 685612",
    },
    enabledModules: {
      // Small boutique — no in-house spa or events.
      rooms: true, dining: true, spa: false, experiences: true,
      events: false, gallery: true,
    },
    theme: {
      "brand-primary": "#0F766E",
      "brand-primary-hover": "#0B5A54",
      "brand-primary-fg": "#FFFFFF",
      "brand-primary-soft": "rgba(15, 118, 110, 0.10)",
      "brand-accent": "#F59E0B",
      "brand-accent-hover": "#D18305",
      "brand-accent-soft": "rgba(245, 158, 11, 0.12)",
      "brand-ink": "#0F172A",
      "brand-ink-soft": "#64748B",
      "brand-surface": "#F8FAFC",
      "brand-surface-elev": "#FFFFFF",
      "brand-border": "#E2E8F0",
      "brand-radius": "16px",
      "brand-radius-sm": "8px",
      "brand-font-serif": "'Playfair Display', serif",
      "brand-font-sans": "'Plus Jakarta Sans', sans-serif",
      "brand-template": "'basic'",
    },
  },
};

export const listTenants = () => Object.values(TENANTS);
export const getTenant = (slug) => TENANTS[slug] || null;
