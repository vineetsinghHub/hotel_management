import AdminLayout from "@/admin/components/AdminLayout";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { stats, revenueTrend, arrivals, activities, channels, statusColor, occupancyTrend } from "@/admin/adminMockData";

const KPI = ({ label, value, delta, icon, color }) => (
  <div className="p-5 bg-white rounded-[16px] border border-slate-200">
    <div className="flex items-start justify-between">
      <p className="text-[10px] tracking-[0.2em] uppercase text-slate-500">{label}</p>
      <span className="w-8 h-8 rounded-full grid place-items-center" style={{ backgroundColor: `${color}15`, color }}><i className={`fa-solid fa-${icon} text-xs`}></i></span>
    </div>
    <p className="mt-3 font-mono text-3xl text-slate-900">{value}</p>
    <p className="text-xs text-emerald-600 mt-1">{delta}</p>
  </div>
);

const RevenueTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-[10px] shadow-[0_10px_28px_rgba(15,23,42,0.10)] px-3 py-2" data-testid="rev-tooltip">
      <p className="text-[10px] tracking-widest uppercase text-slate-400">{p.d}</p>
      <p className="mt-1 font-mono text-sm text-slate-900">₹{(p.v / 1000).toFixed(1)}K</p>
    </div>
  );
};

const OccTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-[10px] shadow-[0_10px_28px_rgba(15,23,42,0.10)] px-3 py-2" data-testid="occ-tooltip">
      <p className="text-[10px] tracking-widest uppercase text-slate-400">Day {p.d}</p>
      <p className="mt-1 font-mono text-sm text-slate-900">{p.occ}%</p>
    </div>
  );
};

const occupancyDonut = [
  { name: "Occupied", value: 19, color: "#4F46E5" },
  { name: "Available", value: 3, color: "#10B981" },
  { name: "Cleaning", value: 2, color: "#C9A227" },
  { name: "OOO/Maint.", value: 2, color: "#F43F5E" },
];

