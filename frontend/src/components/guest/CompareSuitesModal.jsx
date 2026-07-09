import { useState } from "react";
import { useCurrency } from "@/context/AppContext";
import { toast } from "sonner";

export const CompareSuitesModal = ({ rooms, initialIds = [], onClose }) => {
  const { formatPrice } = useCurrency();
  const [ids, setIds] = useState(initialIds.slice(0, 3));
  const picked = rooms.filter((r) => ids.includes(r.id));
  const available = rooms.filter((r) => !ids.includes(r.id));

  const add = (id) => {
    if (ids.length >= 3) { toast.error("Compare up to 3 suites"); return; }
    setIds((s) => [...s, id]);
  };
  const remove = (id) => setIds((s) => s.filter((x) => x !== id));

  const rows = [
    { key: "view", label: "View" },
    { key: "bed", label: "Bed" },
    { key: "guests", label: "Sleeps" },
    { key: "size", label: "Size (ft²)" },
    { key: "cancellation", label: "Cancellation" },
    { key: "price", label: "From / night", price: true },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-8 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} data-testid="compare-modal">
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-5xl rounded-t-[24px] md:rounded-[24px] max-h-[92vh] overflow-y-auto shadow-[0_40px_100px_rgba(15,23,42,0.35)] relative">
        <div className="sticky top-0 bg-white/95 backdrop-blur px-6 md:px-8 py-5 border-b border-slate-100 flex items-center justify-between z-10">
          <div>
            <p className="text-eyebrow text-[#C9A227]">Compare</p>
            <h3 className="mt-1 font-serif text-2xl text-slate-900">Side-by-side suites</h3>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center" aria-label="Close" data-testid="compare-close">
            <i className="fa-solid fa-xmark text-slate-500 text-sm"></i>
          </button>
        </div>

        <div className="p-6 md:p-8">
          {picked.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-10">Add up to three suites to compare.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left text-[10px] tracking-widest uppercase text-slate-400 py-3 w-40">Feature</th>
                    {picked.map((r) => (
                      <th key={r.id} className="text-left py-3" data-testid={`compare-col-${r.id}`}>
                        <div className="flex flex-col">
                          <img src={r.images[0]} alt={r.name} loading="lazy" className="w-full h-32 object-cover rounded-[14px] mb-3" />
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-serif text-lg text-slate-900">{r.name}</span>
                            <button onClick={() => remove(r.id)} className="text-slate-400 hover:text-rose-500" aria-label="Remove" data-testid={`compare-remove-${r.id}`}><i className="fa-solid fa-xmark text-xs"></i></button>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((row) => (
                    <tr key={row.key}>
                      <td className="py-3 text-eyebrow text-slate-500">{row.label}</td>
                      {picked.map((r) => (
                        <td key={r.id} className={`py-3 pr-4 ${row.price ? "font-mono text-slate-900" : "text-slate-700"}`}>
                          {row.price ? formatPrice(r[row.key]) : r[row.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {available.length > 0 && picked.length < 3 && (
            <div className="mt-8">
              <p className="text-eyebrow text-slate-500 mb-3">Add another to compare</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {available.slice(0, 8).map((r) => (
                  <button key={r.id} onClick={() => add(r.id)} className="p-3 rounded-[14px] border border-slate-200 hover:border-[#4F46E5] text-left flex items-center gap-3 transition-colors" data-testid={`compare-add-${r.id}`}>
                    <img src={r.images[0]} alt="" loading="lazy" className="w-12 h-12 rounded-[10px] object-cover" />
                    <div className="min-w-0">
                      <p className="text-sm text-slate-900 truncate">{r.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{formatPrice(r.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompareSuitesModal;
