import { toast } from "sonner";
import AdminLayout from "@aura/b2b-pms/admin/components/AdminLayout";
import { invoicesAdmin, statusColor } from "@aura/shared/admin/adminMockData";
export default function Invoices() {
  return (
    <AdminLayout pageTitle="Invoices & Folios">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">Paid this month</p><p className="mt-2 font-mono text-3xl text-emerald-600">₹68.4L</p></div>
        <div className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">Outstanding</p><p className="mt-2 font-mono text-3xl text-rose-600">₹48.0L</p></div>
        <div className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">Partial payments</p><p className="mt-2 font-mono text-3xl text-amber-600">₹2.6L</p></div>
        <div className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">Avg collection · days</p><p className="mt-2 font-mono text-3xl text-slate-900">4.2</p></div>
      </div>
      <div className="bg-white rounded-[16px] border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-widest uppercase text-slate-400 bg-slate-50"><tr><th className="text-left px-5 py-3 font-medium">Invoice</th><th className="text-left font-medium">Reservation</th><th className="text-left font-medium">Guest</th><th className="text-left font-medium">Date</th><th className="text-right font-medium">Amount</th><th className="text-left font-medium">Method</th><th className="text-center font-medium">Status</th><th className="text-right px-5 font-medium">Actions</th></tr></thead>
          <tbody>
            {invoicesAdmin.map((i) => { const st = statusColor(i.status); return (
              <tr key={i.id} className="border-t border-slate-100 hover:bg-slate-50" data-testid={`inv-${i.id}`}>
                <td className="px-5 py-3 font-mono text-slate-900">{i.id}</td>
                <td className="font-mono text-slate-500 text-xs">{i.ref}</td>
                <td>{i.guest}</td>
                <td className="text-slate-500 text-xs">{i.date}</td>
                <td className="text-right font-mono text-slate-900">₹{(i.amount/100000).toFixed(2)}L</td>
                <td className="text-slate-600 text-xs">{i.method}</td>
                <td className="text-center"><span className={`text-[10px] px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>{st.label}</span></td>
                <td className="px-5 text-right"><button onClick={() => toast.success(`${i.id} downloaded`)} className="text-xs text-slate-500 hover:text-slate-900 mr-3">PDF</button><button onClick={() => toast.success(`${i.id} emailed`)} className="text-xs text-slate-500 hover:text-slate-900">Email</button></td>
              </tr>);
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
