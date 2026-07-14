import { useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, LineChart, Line, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

// Extra analytics tiles for Admin Dashboard.
const monthly = Array.from({ length: 12 }).map((_, i) => ({
  m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  revpar: 180 + Math.round(30 * Math.sin(i / 2)) + i * 4,
  ly: 160 + Math.round(20 * Math.sin(i / 2)) + i * 3,
}));
const pace = Array.from({ length: 30 }).map((_, i) => ({
  d: i + 1, pickup: 3 + Math.round(3 * Math.sin(i / 3)) + (i % 5 === 0 ? 2 : 0), ly: 3 + Math.round(2 * Math.sin(i / 4)),
}));
const funnel = [
  { l: "Site visitors", v: 12400 }, { l: "Started search", v: 5820 }, { l: "Viewed suite", v: 3210 }, { l: "Started booking", v: 1104 }, { l: "Completed", v: 428 },
];
const byCountry = [
  { c: "IN", v: 41 }, { c: "US", v: 18 }, { c: "GB", v: 12 }, { c: "AE", v: 9 }, { c: "FR", v: 7 }, { c: "JP", v: 5 }, { c: "Other", v: 8 },
];

export const AdminExtraAnalytics = () => {
  const funnelMax = funnel[0].v;
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-4" data-testid="admin-extra-analytics">
      {/* RevPAR YoY */}
      <div className="p-5 rounded-[16px] bg-white border border-slate-200">
        <p className="text-eyebrow text-brand-accent">RevPAR YoY</p>
        <h4 className="font-serif text-lg text-slate-900 mt-1">Monthly · vs last year</h4>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={monthly} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
            <XAxis dataKey="m" tick={{ fontSize: 10 }} stroke="#94A3B8" />
            <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
            <Tooltip />
            <Line dataKey="ly" stroke="#94A3B8" strokeDasharray="4 4" dot={false} />
            <Line dataKey="revpar" stroke="#4F46E5" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Booking pace */}
      <div className="p-5 rounded-[16px] bg-white border border-slate-200">
        <p className="text-eyebrow text-brand-accent">Booking pace</p>
        <h4 className="font-serif text-lg text-slate-900 mt-1">Next 30 days · pickup</h4>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={pace} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
            <XAxis dataKey="d" tick={{ fontSize: 10 }} stroke="#94A3B8" />
            <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
            <Tooltip />
            <Bar dataKey="ly" fill="#E2E8F0" radius={[4,4,0,0]} />
            <Bar dataKey="pickup" fill="#C9A227" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Guest origin */}
      <div className="p-5 rounded-[16px] bg-white border border-slate-200">
        <p className="text-eyebrow text-brand-accent">Guest origin</p>
        <h4 className="font-serif text-lg text-slate-900 mt-1">Top source countries</h4>
        <ul className="mt-3 space-y-1.5">
          {byCountry.map((c) => (
            <li key={c.c} className="flex items-center gap-3 text-xs" data-testid={`origin-${c.c}`}>
              <span className="font-mono w-8 text-slate-600">{c.c}</span>
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-brand-primary" style={{ width: `${(c.v / 41) * 100}%` }}></div></div>
              <span className="font-mono text-slate-900 w-8 text-right">{c.v}%</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Booking funnel */}
      <div className="lg:col-span-2 p-5 rounded-[16px] bg-white border border-slate-200" data-testid="funnel-widget">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-eyebrow text-brand-accent">Booking funnel</p>
            <h4 className="font-serif text-lg text-slate-900 mt-1">Last 30 days · conversion 3.4%</h4>
          </div>
          <span className="text-[10px] text-slate-400 tracking-widest uppercase">Direct + OTAs</span>
        </div>
        <div className="mt-4 space-y-2">
          {funnel.map((f, i) => {
            const pct = Math.round((f.v / funnelMax) * 100);
            return (
              <div key={f.l} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-32">{f.l}</span>
                <div className="flex-1 h-6 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-primary to-brand-accent flex items-center justify-end pr-2 text-[10px] text-white" style={{ width: `${pct}%` }}>
                    {i === 0 ? "" : `${((f.v / funnel[i - 1].v) * 100).toFixed(0)}% →`}
                  </div>
                </div>
                <span className="font-mono text-slate-900 text-sm w-16 text-right">{f.v.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guest satisfaction radial */}
      <div className="p-5 rounded-[16px] bg-white border border-slate-200 flex flex-col" data-testid="csat-widget">
        <p className="text-eyebrow text-brand-accent">Guest satisfaction</p>
        <h4 className="font-serif text-lg text-slate-900 mt-1">CSAT · last 90 days</h4>
        <div className="flex-1 grid place-items-center">
          <ResponsiveContainer width="100%" height={180}>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: "csat", v: 92, fill: "#4F46E5" }]} startAngle={220} endAngle={-40}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="v" cornerRadius={20} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center -mt-6 font-mono text-3xl text-slate-900">92%</p>
        <p className="text-center text-[11px] text-slate-500 mt-1">+4 pts vs previous</p>
      </div>
    </section>
  );
};

export default AdminExtraAnalytics;
