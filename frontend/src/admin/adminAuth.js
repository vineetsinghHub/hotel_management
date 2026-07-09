import { ROLE_KEYS } from "./roles";

const KEY = "aura_admin_user";

// Seed demo staff — used to allow login and also drives Staff module.
export const seedUsers = [
  { id: "u1", name: "Anjali Desai", email: "gm@aurahotels.com", role: ROLE_KEYS.SUPER_ADMIN, title: "General Manager", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80", active: true },
  { id: "u2", name: "Ravi Menon", email: "front@aurahotels.com", role: ROLE_KEYS.FRONT_DESK, title: "Front Office Manager", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80", active: true },
  { id: "u3", name: "Meera Kaur", email: "hk@aurahotels.com", role: ROLE_KEYS.HOUSEKEEPING, title: "Executive Housekeeper", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80", active: true },
  { id: "u4", name: "Vikram Singh", email: "chef@aurahotels.com", role: ROLE_KEYS.FB_MANAGER, title: "Executive Chef & F&B Head", avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80", active: true },
  { id: "u5", name: "Priya Nair", email: "spa@aurahotels.com", role: ROLE_KEYS.SPA_MANAGER, title: "Spa Director", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80", active: true },
  { id: "u6", name: "Karan Malhotra", email: "marketing@aurahotels.com", role: ROLE_KEYS.MARKETING, title: "Marketing Lead", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80", active: true },
  { id: "u7", name: "Sunita Rao", email: "finance@aurahotels.com", role: ROLE_KEYS.ACCOUNTING, title: "Finance Controller", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80", active: true },
  { id: "u8", name: "Auditor · Read Only", email: "audit@aurahotels.com", role: ROLE_KEYS.READ_ONLY, title: "External Auditor", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80", active: true },
];

export const getAdminUser = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; }
};
export const setAdminUser = (u) => localStorage.setItem(KEY, JSON.stringify(u));
export const clearAdminUser = () => localStorage.removeItem(KEY);

// Login stub — matches by email. Any password works (mock).
export const mockLogin = (email) => {
  const u = seedUsers.find((x) => x.email.toLowerCase() === email.toLowerCase().trim());
  if (!u) return null;
  setAdminUser(u);
  return u;
};
