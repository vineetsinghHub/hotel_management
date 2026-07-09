// Mock data for admin portal
export const stats = {
  arrivals: 12, departures: 7, inHouse: 24, revenueToday: 42800,
  adr: 892, occupancy: 87, revpar: 776,
};

export const revenueTrend = [
  { d: "Mar 1", v: 28400 }, { d: "Mar 2", v: 31200 }, { d: "Mar 3", v: 26800 }, { d: "Mar 4", v: 34500 },
  { d: "Mar 5", v: 39100 }, { d: "Mar 6", v: 42800 }, { d: "Mar 7", v: 38900 }, { d: "Mar 8", v: 45600 },
  { d: "Mar 9", v: 41200 }, { d: "Mar 10", v: 48900 }, { d: "Mar 11", v: 47600 }, { d: "Mar 12", v: 52400 },
  { d: "Mar 13", v: 49800 }, { d: "Mar 14", v: 54900 }, { d: "Mar 15", v: 58200 },
];

export const occupancyTrend = Array.from({ length: 30 }).map((_, i) => {
  const h = 40 + Math.abs(Math.sin(i * 0.6)) * 55 + (i > 20 ? 20 : 0);
  return { d: `${i + 1}`, occ: Math.min(100, Math.round(h)) };
});

export const activities = [
  { id: "a1", type: "checkin", title: "Check-in completed", body: "Rajesh Sharma checked into Room 101", when: "2m ago", color: "#10B981", icon: "right-to-bracket" },
  { id: "a2", type: "reservation", title: "New reservation", body: "AH-9F27C1 — Meera Nair, 4 nights, ₹1,50,000", when: "10m ago", color: "#4F46E5", icon: "calendar-plus" },
  { id: "a3", type: "maintenance", title: "Urgent maintenance", body: "Room 401 AC unit reported non-functional", when: "18m ago", color: "#C9A227", icon: "screwdriver-wrench" },
  { id: "a4", type: "housekeeping", title: "Housekeeping done", body: "Room 106 inspected and marked ready", when: "24m ago", color: "#10B981", icon: "broom" },
  { id: "a5", type: "checkout", title: "Check-out completed", body: "David Chen checked out of Room 204", when: "1h ago", color: "#F43F5E", icon: "right-from-bracket" },
  { id: "a6", type: "reservation", title: "New reservation", body: "ALMA-VLTW/NP2 — Aisha Khan (Platinum), 4 nights", when: "1h ago", color: "#4F46E5", icon: "calendar-plus" },
];

