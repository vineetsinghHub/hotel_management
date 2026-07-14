// Central store for "unread staff messages" — powers the FAB badge across
// the admin console. Mock only; wire to the real backend later.

let unread = 4; // seed
const listeners = new Set();

export const getUnreadMessages = () => unread;
export const setUnreadMessages = (n) => {
  unread = Math.max(0, n);
  listeners.forEach((cb) => cb(unread));
};
export const clearUnreadMessages = () => setUnreadMessages(0);
export const bumpUnreadMessages = (by = 1) => setUnreadMessages(unread + by);
export const subscribeUnreadMessages = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

// Seed staff-to-staff conversation threads for the FAB drawer.
export const staffThreads = [
  {
    id: "st-1",
    name: "Ravi Menon",
    role: "Front Desk",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    unread: 2,
    updated: "2m ago",
    online: true,
    messages: [
      { id: 1, from: "them", text: "Room 401 AC is out — Meera has flagged it.", when: "09:24" },
      { id: 2, from: "them", text: "Any chance we can shift the Rossi party to 402?", when: "09:25" },
    ],
  },
  {
    id: "st-2",
    name: "Meera Kaur",
    role: "Housekeeping",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    unread: 1,
    updated: "12m ago",
    online: true,
    messages: [
      { id: 1, from: "them", text: "203 is ready for early check-in.", when: "09:14" },
    ],
  },
  {
    id: "st-3",
    name: "Chef Vikram",
    role: "F&B Manager",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80",
    unread: 1,
    updated: "38m ago",
    online: false,
    messages: [
      { id: 1, from: "them", text: "Kheer for 12 tonight at the Chef's Table — confirmed?", when: "08:48" },
    ],
  },
  {
    id: "st-4",
    name: "Priya Nair",
    role: "Spa Director",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    unread: 0,
    updated: "1h ago",
    online: false,
    messages: [
      { id: 1, from: "them", text: "Isabella upgraded to Couple's Retreat at 16:30.", when: "08:12" },
      { id: 2, from: "me", text: "Noted — Room 301, both guests VIP.", when: "08:15" },
    ],
  },
  {
    id: "st-5",
    name: "Karan Malhotra",
    role: "Marketing",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    unread: 0,
    updated: "yesterday",
    online: false,
    messages: [
      { id: 1, from: "them", text: "Diwali campaign hit ₹48L — attaching report.", when: "yesterday" },
    ],
  },
];
