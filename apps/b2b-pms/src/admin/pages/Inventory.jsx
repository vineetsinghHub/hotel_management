import { useMemo, useState } from "react";
import AdminLayout from "@aura/b2b-pms/admin/components/AdminLayout";
import ReadOnlyBanner, { useReadOnly } from "@aura/b2b-pms/admin/components/ReadOnlyBanner";
import { inventory as seed } from "@aura/shared/admin/adminMockData";
import { toast } from "sonner";
import { undoToast } from "@aura/shared/lib/undo";

const KEY = "aura_inventory_v1";
const readStore = () => { try { const v = JSON.parse(localStorage.getItem(KEY) || "null"); return Array.isArray(v) ? v : null; } catch (e) { return null; } };
const writeStore = (arr) => { try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch (e) {} };

export default function Inventory() {
  const [items, setItems] = useState(() => readStore() || seed);
  const [editing, setEditing] = useState(null); // { id }
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ item: "", category: "F&B", stock: 0, par: 10, unit: "units", cost: 0 });
  const [q, setQ] = useState("");
  const readOnly = useReadOnly();

  const filtered = useMemo(() => items.filter((i) => (i.item || "").toLowerCase().includes(q.toLowerCase())), [items, q]);

  const commit = (next) => { setItems(next); writeStore(next); };

  const updateField = (id, key, value) => {
    commit(items.map((i) => i.id === id ? { ...i, [key]: value } : i));
  };

  const removeItem = (id) => {
    const removed = items.find((i) => i.id === id);
    commit(items.filter((i) => i.id !== id));
    undoToast({ message: `Removed ${removed.item}`, description: `From ${removed.category}`, onUndo: () => commit([...items]) });
  };

  const addItem = () => {
    if (!form.item.trim()) { toast.error("Item name required"); return; }
    const id = `inv-${Date.now()}`;
    commit([{ id, ...form, stock: Number(form.stock), par: Number(form.par), cost: Number(form.cost) }, ...items]);
    toast.success(`Added ${form.item}`);
    setForm({ item: "", category: "F&B", stock: 0, par: 10, unit: "units", cost: 0 });
    setAddOpen(false);
  };

  const reorder = (it) => toast.success(`Reorder raised: ${it.item}`, { description: `${it.par - it.stock} ${it.unit} → preferred supplier` });

  return (
    <AdminLayout pageTitle="Inventory">
      <ReadOnlyBanner />
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div>
          <p className="text-eyebrow text-brand-accent">Stock ({items.length})</p>
          <h2 className="mt-1 font-serif text-2xl text-slate-900">Inventory</h2>
        </div>
        <div className="flex items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search items…" className="bg-brand-surface border border-slate-200 rounded-full px-4 py-2 text-sm outline-none focus:border-brand-primary w-48" data-testid="inv-search" />
          {!readOnly && <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-sm px-4 py-2 rounded-full shadow-[0_6px_20px_rgba(79,70,229,0.28)]" data-testid="inv-add"><i className="fa-solid fa-plus text-[10px]"></i>Add item</button>}
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[860px]">
          <thead className="text-[10px] tracking-widest uppercase text-slate-400 bg-slate-50">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Item</th>
              <th className="text-left font-medium">Category</th>
              <th className="text-right font-medium">Stock</th>
              <th className="text-right font-medium">Par</th>
              <th className="text-left font-medium">Level</th>
              <th className="text-right font-medium">Cost</th>
              <th className="text-right px-5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((i) => {
              const pct = (i.stock / (i.par || 1)) * 100;
              const low = pct < 50;
              const isEditing = editing === i.id;
              return (
                <tr key={i.id} className="border-t border-slate-100 hover:bg-slate-50" data-testid={`inv-${i.id}`}>
                  <td className="px-5 py-2">
                    {isEditing ? (
                      <input value={i.item} onChange={(e) => updateField(i.id, "item", e.target.value)} className="bg-white border border-slate-200 rounded-full px-3 py-1 text-sm outline-none focus:border-brand-primary w-48" data-testid={`inv-edit-item-${i.id}`} />
                    ) : (
                      <><p className="text-slate-900">{i.item}</p><p className="text-[10px] text-slate-500 font-mono">{i.id}</p></>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <select value={i.category} onChange={(e) => updateField(i.id, "category", e.target.value)} className="bg-white border border-slate-200 rounded-full px-3 py-1 text-sm outline-none" data-testid={`inv-edit-cat-${i.id}`}>
                        {["F&B", "Linen", "Amenities", "Cleaning", "Office", "Spa"].map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    ) : <span className="text-slate-600 text-xs">{i.category}</span>}
                  </td>
                  <td className="text-right">
                    {isEditing ? (
                      <input type="number" value={i.stock} onChange={(e) => updateField(i.id, "stock", Number(e.target.value))} className="bg-white border border-slate-200 rounded-full px-2 py-1 text-sm text-right w-20 outline-none" data-testid={`inv-edit-stock-${i.id}`} />
                    ) : (
                      <span className="font-mono text-slate-900">{i.stock} <span className="text-xs text-slate-500">{i.unit}</span></span>
                    )}
                  </td>
                  <td className="text-right">
                    {isEditing ? (
                      <input type="number" value={i.par} onChange={(e) => updateField(i.id, "par", Number(e.target.value))} className="bg-white border border-slate-200 rounded-full px-2 py-1 text-sm text-right w-20 outline-none" data-testid={`inv-edit-par-${i.id}`} />
                    ) : <span className="font-mono text-slate-500">{i.par}</span>}
                  </td>
                  <td>
                    <div className="w-32 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full ${low ? "bg-rose-500" : pct > 100 ? "bg-emerald-500" : "bg-brand-primary"}`} style={{ width: `${Math.min(100, pct)}%` }}></div>
                    </div>
                    {low && <p className="text-[9px] text-rose-600 mt-1">Below par</p>}
                  </td>
                  <td className="text-right">
                    {isEditing ? (
                      <input type="number" value={i.cost} onChange={(e) => updateField(i.id, "cost", Number(e.target.value))} className="bg-white border border-slate-200 rounded-full px-2 py-1 text-sm text-right w-24 outline-none" data-testid={`inv-edit-cost-${i.id}`} />
                    ) : <span className="font-mono text-slate-900">₹{i.cost}</span>}
                  </td>
                  <td className="px-5 text-right">
                    {isEditing ? (
                      <button onClick={() => { setEditing(null); toast.success("Saved"); }} className="text-xs text-emerald-600 hover:underline" data-testid={`inv-save-${i.id}`}>Save</button>
                    ) : (
                      <div className="inline-flex items-center gap-2">
                        {low && !readOnly && <button onClick={() => reorder(i)} className="text-xs text-brand-accent hover:underline" data-testid={`inv-reorder-${i.id}`}>Reorder</button>}
                        {!readOnly && <button onClick={() => setEditing(i.id)} className="text-xs text-brand-primary hover:underline" data-testid={`inv-edit-${i.id}`}>Edit</button>}
                        {!readOnly && <button onClick={() => removeItem(i.id)} className="text-xs text-rose-500 hover:underline" data-testid={`inv-remove-${i.id}`}>Remove</button>}
                        {readOnly && <span className="text-[10px] text-slate-400">Read only</span>}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center py-8 text-slate-500">No items match &ldquo;{q}&rdquo;</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {addOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setAddOpen(false)} data-testid="inv-add-modal">
          <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-md rounded-[20px] p-6 shadow-[0_40px_100px_rgba(15,23,42,0.35)]">
            <p className="text-eyebrow text-brand-accent">Add stock</p>
            <h3 className="mt-1 font-serif text-xl text-slate-900">New inventory item</h3>
            <div className="mt-4 space-y-3">
              <input value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} placeholder="Item name" className="w-full bg-brand-surface border border-slate-200 rounded-full px-3 py-2 text-sm outline-none focus:border-brand-primary" data-testid="inv-form-item" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-brand-surface border border-slate-200 rounded-full px-3 py-2 text-sm">{["F&B", "Linen", "Amenities", "Cleaning", "Office", "Spa"].map((c) => <option key={c} value={c}>{c}</option>)}</select>
                <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="Unit" className="w-full bg-brand-surface border border-slate-200 rounded-full px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Stock" className="w-full bg-brand-surface border border-slate-200 rounded-full px-3 py-2 text-sm" />
                <input type="number" value={form.par} onChange={(e) => setForm({ ...form, par: e.target.value })} placeholder="Par" className="w-full bg-brand-surface border border-slate-200 rounded-full px-3 py-2 text-sm" />
                <input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} placeholder="Cost ₹" className="w-full bg-brand-surface border border-slate-200 rounded-full px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button onClick={() => setAddOpen(false)} className="px-4 py-2 rounded-full border border-slate-200 text-sm">Cancel</button>
              <button onClick={addItem} className="px-4 py-2 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-sm" data-testid="inv-form-submit">Add item</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
