import AdminLayout from "@/admin/components/AdminLayout";
import { inventory } from "@/admin/adminMockData";
export default function Inventory() {
  return (
    <AdminLayout pageTitle="Inventory">
      <div className="bg-white rounded-[16px] border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-widest uppercase text-slate-400 bg-slate-50"><tr><th className="text-left px-5 py-3 font-medium">Item</th><th className="text-left font-medium">Category</th><th className="text-right font-medium">Stock</th><th className="text-right font-medium">Par</th><th className="text-left font-medium">Level</th><th className="text-right px-5 font-medium">Unit cost</th></tr></thead>
          <tbody>
            {inventory.map((i) => { const pct = (i.stock / i.par) * 100; const low = pct < 50; return (
              <tr key={i.id} className="border-t border-slate-100 hover:bg-slate-50" data-testid={`inv-${i.id}`}>
                <td className="px-5 py-3"><p className="text-slate-900">{i.item}</p><p className="text-[10px] text-slate-500 font-mono">{i.id}</p></td>
                <td className="text-slate-600 text-xs">{i.category}</td>
                <td className="text-right font-mono text-slate-900">{i.stock} <span className="text-xs text-slate-500">{i.unit}</span></td>
                <td className="text-right font-mono text-slate-500">{i.par}</td>
                <td>
                  <div className="w-32 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full ${low ? "bg-rose-500" : pct > 100 ? "bg-emerald-500" : "bg-[#4F46E5]"}`} style={{ width: `${Math.min(100, pct)}%` }}></div>
                  </div>
                  {low && <p className="text-[9px] text-rose-600 mt-1">Below par · reorder</p>}
                </td>
                <td className="px-5 text-right font-mono text-slate-900">₹{i.cost}</td>
              </tr>);
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
