// Role & Permission Matrix — used by ProtectedAdmin + Sidebar filtering.
// When backend arrives, ship this file to the API and the same map applies.

export const ROLE_KEYS = {
  SUPER_ADMIN: "super_admin",
  GM: "general_manager",
  FRONT_DESK: "front_desk",
  HOUSEKEEPING: "housekeeping",
  FB_MANAGER: "fb_manager",
  SPA_MANAGER: "spa_manager",
  MARKETING: "marketing",
  ACCOUNTING: "accounting",
  READ_ONLY: "read_only",
};

export const ROLES = [
  { key: ROLE_KEYS.SUPER_ADMIN, label: "Super Admin", color: "#4F46E5", desc: "Full access. Manages staff and roles." },
  { key: ROLE_KEYS.GM, label: "General Manager", color: "#C9A227", desc: "Operations, guests, revenue, staff." },
  { key: ROLE_KEYS.FRONT_DESK, label: "Front Desk", color: "#0EA5E9", desc: "Check-in/out, reservations, guest requests." },
  { key: ROLE_KEYS.HOUSEKEEPING, label: "Housekeeping", color: "#10B981", desc: "Room status, cleaning schedule, maintenance." },
  { key: ROLE_KEYS.FB_MANAGER, label: "F&B Manager", color: "#F97316", desc: "Restaurant, events, inventory." },
  { key: ROLE_KEYS.SPA_MANAGER, label: "Spa Manager", color: "#EC4899", desc: "Spa, therapists, appointments." },
  { key: ROLE_KEYS.MARKETING, label: "Marketing", color: "#8B5CF6", desc: "Campaigns, reviews, guest CRM." },
  { key: ROLE_KEYS.ACCOUNTING, label: "Accounting", color: "#14B8A6", desc: "Invoices, folio, reports." },
  { key: ROLE_KEYS.READ_ONLY, label: "Read Only", color: "#64748B", desc: "View-only across modules." },
];

// route key -> allowed role keys. '*' means all roles allowed.
export const PERMISSIONS = {
  "dashboard": "*",
  "front-desk": [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.GM, ROLE_KEYS.FRONT_DESK, ROLE_KEYS.READ_ONLY],
  "reservations": [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.GM, ROLE_KEYS.FRONT_DESK, ROLE_KEYS.READ_ONLY],
  "rooms": [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.GM, ROLE_KEYS.FRONT_DESK, ROLE_KEYS.HOUSEKEEPING, ROLE_KEYS.READ_ONLY],
  "guests": [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.GM, ROLE_KEYS.FRONT_DESK, ROLE_KEYS.MARKETING, ROLE_KEYS.READ_ONLY],
  "housekeeping": [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.GM, ROLE_KEYS.HOUSEKEEPING, ROLE_KEYS.FRONT_DESK, ROLE_KEYS.READ_ONLY],
  "restaurant": [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.GM, ROLE_KEYS.FB_MANAGER, ROLE_KEYS.READ_ONLY],
  "spa": [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.GM, ROLE_KEYS.SPA_MANAGER, ROLE_KEYS.READ_ONLY],
  "events": [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.GM, ROLE_KEYS.FB_MANAGER, ROLE_KEYS.READ_ONLY],
  "inventory": [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.GM, ROLE_KEYS.FB_MANAGER, ROLE_KEYS.HOUSEKEEPING, ROLE_KEYS.READ_ONLY],
  "staff": [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.GM],
  "invoices": [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.GM, ROLE_KEYS.ACCOUNTING, ROLE_KEYS.FRONT_DESK, ROLE_KEYS.READ_ONLY],
  "rate-channel": [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.GM, ROLE_KEYS.ACCOUNTING, ROLE_KEYS.MARKETING, ROLE_KEYS.READ_ONLY],
  "marketing": [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.GM, ROLE_KEYS.MARKETING, ROLE_KEYS.READ_ONLY],
  "messages": [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.GM, ROLE_KEYS.MARKETING, ROLE_KEYS.FRONT_DESK, ROLE_KEYS.READ_ONLY],
  "reviews": [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.GM, ROLE_KEYS.MARKETING, ROLE_KEYS.READ_ONLY],
  "reports": [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.GM, ROLE_KEYS.ACCOUNTING, ROLE_KEYS.READ_ONLY],
  "notifications": "*",
  "settings": [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.GM],
  "appearance": [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.GM, ROLE_KEYS.MARKETING],
};

export const hasAccess = (routeKey, roleKey) => {
  const perm = PERMISSIONS[routeKey];
  if (!perm) return false;
  if (perm === "*") return true;
  return perm.includes(roleKey);
};

// Write / mutation guard — read-only auditors can navigate to modules but can
// never create, edit, delete, or run destructive actions.
export const isReadOnly = (roleKey) => roleKey === ROLE_KEYS.READ_ONLY;
export const canWrite = (roleKey) => !!roleKey && !isReadOnly(roleKey);

export const roleLabel = (k) => ROLES.find((r) => r.key === k)?.label || k;
export const roleColor = (k) => ROLES.find((r) => r.key === k)?.color || "#64748B";

// Landing route each role should be taken to right after signing in.
export const ROLE_LANDING = {
  [ROLE_KEYS.SUPER_ADMIN]: "/admin/dashboard",
  [ROLE_KEYS.GM]: "/admin/dashboard",
  [ROLE_KEYS.FRONT_DESK]: "/admin/front-desk",
  [ROLE_KEYS.HOUSEKEEPING]: "/admin/housekeeping",
  [ROLE_KEYS.FB_MANAGER]: "/admin/restaurant",
  [ROLE_KEYS.SPA_MANAGER]: "/admin/spa",
  [ROLE_KEYS.MARKETING]: "/admin/marketing",
  [ROLE_KEYS.ACCOUNTING]: "/admin/invoices",
  [ROLE_KEYS.READ_ONLY]: "/admin/dashboard",
};
export const landingFor = (roleKey) => ROLE_LANDING[roleKey] || "/admin/dashboard";
