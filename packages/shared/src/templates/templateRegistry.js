// Template registry — the Aura design catalogue.
// Each template is a curated combination of base look + default sub-options
// (cursor, button, input, animation). Hotels can adopt a template and then
// tweak the 4 sub-options independently.
//
// Super admins can add new "template entries" (name + description + preview
// image + which of the 4 CSS bases to build on). The CSS itself lives in
// packages/ui-core/src/templates/*.css and is loaded once globally — new
// entries reuse those bases (no arbitrary CSS injection for security).

export const TEMPLATE_BASES = ["luxury", "heritage", "modern", "minimal"];

// Tier gating for individual style options.
//   free    → included in Basic + Pro
//   pro     → included in Pro; Basic must upgrade OR buy to unlock
//   premium → à-la-carte only; must be purchased even by Pro tenants
export const TIER_ORDER = { free: 0, pro: 1, premium: 2 };
export const TIER_LABEL = { free: "Included", pro: "Pro", premium: "Premium" };
export const TIER_PRICE = { free: 0, pro: 0, premium: 4900 };   // paise (₹49)

export const CURSOR_OPTIONS = [
  { key: "default",   label: "Default",     desc: "Standard system cursor",             tier: "free" },
  { key: "luxe",      label: "Luxe",        desc: "Refined arrow with gold tint",       tier: "pro" },
  { key: "crosshair", label: "Precision",   desc: "Minimalist crosshair",               tier: "free" },
  { key: "sparkle",   label: "Sparkle",     desc: "Animated dot with trailing halo",    tier: "premium" },
];

export const BUTTON_OPTIONS = [
  { key: "pill",  label: "Pill",       desc: "Fully rounded pill buttons",  tier: "free" },
  { key: "sharp", label: "Sharp",      desc: "Squared corners, editorial",  tier: "free" },
  { key: "glow",  label: "Glow",       desc: "Subtle ambient glow",         tier: "pro" },
  { key: "lift",  label: "Lift",       desc: "3D lift on hover",            tier: "premium" },
];

export const INPUT_OPTIONS = [
  { key: "underline", label: "Underline",  desc: "Minimalist line-only",   tier: "free" },
  { key: "filled",    label: "Filled",     desc: "Soft filled inputs",     tier: "free" },
  { key: "outlined",  label: "Outlined",   desc: "Classic bordered",       tier: "pro" },
  { key: "soft",      label: "Soft pill",  desc: "Pill-shaped rounded",    tier: "premium" },
];

export const ANIMATION_OPTIONS = [
  { key: "off",      label: "Off",      desc: "No motion (accessibility-first)", tier: "free" },
  { key: "subtle",   label: "Subtle",   desc: "Gentle fades, quiet transitions", tier: "free" },
  { key: "lively",   label: "Lively",   desc: "Snappy movement, energetic",      tier: "pro" },
  { key: "dramatic", label: "Dramatic", desc: "Bold cinematic transitions",      tier: "premium" },
];

// Which family a key belongs to (used by the marketplace unlock lookups).
export const OPTION_FAMILIES = {
  cursor: CURSOR_OPTIONS,
  button: BUTTON_OPTIONS,
  input: INPUT_OPTIONS,
  animation: ANIMATION_OPTIONS,
};

// Given a tenant tier + unlock list, can this option be applied?
//   basic tier   → only "free" OR explicitly unlocked
//   pro tier     → "free" + "pro" OR explicitly unlocked
//   any tier     → "premium" requires unlock
export const canUseOption = (option, tenantTier = "basic", unlocks = []) => {
  if (!option) return false;
  const key = `${option.family || ""}:${option.key}`;
  if (unlocks.includes(key)) return true;                     // explicitly bought
  if (option.tier === "premium") return false;                 // premium always needs unlock
  if (option.tier === "pro" && tenantTier !== "pro") return false;
  return true;
};

// Built-in curated templates. Super admins can add more via the CRUD page —
// those get persisted to localStorage on top of this baseline.
export const BUILT_IN_TEMPLATES = [
  {
    id: "luxury-classic",
    name: "Luxury · Classic",
    description: "Palatial serif typography, indigo + gold, refined animations.",
    base: "luxury",
    previewImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60",
    published: true,
    builtIn: true,
    defaults: { cursor: "luxe", button: "pill", input: "underline", animation: "subtle" },
  },
  {
    id: "heritage-rajputana",
    name: "Heritage · Rajputana",
    description: "Maroon + brass, sharper radii, ornate serifs — palace vibe.",
    base: "heritage",
    previewImage: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=60",
    published: true,
    builtIn: true,
    defaults: { cursor: "default", button: "sharp", input: "outlined", animation: "subtle" },
  },
  {
    id: "modern-boutique",
    name: "Modern · Boutique",
    description: "Clean sans-serif, teal + slate, snappy motion, high-contrast CTAs.",
    base: "modern",
    previewImage: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&auto=format&fit=crop&q=60",
    published: true,
    builtIn: true,
    defaults: { cursor: "default", button: "lift", input: "filled", animation: "lively" },
  },
  {
    id: "minimal-quiet",
    name: "Minimal · Quiet",
    description: "Warm neutrals, generous whitespace, near-zero animation.",
    base: "minimal",
    previewImage: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=60",
    published: true,
    builtIn: true,
    defaults: { cursor: "default", button: "pill", input: "soft", animation: "off" },
  },
  {
    id: "signature-glow",
    name: "Signature · Glow",
    description: "Luxury base with dramatic motion and glowing CTAs — flagship feel.",
    base: "luxury",
    previewImage: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&auto=format&fit=crop&q=60",
    published: true,
    builtIn: true,
    defaults: { cursor: "sparkle", button: "glow", input: "underline", animation: "dramatic" },
  },
];

// Default sub-option values if nothing has been picked.
export const APPEARANCE_DEFAULTS = {
  templateId: "luxury-classic",
  cursor: "luxe",
  button: "pill",
  input: "underline",
  animation: "subtle",
};

// Resolve — merge template defaults + tenant overrides.
export const resolveAppearance = (template, tenantAppearance = {}) => ({
  templateId: template?.id || APPEARANCE_DEFAULTS.templateId,
  base: template?.base || "luxury",
  cursor: tenantAppearance.cursor || template?.defaults?.cursor || APPEARANCE_DEFAULTS.cursor,
  button: tenantAppearance.button || template?.defaults?.button || APPEARANCE_DEFAULTS.button,
  input: tenantAppearance.input || template?.defaults?.input || APPEARANCE_DEFAULTS.input,
  animation: tenantAppearance.animation || template?.defaults?.animation || APPEARANCE_DEFAULTS.animation,
});
