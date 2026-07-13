// Lightweight guest-side auth used to gate Reserve / My account CTAs.
// Mock-only: any email + non-empty password logs the guest in and persists
// to localStorage. Reactive: components can subscribe with useGuestAuth().

import { useEffect, useState } from "react";

const KEY = "aura_guest_user";
let _user = null;
try { _user = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}
const listeners = new Set();

const notify = () => listeners.forEach((cb) => cb(_user));

export const getGuest = () => _user;
export const setGuest = (u) => {
  _user = u;
  try {
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
  } catch (e) {}
  notify();
};
export const signOutGuest = () => setGuest(null);

// Any email + non-empty password logs the guest in (mock).
export const mockGuestLogin = ({ email, password }) => {
  if (!email || !password) return null;
  const name = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Guest";
  const u = { id: `g-${Date.now()}`, email, name, avatar: `https://i.pravatar.cc/200?u=${encodeURIComponent(email)}` };
  setGuest(u);
  return u;
};

export const mockGuestRegister = ({ email, password, name }) => {
  if (!email || !password || !name) return null;
  const u = { id: `g-${Date.now()}`, email, name, avatar: `https://i.pravatar.cc/200?u=${encodeURIComponent(email)}` };
  setGuest(u);
  return u;
};

// React hook
export const useGuestAuth = () => {
  const [user, setUser] = useState(_user);
  useEffect(() => {
    const cb = (u) => setUser(u);
    listeners.add(cb);
    return () => listeners.delete(cb);
  }, []);
  return { user, isAuthed: !!user, signOut: signOutGuest };
};