// Expanded arrivals: mix of confirmed (arrivals today), checked_in (in-house), checked_out (departures)
export const arrivals = [
  // Departing today (checked_out)
  { id: "AH-0192Z1", guest: "Elena Petrova", room: "104", roomType: "Garden View", checkIn: "Mar 12", checkOut: "Mar 15", status: "checked_out", total: 172500, arrivalTime: "—", eta: "11:30" },
  { id: "AH-0192Z2", guest: "Nikhil Rao", room: "202", roomType: "Royal Terrace", checkIn: "Mar 11", checkOut: "Mar 15", status: "checked_out", total: 259600, arrivalTime: "—", eta: "12:00" },
  { id: "AH-0192Z3", guest: "Camille Dubois", room: "303", roomType: "Lake Pavilion", checkIn: "Mar 12", checkOut: "Mar 15", status: "checked_out", total: 495000, arrivalTime: "—", eta: "10:45" },
  // In-house (checked_in)
  { id: "AH-0193A2", guest: "Rajesh Sharma", room: "101", roomType: "Heritage Grand", checkIn: "Mar 13", checkOut: "Mar 18", status: "checked_in", total: 148500, arrivalTime: "14:30", eta: "—" },
  { id: "AH-0193B3", guest: "Priya Mehta", room: "102", roomType: "Heritage Grand", checkIn: "Mar 13", checkOut: "Mar 18", status: "checked_in", total: 148500, arrivalTime: "15:00", eta: "—" },
  { id: "AH-0193C4", guest: "James Thornton", room: "105", roomType: "Garden View", checkIn: "Mar 14", checkOut: "Mar 18", status: "checked_in", total: 230100, arrivalTime: "13:15", eta: "—" },
  { id: "AH-0193D5", guest: "Sophie Laurent", room: "203", roomType: "Royal Terrace", checkIn: "Mar 14", checkOut: "Mar 19", status: "checked_in", total: 259600, arrivalTime: "16:20", eta: "—" },
  { id: "AH-0193E6", guest: "David Chen", room: "204", roomType: "Royal Terrace", checkIn: "Mar 14", checkOut: "Mar 17", status: "checked_in", total: 129800, arrivalTime: "12:45", eta: "—" },
  // Arriving today (confirmed)
  { id: "AH-0193F7", guest: "Meera Nair", room: "205", roomType: "Royal Terrace", checkIn: "Mar 15", checkOut: "Mar 19", status: "confirmed", total: 259600, arrivalTime: "—", eta: "14:00" },
  { id: "AH-0193G8", guest: "Aisha Khan", room: "301", roomType: "Maharajah Suite", checkIn: "Mar 15", checkOut: "Mar 20", status: "confirmed", total: 480000, arrivalTime: "—", eta: "15:30" },
  { id: "AH-0193H9", guest: "Marco Rossi", room: "302", roomType: "Lake Pavilion", checkIn: "Mar 15", checkOut: "Mar 19", status: "confirmed", total: 495000, arrivalTime: "—", eta: "16:00" },
  { id: "AH-0193I1", guest: "Yuki Tanaka", room: "106", roomType: "Garden View", checkIn: "Mar 15", checkOut: "Mar 17", status: "confirmed", total: 115000, arrivalTime: "—", eta: "17:20" },
];

export const channels = [
  { name: "Direct", pct: 42, count: 178, color: "#4F46E5" },
  { name: "Booking.com", pct: 22, count: 93, color: "#0EA5E9" },
  { name: "Expedia", pct: 14, count: 59, color: "#F97316" },
  { name: "Travel Agents", pct: 12, count: 51, color: "#10B981" },
  { name: "Corporate", pct: 6, count: 25, color: "#EC4899" },
  { name: "Referral", pct: 4, count: 17, color: "#C9A227" },
];

export const roomsInventory = Array.from({ length: 22 }).map((_, i) => {
  const type = ["Heritage Grand", "Garden View", "Royal Terrace", "Maharajah Suite", "Lake Pavilion"][i % 5];
  const statusPool = ["clean", "dirty", "inspected", "occupied", "ooo"];
  return {
    id: `R-${100 + i}`,
    number: `${100 + i}`,
    type,
    floor: Math.floor(i / 8) + 1,
    status: statusPool[i % statusPool.length],
    guest: i % 3 === 0 ? "Rajesh Sharma" : "—",
    rate: [12000, 18000, 24000, 42000, 58000][i % 5],
  };
});

export const guests = [
  { id: "G-092841", name: "Aarav Mehta", email: "aarav@example.com", tier: "Platinum", stays: 12, spend: 342000, lastStay: "Nov 12, 2025", country: "India" },
  { id: "G-081227", name: "Eleanor Ross", email: "eleanor@example.com", tier: "Gold", stays: 8, spend: 218000, lastStay: "Oct 04, 2025", country: "United Kingdom" },
  { id: "G-071156", name: "Kenji Tanaka", email: "kenji@example.com", tier: "Diamond", stays: 24, spend: 685000, lastStay: "Sep 22, 2025", country: "Japan" },
  { id: "G-064421", name: "Isabella Rossi", email: "isabella@example.com", tier: "Platinum", stays: 15, spend: 412000, lastStay: "Aug 18, 2025", country: "Italy" },
  { id: "G-052890", name: "Marco Rossi", email: "marco@example.com", tier: "Gold", stays: 6, spend: 176000, lastStay: "Jul 09, 2025", country: "Italy" },
  { id: "G-041127", name: "Sophie Laurent", email: "sophie@example.com", tier: "Silver", stays: 4, spend: 89000, lastStay: "Jun 12, 2025", country: "France" },
  { id: "G-034578", name: "David Chen", email: "david@example.com", tier: "Gold", stays: 9, spend: 245000, lastStay: "May 18, 2025", country: "Singapore" },
  { id: "G-021109", name: "Aisha Khan", email: "aisha@example.com", tier: "Platinum", stays: 14, spend: 398000, lastStay: "Apr 22, 2025", country: "UAE" },
];

