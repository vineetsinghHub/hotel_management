// Super-admin auth — a completely separate identity from the per-tenant
// PMS. In production this is the SaaS operator's staff (billing, support,
// platform engineering). Mock only.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const SUPER_ADMINS = [
  { id: "sa-1", email: "platform@aurahotels.com", name: "Ananya Bose", role: "platform_admin", avatar: "https://i.pravatar.cc/200?img=32" },
  { id: "sa-2", email: "support@aurahotels.com", name: "Rohan Chatterjee", role: "support", avatar: "https://i.pravatar.cc/200?img=52" },
  { id: "sa-3", email: "billing@aurahotels.com", name: "Divya Iyer", role: "billing", avatar: "https://i.pravatar.cc/200?img=48" },
];

export const useSuperAdminStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (u) => set({ user: u }),
    }),
    {
      name: "aura_super_admin_v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const getSuperAdmin = () => useSuperAdminStore.getState().user;
export const setSuperAdmin = (u) => useSuperAdminStore.getState().setUser(u);
export const clearSuperAdmin = () => setSuperAdmin(null);

export const mockSuperLogin = (email) => {
  const u = SUPER_ADMINS.find((x) => x.email.toLowerCase() === (email || "").toLowerCase());
  if (!u) return null;
  setSuperAdmin(u);
  return u;
};

export const useSuperAdminAuth = () => {
  const user = useSuperAdminStore((s) => s.user);
  return { user, isAuthed: !!user, signOut: clearSuperAdmin };
};
