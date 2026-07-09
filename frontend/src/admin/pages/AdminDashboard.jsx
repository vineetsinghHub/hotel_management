import AdminLayout from "@/admin/components/AdminLayout";
import { stats, revenueTrend, arrivals, activities, channels, statusColor } from "@/admin/adminMockData";

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

export default function AdminDashboard() {
  const max = Math.max(...revenueTrend.map((x) => x.v));
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
        <div className="lg:col-span-2 bg-white rounded-[16px] border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-eyebrow text-[#C9A227]">Revenue Trend</p>
              <h3 className="mt-1 font-serif text-2xl text-slate-900">Last 60 days · <span className="font-sans text-base text-slate-500">₹1,00Lk</span></h3>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
              {["7D", "30D", "90D", "1Y"].map((t) => <button key={t} className={`px-3 py-1 rounded-full text-xs ${t === "30D" ? "bg-[#4F46E5] text-white" : "text-slate-600"}`}>{t}</button>)}
            </div>
          </div>
          <svg viewBox="0 0 720 220" className="mt-6 w-full h-56">
            <defs>
              <linearGradient id="grev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.28"/>
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0"/>
              </linearGradient>
            </defs>
            {(() => {
              const pts = revenueTrend.map((p, i) => [40 + i * ((720 - 60) / (revenueTrend.length - 1)), 200 - (p.v / max) * 160]);
              const path = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
              const area = `${path} L${pts[pts.length - 1][0]},200 L${pts[0][0]},200 Z`;
              return (<>
                <path d={area} fill="url(#grev)" />
                <path d={path} fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
                {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#4F46E5" />)}
              </>);
            })()}
            {revenueTrend.filter((_, i) => i % 3 === 0).map((p, i) => <text key={i} x={40 + i * 3 * ((720 - 60) / (revenueTrend.length - 1))} y="216" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="JetBrains Mono">{p.d}</text>)}
          </svg>
        </div>

        <div className="bg-white rounded-[16px] border border-slate-200 p-6" data-testid="live-occupancy">
          <p className="text-eyebrow text-[#C9A227]">Live Occupancy</p>
          <h3 className="mt-1 font-serif text-xl text-slate-900">Real-time room status</h3>
          <div className="mt-6 flex flex-col items-center">
            {(() => {
              const R = 60, C = 2 * Math.PI * R;
              const pct = 87; const off = C - (pct / 100) * C;
              return (
                <svg width="160" height="160" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r={R} stroke="#E2E8F0" strokeWidth="14" fill="none" />
                  <circle cx="80" cy="80" r={R} stroke="#4F46E5" strokeWidth="14" fill="none" strokeDasharray={C} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 80 80)" />
                  <text x="80" y="80" textAnchor="middle" fontSize="28" fill="#0F172A" fontFamily="JetBrains Mono" fontWeight="500">{pct}%</text>
                  <text x="80" y="98" textAnchor="middle" fontSize="9" fill="#64748B" letterSpacing="2">OCCUPIED</text>
                </svg>
              );
            })()}
          </div>
          <ul className="mt-5 space-y-2 text-sm">
            {[
              { label: "Occupied", v: 19, c: "#4F46E5" },
              { label: "Available", v: 3, c: "#10B981" },
              { label: "Cleaning", v: 2, c: "#C9A227" },
              { label: "OOO/Maint.", v: 2, c: "#F43F5E" },
            ].map((r) => (
              <li key={r.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: r.c }}></span>{r.label}</div>
                <span className="font-mono text-slate-900">{r.v}</span>
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
              {arrivals.slice(0, 6).map((a) => {
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
        <div className="bg-white rounded-[16px] border border-slate-200 p-6">
          <p className="text-eyebrow text-[#C9A227]">Occupancy Trend</p>
          <p className="mt-1 text-sm text-slate-500">Last 30 days</p>
          <div className="mt-6 flex items-end gap-1.5 h-40">
            {Array.from({ length: 30 }).map((_, i) => {
              const h = 40 + Math.abs(Math.sin(i * 0.6)) * 55 + (i > 20 ? 20 : 0);
              return <div key={i} className="flex-1 bg-gradient-to-t from-[#4F46E5]/70 to-[#4F46E5] rounded-t-[3px]" style={{ height: `${Math.min(100, h)}%` }} title={`${Math.round(h)}%`}></div>;
            })}
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono"><span>Feb 15</span><span>Mar 01</span><span>Mar 15</span></div>
        </div>
      </section>
    </AdminLayout>
  );
}