export const housekeeping = roomsInventory.map((r, i) => ({
  ...r,
  attendant: ["Meera K.", "Anjali V.", "Priya S.", "Rohan D."][i % 4],
  eta: ["09:30", "10:00", "10:30", "11:00", "11:30", "12:00"][i % 6],
  priority: r.status === "occupied" ? "low" : r.status === "dirty" ? "high" : "medium",
}));

// Housekeeping attendants directory
export const hkAttendants = [
  { id: "att-1", name: "Meera K.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80", shift: "Morning · 07:00 – 15:00" },
  { id: "att-2", name: "Anjali V.", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80", shift: "Morning · 07:00 – 15:00" },
  { id: "att-3", name: "Priya S.", avatar: "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=200&q=80", shift: "Afternoon · 12:00 – 20:00" },
  { id: "att-4", name: "Rohan D.", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80", shift: "Afternoon · 12:00 – 20:00" },
];

export const menuItems = [
  { id: "m1", name: "Laal Maas", category: "Lunch", price: 4800, active: true, ingredients: "Lamb, mathania chilli, ghee", cost: 1400 },
  { id: "m2", name: "Chef's Table Tasting", category: "Dinner", price: 24000, active: true, ingredients: "10-course seasonal", cost: 6800 },
  { id: "m3", name: "Palace Thali", category: "Lunch", price: 9200, active: true, ingredients: "12-course brass thali", cost: 2400 },
  { id: "m4", name: "Saffron Kheer Porridge", category: "Breakfast", price: 2400, active: true, ingredients: "Steel-cut oats, saffron, almonds", cost: 400 },
  { id: "m5", name: "Rose Kulfi", category: "Desserts", price: 1800, active: true, ingredients: "Rose, cardamom, pistachio", cost: 380 },
  { id: "m6", name: "Aura Reserve Champagne", category: "Wine", price: 24000, active: false, ingredients: "Blanc de Blancs GC", cost: 12000 },
];

export const spaAppointments = [
  { id: "SA-01", guest: "Aarav Mehta", room: "301", treatment: "Royal Abhyanga", therapist: "Meera K.", time: "10:00", duration: "90 min", price: 24000, status: "confirmed" },
  { id: "SA-02", guest: "Eleanor Ross", room: "205", treatment: "Rose Hammam", therapist: "Priya S.", time: "11:30", duration: "120 min", price: 38000, status: "in_progress" },
  { id: "SA-03", guest: "Kenji Tanaka", room: "302", treatment: "Shirodhara Ritual", therapist: "Anjali V.", time: "14:00", duration: "75 min", price: 32000, status: "confirmed" },
  { id: "SA-04", guest: "Isabella Rossi", room: "301", treatment: "Couple's Retreat", therapist: "Team of 2", time: "16:30", duration: "150 min", price: 62000, status: "confirmed" },
];

export const events = [
  { id: "EV-01", title: "Rossi–Kapoor Wedding", type: "Wedding", date: "Mar 22, 2026", guests: 240, venue: "Diwan-i-Khas Courtyard", planner: "Aisha Khan", revenue: 4800000 },
  { id: "EV-02", title: "Aura Culinary Festival", type: "Festival", date: "Apr 05, 2026", guests: 120, venue: "Mughal Gardens", planner: "Chef Vikram", revenue: 890000 },
  { id: "EV-03", title: "TCS Board Retreat", type: "Corporate", date: "Apr 12, 2026", guests: 30, venue: "Palace Boardroom", planner: "Karan Malhotra", revenue: 1450000 },
];

export const inventory = [
  { id: "I-001", item: "Bvlgari Toiletries · Amenity Kit", category: "Guestroom", stock: 148, par: 200, unit: "kit", cost: 320 },
  { id: "I-002", item: "Egyptian Cotton Linen · King", category: "Housekeeping", stock: 42, par: 60, unit: "set", cost: 4200 },
  { id: "I-003", item: "Champagne · Aura Reserve", category: "Beverages", stock: 28, par: 40, unit: "bottle", cost: 12000 },
  { id: "I-004", item: "Saffron · Kashmiri", category: "Kitchen", stock: 240, par: 200, unit: "gram", cost: 480 },
  { id: "I-005", item: "Rose Petals · Fresh", category: "Spa", stock: 8, par: 20, unit: "kg", cost: 1200 },
  { id: "I-006", item: "Herbal Oil Blend", category: "Spa", stock: 34, par: 30, unit: "litre", cost: 2400 },
];

export const invoicesAdmin = [
  { id: "INV-2026-0092", ref: "AH-9F27C1", guest: "Aarav Mehta", date: "Mar 15, 2026", amount: 446000, status: "paid", method: "Visa •4242" },
  { id: "INV-2026-0091", ref: "AH-0193C4", guest: "James Thornton", date: "Mar 15, 2026", amount: 230100, status: "paid", method: "AMEX •8843" },
  { id: "INV-2026-0090", ref: "AH-0193D5", guest: "Sophie Laurent", date: "Mar 14, 2026", amount: 259600, status: "partial", method: "Mastercard •1029" },
  { id: "INV-2026-0089", ref: "AH-0193B3", guest: "Priya Mehta", date: "Mar 14, 2026", amount: 148500, status: "paid", method: "UPI" },
  { id: "INV-2026-0088", ref: "EV-01", guest: "Rossi–Kapoor Wedding", date: "Mar 12, 2026", amount: 4800000, status: "outstanding", method: "Bank transfer" },
  { id: "INV-2026-0087", ref: "AH-0193A2", guest: "Rajesh Sharma", date: "Mar 12, 2026", amount: 148500, status: "paid", method: "Visa •9982" },
];

export const campaigns = [
  { id: "C-01", name: "Monsoon Retreat", audience: 12480, sent: "Mar 10, 2026", opens: 4820, clicks: 618, bookings: 42, revenue: 2480000, status: "sent" },
  { id: "C-02", name: "Diwali Preview", audience: 18240, sent: "Mar 05, 2026", opens: 7960, clicks: 1240, bookings: 78, revenue: 4820000, status: "sent" },
  { id: "C-03", name: "Chef's Table Spring", audience: 4820, sent: "—", opens: 0, clicks: 0, bookings: 0, revenue: 0, status: "draft" },
];

export const reviews = [
  { id: "R-01", guest: "Kenji Tanaka", channel: "Google", rating: 5, title: "Beyond exquisite", body: "The silence at dawn, the saffron kheer, the private terrace at sunset — an unforgettable stay.", date: "Mar 12, 2026", responded: true },
  { id: "R-02", guest: "Eleanor Ross", channel: "TripAdvisor", rating: 5, title: "A masterpiece of hospitality", body: "Service anticipates your every need before you realise it.", date: "Mar 10, 2026", responded: true },
  { id: "R-03", guest: "Marco Rossi", channel: "Booking.com", rating: 4, title: "Beautiful but the Wi-Fi in the Mughal gardens...", body: "Only quibble — the outdoor Wi-Fi was patchy in the far east lawn.", date: "Mar 08, 2026", responded: false },
  { id: "R-04", guest: "Sophie Laurent", channel: "Google", rating: 5, title: "Truly royal", body: "The Chef's Table dinner made the trip. Extraordinary.", date: "Mar 07, 2026", responded: false },
];

export const notificationsAdmin = [
  { id: "N-1", title: "New reservation · AH-0193F7", body: "Meera Nair · Mar 15 → Mar 19 · Royal Terrace 205", when: "2m ago", read: false, kind: "reservation" },
  { id: "N-2", title: "Urgent maintenance ticket", body: "Room 401 AC unit reported non-functional by Front Desk", when: "18m ago", read: false, kind: "maintenance" },
  { id: "N-3", title: "Review awaiting response", body: "Marco Rossi · 4★ Booking.com — Wi-Fi concern in gardens", when: "1h ago", read: false, kind: "review" },
  { id: "N-4", title: "Inventory low: Rose Petals", body: "Below par (8/20 kg) — reorder recommended", when: "2h ago", read: true, kind: "inventory" },
  { id: "N-5", title: "Campaign 'Diwali Preview' completed", body: "78 bookings · ₹48,20,000 revenue attributed", when: "Yesterday", read: true, kind: "marketing" },
];

// Audit log entries (expanded) — actor, action type, target, when
export const auditLog = [
  { id: "AL-001", actor: "Anjali Desai", role: "general_manager", action: "role_change", target: "Ravi Menon → Front Desk", when: "2 min ago", ts: "2026-03-15T09:58:00" },
  { id: "AL-002", actor: "Sunita Rao", role: "accounting", action: "invoice_download", target: "INV-2026-0092", when: "18 min ago", ts: "2026-03-15T09:42:00" },
  { id: "AL-003", actor: "Meera Kaur", role: "housekeeping", action: "room_inspected", target: "Room 106", when: "24 min ago", ts: "2026-03-15T09:36:00" },
  { id: "AL-004", actor: "Karan Malhotra", role: "marketing", action: "campaign_sent", target: "Diwali Preview", when: "1 h ago", ts: "2026-03-15T09:00:00" },
  { id: "AL-005", actor: "Anjali Desai", role: "general_manager", action: "rate_updated", target: "Maharajah Suite → ₹58,000", when: "2 h ago", ts: "2026-03-15T08:00:00" },
  { id: "AL-006", actor: "Ravi Menon", role: "front_desk", action: "check_in", target: "AH-0193A2 · Rajesh Sharma", when: "3 h ago", ts: "2026-03-15T07:00:00" },
  { id: "AL-007", actor: "Sunita Rao", role: "accounting", action: "refund_issued", target: "INV-2026-0085 · ₹42,000", when: "4 h ago", ts: "2026-03-15T06:00:00" },
  { id: "AL-008", actor: "Chef Vikram", role: "fb_manager", action: "menu_updated", target: "Aura Reserve Champagne toggled off", when: "5 h ago", ts: "2026-03-15T05:00:00" },
  { id: "AL-009", actor: "Priya S.", role: "spa_manager", action: "appointment_created", target: "SA-04 · Isabella Rossi", when: "6 h ago", ts: "2026-03-15T04:00:00" },
  { id: "AL-010", actor: "Anjali Desai", role: "general_manager", action: "settings_changed", target: "Tax rate 18% → 18%", when: "Yesterday", ts: "2026-03-14T18:00:00" },
  { id: "AL-011", actor: "Karan Malhotra", role: "marketing", action: "review_replied", target: "R-02 · Eleanor Ross", when: "Yesterday", ts: "2026-03-14T16:00:00" },
  { id: "AL-012", actor: "Ravi Menon", role: "front_desk", action: "check_out", target: "AH-0192Z2 · Nikhil Rao", when: "Yesterday", ts: "2026-03-14T12:00:00" },
  { id: "AL-013", actor: "Anjali Desai", role: "general_manager", action: "user_invited", target: "new-staff@aurahotels.com", when: "2 days ago", ts: "2026-03-13T14:00:00" },
  { id: "AL-014", actor: "Meera Kaur", role: "housekeeping", action: "room_ooo", target: "Room 401 (AC unit)", when: "2 days ago", ts: "2026-03-13T11:00:00" },
  { id: "AL-015", actor: "Sunita Rao", role: "accounting", action: "invoice_download", target: "INV-2026-0088", when: "3 days ago", ts: "2026-03-12T15:00:00" },
];

export const AUDIT_ACTION_LABELS = {
  role_change: "Role change",
  invoice_download: "Invoice download",
  room_inspected: "Room inspected",
  campaign_sent: "Campaign sent",
  rate_updated: "Rate updated",
  check_in: "Check-in",
  check_out: "Check-out",
  refund_issued: "Refund",
  menu_updated: "Menu update",
  appointment_created: "Appointment",
  settings_changed: "Settings",
  review_replied: "Review reply",
  user_invited: "User invited",
  room_ooo: "Room OOO",
};

// OTA channel connections for the Rate & Channel Manager
export const otaChannels = [
  { id: "ch-direct", name: "Aura Direct", logo: "A", color: "#4F46E5", status: "connected", commission: 0, mapped: 5, total: 5, lastSync: "Just now", desc: "Your own website — full-margin bookings." },
  { id: "ch-bcom", name: "Booking.com", logo: "B", color: "#003580", status: "connected", commission: 15, mapped: 5, total: 5, lastSync: "2 min ago", desc: "Global OTA · 42% of external bookings." },
  { id: "ch-expedia", name: "Expedia Group", logo: "E", color: "#EFC132", status: "connected", commission: 18, mapped: 4, total: 5, lastSync: "8 min ago", desc: "Expedia, Hotels.com, VRBO, Trivago." },
  { id: "ch-agoda", name: "Agoda", logo: "A", color: "#FF5C0F", status: "sync_error", commission: 17, mapped: 3, total: 5, lastSync: "3 h ago", desc: "APAC · sync error — rate parity mismatch." },
  { id: "ch-airbnb", name: "Airbnb Luxe", logo: "A", color: "#FF5A5F", status: "connected", commission: 12, mapped: 2, total: 5, lastSync: "12 min ago", desc: "Curated luxury listings — private stays." },
  { id: "ch-mmt", name: "MakeMyTrip", logo: "M", color: "#EB2226", status: "unlinked", commission: 16, mapped: 0, total: 5, lastSync: "—", desc: "India domestic · not yet connected." },
  { id: "ch-tripcom", name: "Trip.com", logo: "T", color: "#287DFA", status: "unlinked", commission: 15, mapped: 0, total: 5, lastSync: "—", desc: "China & APAC · upgrade to Pro to unlock." },
  { id: "ch-hyatt", name: "GDS · Sabre", logo: "S", color: "#0F172A", status: "connected", commission: 8, mapped: 5, total: 5, lastSync: "1 h ago", desc: "Corporate travel & agency GDS distribution." },
];

// Rate Calendar — categories with a base rate; the calendar renders next 14 days
export const rateCategories = [
  { id: "cat-hg", label: "Heritage Grand", baseRate: 24000, code: "HGN" },
  { id: "cat-gv", label: "Garden View", baseRate: 32000, code: "GVR" },
  { id: "cat-rt", label: "Royal Terrace", baseRate: 48000, code: "RTS" },
  { id: "cat-lp", label: "Lake Pavilion", baseRate: 92000, code: "LPV" },
  { id: "cat-ms", label: "Maharajah Suite", baseRate: 148000, code: "MHS" },
];

export const statusColor = (s) => ({
  clean: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Clean" },
  dirty: { bg: "bg-rose-50", text: "text-rose-700", label: "Dirty" },
  inspected: { bg: "bg-indigo-50", text: "text-indigo-700", label: "Inspected" },
  occupied: { bg: "bg-amber-50", text: "text-amber-700", label: "Occupied" },
  ooo: { bg: "bg-slate-100", text: "text-slate-700", label: "OOO/Maint." },
  confirmed: { bg: "bg-indigo-50", text: "text-indigo-700", label: "Confirmed" },
  checked_in: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Checked in" },
  checked_out: { bg: "bg-slate-100", text: "text-slate-700", label: "Checked out" },
  in_progress: { bg: "bg-amber-50", text: "text-amber-700", label: "In progress" },
  paid: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Paid" },
  partial: { bg: "bg-amber-50", text: "text-amber-700", label: "Partial" },
  outstanding: { bg: "bg-rose-50", text: "text-rose-700", label: "Outstanding" },
  sent: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Sent" },
  draft: { bg: "bg-slate-100", text: "text-slate-700", label: "Draft" },
  connected: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Connected" },
  sync_error: { bg: "bg-rose-50", text: "text-rose-700", label: "Sync Error" },
  unlinked: { bg: "bg-slate-100", text: "text-slate-600", label: "Unlinked" },
}[s] || { bg: "bg-slate-100", text: "text-slate-700", label: s });
