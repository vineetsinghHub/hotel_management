// Role-specific dashboard variants. Each role sees a lens tailored to their
// daily job — Front Desk sees arrivals/departures, Housekeeping sees rooms
// to turn, F&B sees today's covers, etc. Keeps the guest-facing site
// completely mock-driven.

import { Link } from "react-router-dom";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import {
  stats, revenueTrend, arrivals, activities, channels, statusColor,
  occupancyTrend, roomsInventory, housekeeping, menuItems, spaAppointments,
  invoicesAdmin, campaigns, guests, notificationsAdmin,
} from "@aura/shared/admin/adminMockData";
import { roleLabel } from "@aura/shared/admin/roles";
import { isPro, TIERS } from "@aura/shared/admin/tier";
import useTenantPath from "@aura/shared/hooks/useTenantPath";

// Small wrapper that transparently rewrites `to="/admin/xxx"` into
// `to="/t/:slug/admin/xxx"` using the active tenant. Keeps every existing
// Link across the role dashboards working without a mechanical rewrite.
const TLink = ({ to, ...rest }) => {
  const t = useTenantPath();
  const resolved = typeof to === "string" && to.startsWith("/admin/")
    ? t(to.slice(1))            // "/admin/foo" → "admin/foo" → "/t/:slug/admin/foo"
    : to;
  return <Link to={resolved} {...rest} />;
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared building blocks
// ─────────────────────────────────────────────────────────────────────────────
export const KPI = ({ label, value, delta, icon, color }) => (
  <div className="p-5 bg-white rounded-[16px] border border-slate-200">
    <div className="flex items-start justify-between">
      <p className="text-[10px] tracking-[0.2em] uppercase text-slate-500">{label}</p>
      <span className="w-8 h-8 rounded-full grid place-items-center" style={{ backgroundColor: `${color}15`, color }}><i className={`fa-solid fa-${icon} text-xs`}></i></span>
    </div>
    <p className="mt-3 font-mono text-3xl text-slate-900">{value}</p>
    {delta && <p className="text-xs text-emerald-600 mt-1">{delta}</p>}
  </div>
);

export const RoleGreeting = ({ user }) => {
  const hour = new Date().getHours();
  const salutation = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <div className="mb-6 flex items-start justify-between flex-wrap gap-3" data-testid="role-greeting">
      <div>
        <p className="text-eyebrow text-brand-accent">{salutation}, {user?.name?.split(" ")[0] || "there"}</p>
        <h2 className="mt-1 font-serif text-3xl text-slate-900">Your {roleLabel(user?.role) || "Console"} view</h2>
        <p className="mt-1 text-sm text-slate-500">Here's what needs your attention today.</p>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-slate-200">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-xs text-slate-600">Live · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Front Desk Dashboard
// ─────────────────────────────────────────────────────────────────────────────
export const FrontDeskDashboard = () => {
  const arriving = arrivals.filter((a) => a.status === "confirmed");
  const inHouse = arrivals.filter((a) => a.status === "checked_in");
  const departing = arrivals.filter((a) => a.status === "checked_out");

  return (
    <div data-testid="dashboard-front-desk">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Arriving Today" value={arriving.length} delta={`${arriving[0]?.eta || "—"} first ETA`} icon="plane-arrival" color="#4F46E5" />
        <KPI label="Departing Today" value={departing.length} delta="On track" icon="plane-departure" color="#F43F5E" />
        <KPI label="In-House Guests" value={inHouse.length} delta="VIP × 2" icon="user-group" color="#C9A227" />
        <KPI label="Walk-ins (Est.)" value="2" delta="Based on last 30 days" icon="door-open" color="#10B981" />
      </section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-[16px] border border-slate-200">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-eyebrow text-brand-accent">Arriving today</p>
              <p className="mt-1 text-sm text-slate-500">{arriving.length} reservations · sorted by ETA</p>
            </div>
            <TLink to="/admin/front-desk" className="text-xs text-brand-primary hover:underline">Open Front Desk →</TLink>
          </div>
          <ul className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {arriving.map((a) => (
              <li key={a.id} className="p-4 flex items-center gap-3 hover:bg-slate-50" data-testid={`fd-arrival-${a.id}`}>
                <span className="w-10 h-10 rounded-full bg-brand-primary/12 text-brand-primary grid place-items-center font-serif">{a.guest[0]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 truncate">{a.guest}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{a.id} · {a.roomType}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-900 font-mono">{a.eta}</p>
                  <p className="text-[10px] text-slate-400">Room {a.room}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-[16px] border border-slate-200">
          <div className="p-5 border-b border-slate-100">
            <p className="text-eyebrow text-brand-accent">In-house guests</p>
            <p className="mt-1 text-sm text-slate-500">{inHouse.length} currently checked in</p>
          </div>
          <ul className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {inHouse.map((a) => {
              const st = statusColor(a.status);
              return (
                <li key={a.id} className="p-4 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 grid place-items-center font-serif">{a.guest[0]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 truncate">{a.guest}</p>
                    <p className="text-[10px] text-slate-500 font-mono">Room {a.room} · Checkout {a.checkOut}</p>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>{st.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="mt-6 p-6 rounded-[16px] bg-gradient-to-br from-brand-primary to-slate-900 text-white">
        <p className="text-eyebrow text-brand-accent-hover">Quick actions</p>
        <h4 className="font-serif text-xl mt-1">Front desk toolkit</h4>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l: "New Reservation", to: "/admin/reservations", i: "calendar-plus" },
            { l: "New Guest", to: "/admin/guests", i: "user-plus" },
            { l: "Check-in / out", to: "/admin/front-desk", i: "concierge-bell" },
            { l: "Room Status", to: "/admin/housekeeping", i: "broom" },
          ].map((a) => (
            <TLink key={a.l} to={a.to} className="p-4 rounded-[14px] bg-white/10 hover:bg-white/15 backdrop-blur flex items-center gap-3" data-testid={`fd-action-${a.i}`}>
              <i className={`fa-solid fa-${a.i} text-brand-accent-hover`}></i>
              <span className="text-sm">{a.l}</span>
            </TLink>
          ))}
        </div>
      </section>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Housekeeping Dashboard
// ─────────────────────────────────────────────────────────────────────────────
export const HousekeepingDashboard = () => {
  const counts = ["clean", "dirty", "inspected", "occupied", "ooo"].reduce((acc, k) => {
    acc[k] = housekeeping.filter((r) => r.status === k).length; return acc;
  }, {});
  const priority = housekeeping.filter((r) => r.priority === "high");
  const donut = [
    { name: "Clean", value: counts.clean || 0, color: "#10B981" },
    { name: "Dirty", value: counts.dirty || 0, color: "#F43F5E" },
    { name: "Inspected", value: counts.inspected || 0, color: "#4F46E5" },
    { name: "Occupied", value: counts.occupied || 0, color: "#C9A227" },
    { name: "OOO", value: counts.ooo || 0, color: "#64748B" },
  ];
  const total = donut.reduce((s, x) => s + x.value, 0);

  return (
    <div data-testid="dashboard-housekeeping">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="To Clean (Dirty)" value={counts.dirty} delta="Priority" icon="broom" color="#F43F5E" />
        <KPI label="Awaiting Inspection" value={counts.clean} delta="Ready for QA" icon="magnifying-glass" color="#4F46E5" />
        <KPI label="Ready (Inspected)" value={counts.inspected} delta="Available to sell" icon="circle-check" color="#10B981" />
        <KPI label="OOO / Maintenance" value={counts.ooo} delta="Blocked" icon="wrench" color="#64748B" />
      </section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-[16px] border border-slate-200">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-eyebrow text-brand-accent">Priority queue</p>
              <p className="mt-1 text-sm text-slate-500">{priority.length} rooms need immediate attention</p>
            </div>
            <TLink to="/admin/housekeeping" className="text-xs text-brand-primary hover:underline">Open Housekeeping →</TLink>
          </div>
          <ul className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
            {priority.map((r) => {
              const st = statusColor(r.status);
              return (
                <li key={r.id} className="p-4 flex items-center gap-3" data-testid={`hk-priority-${r.id}`}>
                  <span className="w-11 h-11 rounded-[10px] bg-rose-50 text-rose-700 grid place-items-center font-mono text-sm">{r.number}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">{r.type}</p>
                    <p className="text-[10px] text-slate-500">Attendant: {r.attendant} · ETA {r.eta}</p>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>{st.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="bg-white rounded-[16px] border border-slate-200 p-6">
          <p className="text-eyebrow text-brand-accent">Room status</p>
          <h3 className="mt-1 font-serif text-lg text-slate-900">{total} rooms</h3>
          <div className="mt-4 h-44 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donut} dataKey="value" nameKey="name" innerRadius={48} outerRadius={70} paddingAngle={2}>
                  {donut.map((e) => <Cell key={e.name} fill={e.color} stroke="none" />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-1.5 text-xs">
            {donut.map((r) => (
              <li key={r.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: r.color }}></span>{r.name}</div>
                <span className="font-mono text-slate-900">{r.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// F&B Manager Dashboard
// ─────────────────────────────────────────────────────────────────────────────
export const FBDashboard = () => {
  const activeMenu = menuItems.filter((m) => m.active);
  const covers = [
    { d: "Mon", c: 82 }, { d: "Tue", c: 96 }, { d: "Wed", c: 112 }, { d: "Thu", c: 128 },
    { d: "Fri", c: 168 }, { d: "Sat", c: 210 }, { d: "Sun", c: 184 },
  ];
  return (
    <div data-testid="dashboard-fb">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Today's Covers" value="128" delta="+12 vs yesterday" icon="utensils" color="#F97316" />
        <KPI label="F&B Revenue" value="₹1.42L" delta="+8% WoW" icon="indian-rupee-sign" color="#10B981" />
        <KPI label="Active Menu Items" value={activeMenu.length} delta={`of ${menuItems.length} total`} icon="book-open" color="#4F46E5" />
        <KPI label="Avg. Ticket" value="₹1,108" delta="Above target" icon="receipt" color="#C9A227" />
      </section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-[16px] border border-slate-200 p-6">
          <p className="text-eyebrow text-brand-accent">Covers this week</p>
          <h3 className="mt-1 font-serif text-xl text-slate-900">1,000 covers · +14% WoW</h3>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={covers}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 6" vertical={false} />
                <XAxis dataKey="d" stroke="#94A3B8" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="c" fill="#F97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-slate-200 p-5">
          <p className="text-eyebrow text-brand-accent">Top items today</p>
          <ul className="mt-3 space-y-2 text-sm">
            {activeMenu.slice(0, 5).map((m, i) => (
              <li key={m.id} className="flex items-center justify-between p-2 rounded-[10px] hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 w-4">#{i + 1}</span>
                  <span className="text-slate-900 text-sm">{m.name}</span>
                </div>
                <span className="text-xs font-mono text-slate-500">₹{(m.price / 1000).toFixed(1)}K</span>
              </li>
            ))}
          </ul>
          <TLink to="/admin/restaurant" className="mt-4 block text-center text-xs text-brand-primary hover:underline">Open Restaurant →</TLink>
        </div>
      </section>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Spa Manager Dashboard
// ─────────────────────────────────────────────────────────────────────────────
export const SpaDashboard = () => (
  <div data-testid="dashboard-spa">
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <KPI label="Today's Appointments" value={spaAppointments.length} delta="4 confirmed" icon="spa" color="#EC4899" />
      <KPI label="Spa Revenue Today" value="₹1.56L" delta="+22% WoW" icon="indian-rupee-sign" color="#10B981" />
      <KPI label="Therapists on shift" value="6" delta="2 morning · 4 afternoon" icon="user-nurse" color="#4F46E5" />
      <KPI label="Slot utilisation" value="82%" delta="Peak: 15:00–17:00" icon="clock" color="#C9A227" />
    </section>

    <section className="mt-6 bg-white rounded-[16px] border border-slate-200">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-eyebrow text-brand-accent">Today's schedule</p>
          <p className="mt-1 text-sm text-slate-500">{spaAppointments.length} treatments booked</p>
        </div>
        <TLink to="/admin/spa" className="text-xs text-brand-primary hover:underline">Open Spa →</TLink>
      </div>
      <ul className="divide-y divide-slate-100">
        {spaAppointments.map((s) => {
          const st = statusColor(s.status);
          return (
            <li key={s.id} className="p-4 flex items-center gap-3">
              <span className="w-14 text-center">
                <p className="font-mono text-sm text-slate-900">{s.time}</p>
                <p className="text-[9px] text-slate-400">{s.duration}</p>
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900">{s.treatment}</p>
                <p className="text-[10px] text-slate-500">{s.guest} · Room {s.room} · with {s.therapist}</p>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>{st.label}</span>
            </li>
          );
        })}
      </ul>
    </section>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Marketing Dashboard
// ─────────────────────────────────────────────────────────────────────────────
export const MarketingDashboard = () => {
  const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
  const totalBookings = campaigns.reduce((s, c) => s + c.bookings, 0);
  return (
    <div data-testid="dashboard-marketing">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Campaign Revenue" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} delta="+18% MoM" icon="indian-rupee-sign" color="#10B981" />
        <KPI label="Bookings Attributed" value={totalBookings} delta="From 3 campaigns" icon="calendar-plus" color="#4F46E5" />
        <KPI label="CRM Audience" value={`${(guests.length * 340).toLocaleString()}`} delta="Segmented · 8 lists" icon="user-group" color="#C9A227" />
        <KPI label="Avg. Open Rate" value="42%" delta="Industry: 21%" icon="envelope-open-text" color="#EC4899" />
      </section>

      <section className="mt-6 bg-white rounded-[16px] border border-slate-200 p-6">
        <p className="text-eyebrow text-brand-accent">Campaign performance</p>
        <table className="mt-3 w-full text-sm">
          <thead className="text-[10px] tracking-widest uppercase text-slate-400">
            <tr><th className="text-left py-2">Campaign</th><th className="text-right">Audience</th><th className="text-right">Bookings</th><th className="text-right">Revenue</th><th className="text-right">Status</th></tr>
          </thead>
          <tbody>
            {campaigns.map((c) => {
              const st = statusColor(c.status);
              return (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="py-3 text-slate-900">{c.name}</td>
                  <td className="text-right font-mono text-xs">{c.audience.toLocaleString()}</td>
                  <td className="text-right font-mono text-xs">{c.bookings}</td>
                  <td className="text-right font-mono text-slate-900">₹{(c.revenue / 100000).toFixed(1)}L</td>
                  <td className="text-right"><span className={`text-[10px] px-2 py-1 rounded-full ${st.bg} ${st.text}`}>{st.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <TLink to="/admin/marketing" className="mt-4 block text-center text-xs text-brand-primary hover:underline">Open Marketing →</TLink>
      </section>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Accounting Dashboard
// ─────────────────────────────────────────────────────────────────────────────
export const AccountingDashboard = () => {
  const paid = invoicesAdmin.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const outstanding = invoicesAdmin.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount, 0);
  return (
    <div data-testid="dashboard-accounting">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Collected This Month" value={`₹${(paid / 100000).toFixed(1)}L`} delta="+18% MoM" icon="indian-rupee-sign" color="#10B981" />
        <KPI label="Outstanding" value={`₹${(outstanding / 100000).toFixed(1)}L`} delta="3 invoices" icon="triangle-exclamation" color="#F43F5E" />
        <KPI label="Tax Payable (GST)" value={`₹${(paid * 0.18 / 100000).toFixed(1)}L`} delta="Due Mar 20" icon="receipt" color="#C9A227" />
        <KPI label="Refunds Issued" value="₹42K" delta="1 this week" icon="rotate-left" color="#64748B" />
      </section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-[16px] border border-slate-200">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <p className="text-eyebrow text-brand-accent">Recent invoices</p>
            <TLink to="/admin/invoices" className="text-xs text-brand-primary hover:underline">Open Invoices →</TLink>
          </div>
          <table className="w-full text-sm">
            <thead className="text-[10px] tracking-widest uppercase text-slate-400">
              <tr><th className="text-left px-5 py-3">Invoice</th><th className="text-left">Guest</th><th className="text-left">Method</th><th className="text-right px-5">Amount</th><th className="text-right px-5">Status</th></tr>
            </thead>
            <tbody>
              {invoicesAdmin.slice(0, 6).map((i) => {
                const st = statusColor(i.status);
                return (
                  <tr key={i.id} className="border-t border-slate-100">
                    <td className="px-5 py-3 font-mono text-xs">{i.id}</td>
                    <td className="text-slate-900">{i.guest}</td>
                    <td className="text-xs text-slate-500">{i.method}</td>
                    <td className="px-5 text-right font-mono">₹{(i.amount / 1000).toFixed(1)}K</td>
                    <td className="px-5 text-right"><span className={`text-[10px] px-2 py-1 rounded-full ${st.bg} ${st.text}`}>{st.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-[16px] border border-slate-200 p-6">
          <p className="text-eyebrow text-brand-accent">Revenue trend</p>
          <p className="mt-1 text-sm text-slate-500">Last 15 days</p>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="accRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#14B8A6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 6" vertical={false} />
                <XAxis dataKey="d" stroke="#94A3B8" fontSize={9} axisLine={false} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={9} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip />
                <Area dataKey="v" stroke="#14B8A6" strokeWidth={2} fill="url(#accRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Read-only Dashboard (compact viewer)
// ─────────────────────────────────────────────────────────────────────────────
export const ReadOnlyDashboard = () => (
  <div data-testid="dashboard-readonly">
    <div className="mb-4 p-4 rounded-[14px] bg-slate-50 border border-slate-200 flex items-center gap-3">
      <i className="fa-solid fa-eye text-slate-500"></i>
      <p className="text-sm text-slate-600">You have <span className="font-medium">view-only</span> access. All KPIs and dashboards are read-only.</p>
    </div>
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <KPI label="Occupancy" value={`${stats.occupancy}%`} delta="Today" icon="bed" color="#4F46E5" />
      <KPI label="ADR" value={`₹${stats.adr}`} delta="Average daily rate" icon="chart-line" color="#C9A227" />
      <KPI label="RevPAR" value={`₹${stats.revpar}`} delta="Revenue per room" icon="indian-rupee-sign" color="#10B981" />
      <KPI label="In-House" value={stats.inHouse} delta="Guests" icon="user-group" color="#F97316" />
    </section>

    <section className="mt-6 bg-white rounded-[16px] border border-slate-200 p-6">
      <p className="text-eyebrow text-brand-accent">Recent activity</p>
      <ul className="mt-4 space-y-3">
        {activities.slice(0, 6).map((a) => (
          <li key={a.id} className="flex gap-3">
            <span className="w-8 h-8 rounded-full grid place-items-center" style={{ backgroundColor: `${a.color}15`, color: a.color }}><i className={`fa-solid fa-${a.icon} text-[11px]`}></i></span>
            <div><p className="text-sm text-slate-900">{a.title}</p><p className="text-xs text-slate-500 mt-0.5">{a.body}</p></div>
          </li>
        ))}
      </ul>
    </section>
  </div>
);
