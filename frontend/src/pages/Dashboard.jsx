import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { PropertyMark } from "@/components/PropertyMark";
import { rooms, experiences, spaTreatments } from "@/data/mockData";

const nav = [
  { id: "dashboard", label: "Dashboard", icon: "gauge" },
  { id: "bookings", label: "Bookings", icon: "calendar" },
  { id: "dining", label: "Dining", icon: "utensils" },
  { id: "spa", label: "Spa", icon: "spa" },
  { id: "experiences", label: "Experiences", icon: "compass" },
  { id: "invoices", label: "Invoices", icon: "file-invoice" },
  { id: "profile", label: "Profile", icon: "user" },
  { id: "settings", label: "Settings", icon: "gear" },
];

const bookingHistory = [
  { id: "AH-9F27C1", suite: "Maharajah Suite", dates: "Nov 12 – Nov 15, 2025", nights: 3, amount: 4460, status: "Upcoming" },
  { id: "AH-7A19DE", suite: "Lake Pavilion", dates: "Mar 08 – Mar 12, 2025", nights: 4, amount: 7920, status: "Completed" },
  { id: "AH-4B02F7", suite: "Courtyard Grand", dates: "Dec 22 – Dec 26, 2024", nights: 4, amount: 3960, status: "Completed" },
  { id: "AH-1C93AA", suite: "Royal Heritage", dates: "Aug 04 – Aug 07, 2024", nights: 3, amount: 8640, status: "Completed" },
];

const initialNotifications = [
  { id: "n1", i: "bell", t: "Your butler has prepared an itinerary", d: "10 min ago", c: "#C9A227", read: false },
  { id: "n2", i: "sparkles", t: "Spa slots opened for Nov 13", d: "2 hours ago", c: "#4F46E5", read: false },
  { id: "n3", i: "utensils", t: "Chef's Table confirmed for Nov 13", d: "Yesterday", c: "#10B981", read: true },
];

const invoicesData = [
  { id: "INV-2025-091", ref: "AH-9F27C1", date: "Nov 08, 2025", amount: 4460, status: "Paid" },
  { id: "INV-2025-042", ref: "AH-7A19DE", date: "Mar 04, 2025", amount: 7920, status: "Paid" },
  { id: "INV-2024-138", ref: "AH-4B02F7", date: "Dec 18, 2024", amount: 3960, status: "Paid" },
  { id: "INV-2024-104", ref: "AH-1C93AA", date: "Aug 01, 2024", amount: 8640, status: "Paid" },
];

const initialDining = [
  { id: "d1", name: "Chef's Table Tasting", when: "Nov 13, 20:00", guests: 2, restaurant: "The Palace Table" },
];
const initialSpa = [
  { id: "s1", name: "Royal Abhyanga", when: "Nov 13, 15:00", therapist: "Meera K.", duration: "90 min" },
];
const initialExperiences = [
  { id: "e1", title: "Heritage Walk", when: "Nov 13, 07:00" },
  { id: "e2", title: "Sunset Boating", when: "Nov 14, 17:30" },
];

