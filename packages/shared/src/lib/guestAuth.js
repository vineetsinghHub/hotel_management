// Reactive guest auth backed by Zustand + localStorage persistence.
// Public API kept unchanged: getGuest, setGuest, signOutGuest, mockGuestLogin,
// mockGuestRegister, useGuestAuth.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useGuestStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (u) => set({ user: u }),
    }),
    {
      name: "aura_guest_user_v2",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const getGuest = () => useGuestStore.getState().user;
export const setGuest = (u) => useGuestStore.getState().setUser(u);
export const signOutGuest = () => setGuest(null);

const nameFromEmail = (email) =>
  email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Guest";

export const mockGuestLogin = ({ email, password }) => {
  if (!email || !password) return null;
  const u = {
    id: `g-${Date.now()}`,
    email,
    name: nameFromEmail(email),
    avatar: `https://i.pravatar.cc/200?u=${encodeURIComponent(email)}`,
  };
  setGuest(u);
  return u;
};

export const mockGuestRegister = ({ email, password, name }) => {
  if (!email || !password || !name) return null;
  const u = {
    id: `g-${Date.now()}`,
    email,
    name,
    avatar: `https://i.pravatar.cc/200?u=${encodeURIComponent(email)}`,
  };
  setGuest(u);
  return u;
};

export const useGuestAuth = () => {
  const user = useGuestStore((s) => s.user);
  return { user, isAuthed: !!user, signOut: signOutGuest };
};
