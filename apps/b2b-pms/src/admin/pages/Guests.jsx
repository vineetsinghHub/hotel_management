import { useState } from "react";
import AdminLayout from "@aura/b2b-pms/admin/components/AdminLayout";
import ReadOnlyBanner, { useReadOnly } from "@aura/b2b-pms/admin/components/ReadOnlyBanner";
import Guest360Modal from "@aura/b2b-pms/admin/components/Guest360Modal";
import BulkCsvImport from "@aura/b2b-pms/admin/components/BulkCsvImport";
import { guests } from "@aura/shared/admin/adminMockData";

const tierColor = (t) => ({ Diamond: "#8B5CF6", Platinum: "#4F46E5", Gold: "#C9A227", Silver: "#94A3B8" }[t] || "#64748B");

const withAvatars = (list) => list.map((g, i) => ({
  ...g,
  avatar: g.avatar || `https://i.pravatar.cc/200?img=${(i % 60) + 1}`,
  phone: g.phone || "+91 98200 12345",
}));

export default function Guests() {
  const [open, setOpen] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const rows = withAvatars(guests);
  const readOnly = useReadOnly();

  return (
    <AdminLayout pageTitle="Guests · CRM">
      <ReadOnlyBanner />
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-eyebrow text-brand-accent">Customers</p>
          <h2 className="mt-1 font-serif text-2xl text-slate-900">Guest CRM</h2>
        </div>
        {!readOnly && <button onClick={() => setImportOpen(true)} className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs" data-testid="import-open"><i className="fa-solid fa-upload text-[10px] mr-1.5"></i>Bulk import CSV</button>}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">Total Guests</p><p className="mt-2 font-mono text-3xl text-slate-900">{guests.length * 152}</p></div>
        <div className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">Platinum+ Members</p><p className="mt-2 font-mono text-3xl text-brand-primary">142</p></div>
        <div className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">Repeat rate</p><p className="mt-2 font-mono text-3xl text-emerald-600">68%</p></div>
        <div className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">Avg lifetime value</p><p className="mt-2 font-mono text-3xl text-slate-900">₹2.4L</p></div>
      </div>
      <div className="bg-white rounded-[16px] border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-widest uppercase text-slate-400 bg-slate-50">
            <tr><th className="text-left px-5 py-3 font-medium">Guest</th><th className="text-left font-medium">Tier</th><th className="text-left font-medium">Stays</th><th className="text-left font-medium">Spend</th><th className="text-left font-medium">Country</th><th className="text-left font-medium">Last stay</th><th className="text-right px-5 font-medium">Action</th></tr>
          </thead>
          <tbody>
            {rows.map((g) => (
              <tr key={g.id} className="border-t border-slate-100 hover:bg-slate-50" data-testid={`guest-${g.id}`}>
                <td className="px-5 py-3">
                  <button onClick={() => setOpen(g)} className="text-left hover:underline" data-testid={`open-guest-${g.id}`}>
                    <p className="text-slate-900">{g.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{g.id} · {g.email}</p>
                  </button>
                </td>
                <td><span className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: tierColor(g.tier) }}>{g.tier}</span></td>
                <td className="font-mono text-slate-900">{g.stays}</td>
                <td className="font-mono text-slate-900">₹{(g.spend/1000).toFixed(0)}K</td>
                <td className="text-slate-600 text-xs">{g.country}</td>
                <td className="text-slate-500 text-xs">{g.lastStay}</td>
                <td className="text-right px-5"><button onClick={() => setOpen(g)} className="text-xs text-brand-primary hover:underline" data-testid={`view-guest-${g.id}`}>View 360</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && <Guest360Modal guest={open} onClose={() => setOpen(null)} />}
      <BulkCsvImport open={importOpen} onClose={() => setImportOpen(false)} entity="Guests" onCommit={(data) => console.log("imported", data.length)} />
    </AdminLayout>
  );
}