export default function Dashboard() {
  const [active, setActive] = useState("dashboard");
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [notifs, setNotifs] = useState(initialNotifications);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [modifyOpen, setModifyOpen] = useState(false);
  const [earlyOpen, setEarlyOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(null);
  const [detailBooking, setDetailBooking] = useState(null);
  const [rescheduleItem, setRescheduleItem] = useState(null); // { kind: 'dining'|'spa'|'experience', item }
  const [dining, setDining] = useState(initialDining);
  const [spa, setSpa] = useState(initialSpa);
  const [upcomingExps, setUpcomingExps] = useState(initialExperiences);
  const [query, setQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [bookSpaOpen, setBookSpaOpen] = useState(false);
  const [bookDinnerOpen, setBookDinnerOpen] = useState(false);

  // Reservation state (may be updated by Modify Booking) — read from Booking page's localStorage
  const stored = (() => { try { return JSON.parse(localStorage.getItem("aura_booking") || "null"); } catch (e) { return null; } })();
  const defaultIn = new Date(); defaultIn.setDate(defaultIn.getDate() + 6);
  const defaultOut = new Date(); defaultOut.setDate(defaultOut.getDate() + 9);
  const toISO = (d) => d.toISOString().slice(0, 10);
  const [stay, setStay] = useState({
    suite: stored?.roomName || "The Maharajah Suite",
    checkIn: stored?.checkIn || toISO(defaultIn),
    checkOut: stored?.checkOut || toISO(defaultOut),
    guests: `${stored?.adults || 2} Adults · ${stored?.roomsCount || 1} Suite`,
    grand: stored?.grand ?? 4460,
    paid: stored?.payNow ?? Math.round((stored?.grand ?? 4460) * 0.25),
    plan: stored?.plan || "reserve-25",
  });
  const [extras, setExtras] = useState([
    { id: "x1", label: "Room service · Continental breakfast", when: "Nov 12, 09:00", amount: 45 },
  ]);
  const [payBalanceOpen, setPayBalanceOpen] = useState(false);
  const [addExtrasOpen, setAddExtrasOpen] = useState(false);

  const extrasTotal = extras.reduce((s, e) => s + e.amount, 0);
  const balanceDue = stay.grand - stay.paid + extrasTotal;
  const isFullyPaid = balanceDue <= 0;
  const isFullPlan = stay.plan === "full" && extras.length === 0;

  // Profile state
  const [profile, setProfile] = useState({
    firstName: "Aarav", lastName: "Mehta", email: "aarav@example.com",
    phone: "+91 98200 12345", country: "India", passport: "K••••••2183",
    dob: "1988-04-12", notes: "Vegetarian · Sunset boat preferred",
  });
  // Settings
  const [prefs, setPrefs] = useState({
    emailUpdates: true, whatsapp: true, newsletter: true,
    twoFactor: true, currency: "USD", language: "English",
  });

  useEffect(() => {
    const target = new Date(`${stay.checkIn}T14:00:00`);
    const tick = () => {
      const now = new Date();
      const diff = Math.max(0, target - now);
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown({ d, h, m, s });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [stay.checkIn]);

  const unreadCount = notifs.filter((n) => !n.read).length;
  const markAllRead = () => { setNotifs((s) => s.map((n) => ({ ...n, read: true }))); toast.success("All notifications marked as read"); };
  const dismissNotif = (id) => setNotifs((s) => s.filter((n) => n.id !== id));

  // Quick actions
  const quickAction = (label) => toast.success(`${label} request sent`, { description: "Our concierge will reach out within moments." });
  const downloadInvoice = (id) => toast.success(`Invoice ${id} downloaded`, { description: "PDF saved to your device." });
  const emailInvoice = (id) => toast.success(`Invoice ${id} emailed`, { description: `Sent to ${profile.email}` });
  const exportHistory = () => toast.success("Booking history exported", { description: "CSV file saved to your device." });
  const cancelBooking = (id) => { toast.success(`Reservation ${id} cancellation requested`, { description: "A concierge will confirm within 1 hour." }); setCancelOpen(null); };
  const saveProfile = () => toast.success("Profile updated", { description: "Your preferences are saved." });
  const savePrefs = () => toast.success("Preferences saved");

  // Dining / Spa / Experience cancel + reschedule
  const cancelDining = (id) => { setDining((s) => s.filter((x) => x.id !== id)); toast.success("Dining reservation cancelled"); };
  const cancelSpa = (id) => { setSpa((s) => s.filter((x) => x.id !== id)); toast.success("Spa appointment cancelled"); };
  const cancelExperience = (id) => { setUpcomingExps((s) => s.filter((x) => x.id !== id)); toast.success("Experience cancelled"); };

  const confirmReschedule = (newWhen) => {
    if (!rescheduleItem) return;
    const { kind, item } = rescheduleItem;
    const updater = (list) => list.map((x) => (x.id === item.id ? { ...x, when: newWhen } : x));
    if (kind === "dining") setDining(updater);
    if (kind === "spa") setSpa(updater);
    if (kind === "experience") setUpcomingExps(updater);
    toast.success(`${kind === "spa" ? "Appointment" : kind === "dining" ? "Reservation" : "Experience"} rescheduled`, { description: `New time: ${newWhen}` });
    setRescheduleItem(null);
  };

  const payBalance = () => {
    const settled = balanceDue;
    setStay((s) => ({ ...s, paid: s.grand }));
    setExtras([]);
    toast.success("Balance settled", { description: `$${settled.toLocaleString()} charged to Visa •••• 4242` });
    setPayBalanceOpen(false);
  };
  const addExtra = (label, amount) => {
    setExtras((s) => [...s, { id: `x${Date.now()}`, label, when: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }), amount }]);
    toast.success(`${label} added`, { description: `$${amount} added to your folio` });
  };
  const removeExtra = (id) => setExtras((s) => s.filter((e) => e.id !== id));
  const applyModify = ({ checkIn, checkOut, suite }) => {
    setStay((s) => ({ ...s, checkIn, checkOut, suite }));
    toast.success("Booking modified", { description: `${suite} · ${checkIn} → ${checkOut}` });
    setModifyOpen(false);
  };
  const applyEarlyCheckin = (slot) => {
    toast.success("Early check-in confirmed", { description: `Arrival at ${slot} on ${new Date(stay.checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` });
    setEarlyOpen(false);
  };

  const confirmBookSpa = ({ treatmentId, date, time }) => {
    const t = spaTreatments.find((x) => x.id === treatmentId);
    if (!t) return;
    const label = `${new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${time}`;
    setSpa((s) => [...s, { id: `s${Date.now()}`, name: t.name, when: label, therapist: t.therapist, duration: t.duration }]);
    setExtras((s) => [...s, { id: `x${Date.now()}`, label: `Spa · ${t.name}`, when: label, amount: t.price }]);
    toast.success("Spa treatment booked", { description: `${t.name} · ${label} · $${t.price} added to folio` });
    setBookSpaOpen(false);
  };

  const confirmBookDinner = ({ restaurant, date, time, guests }) => {
    const label = `${new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${time}`;
    const priceMap = { "Chef's Table Tasting": 240, "The Palace Table · Royal Thali": 92, "Rooftop Grill": 68, "Garden Breakfast": 26 };
    const amount = priceMap[restaurant] * guests;
    setDining((s) => [...s, { id: `d${Date.now()}`, name: restaurant, when: label, guests, restaurant }]);
    setExtras((s) => [...s, { id: `x${Date.now()}`, label: `Dining · ${restaurant} · ${guests} guests`, when: label, amount }]);
    toast.success("Dining table reserved", { description: `${restaurant} · ${label} · $${amount} added to folio` });
    setBookDinnerOpen(false);
  };

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results = [];
    bookingHistory.forEach((b) => { if (b.id.toLowerCase().includes(q) || b.suite.toLowerCase().includes(q)) results.push({ type: "Reservation", label: `${b.suite} · ${b.id}`, id: b.id }); });
    rooms.forEach((r) => { if (r.name.toLowerCase().includes(q)) results.push({ type: "Suite", label: r.name, id: r.id }); });
    experiences.forEach((e) => { if (e.title.toLowerCase().includes(q)) results.push({ type: "Experience", label: e.title, id: e.id }); });
    return results.slice(0, 8);
  }, [query]);

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex" data-testid="dashboard-page">
      {/* SIDEBAR */}
      <aside className={`flex flex-col w-72 bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-40 transition-transform duration-300 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`} data-testid="dashboard-sidebar">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <PropertyMark size="sm" />
          <button onClick={() => setMobileNavOpen(false)} className="lg:hidden w-8 h-8 rounded-full hover:bg-slate-50 grid place-items-center">
            <i className="fa-solid fa-xmark text-slate-500 text-sm"></i>
          </button>
        </div>
        <nav className="p-5 flex-1 space-y-1 overflow-y-auto">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => { setActive(n.id); setMobileNavOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm transition-all ${
                active === n.id
                  ? "bg-slate-900 text-white shadow-[0_6px_20px_rgba(15,23,42,0.25)]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
              data-testid={`side-${n.id}`}
            >
              <i className={`fa-solid fa-${n.icon} text-xs w-4`}></i>
              <span>{n.label}</span>
              {n.id === "bookings" && <span className="ml-auto text-[10px] bg-[#C9A227] text-white px-2 py-0.5 rounded-full font-mono">1</span>}
            </button>
          ))}
        </nav>
        <div className="m-5 p-5 rounded-[18px] bg-gradient-to-br from-indigo-900 to-slate-900 text-white">
          <p className="text-eyebrow text-[#E6C868]">Aura Circle</p>
          <p className="mt-2 font-serif text-2xl">Platinum</p>
          <p className="text-xs text-white/60 mt-1">2,480 nights to Diamond</p>
          <div className="mt-3 w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-2/3 bg-[#E6C868]"></div>
          </div>
        </div>
      </aside>

      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-900/40 z-30" onClick={() => setMobileNavOpen(false)}></div>
      )}

      <div className="flex-1 lg:ml-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#FAFAF8]/80 backdrop-blur-xl border-b border-slate-200 px-6 md:px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden w-10 h-10 rounded-full border border-slate-200 hover:bg-white grid place-items-center"
              data-testid="mobile-nav-toggle"
            >
              <i className="fa-solid fa-bars text-xs text-slate-600"></i>
            </button>
            <div>
              <p className="text-eyebrow text-slate-500">Good evening,</p>
              <h1 className="font-serif text-2xl text-slate-900">
                {active === "dashboard" ? "Welcome back, Aarav" : nav.find((n) => n.id === active)?.label}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 rounded-full border border-slate-200 hover:bg-white grid place-items-center"
              data-testid="top-search"
            >
              <i className="fa-solid fa-magnifying-glass text-xs text-slate-600"></i>
            </button>
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="w-10 h-10 rounded-full border border-slate-200 hover:bg-white grid place-items-center relative"
                data-testid="top-notifications"
              >
                <i className="fa-regular fa-bell text-xs text-slate-600"></i>
                {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-[#FAFAF8]"></span>}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-slate-200 rounded-[18px] shadow-[0_20px_50px_rgba(15,23,42,0.10)] p-4 z-40" data-testid="notif-panel">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-serif text-lg text-slate-900">Notifications</p>
                    <button onClick={markAllRead} className="text-xs text-[#4F46E5] hover:underline" data-testid="mark-all-read">Mark all read</button>
                  </div>
                  {notifs.length === 0 ? (
                    <p className="text-sm text-slate-500 py-6 text-center">You&apos;re all caught up.</p>
                  ) : (
                    <ul className="space-y-2 max-h-80 overflow-y-auto">
                      {notifs.map((n) => (
                        <li key={n.id} className={`flex items-start gap-3 p-3 rounded-[12px] ${n.read ? "" : "bg-[#FAFAF8]"}`}>
                          <span className="w-9 h-9 rounded-full grid place-items-center flex-shrink-0" style={{ backgroundColor: `${n.c}18`, color: n.c }}>
                            <i className={`fa-solid fa-${n.i} text-xs`}></i>
                          </span>
                          <div className="flex-1">
                            <p className="text-sm text-slate-900">{n.t}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{n.d}</p>
                          </div>
                          <button onClick={() => dismissNotif(n.id)} className="text-slate-400 hover:text-slate-900 text-xs" data-testid={`dismiss-${n.id}`}>
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" alt="" className="w-9 h-9 rounded-full object-cover" />
              <div className="hidden md:block">
                <p className="text-sm text-slate-900 font-medium">Aarav Mehta</p>
                <p className="text-[10px] text-slate-500 font-mono">AH-092841</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-10 space-y-8" data-testid={`section-${active}`}>
          {active === "dashboard" && (
            <>
              {/* Upcoming Stay Hero */}
              <section className="relative overflow-hidden rounded-[28px] text-white" data-testid="upcoming-stay">
                <img src={rooms[0].images[0]} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/55 to-slate-900/25"></div>
                <div className="relative p-10 md:p-14 grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="md:col-span-2">
                    <p className="text-eyebrow text-[#E6C868]">Your Next Stay</p>
                    <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-tight" data-testid="stay-suite">{stay.suite}</h2>
                    <p className="text-white/80 mt-2 text-sm" data-testid="stay-dates">
                      {new Date(stay.checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })} → {new Date(stay.checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {Math.max(1, Math.round((new Date(stay.checkOut) - new Date(stay.checkIn)) / 86400000))} nights · {stay.guests}
                    </p>

                    <div className="mt-8 grid grid-cols-4 gap-3 max-w-md">
                      {["Days", "Hours", "Minutes", "Seconds"].map((l, i) => {
                        const v = [countdown.d, countdown.h, countdown.m, countdown.s][i];
                        return (
                          <div key={l} className="text-center glass-dark rounded-[14px] py-4">
                            <p className="font-mono text-2xl md:text-3xl text-white">{String(v).padStart(2, "0")}</p>
                            <p className="text-[10px] tracking-widest uppercase text-white/60 mt-1">{l}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <button onClick={() => setModifyOpen(true)} className="px-5 py-2.5 rounded-full bg-[#C9A227] hover:bg-[#B08D1E] text-slate-900 text-sm font-medium" data-testid="modify-booking-btn">Modify Booking</button>
                      <button onClick={() => setEarlyOpen(true)} className="px-5 py-2.5 rounded-full glass-dark text-white text-sm" data-testid="early-checkin-btn">Request Early Check-in</button>
                      <button onClick={() => setBookSpaOpen(true)} className="px-5 py-2.5 rounded-full glass-dark text-white text-sm" data-testid="book-spa-btn">Book Spa</button>
                      <button onClick={() => setBookDinnerOpen(true)} className="px-5 py-2.5 rounded-full glass-dark text-white text-sm" data-testid="book-dinner-btn">Book Dinner</button>
                    </div>
                  </div>

                  <div className="md:col-span-1 space-y-4">
                    <div className="glass-dark p-5 rounded-[18px]">
                      <p className="text-eyebrow text-[#E6C868]">Weather · Udaipur</p>
                      <div className="mt-3 flex items-center gap-3">
                        <i className="fa-solid fa-sun text-[#E6C868] text-3xl"></i>
                        <div>
                          <p className="font-serif text-3xl">28°C</p>
                          <p className="text-xs text-white/70">Sunny, gentle breeze</p>
                        </div>
                      </div>
                    </div>
                    <div className="glass-dark p-5 rounded-[18px] text-center">
                      <p className="text-eyebrow text-[#E6C868]">QR Check-in</p>
                      <div className="mt-3 mx-auto w-28 h-28 rounded-[14px] bg-white grid place-items-center">
                        <svg viewBox="0 0 40 40" className="w-24 h-24">
                          {[...Array(64)].map((_, k) => {
                            const seed = (k * 9301 + 49297) % 233280 / 233280;
                            return seed > 0.5 ? <rect key={k} x={(k % 8) * 5} y={Math.floor(k / 8) * 5} width="5" height="5" fill="#0F172A" /> : null;
                          })}
                          <rect x="0" y="0" width="10" height="10" fill="none" stroke="#0F172A" strokeWidth="1.5" />
                          <rect x="30" y="0" width="10" height="10" fill="none" stroke="#0F172A" strokeWidth="1.5" />
                          <rect x="0" y="30" width="10" height="10" fill="none" stroke="#0F172A" strokeWidth="1.5" />
                        </svg>
                      </div>
                      <p className="mt-3 font-mono text-xs">AH-9F27C1</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Outstanding Balance / Folio */}
              {!isFullPlan && (
                <section className="bg-white rounded-[28px] border border-slate-200 p-8 md:p-10" data-testid="folio-card">
                  <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
                    <div>
                      <p className="text-eyebrow text-[#C9A227]">Your Folio</p>
                      <h3 className="mt-2 font-serif text-3xl text-slate-900">Outstanding Balance</h3>
                      <p className="mt-2 text-sm text-slate-500">Deposit paid at booking. Remaining balance plus in-stay extras is settled at check-out.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-eyebrow text-slate-500">Due at check-out</p>
                      <p className="mt-1 font-mono text-4xl text-slate-900" data-testid="balance-due">${balanceDue.toLocaleString()}</p>
                      {isFullyPaid && <p className="text-xs text-emerald-600 mt-1">Paid in full · nothing due</p>}
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-[16px] bg-[#FAFAF8] border border-slate-100">
                      <p className="text-eyebrow text-slate-500">Grand Total</p>
                      <p className="mt-2 font-mono text-2xl text-slate-900">${stay.grand.toLocaleString()}</p>
                    </div>
                    <div className="p-5 rounded-[16px] bg-emerald-50/40 border border-emerald-100">
                      <p className="text-eyebrow text-emerald-700">Paid</p>
                      <p className="mt-2 font-mono text-2xl text-emerald-700" data-testid="balance-paid">${stay.paid.toLocaleString()}</p>
                    </div>
                    <div className="p-5 rounded-[16px] bg-indigo-50/40 border border-indigo-100">
                      <p className="text-eyebrow text-indigo-700">In-stay extras</p>
                      <p className="mt-2 font-mono text-2xl text-indigo-700" data-testid="balance-extras">${extrasTotal.toLocaleString()}</p>
                    </div>
                  </div>

                  {extras.length > 0 && (
                    <div className="mt-6" data-testid="folio-extras-list">
                      <p className="text-eyebrow text-slate-500 mb-3">Charges added to your folio</p>
                      <div className="divide-y divide-slate-100 border border-slate-100 rounded-[16px]">
                        {extras.map((e) => (
                          <div key={e.id} className="p-4 flex items-center justify-between" data-testid={`folio-item-${e.id}`}>
                            <div className="flex items-center gap-3">
                              <i className="fa-solid fa-receipt text-[#C9A227]"></i>
                              <div>
                                <p className="text-sm text-slate-900">{e.label}</p>
                                <p className="text-xs text-slate-500">{e.when}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm text-slate-900">+${e.amount}</span>
                              <button onClick={() => removeExtra(e.id)} className="text-slate-400 hover:text-rose-500" data-testid={`folio-remove-${e.id}`}>
                                <i className="fa-solid fa-xmark text-xs"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setPayBalanceOpen(true)}
                      disabled={isFullyPaid}
                      className="px-6 py-3 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm shadow-[0_10px_28px_rgba(79,70,229,0.28)]"
                      data-testid="pay-balance-btn"
                    >
                      Pay Balance · <span className="font-mono">${balanceDue.toLocaleString()}</span>
                    </button>
                    <button
                      onClick={() => setAddExtrasOpen(true)}
                      className="px-6 py-3 rounded-full border border-slate-200 hover:bg-slate-50 text-sm text-slate-900"
                      data-testid="add-extras-btn"
                    >
                      <i className="fa-solid fa-plus mr-1.5 text-[#C9A227]"></i>Add extras
                    </button>
                    <button
                      onClick={() => toast.success("Folio emailed", { description: `Sent to ${profile.email}` })}
                      className="px-6 py-3 rounded-full border border-slate-200 hover:bg-slate-50 text-sm text-slate-700"
                      data-testid="email-folio-btn"
                    >
                      <i className="fa-regular fa-envelope mr-1.5"></i>Email folio
                    </button>
                  </div>
                </section>
              )}

              {/* Stats */}
              <section className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="stats-row">
                {[
                  { l: "Nights Stayed", v: "42", d: "+3 this year", c: "#4F46E5" },
                  { l: "Loyalty Points", v: "18,240", d: "1,240 pending", c: "#C9A227" },
                  { l: "Experiences", v: "17", d: "3 upcoming", c: "#10B981" },
                  { l: "Lifetime Value", v: "$34.2K", d: "Platinum status", c: "#F43F5E" },
                ].map((s) => (
                  <div key={s.l} className="p-6 rounded-[20px] bg-white border border-slate-200">
                    <div className="flex items-center justify-between">
                      <p className="text-eyebrow text-slate-500">{s.l}</p>
                      <span className="w-8 h-8 rounded-full grid place-items-center" style={{ backgroundColor: `${s.c}12`, color: s.c }}>
                        <i className="fa-solid fa-arrow-trend-up text-[10px]"></i>
                      </span>
                    </div>
                    <p className="font-mono text-3xl text-slate-900 mt-3">{s.v}</p>
                    <p className="text-xs text-slate-500 mt-1">{s.d}</p>
                  </div>
                ))}
              </section>

              {/* Booking history + Notifications preview */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-[24px] border border-slate-200 overflow-hidden" data-testid="booking-history">
                  <div className="p-6 flex items-center justify-between border-b border-slate-100">
                    <div>
                      <p className="text-eyebrow text-[#C9A227]">Booking History</p>
                      <h3 className="mt-1 font-serif text-2xl text-slate-900">Your journeys</h3>
                    </div>
                    <button onClick={exportHistory} className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5" data-testid="export-history">
                      <i className="fa-solid fa-download text-[10px]"></i>Export
                    </button>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="text-[11px] tracking-widest uppercase text-slate-400">
                      <tr>
                        <th className="text-left px-6 py-3 font-medium">Reservation</th>
                        <th className="text-left px-6 py-3 font-medium">Suite</th>
                        <th className="text-left px-6 py-3 font-medium">Dates</th>
                        <th className="text-right px-6 py-3 font-medium">Total</th>
                        <th className="text-center px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingHistory.map((b) => (
                        <tr key={b.id} className="border-t border-slate-100 hover:bg-[#FAFAF8]" data-testid={`row-${b.id}`}>
                          <td className="px-6 py-4 font-mono text-slate-900">{b.id}</td>
                          <td className="px-6 py-4 text-slate-800">{b.suite}</td>
                          <td className="px-6 py-4 text-slate-500 text-xs">{b.dates}</td>
                          <td className="px-6 py-4 text-right font-mono text-slate-900">${b.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`text-[10px] px-2.5 py-1 rounded-full tracking-widest uppercase ${
                              b.status === "Upcoming" ? "bg-indigo-50 text-indigo-700" : "bg-emerald-50 text-emerald-700"
                            }`}>{b.status}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => downloadInvoice(b.id)} className="text-slate-400 hover:text-slate-900" data-testid={`row-invoice-${b.id}`}>
                              <i className="fa-solid fa-file-invoice"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Notifications preview + Quick actions */}
                <div className="space-y-6">
                  <div className="bg-white rounded-[24px] border border-slate-200 p-6" data-testid="notifications-preview">
                    <div className="flex items-center justify-between">
                      <p className="text-eyebrow text-[#C9A227]">Notifications</p>
                      <button onClick={() => setNotifOpen(true)} className="text-xs text-slate-500 hover:text-slate-900">View all</button>
                    </div>
                    <ul className="mt-4 space-y-4">
                      {notifs.slice(0, 3).map((n) => (
                        <li key={n.id} className="flex gap-3">
                          <span className="w-9 h-9 rounded-full grid place-items-center flex-shrink-0" style={{ backgroundColor: `${n.c}15`, color: n.c }}>
                            <i className={`fa-solid fa-${n.i} text-xs`}></i>
                          </span>
                          <div>
                            <p className="text-sm text-slate-900">{n.t}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{n.d}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-[24px] border border-slate-200 p-6">
                    <p className="text-eyebrow text-[#C9A227]">Quick Actions</p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {[
                        { i: "concierge-bell", l: "Concierge" },
                        { i: "utensils", l: "Room Service" },
                        { i: "car", l: "Car Service" },
                        { i: "person-swimming", l: "Pool Access" },
                      ].map((a) => (
                        <button
                          key={a.l}
                          onClick={() => quickAction(a.l)}
                          className="p-4 rounded-[14px] bg-[#FAFAF8] hover:bg-white hover:border-slate-300 border border-transparent text-left transition-all"
                          data-testid={`quick-${a.l.toLowerCase().replace(/\s/g, "-")}`}
                        >
                          <i className={`fa-solid fa-${a.i} text-[#C9A227]`}></i>
                          <p className="mt-2 text-sm text-slate-800">{a.l}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {active === "bookings" && (
            <section className="bg-white rounded-[24px] border border-slate-200 overflow-hidden">
              <div className="p-6 flex items-center justify-between border-b border-slate-100">
                <div>
                  <p className="text-eyebrow text-[#C9A227]">Your Bookings</p>
                  <h3 className="mt-1 font-serif text-2xl text-slate-900">Manage reservations</h3>
                </div>
                <Link to="/booking" className="text-xs bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 py-2 rounded-full">+ New reservation</Link>
              </div>
              <div className="divide-y divide-slate-100">
                {bookingHistory.map((b) => (
                  <div key={b.id} className="p-6 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6" data-testid={`booking-row-${b.id}`}>
                    <div className="lg:w-64 flex-shrink-0">
                      <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">{b.id}</p>
                      <p className="mt-1 font-serif text-lg text-slate-900 leading-tight">{b.suite}</p>
                    </div>
                    <div className="flex-1 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                      <div className="min-w-[160px]">
                        <p className="text-[10px] text-slate-400 tracking-widest uppercase">Dates</p>
                        <p className="text-slate-700 mt-0.5">{b.dates}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 tracking-widest uppercase">Nights</p>
                        <p className="font-mono text-slate-700 mt-0.5">{b.nights}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 tracking-widest uppercase">Total</p>
                        <p className="font-mono text-slate-900 mt-0.5">${b.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 tracking-widest uppercase">Status</p>
                        <span className={`inline-block mt-0.5 text-[10px] px-2.5 py-1 rounded-full tracking-widest uppercase ${b.status === "Upcoming" ? "bg-indigo-50 text-indigo-700" : "bg-emerald-50 text-emerald-700"}`}>{b.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap lg:justify-end lg:flex-shrink-0">
                      <button onClick={() => setDetailBooking(b)} className="text-xs px-3 py-2 rounded-full border border-slate-200 hover:bg-slate-50" data-testid={`view-${b.id}`}>View</button>
                      {b.status === "Upcoming" ? (
                        <>
                          <button onClick={() => setModifyOpen(true)} className="text-xs px-3 py-2 rounded-full bg-slate-900 text-white" data-testid={`modify-${b.id}`}>Modify</button>
                          <button onClick={() => setCancelOpen(b)} className="text-xs px-3 py-2 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50" data-testid={`cancel-${b.id}`}>Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => downloadInvoice(b.id)} className="text-xs px-3 py-2 rounded-full border border-slate-200 hover:bg-slate-50">Invoice</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {active === "dining" && (
            <section className="space-y-6">
              <div className="bg-white rounded-[24px] border border-slate-200 p-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-eyebrow text-[#C9A227]">Upcoming</p>
                    <h3 className="mt-1 font-serif text-2xl text-slate-900">Dining reservations</h3>
                  </div>
                  <Link to="/dining" className="text-xs bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 py-2 rounded-full">Reserve table</Link>
                </div>
                <div className="mt-6 space-y-3">
                  {dining.length === 0 ? (
                    <div className="p-8 text-center rounded-[16px] border border-dashed border-slate-200" data-testid="dining-empty">
                      <i className="fa-solid fa-utensils text-2xl text-slate-300"></i>
                      <p className="mt-3 text-sm text-slate-500">No upcoming dining reservations.</p>
                      <Link to="/dining" className="mt-4 inline-block text-xs px-4 py-2 rounded-full bg-slate-900 text-white">Reserve a table</Link>
                    </div>
                  ) : dining.map((d) => (
                    <div key={d.id} className="p-5 rounded-[16px] border border-slate-200 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 justify-between" data-testid={`dining-${d.id}`}>
                      <div className="flex items-center gap-4">
                        <i className="fa-solid fa-utensils text-[#C9A227]"></i>
                        <div>
                          <p className="font-serif text-lg text-slate-900">{d.name}</p>
                          <p className="text-xs text-slate-500">{d.restaurant} · {d.when} · {d.guests} guests</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => setRescheduleItem({ kind: "dining", item: d })} className="text-xs px-3 py-2 rounded-full border border-slate-200 hover:bg-slate-50" data-testid={`dining-reschedule-${d.id}`}>Reschedule</button>
                        <button onClick={() => cancelDining(d.id)} className="text-xs px-3 py-2 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50" data-testid={`dining-cancel-${d.id}`}>Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {active === "spa" && (
            <section className="space-y-6">
              <div className="bg-white rounded-[24px] border border-slate-200 p-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-eyebrow text-[#C9A227]">Upcoming</p>
                    <h3 className="mt-1 font-serif text-2xl text-slate-900">Spa appointments</h3>
                  </div>
                  <Link to="/spa" className="text-xs bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 py-2 rounded-full">New appointment</Link>
                </div>
                <div className="mt-6 space-y-3">
                  {spa.length === 0 ? (
                    <div className="p-8 text-center rounded-[16px] border border-dashed border-slate-200" data-testid="spa-empty">
                      <i className="fa-solid fa-spa text-2xl text-slate-300"></i>
                      <p className="mt-3 text-sm text-slate-500">No upcoming spa appointments.</p>
                      <Link to="/spa" className="mt-4 inline-block text-xs px-4 py-2 rounded-full bg-slate-900 text-white">Book a treatment</Link>
                    </div>
                  ) : spa.map((s) => (
                    <div key={s.id} className="p-5 rounded-[16px] border border-slate-200 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 justify-between" data-testid={`spa-${s.id}`}>
                      <div className="flex items-center gap-4">
                        <i className="fa-solid fa-spa text-[#C9A227]"></i>
                        <div>
                          <p className="font-serif text-lg text-slate-900">{s.name}</p>
                          <p className="text-xs text-slate-500">{s.duration} · with {s.therapist} · {s.when}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => setRescheduleItem({ kind: "spa", item: s })} className="text-xs px-3 py-2 rounded-full border border-slate-200 hover:bg-slate-50" data-testid={`spa-reschedule-${s.id}`}>Reschedule</button>
                        <button onClick={() => cancelSpa(s.id)} className="text-xs px-3 py-2 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50" data-testid={`spa-cancel-${s.id}`}>Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {spaTreatments.slice(0, 2).map((t) => (
                  <div key={t.id} className="p-6 rounded-[20px] bg-white border border-slate-200">
                    <p className="text-eyebrow text-[#C9A227]">Try next</p>
                    <p className="mt-2 font-serif text-xl text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{t.benefits}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-mono text-lg text-slate-900">${t.price}</span>
                      <Link to="/spa" className="text-xs px-4 py-2 rounded-full bg-slate-900 text-white">Book</Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {active === "experiences" && (
            <section className="space-y-6">
              <div className="bg-white rounded-[24px] border border-slate-200 p-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-eyebrow text-[#C9A227]">Upcoming</p>
                    <h3 className="mt-1 font-serif text-2xl text-slate-900">Your experiences</h3>
                  </div>
                  <Link to="/experiences" className="text-xs bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 py-2 rounded-full">Browse</Link>
                </div>
                <div className="mt-6 space-y-3">
                  {upcomingExps.length === 0 ? (
                    <div className="p-8 text-center rounded-[16px] border border-dashed border-slate-200" data-testid="exp-empty">
                      <i className="fa-solid fa-compass text-2xl text-slate-300"></i>
                      <p className="mt-3 text-sm text-slate-500">No upcoming experiences.</p>
                      <Link to="/experiences" className="mt-4 inline-block text-xs px-4 py-2 rounded-full bg-slate-900 text-white">Discover experiences</Link>
                    </div>
                  ) : upcomingExps.map((e) => (
                    <div key={e.id} className="p-5 rounded-[16px] border border-slate-200 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 justify-between" data-testid={`experience-${e.id}`}>
                      <div className="flex items-center gap-4">
                        <i className="fa-solid fa-compass text-[#C9A227]"></i>
                        <div>
                          <p className="font-serif text-lg text-slate-900">{e.title}</p>
                          <p className="text-xs text-slate-500">{e.when}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => setRescheduleItem({ kind: "experience", item: e })} className="text-xs px-3 py-2 rounded-full border border-slate-200 hover:bg-slate-50" data-testid={`exp-reschedule-${e.id}`}>Reschedule</button>
                        <button onClick={() => cancelExperience(e.id)} className="text-xs px-3 py-2 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50" data-testid={`exp-cancel-${e.id}`}>Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {active === "invoices" && (
            <section className="bg-white rounded-[24px] border border-slate-200 overflow-hidden">
              <div className="p-6 flex items-center justify-between border-b border-slate-100">
                <div>
                  <p className="text-eyebrow text-[#C9A227]">Financials</p>
                  <h3 className="mt-1 font-serif text-2xl text-slate-900">Invoices</h3>
                </div>
                <p className="text-xs text-slate-500">Total this year · <span className="font-mono text-slate-900">$24,980</span></p>
              </div>
              <table className="w-full text-sm">
                <thead className="text-[11px] tracking-widest uppercase text-slate-400">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Invoice</th>
                    <th className="text-left px-6 py-3 font-medium">Reservation</th>
                    <th className="text-left px-6 py-3 font-medium">Date</th>
                    <th className="text-right px-6 py-3 font-medium">Amount</th>
                    <th className="text-center px-6 py-3 font-medium">Status</th>
                    <th className="text-right px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoicesData.map((inv) => (
                    <tr key={inv.id} className="border-t border-slate-100 hover:bg-[#FAFAF8]" data-testid={`invoice-row-${inv.id}`}>
                      <td className="px-6 py-4 font-mono text-slate-900">{inv.id}</td>
                      <td className="px-6 py-4 font-mono text-slate-600">{inv.ref}</td>
                      <td className="px-6 py-4 text-slate-500 text-xs">{inv.date}</td>
                      <td className="px-6 py-4 text-right font-mono text-slate-900">${inv.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-[10px] px-2.5 py-1 rounded-full tracking-widest uppercase bg-emerald-50 text-emerald-700">{inv.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => downloadInvoice(inv.id)} className="text-xs text-slate-600 hover:text-slate-900 mr-3" data-testid={`invoice-download-${inv.id}`}>
                          <i className="fa-solid fa-download mr-1"></i>PDF
                        </button>
                        <button onClick={() => emailInvoice(inv.id)} className="text-xs text-slate-600 hover:text-slate-900" data-testid={`invoice-email-${inv.id}`}>
                          <i className="fa-regular fa-envelope mr-1"></i>Email
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {active === "profile" && (
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-testid="profile-section">
              <div className="lg:col-span-1 bg-white rounded-[24px] border border-slate-200 p-8 text-center">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" alt="" className="w-24 h-24 rounded-full object-cover mx-auto" />
                <p className="mt-4 font-serif text-2xl text-slate-900">{profile.firstName} {profile.lastName}</p>
                <p className="text-xs text-slate-500 font-mono mt-1">Member · AH-092841</p>
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-2 text-sm text-left">
                  <div className="flex justify-between"><span className="text-slate-500">Tier</span><span className="text-slate-900">Platinum</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Member since</span><span className="text-slate-900">Feb 2019</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Nights</span><span className="font-mono text-slate-900">42</span></div>
                </div>
                <button onClick={() => toast.info("Photo upload coming soon")} className="mt-6 text-xs w-full py-2.5 rounded-full border border-slate-200 hover:bg-slate-50">Change photo</button>
              </div>
              <div className="lg:col-span-2 bg-white rounded-[24px] border border-slate-200 p-8">
                <p className="text-eyebrow text-[#C9A227]">Personal Details</p>
                <h3 className="mt-1 font-serif text-2xl text-slate-900">Edit your information</h3>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FieldSm label="First Name" value={profile.firstName} onChange={(v) => setProfile({ ...profile, firstName: v })} testid="pf-first" />
                  <FieldSm label="Last Name" value={profile.lastName} onChange={(v) => setProfile({ ...profile, lastName: v })} testid="pf-last" />
                  <FieldSm label="Email" value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} testid="pf-email" />
                  <FieldSm label="Phone" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} testid="pf-phone" />
                  <FieldSm label="Country" value={profile.country} onChange={(v) => setProfile({ ...profile, country: v })} testid="pf-country" />
                  <FieldSm label="Passport" value={profile.passport} onChange={(v) => setProfile({ ...profile, passport: v })} testid="pf-passport" />
                  <FieldSm label="Date of Birth" value={profile.dob} onChange={(v) => setProfile({ ...profile, dob: v })} testid="pf-dob" type="date" />
                  <FieldSm label="Preferences" value={profile.notes} onChange={(v) => setProfile({ ...profile, notes: v })} testid="pf-notes" />
                </div>
                <div className="mt-8 flex items-center gap-3">
                  <button onClick={saveProfile} className="px-6 py-3 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm" data-testid="pf-save">Save changes</button>
                  <button onClick={() => setProfile((p) => ({ ...p, firstName: "Aarav", lastName: "Mehta" }))} className="px-6 py-3 rounded-full border border-slate-200 hover:bg-slate-50 text-sm">Reset</button>
                </div>
              </div>
            </section>
          )}

          {active === "settings" && (
            <section className="space-y-6" data-testid="settings-section">
              <div className="bg-white rounded-[24px] border border-slate-200 p-8">
                <p className="text-eyebrow text-[#C9A227]">Notifications</p>
                <h3 className="mt-1 font-serif text-2xl text-slate-900">How we reach you</h3>
                <div className="mt-6 space-y-4">
                  {[
                    { k: "emailUpdates", l: "Email updates", d: "Reservation confirmations, letters from the palace." },
                    { k: "whatsapp", l: "WhatsApp concierge", d: "Real-time messages from your dedicated butler." },
                    { k: "newsletter", l: "The Aura Journal", d: "Quarterly letter with seasonal openings and private events." },
                  ].map((row) => (
                    <div key={row.k} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="text-sm text-slate-900 font-medium">{row.l}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{row.d}</p>
                      </div>
                      <Toggle checked={prefs[row.k]} onChange={(v) => setPrefs({ ...prefs, [row.k]: v })} testid={`toggle-${row.k}`} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-[24px] border border-slate-200 p-8">
                <p className="text-eyebrow text-[#C9A227]">Security</p>
                <h3 className="mt-1 font-serif text-2xl text-slate-900">Your account</h3>
                <div className="mt-6 flex items-center justify-between py-4 border-b border-slate-100">
                  <div>
                    <p className="text-sm text-slate-900 font-medium">Two-factor authentication</p>
                    <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security to your account.</p>
                  </div>
                  <Toggle checked={prefs.twoFactor} onChange={(v) => setPrefs({ ...prefs, twoFactor: v })} testid="toggle-twoFactor" />
                </div>
                <button onClick={() => toast.info("Password reset email sent")} className="mt-4 text-sm text-[#4F46E5] hover:underline" data-testid="reset-password">Reset password</button>
              </div>
              <div className="bg-white rounded-[24px] border border-slate-200 p-8">
                <p className="text-eyebrow text-[#C9A227]">Preferences</p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-eyebrow text-slate-500">Currency</label>
                    <select value={prefs.currency} onChange={(e) => setPrefs({ ...prefs, currency: e.target.value })} className="mt-2 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5]" data-testid="pref-currency">
                      {["USD", "EUR", "GBP", "INR", "AED"].map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-eyebrow text-slate-500">Language</label>
                    <select value={prefs.language} onChange={(e) => setPrefs({ ...prefs, language: e.target.value })} className="mt-2 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5]" data-testid="pref-language">
                      {["English", "Français", "Deutsch", "日本語", "हिन्दी"].map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <button onClick={savePrefs} className="px-6 py-3 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm" data-testid="prefs-save">Save preferences</button>
            </section>
          )}
        </main>
      </div>

      {/* MODIFY MODAL */}
      {modifyOpen && (
        <ModifyBookingModal stay={stay} onClose={() => setModifyOpen(false)} onApply={applyModify} />
      )}

      {/* EARLY CHECK-IN MODAL */}
      {earlyOpen && (
        <EarlyCheckinModal onClose={() => setEarlyOpen(false)} onApply={applyEarlyCheckin} />
      )}

      {/* PAY BALANCE MODAL */}
      {payBalanceOpen && (
        <PayBalanceModal amount={balanceDue} onClose={() => setPayBalanceOpen(false)} onConfirm={payBalance} />
      )}

      {/* ADD EXTRAS MODAL */}
      {addExtrasOpen && (
        <AddExtrasModal onClose={() => setAddExtrasOpen(false)} onAdd={addExtra} />
      )}

      {/* BOOK SPA MODAL */}
      {bookSpaOpen && (
        <BookSpaModal stay={stay} onClose={() => setBookSpaOpen(false)} onConfirm={confirmBookSpa} />
      )}

      {/* BOOK DINNER MODAL */}
      {bookDinnerOpen && (
        <BookDinnerModal stay={stay} onClose={() => setBookDinnerOpen(false)} onConfirm={confirmBookDinner} />
      )}

      {/* CANCEL MODAL */}
      {cancelOpen && (
        <ModalShell title="Cancel Reservation" onClose={() => setCancelOpen(null)} testid="cancel-modal">
          <p className="text-sm text-slate-600 leading-relaxed">
            You are about to cancel <span className="font-mono text-slate-900">{cancelOpen.id}</span> — {cancelOpen.suite}, {cancelOpen.dates}. Complimentary until 48 hours before arrival.
          </p>
          <div className="mt-6 flex items-center gap-3 justify-end">
            <button onClick={() => setCancelOpen(null)} className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-sm">Keep reservation</button>
            <button onClick={() => cancelBooking(cancelOpen.id)} className="px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-sm" data-testid="cancel-confirm">Confirm cancellation</button>
          </div>
        </ModalShell>
      )}

      {/* RESCHEDULE MODAL */}
      {rescheduleItem && (
        <RescheduleModal item={rescheduleItem} onClose={() => setRescheduleItem(null)} onConfirm={confirmReschedule} />
      )}

      {/* BOOKING DETAIL MODAL */}
      {detailBooking && (
        <ModalShell title={detailBooking.suite} onClose={() => setDetailBooking(null)} testid="detail-modal">
          <p className="text-xs text-slate-500 font-mono">{detailBooking.id}</p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <Row2 l="Dates" v={detailBooking.dates} />
            <Row2 l="Nights" v={`${detailBooking.nights}`} mono />
            <Row2 l="Guests" v="2 Adults · 1 Suite" />
            <Row2 l="Total" v={`$${detailBooking.amount.toLocaleString()}`} mono />
            <Row2 l="Status" v={detailBooking.status} />
            <Row2 l="Payment" v="Paid · Visa •••• 4242" />
          </div>
          <div className="mt-6 flex items-center gap-3 justify-end">
            <button onClick={() => downloadInvoice(detailBooking.id)} className="text-xs px-4 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50">Download invoice</button>
            <button onClick={() => setDetailBooking(null)} className="text-xs px-4 py-2.5 rounded-full bg-slate-900 text-white">Close</button>
          </div>
        </ModalShell>
      )}

      {/* SEARCH MODAL */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSearchOpen(false)} data-testid="search-modal">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl bg-white rounded-[20px] border border-slate-200 shadow-[0_40px_100px_rgba(15,23,42,0.35)] overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
              <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search reservations, suites, experiences..." className="flex-1 text-sm outline-none" data-testid="search-input" />
              <kbd className="text-[10px] text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">esc</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {query.trim() === "" ? (
                <p className="p-6 text-sm text-slate-500 text-center">Type to search across your bookings, suites and experiences.</p>
              ) : searchResults.length === 0 ? (
                <p className="p-6 text-sm text-slate-500 text-center">No results for &ldquo;{query}&rdquo;</p>
              ) : (
                <ul>
                  {searchResults.map((r, i) => (
                    <li key={i} className="px-5 py-3 hover:bg-[#FAFAF8] flex items-center gap-3 cursor-pointer border-t border-slate-100">
                      <span className="text-[10px] tracking-widest uppercase text-[#C9A227] w-24">{r.type}</span>
                      <span className="text-sm text-slate-900">{r.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const FieldSm = ({ label, value, onChange, testid, type = "text" }) => (
  <div>
    <label className="text-eyebrow text-slate-500">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5]" data-testid={testid} />
  </div>
);

const Toggle = ({ checked, onChange, testid }) => (
  <button onClick={() => onChange(!checked)} className={`w-11 h-6 rounded-full relative transition-colors ${checked ? "bg-[#4F46E5]" : "bg-slate-200"}`} data-testid={testid}>
    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`}></span>
  </button>
);

const Row2 = ({ l, v, mono }) => (
  <div>
    <p className="text-eyebrow text-slate-500">{l}</p>
    <p className={`mt-1 text-slate-900 ${mono ? "font-mono" : ""}`}>{v}</p>
  </div>
);

const ModalShell = ({ title, onClose, children, testid }) => (
  <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-8 bg-slate-900/60 backdrop-blur-sm reveal-in" data-testid={testid}>
    <div className="bg-white w-full max-w-lg rounded-t-[24px] md:rounded-[24px] p-8 shadow-[0_40px_100px_rgba(15,23,42,0.35)] reveal-scale relative">
      <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center" data-testid={`${testid}-close`}>
        <i className="fa-solid fa-xmark text-slate-500 text-sm"></i>
      </button>
      <p className="text-eyebrow text-[#C9A227]">Reservation</p>
      <h3 className="mt-1 font-serif text-2xl text-slate-900">{title}</h3>
      <div className="mt-5">{children}</div>
    </div>
  </div>
);

const RescheduleModal = ({ item, onClose, onConfirm }) => {
  const kindLabel = item.kind === "spa" ? "appointment" : item.kind === "dining" ? "reservation" : "experience";
  const [date, setDate] = useState("2025-11-14");
  const [time, setTime] = useState("15:00");
  const slots = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:30", "20:00", "21:00"];
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-8 bg-slate-900/60 backdrop-blur-sm reveal-in" data-testid="reschedule-modal">
      <div className="bg-white w-full max-w-lg rounded-t-[24px] md:rounded-[24px] p-8 shadow-[0_40px_100px_rgba(15,23,42,0.35)] reveal-scale relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center" data-testid="reschedule-close">
          <i className="fa-solid fa-xmark text-slate-500 text-sm"></i>
        </button>
        <p className="text-eyebrow text-[#C9A227]">Reschedule {kindLabel}</p>
        <h3 className="mt-1 font-serif text-2xl text-slate-900">{item.item.name || item.item.title}</h3>
        <p className="text-xs text-slate-500 mt-1">Current: {item.item.when}</p>

        <div className="mt-5">
          <label className="text-eyebrow text-slate-500">New date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-2 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5] font-mono" data-testid="reschedule-date" />
        </div>
        <div className="mt-4">
          <label className="text-eyebrow text-slate-500">New time</label>
          <div className="mt-2 grid grid-cols-5 gap-2">
            {slots.map((t) => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={`py-2 rounded-[10px] text-xs font-mono transition-all ${time === t ? "bg-[#4F46E5] text-white" : "bg-[#FAFAF8] text-slate-700 hover:bg-slate-100"}`}
                data-testid={`reschedule-slot-${t}`}
              >{t}</button>
            ))}
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-sm" data-testid="reschedule-cancel">Cancel</button>
          <button
            onClick={() => {
              const d = new Date(date);
              const label = `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${time}`;
              onConfirm(label);
            }}
            className="px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm"
            data-testid="reschedule-confirm"
          >Confirm reschedule</button>
        </div>
      </div>
    </div>
  );
};

const ModifyBookingModal = ({ stay, onClose, onApply }) => {
  const [suite, setSuite] = useState(stay.suite);
  const [checkIn, setCheckIn] = useState(stay.checkIn);
  const [checkOut, setCheckOut] = useState(stay.checkOut);
  const [notes, setNotes] = useState("Would love to extend by one night.");
  const err = new Date(checkOut) <= new Date(checkIn);
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-8 bg-slate-900/60 backdrop-blur-sm reveal-in" data-testid="modify-modal">
      <div className="bg-white w-full max-w-lg rounded-t-[24px] md:rounded-[24px] p-8 shadow-[0_40px_100px_rgba(15,23,42,0.35)] reveal-scale relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center" data-testid="modify-close">
          <i className="fa-solid fa-xmark text-slate-500 text-sm"></i>
        </button>
        <p className="text-eyebrow text-[#C9A227]">Reservation</p>
        <h3 className="mt-1 font-serif text-2xl text-slate-900">Modify Booking</h3>
        <p className="text-sm text-slate-500 mt-1">Free of charge up to 48 hours before arrival.</p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-eyebrow text-slate-500">Suite</label>
            <select value={suite} onChange={(e) => setSuite(e.target.value)} className="mt-2 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5]" data-testid="mod-suite">
              {rooms.map((r) => <option key={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-eyebrow text-slate-500">New check-in</label>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-2 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5] font-mono" data-testid="mod-checkin" />
            </div>
            <div>
              <label className="text-eyebrow text-slate-500">New check-out</label>
              <input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} className={`mt-2 w-full bg-[#FAFAF8] border rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5] font-mono ${err ? "border-rose-400" : "border-slate-200"}`} data-testid="mod-checkout" />
            </div>
          </div>
          <div>
            <label className="text-eyebrow text-slate-500">Notes for concierge</label>
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-2 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5]" data-testid="mod-notes" />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-sm">Cancel</button>
          <button
            onClick={() => onApply({ suite, checkIn, checkOut })}
            disabled={err}
            className="px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-40 text-white text-sm"
            data-testid="mod-submit"
          >Save changes</button>
        </div>
      </div>
    </div>
  );
};

const EarlyCheckinModal = ({ onClose, onApply }) => {
  const [slot, setSlot] = useState("12:00");
  const slots = ["09:00", "10:30", "11:00", "12:00", "12:30", "13:00", "13:30", "14:00"];
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-8 bg-slate-900/60 backdrop-blur-sm reveal-in" data-testid="early-modal">
      <div className="bg-white w-full max-w-lg rounded-t-[24px] md:rounded-[24px] p-8 shadow-[0_40px_100px_rgba(15,23,42,0.35)] reveal-scale relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center" data-testid="early-close">
          <i className="fa-solid fa-xmark text-slate-500 text-sm"></i>
        </button>
        <p className="text-eyebrow text-[#C9A227]">Arrival</p>
        <h3 className="mt-1 font-serif text-2xl text-slate-900">Request Early Check-in</h3>
        <p className="text-sm text-slate-500 mt-1">Preferred arrival window:</p>

        <div className="mt-5 grid grid-cols-4 gap-2">
          {slots.map((t) => (
            <button
              key={t}
              onClick={() => setSlot(t)}
              className={`py-2.5 rounded-[10px] text-xs font-mono transition-all ${slot === t ? "bg-[#4F46E5] text-white" : "bg-[#FAFAF8] text-slate-700 hover:bg-slate-100"}`}
              data-testid={`early-slot-${t}`}
            >{t}</button>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">Complimentary early check-in is subject to housekeeping. Guaranteed 4-hour early check-in from $90.</p>
        <div className="mt-6 flex items-center gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-sm">Cancel</button>
          <button onClick={() => onApply(slot)} className="px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm" data-testid="early-submit">Confirm {slot}</button>
        </div>
      </div>
    </div>
  );
};

const PayBalanceModal = ({ amount, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-8 bg-slate-900/60 backdrop-blur-sm reveal-in" data-testid="pay-balance-modal">
    <div className="bg-white w-full max-w-md rounded-t-[24px] md:rounded-[24px] p-8 shadow-[0_40px_100px_rgba(15,23,42,0.35)] reveal-scale relative">
      <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center" data-testid="pay-balance-close">
        <i className="fa-solid fa-xmark text-slate-500 text-sm"></i>
      </button>
      <p className="text-eyebrow text-[#C9A227]">Settle balance</p>
      <h3 className="mt-1 font-serif text-2xl text-slate-900">Pay outstanding</h3>
      <p className="text-sm text-slate-500 mt-2">Charge to your card on file. This clears the remaining balance and all in-stay extras.</p>
      <div className="mt-6 p-5 rounded-[16px] bg-[#FAFAF8] border border-slate-100 flex items-baseline justify-between">
        <div>
          <p className="text-eyebrow text-slate-500">Amount</p>
          <p className="text-xs text-slate-500 mt-1">Visa •••• 4242</p>
        </div>
        <p className="font-mono text-3xl text-slate-900">${amount.toLocaleString()}</p>
      </div>
      <div className="mt-6 flex items-center gap-3 justify-end">
        <button onClick={onClose} className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-sm">Cancel</button>
        <button onClick={onConfirm} className="px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm" data-testid="pay-balance-confirm">
          <i className="fa-solid fa-lock text-[10px] mr-1.5"></i>Pay ${amount.toLocaleString()}
        </button>
      </div>
    </div>
  </div>
);

const AddExtrasModal = ({ onClose, onAdd }) => {
  const catalog = [
    { label: "Room Service · Continental Breakfast", amount: 45, icon: "mug-hot" },
    { label: "Room Service · À la carte lunch", amount: 68, icon: "utensils" },
    { label: "Mini-bar · Champagne", amount: 120, icon: "champagne-glasses" },
    { label: "Laundry & Pressing", amount: 40, icon: "shirt" },
    { label: "Late Check-out · 4pm", amount: 90, icon: "clock" },
    { label: "Airport Transfer · Return", amount: 120, icon: "car" },
    { label: "Private Yoga Session", amount: 85, icon: "person-praying" },
    { label: "In-suite Photographer", amount: 180, icon: "camera" },
  ];
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-8 bg-slate-900/60 backdrop-blur-sm reveal-in" data-testid="add-extras-modal">
      <div className="bg-white w-full max-w-2xl rounded-t-[24px] md:rounded-[24px] p-8 shadow-[0_40px_100px_rgba(15,23,42,0.35)] reveal-scale relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center" data-testid="add-extras-close">
          <i className="fa-solid fa-xmark text-slate-500 text-sm"></i>
        </button>
        <p className="text-eyebrow text-[#C9A227]">In-stay extras</p>
        <h3 className="mt-1 font-serif text-2xl text-slate-900">Add to your folio</h3>
        <p className="text-sm text-slate-500 mt-1">Charged to your suite. Settled at check-out.</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          {catalog.map((c) => (
            <button
              key={c.label}
              onClick={() => onAdd(c.label, c.amount)}
              className="text-left p-4 rounded-[14px] bg-[#FAFAF8] hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-4"
              data-testid={`extra-${c.icon}`}
            >
              <span className="w-10 h-10 rounded-full bg-[#C9A227]/10 text-[#C9A227] grid place-items-center">
                <i className={`fa-solid fa-${c.icon} text-sm`}></i>
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 truncate">{c.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">Add to folio</p>
              </div>
              <span className="font-mono text-sm text-slate-900">${c.amount}</span>
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-sm">Done</button>
        </div>
      </div>
    </div>
  );
};

const BookSpaModal = ({ stay, onClose, onConfirm }) => {
  const [treatmentId, setTreatmentId] = useState(spaTreatments[0].id);
  const [date, setDate] = useState(stay.checkIn);
  const [time, setTime] = useState("15:00");
  const slots = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:30"];
  const t = spaTreatments.find((x) => x.id === treatmentId);
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-8 bg-slate-900/60 backdrop-blur-sm reveal-in" data-testid="book-spa-modal">
      <div className="bg-white w-full max-w-2xl rounded-t-[24px] md:rounded-[24px] p-8 shadow-[0_40px_100px_rgba(15,23,42,0.35)] reveal-scale relative max-h-[92vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center" data-testid="book-spa-close">
          <i className="fa-solid fa-xmark text-slate-500 text-sm"></i>
        </button>
        <p className="text-eyebrow text-[#C9A227]">Book from your stay</p>
        <h3 className="mt-1 font-serif text-2xl text-slate-900">Book Spa Treatment</h3>
        <p className="text-sm text-slate-500 mt-1">Charged to your folio · settled at check-out.</p>

        <div className="mt-5">
          <label className="text-eyebrow text-slate-500">Treatment</label>
          <div className="mt-3 space-y-2">
            {spaTreatments.map((x) => {
              const on = x.id === treatmentId;
              return (
                <button
                  key={x.id}
                  onClick={() => setTreatmentId(x.id)}
                  className={`w-full text-left p-4 rounded-[14px] border flex items-center gap-4 transition-all ${on ? "border-[#4F46E5] bg-indigo-50/30 ring-2 ring-[#4F46E5]/10" : "border-slate-200 hover:border-slate-300 bg-white"}`}
                  data-testid={`spa-pick-${x.id}`}
                >
                  <span className="w-10 h-10 rounded-full bg-[#C9A227]/10 text-[#C9A227] grid place-items-center flex-shrink-0"><i className="fa-solid fa-spa text-sm"></i></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">{x.name}</p>
                    <p className="text-xs text-slate-500">{x.duration} · with {x.therapist}</p>
                  </div>
                  <span className="font-mono text-sm text-slate-900">${x.price}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <label className="text-eyebrow text-slate-500">Date</label>
            <input type="date" value={date} min={stay.checkIn} max={stay.checkOut} onChange={(e) => setDate(e.target.value)} className="mt-2 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5] font-mono" data-testid="spa-date" />
          </div>
          <div>
            <label className="text-eyebrow text-slate-500">Time</label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {slots.map((s) => (
                <button key={s} onClick={() => setTime(s)} className={`py-2 rounded-[10px] text-xs font-mono transition-all ${time === s ? "bg-[#4F46E5] text-white" : "bg-[#FAFAF8] text-slate-700 hover:bg-slate-100"}`} data-testid={`spa-slot-${s}`}>{s}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 p-4 rounded-[14px] bg-[#FAFAF8] border border-slate-100 flex items-baseline justify-between">
          <div>
            <p className="text-eyebrow text-slate-500">Charged to folio</p>
            <p className="text-xs text-slate-500 mt-1">{t.name} · {t.duration}</p>
          </div>
          <p className="font-mono text-2xl text-slate-900">${t.price}</p>
        </div>

        <div className="mt-6 flex items-center gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-sm">Cancel</button>
          <button onClick={() => onConfirm({ treatmentId, date, time })} className="px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm" data-testid="spa-confirm">Confirm booking</button>
        </div>
      </div>
    </div>
  );
};

const BookDinnerModal = ({ stay, onClose, onConfirm }) => {
  const restaurants = [
    { name: "Chef's Table Tasting", desc: "10 courses in the palace kitchen", price: 240 },
    { name: "The Palace Table · Royal Thali", desc: "12-course brass thali", price: 92 },
    { name: "Rooftop Grill", desc: "Tandoor selections under the stars", price: 68 },
    { name: "Garden Breakfast", desc: "In the Mughal gardens", price: 26 },
  ];
  const [restaurant, setRestaurant] = useState(restaurants[0].name);
  const [date, setDate] = useState(stay.checkIn);
  const [time, setTime] = useState("20:00");
  const [guests, setGuests] = useState(2);
  const slots = ["12:30", "13:30", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];
  const price = restaurants.find((r) => r.name === restaurant)?.price || 0;
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-8 bg-slate-900/60 backdrop-blur-sm reveal-in" data-testid="book-dinner-modal">
      <div className="bg-white w-full max-w-2xl rounded-t-[24px] md:rounded-[24px] p-8 shadow-[0_40px_100px_rgba(15,23,42,0.35)] reveal-scale relative max-h-[92vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center" data-testid="book-dinner-close">
          <i className="fa-solid fa-xmark text-slate-500 text-sm"></i>
        </button>
        <p className="text-eyebrow text-[#C9A227]">Book from your stay</p>
        <h3 className="mt-1 font-serif text-2xl text-slate-900">Reserve a Table</h3>
        <p className="text-sm text-slate-500 mt-1">Charged to your folio · settled at check-out.</p>

        <div className="mt-5">
          <label className="text-eyebrow text-slate-500">Restaurant</label>
          <div className="mt-3 space-y-2">
            {restaurants.map((r) => {
              const on = r.name === restaurant;
              return (
                <button
                  key={r.name}
                  onClick={() => setRestaurant(r.name)}
                  className={`w-full text-left p-4 rounded-[14px] border flex items-center gap-4 transition-all ${on ? "border-[#4F46E5] bg-indigo-50/30 ring-2 ring-[#4F46E5]/10" : "border-slate-200 hover:border-slate-300 bg-white"}`}
                  data-testid={`dinner-pick-${r.name.split(" ")[0].toLowerCase()}`}
                >
                  <span className="w-10 h-10 rounded-full bg-[#C9A227]/10 text-[#C9A227] grid place-items-center flex-shrink-0"><i className="fa-solid fa-utensils text-sm"></i></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.desc}</p>
                  </div>
                  <span className="font-mono text-sm text-slate-900">${r.price}<span className="text-xs text-slate-500"> / pp</span></span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <label className="text-eyebrow text-slate-500">Date</label>
            <input type="date" value={date} min={stay.checkIn} max={stay.checkOut} onChange={(e) => setDate(e.target.value)} className="mt-2 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5] font-mono" data-testid="dinner-date" />
          </div>
          <div>
            <label className="text-eyebrow text-slate-500">Time</label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {slots.map((s) => (
                <button key={s} onClick={() => setTime(s)} className={`py-2 rounded-[10px] text-xs font-mono transition-all ${time === s ? "bg-[#4F46E5] text-white" : "bg-[#FAFAF8] text-slate-700 hover:bg-slate-100"}`} data-testid={`dinner-slot-${s}`}>{s}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label className="text-eyebrow text-slate-500">Guests</label>
          <div className="mt-2 flex items-center justify-between p-3 bg-[#FAFAF8] rounded-[14px] border border-slate-100 max-w-xs">
            <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700" data-testid="dinner-guests-minus">−</button>
            <span className="font-mono" data-testid="dinner-guests-value">{guests} guest{guests > 1 ? "s" : ""}</span>
            <button onClick={() => setGuests(guests + 1)} className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700" data-testid="dinner-guests-plus">+</button>
          </div>
        </div>

        <div className="mt-5 p-4 rounded-[14px] bg-[#FAFAF8] border border-slate-100 flex items-baseline justify-between">
          <div>
            <p className="text-eyebrow text-slate-500">Charged to folio</p>
            <p className="text-xs text-slate-500 mt-1">{restaurant} · {guests} guest{guests > 1 ? "s" : ""}</p>
          </div>
          <p className="font-mono text-2xl text-slate-900">${(price * guests).toLocaleString()}</p>
        </div>

        <div className="mt-6 flex items-center gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-sm">Cancel</button>
          <button onClick={() => onConfirm({ restaurant, date, time, guests })} className="px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm" data-testid="dinner-confirm">Reserve table</button>
        </div>
      </div>
    </div>
  );
};
