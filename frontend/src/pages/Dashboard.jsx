import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PropertyMark } from "@/components/PropertyMark";
import { rooms } from "@/data/mockData";

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

const notifications = [
  { i: "bell", t: "Your butler has prepared an itinerary", d: "10 min ago", c: "#C9A227" },
  { i: "sparkles", t: "Spa slots opened for Nov 13", d: "2 hours ago", c: "#4F46E5" },
  { i: "utensils", t: "Chef's Table confirmed for Nov 13", d: "Yesterday", c: "#10B981" },
];

export default function Dashboard() {
  const [active, setActive] = useState("dashboard");
  const [countdown, setCountdown] = useState({ d: 6, h: 14, m: 22, s: 11 });

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown((c) => {
        let { d, h, m, s } = c;
        s -= 1;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) { h = 23; d -= 1; }
        if (d < 0) d = 0;
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex" data-testid="dashboard-page">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-40" data-testid="dashboard-sidebar">
        <div className="p-8 border-b border-slate-100">
          <PropertyMark size="sm" />
        </div>
        <nav className="p-5 flex-1 space-y-1">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setActive(n.id)}
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

      <div className="flex-1 lg:ml-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#FAFAF8]/80 backdrop-blur-xl border-b border-slate-200 px-6 md:px-10 py-5 flex items-center justify-between">
          <div>
            <p className="text-eyebrow text-slate-500">Good evening,</p>
            <h1 className="font-serif text-2xl text-slate-900">Welcome back, Aarav</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full border border-slate-200 hover:bg-white grid place-items-center">
              <i className="fa-solid fa-magnifying-glass text-xs text-slate-600"></i>
            </button>
            <button className="w-10 h-10 rounded-full border border-slate-200 hover:bg-white grid place-items-center relative">
              <i className="fa-regular fa-bell text-xs text-slate-600"></i>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-[#FAFAF8]"></span>
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" alt="" className="w-9 h-9 rounded-full object-cover" />
              <div className="hidden md:block">
                <p className="text-sm text-slate-900 font-medium">Aarav Mehta</p>
                <p className="text-[10px] text-slate-500 font-mono">AH-092841</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-10 space-y-8">
          {/* Upcoming Stay Hero */}
          <section className="relative overflow-hidden rounded-[28px] text-white" data-testid="upcoming-stay">
            <img src={rooms[0].images[0]} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/55 to-slate-900/25"></div>
            <div className="relative p-10 md:p-14 grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="md:col-span-2">
                <p className="text-eyebrow text-[#E6C868]">Your Next Stay</p>
                <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-tight">The Maharajah Suite</h2>
                <p className="text-white/80 mt-2 text-sm">Nov 12 → Nov 15 · 3 nights · 2 guests</p>

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
                  <button className="px-5 py-2.5 rounded-full bg-[#C9A227] hover:bg-[#B08D1E] text-slate-900 text-sm font-medium">Modify Booking</button>
                  <button className="px-5 py-2.5 rounded-full glass-dark text-white text-sm">Request Early Check-in</button>
                  <Link to="/spa" className="px-5 py-2.5 rounded-full glass-dark text-white text-sm">Book Spa</Link>
                  <Link to="/dining" className="px-5 py-2.5 rounded-full glass-dark text-white text-sm">Book Dinner</Link>
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

          {/* Booking history */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-[24px] border border-slate-200 overflow-hidden" data-testid="booking-history">
              <div className="p-6 flex items-center justify-between border-b border-slate-100">
                <div>
                  <p className="text-eyebrow text-[#C9A227]">Booking History</p>
                  <h3 className="mt-1 font-serif text-2xl text-slate-900">Your journeys</h3>
                </div>
                <button className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5">
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
                        <button className="text-slate-400 hover:text-slate-900">
                          <i className="fa-solid fa-file-invoice"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Notifications + Quick actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-[24px] border border-slate-200 p-6" data-testid="notifications">
                <p className="text-eyebrow text-[#C9A227]">Notifications</p>
                <ul className="mt-4 space-y-4">
                  {notifications.map((n, i) => (
                    <li key={i} className="flex gap-3">
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
                    { i: "person-swimming", l: "Pool" },
                  ].map((a) => (
                    <button key={a.l} className="p-4 rounded-[14px] bg-[#FAFAF8] hover:bg-white hover:border-slate-300 border border-transparent text-left">
                      <i className={`fa-solid fa-${a.i} text-[#C9A227]`}></i>
                      <p className="mt-2 text-sm text-slate-800">{a.l}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
