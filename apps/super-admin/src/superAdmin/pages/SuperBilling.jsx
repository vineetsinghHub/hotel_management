import SuperAdminLayout from "@aura/super-admin/superAdmin/SuperAdminLayout";
import { platformTenants, statusPill } from "@aura/super-admin/superAdmin/superAdminMockData";

// Billing overview — flat list of invoices generated across all tenants.
// Mock data derived from tenant MRR × month.
const months = ["Feb 2026", "Jan 2026", "Dec 2025"];
const buildInvoices = () => {
  const out = [];
  platformTenants.forEach((t) => {
    months.forEach((m, i) => {
      out.push({
        id: `INV-${t.slug.toUpperCase().slice(0, 4)}-${100 + i}`,
        tenant: t,
        amount: t.mrr,
        month: m,
        status: i === 0 && t.status === "suspended" ? "overdue" : i === 0 && t.status === "trial" ? "pending" : "paid",
      });
    });
  });
  return out.sort((a, b) => (a.status === "overdue" ? -1 : 0));
};

const badge = (s) => {
  if (s === "paid") return "bg-emerald-500/15 text-emerald-300";
  if (s === "pending") return "bg-amber-500/15 text-amber-300";
  return "bg-rose-500/15 text-rose-300";
};

export default function SuperBilling() {
  const invoices = buildInvoices();
  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const totalOutstanding = invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount, 0);

  return (
    <SuperAdminLayout pageTitle="Billing">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-5 rounded-[16px] bg-white/5 border border-white/10">
          <p className="text-eyebrow text-brand-accent">Collected (3 mo)</p>
          <p className="mt-2 font-mono text-3xl text-white">₹{(totalPaid / 100000).toFixed(1)}L</p>
        </div>
        <div className="p-5 rounded-[16px] bg-white/5 border border-white/10">
          <p className="text-eyebrow text-brand-accent">Outstanding</p>
          <p className="mt-2 font-mono text-3xl text-rose-300">₹{(totalOutstanding / 1000).toFixed(0)}K</p>
        </div>
        <div className="p-5 rounded-[16px] bg-white/5 border border-white/10">
          <p className="text-eyebrow text-brand-accent">Auto-renew rate</p>
          <p className="mt-2 font-mono text-3xl text-white">97.4%</p>
        </div>
      </div>

      <div className="rounded-[16px] bg-white/5 border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-widest uppercase text-slate-500 bg-white/5">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Invoice</th>
              <th className="text-left font-medium">Tenant</th>
              <th className="text-left font-medium">Month</th>
              <th className="text-right px-5 font-medium">Amount</th>
              <th className="text-right px-5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.slice(0, 15).map((i) => (
              <tr key={i.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-5 py-3 font-mono text-xs text-slate-300">{i.id}</td>
                <td className="text-white">{i.tenant.brandName}</td>
                <td className="text-slate-400 text-xs">{i.month}</td>
                <td className="px-5 text-right font-mono text-white">₹{(i.amount / 1000).toFixed(1)}K</td>
                <td className="px-5 text-right"><span className={`text-[10px] px-2 py-1 rounded-full capitalize ${badge(i.status)}`}>{i.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SuperAdminLayout>
  );
}
