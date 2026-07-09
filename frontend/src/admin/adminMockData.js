// Mock data for admin portal
export const stats = {
  arrivals: 12, departures: 7, inHouse: 24, revenueToday: 42800,
  adr: 892, occupancy: 87, revpar: 776,
};

export const revenueTrend = [
  { d: "Mar 1", v: 28400 }, { d: "2", v: 31200 }, { d: "3", v: 26800 }, { d: "4", v: 34500 },
  { d: "5", v: 39100 }, { d: "6", v: 42800 }, { d: "7", v: 38900 }, { d: "8", v: 45600 },
  { d: "9", v: 41200 }, { d: "10", v: 48900 }, { d: "11", v: 47600 }, { d: "12", v: 52400 },
  { d: "13", v: 49800 }, { d: "14", v: 54900 }, { d: "15", v: 58200 },
];

export const activities = [
  { id: "a1", type: "checkin", title: "Check-in completed", body: "Rajesh Sharma checked into Room 101", when: "2m ago", color: "#10B981", icon: "right-to-bracket" },
  { id: "a2", type: "reservation", title: "New reservation", body: "AH-9F27C1 — Meera Nair, 4 nights, ₹1,50,000", when: "10m ago", color: "#4F46E5", icon: "calendar-plus" },
  { id: "a3", type: "maintenance", title: "Urgent maintenance", body: "Room 401 AC unit reported non-functional", when: "18m ago", color: "#C9A227", icon: "screwdriver-wrench" },
  { id: "a4", type: "housekeeping", title: "Housekeeping done", body: "Room 106 inspected and marked ready", when: "24m ago", color: "#10B981", icon: "broom" },
  { id: "a5", type: "checkout", title: "Check-out completed", body: "David Chen checked out of Room 204", when: "1h ago", color: "#F43F5E", icon: "right-from-bracket" },
  { id: "a6", type: "reservation", title: "New reservation", body: "ALMA-VLTW/NP2 — Aisha Khan (Platinum), 4 nights", when: "1h ago", color: "#4F46E5", icon: "calendar-plus" },
];

export const arrivals = [
  { id: "AH-0193A2", guest: "Rajesh Sharma", room: "101", roomType: "Heritage Grand", checkIn: "Mar 15", checkOut: "Mar 18", status: "checked_in", total: 148500 },
  { id: "AH-0193B3", guest: "Priya Mehta", room: "102", roomType: "Heritage Grand", checkIn: "Mar 15", checkOut: "Mar 18", status: "checked_in", total: 148500 },
  { id: "AH-0193C4", guest: "James Thornton", room: "105", roomType: "Garden View", checkIn: "Mar 15", checkOut: "Mar 18", status: "checked_in", total: 230100 },
  { id: "AH-0193D5", guest: "Sophie Laurent", room: "203", roomType: "Royal Terrace", checkIn: "Mar 15", checkOut: "Mar 19", status: "checked_in", total: 259600 },
  { id: "AH-0193E6", guest: "David Chen", room: "204", roomType: "Royal Terrace", checkIn: "Mar 15", checkOut: "Mar 17", status: "checked_in", total: 129800 },
  { id: "AH-0193F7", guest: "Meera Nair", room: "205", roomType: "Royal Terrace", checkIn: "Mar 15", checkOut: "Mar 19", status: "confirmed", total: 259600 },
  { id: "AH-0193G8", guest: "Aisha Khan", room: "301", roomType: "Maharajah Suite", checkIn: "Mar 16", checkOut: "Mar 20", status: "confirmed", total: 480000 },
  { id: "AH-0193H9", guest: "Marco Rossi", room: "302", roomType: "Lake Pavilion", checkIn: "Mar 16", checkOut: "Mar 19", status: "confirmed", total: 495000 },
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

export const housekeeping = roomsInventory.map((r) => ({
  ...r,
  attendant: ["Meera K.", "Anjali V.", "Priya S.", "Rohan D."][r.number % 4],
  eta: ["09:30", "10:00", "10:30", "11:00", "11:30", "12:00"][r.number % 6],
  priority: r.status === "occupied" ? "low" : r.status === "dirty" ? "high" : "medium",
}));

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
}[s] || { bg: "bg-slate-100", text: "text-slate-700", label: s });