export default function AdminDashboard() {
  const totalRooms = occupancyDonut.reduce((s, x) => s + x.value, 0);
  const occPct = Math.round((occupancyDonut[0].value / totalRooms) * 100);

  return (
    <AdminLayout pageTitle="Dashboard">
      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="kpi-row">
        <KPI label="Today's Arrivals" value={stats.arrivals} delta="+2 vs yesterday" icon="right-to-bracket" color="#4F46E5" />
        <KPI label="Today's Departures" value={stats.departures} delta="On track" icon="right-from-bracket" color="#F43F5E" />
        <KPI label="In-house Guests" value={stats.inHouse} delta="87% occupancy" icon="user-group" color="#C9A227" />
        <KPI label="Revenue Today" value={`₹${(stats.revenueToday/1000).toFixed(1)}K`} delta="+18% MoM" icon="indian-rupee-sign" color="#10B981" />
      </section>

      {/* Revenue + Occupancy */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-[16px] border border-slate-200 p-6" data-testid="revenue-chart-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-eyebrow text-[#C9A227]">Revenue Trend</p>
              <h3 className="mt-1 font-serif text-2xl text-slate-900">Last 15 days · <span className="font-sans text-base text-slate-500">₹6,29,400</span></h3>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
              {["7D", "30D", "90D", "1Y"].map((t) => <button key={t} className={`px-3 py-1 rounded-full text-xs ${t === "30D" ? "bg-[#4F46E5] text-white" : "text-slate-600"}`}>{t}</button>)}
            </div>
          </div>
          <div className="mt-6 h-56 w-full" data-testid="revenue-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 6" vertical={false} />
                <XAxis dataKey="d" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<RevenueTooltip />} cursor={{ stroke: "#4F46E5", strokeWidth: 1, strokeDasharray: "3 3" }} />
                <Area type="monotone" dataKey="v" stroke="#4F46E5" strokeWidth={2.5} fill="url(#revGradient)" activeDot={{ r: 5, fill: "#4F46E5", stroke: "white", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-slate-200 p-6" data-testid="live-occupancy">
          <p className="text-eyebrow text-[#C9A227]">Live Occupancy</p>
          <h3 className="mt-1 font-serif text-xl text-slate-900">Real-time room status</h3>
          <div className="mt-4 h-44 relative" data-testid="occupancy-donut">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={occupancyDonut} dataKey="value" nameKey="name" innerRadius={54} outerRadius={72} paddingAngle={2} startAngle={90} endAngle={-270}>
                  {occupancyDonut.map((entry) => <Cell key={entry.name} fill={entry.color} stroke="none" />)}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => active && payload && payload[0] ? (
                    <div className="bg-white border border-slate-200 rounded-[10px] shadow-[0_10px_28px_rgba(15,23,42,0.10)] px-3 py-2">
                      <p className="text-[10px] tracking-widest uppercase text-slate-400">{payload[0].name}</p>
                      <p className="mt-1 font-mono text-sm text-slate-900">{payload[0].value} rooms</p>
                    </div>
                  ) : null}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="text-center">
                <p className="font-mono text-3xl text-slate-900">{occPct}%</p>
                <p className="text-[9px] tracking-widest uppercase text-slate-500">Occupied</p>
              </div>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {occupancyDonut.map((r) => (
              <li key={r.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: r.color }}></span>{r.name}</div>
                <span className="font-mono text-slate-900">{r.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Arrivals + Activity */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-[16px] border border-slate-200">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-eyebrow text-[#C9A227]">Today&apos;s Arrivals & In-House</p>
              <p className="mt-1 text-sm text-slate-500">10 active reservations</p>
            </div>
            <a href="/admin/reservations" className="text-xs text-[#4F46E5] hover:underline">View all →</a>
          </div>
          <table className="w-full text-sm">
            <thead className="text-[10px] tracking-widest uppercase text-slate-400">
              <tr><th className="text-left px-5 py-3 font-medium">Guest</th><th className="text-left font-medium">Room</th><th className="text-left font-medium">Dates</th><th className="text-left font-medium">Status</th><th className="text-right px-5 font-medium">Total</th></tr>
            </thead>
            <tbody>
              {arrivals.slice(3, 9).map((a) => {
                const st = statusColor(a.status);
                return (
                  <tr key={a.id} className="border-t border-slate-100 hover:bg-slate-50" data-testid={`arrival-${a.id}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-slate-100 grid place-items-center font-serif text-slate-700 text-sm">{a.guest[0]}</span>
                        <div><p className="text-slate-900">{a.guest}</p><p className="text-[10px] text-slate-500 font-mono">{a.id}</p></div>
                      </div>
                    </td>
                    <td><p className="text-slate-900">{a.room}</p><p className="text-[10px] text-slate-500">{a.roomType}</p></td>
                    <td className="text-slate-600 text-xs">{a.checkIn} — {a.checkOut}</td>
                    <td><span className={`inline-block text-[10px] px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>{st.label}</span></td>
                    <td className="px-5 text-right font-mono text-slate-900">₹{(a.total / 1000).toFixed(1)}K</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-[16px] border border-slate-200 p-6">
          <p className="text-eyebrow text-[#C9A227]">Activity</p>
          <p className="mt-1 text-sm text-slate-500">Recent events</p>
          <ul className="mt-5 space-y-4">
            {activities.map((a) => (
              <li key={a.id} className="flex gap-3">
                <span className="w-8 h-8 rounded-full grid place-items-center flex-shrink-0" style={{ backgroundColor: `${a.color}15`, color: a.color }}><i className={`fa-solid fa-${a.icon} text-[11px]`}></i></span>
                <div><p className="text-sm text-slate-900">{a.title}</p><p className="text-xs text-slate-500 mt-0.5">{a.body}</p><p className="text-[10px] text-slate-400 mt-0.5">{a.when}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Channels + Occupancy trend */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-[16px] border border-slate-200 p-6">
          <p className="text-eyebrow text-[#C9A227]">Booking Channels</p>
          <p className="mt-1 text-sm text-slate-500">Distribution this month</p>
          <ul className="mt-5 space-y-3">
            {channels.map((c) => (
              <li key={c.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center gap-2 text-slate-700"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}></span>{c.name}</div>
                  <div className="flex items-center gap-3 text-slate-500 text-xs"><span className="font-mono">{c.count}</span><span className="font-mono text-slate-900">{c.pct}%</span></div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${c.pct}%`, backgroundColor: c.color }}></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-[16px] border border-slate-200 p-6" data-testid="occupancy-trend">
          <p className="text-eyebrow text-[#C9A227]">Occupancy Trend</p>
          <p className="mt-1 text-sm text-slate-500">Last 30 days</p>
          <div className="mt-6 h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyTrend} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 6" vertical={false} />
                <XAxis dataKey="d" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} interval={4} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                <Tooltip content={<OccTooltip />} cursor={{ fill: "#4F46E5", opacity: 0.06 }} />
                <Bar dataKey="occ" radius={[4, 4, 0, 0]}>
                  {occupancyTrend.map((entry, i) => (
                    <Cell key={i} fill={entry.occ >= 85 ? "#4F46E5" : entry.occ >= 60 ? "#818CF8" : "#C7D2FE"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
