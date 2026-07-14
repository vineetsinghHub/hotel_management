import { Link } from "react-router-dom";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import SuperAdminLayout from "@aura/super-admin/superAdmin/SuperAdminLayout";
import { platformKpis, platformTenants, mrrTrend, signupTrend, platformAudit, statusPill, churnPill } from "@aura/super-admin/superAdmin/superAdminMockData";

const KPI = ({ label, value, delta, icon, color = "#4F46E5" }) => {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return (
    <div className="p-5 rounded-[16px] bg-white/5 border border-white/10" data-testid={`super-kpi-${id}`}>
      <div className="flex items-start justify-between">
        <p className="text-[10px] tracking-widest uppercase text-slate-500">{label}</p>
        <span className="w-8 h-8 rounded-full grid place-items-center" style={{ backgroundColor: `${color}25`, color }}>
          <i className={`fa-solid fa-${icon} text-xs`}></i>
        </span>
      </div>
      <p className="mt-3 font-mono text-3xl text-white">{value}</p>
      {delta && <p className="text-xs text-emerald-400 mt-1">{delta}</p>}
    </div>
  );
};

const RevTooltip = ({ active, payload }) => active && payload?.[0] ? (
  <div className="bg-slate-900 border border-white/10 rounded-[10px] px-3 py-2 shadow-xl">
    <p className="text-[10px] tracking-widest uppercase text-slate-500">{payload[0].payload.m}</p>
    <p className="mt-1 font-mono text-sm text-white">₹{(payload[0].value / 1000).toFixed(1)}K</p>
  </div>
) : null;

export default function SuperOverview() {
  const k = platformKpis();
  const top = [...platformTenants].sort((a, b) => b.mrr - a.mrr).slice(0, 6);
  const atRisk = platformTenants.filter((t) => t.churn === "high" || t.health < 80);

  return (
    <SuperAdminLayout pageTitle="Platform overview">
      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Active Tenants" value={k.active} delta={`+${k.trial} in trial`} icon="building" color="#4F46E5" />
        <KPI label="MRR" value={`₹${(k.mrr / 100000).toFixed(1)}L`} delta={`ARR ₹${(k.arr / 10000000).toFixed(2)}Cr`} icon="indian-rupee-sign" color="#10B981" />
        <KPI label="Avg. Health" value={`${k.avgHealth}%`} delta="Above target (90%)" icon="heart-pulse" color="#EC4899" />
        <KPI label="Uptime SLA" value={`${k.uptime}%`} delta="30-day rolling" icon="signal" color="#C9A227" />
      </section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-6 rounded-[16px] bg-white/5 border border-white/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-eyebrow text-brand-accent">Recurring revenue</p>
              <h3 className="mt-1 font-serif text-2xl text-white">MRR — last 12 months</h3>
            </div>
            <p className="text-xs text-slate-400"><span className="text-emerald-400 font-mono">+18.4%</span> MoM</p>
          </div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mrrTrend}>
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1F2937" strokeDasharray="4 6" vertical={false} />
                <XAxis dataKey="m" stroke="#64748B" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<RevTooltip />} cursor={{ stroke: "#4F46E5", strokeDasharray: "3 3" }} />
                <Area dataKey="v" stroke="#4F46E5" strokeWidth={2.5} fill="url(#mrrGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-[16px] bg-white/5 border border-white/10">
          <p className="text-eyebrow text-brand-accent">Sign-ups</p>
          <h3 className="mt-1 font-serif text-lg text-white">New tenants / month</h3>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={signupTrend}>
                <CartesianGrid stroke="#1F2937" strokeDasharray="4 6" vertical={false} />
                <XAxis dataKey="m" stroke="#64748B" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="v" fill="#C9A227" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-xs text-slate-400 flex items-center justify-between border-t border-white/5 pt-4">
            <span>Churn rate</span><span className="text-white font-mono">{k.churnRate}%</span>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-[16px] bg-white/5 border border-white/10 overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <div>
              <p className="text-eyebrow text-brand-accent">Top tenants by MRR</p>
              <p className="mt-1 text-sm text-slate-400">Highest-value properties on the platform</p>
            </div>
            <Link to="/super-admin/tenants" className="text-xs text-[#818CF8] hover:underline">All tenants →</Link>
          </div>
          <table className="w-full text-sm">
            <thead className="text-[10px] tracking-widest uppercase text-slate-500">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Tenant</th>
                <th className="text-left font-medium">Template</th>
                <th className="text-right font-medium">Users</th>
                <th className="text-right px-5 font-medium">MRR</th>
                <th className="text-right px-5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {top.map((t) => {
                const p = statusPill(t.status);
                return (
                  <tr key={t.slug} className="border-t border-white/5 hover:bg-white/5" data-testid={`top-tenant-${t.slug}`}>
                    <td className="px-5 py-3">
                      <Link to={`/super-admin/tenants/${t.slug}`} className="flex items-center gap-3 group">
                        <span className="w-8 h-8 rounded-full grid place-items-center text-xs font-serif text-slate-900" style={{ backgroundColor: "#C9A227" }}>{t.brandName[0]}</span>
                        <div>
                          <p className="text-white group-hover:text-brand-accent-hover transition-colors">{t.brandName}</p>
                          <p className="text-[10px] text-slate-500 font-mono">/{t.slug}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="text-slate-400 text-xs capitalize">{t.template}</td>
                    <td className="text-right font-mono text-xs text-slate-300">{t.users}</td>
                    <td className="px-5 text-right font-mono text-white">₹{(t.mrr / 1000).toFixed(1)}K</td>
                    <td className="px-5 text-right"><span className={`inline-block text-[10px] px-2 py-1 rounded-full ${p.bg} ${p.text}`}>{p.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-6 rounded-[16px] bg-white/5 border border-white/10">
          <p className="text-eyebrow text-brand-accent">Recent activity</p>
          <p className="mt-1 text-sm text-slate-400">Platform ops audit</p>
          <ul className="mt-4 space-y-3.5">
            {platformAudit.map((a) => (
              <li key={a.id} className="flex gap-3">
                <span className="w-8 h-8 rounded-full grid place-items-center flex-shrink-0" style={{ backgroundColor: `${a.color}25`, color: a.color }}>
                  <i className={`fa-solid fa-${a.icon} text-[10px]`}></i>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate"><span className="text-slate-400">{a.who}</span> {a.action}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">{a.target}</p>
                  <p className="text-[9px] text-slate-600 mt-0.5">{a.when}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {atRisk.length > 0 && (
        <section className="mt-6 p-6 rounded-[16px] bg-rose-500/5 border border-rose-500/20">
          <div className="flex items-start gap-3">
            <span className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 grid place-items-center flex-shrink-0"><i className="fa-solid fa-triangle-exclamation"></i></span>
            <div className="flex-1">
              <p className="text-eyebrow text-rose-400">Attention required</p>
              <h3 className="mt-1 font-serif text-lg text-white">{atRisk.length} tenants need review</h3>
              <p className="text-xs text-slate-400 mt-1">Health below 80% or churn risk high. Consider a proactive outreach.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {atRisk.map((t) => (
                  <Link key={t.slug} to={`/super-admin/tenants/${t.slug}`} className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-slate-200 border border-white/10 flex items-center gap-2" data-testid={`at-risk-${t.slug}`}>
                    {t.brandName}
                    <span className="text-rose-400 font-mono text-[10px]">{t.health}%</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </SuperAdminLayout>
  );
}
