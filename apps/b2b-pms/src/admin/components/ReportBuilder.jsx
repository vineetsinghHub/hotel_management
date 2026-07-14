import { useMemo, useState } from "react";
import { toast } from "sonner";

const allFields = [
  { k: "date", l: "Date", type: "date" },
  { k: "guest", l: "Guest", type: "text" },
  { k: "room", l: "Room", type: "text" },
  { k: "nights", l: "Nights", type: "num" },
  { k: "adr", l: "ADR", type: "money" },
  { k: "revenue", l: "Revenue", type: "money" },
  { k: "channel", l: "Channel", type: "text" },
  { k: "tax", l: "Tax", type: "money" },
  { k: "discount", l: "Discount", type: "money" },
  { k: "tips", l: "Tips", type: "money" },
  { k: "folio", l: "Folio total", type: "money" },
];

const presets = [
  { k: "revenue", name: "Revenue by day", fields: ["date", "revenue", "adr", "nights"] },
  { k: "channel", name: "Channel performance", fields: ["channel", "revenue", "nights", "adr"] },
  { k: "folio", name: "Guest folios", fields: ["date", "guest", "room", "folio", "tips"] },
];

const randomRow = (i) => ({
  date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
  guest: ["Aarav M.", "Priya P.", "James T.", "Camille D.", "Nikhil R."][i % 5],
  room: [101, 102, 203, 204, 301][i % 5],
  nights: 2 + (i % 4),
  adr: 220 + (i * 13) % 180,
  revenue: 2400 + (i * 137) % 1800,
  channel: ["Direct", "Booking.com", "Expedia", "Agoda", "Corporate"][i % 5],
  tax: 240 + (i * 7) % 90,
  discount: (i % 3) === 0 ? 120 : 0,
  tips: 20 + (i * 3) % 40,
  folio: 2800 + (i * 141) % 2100,
});

export const ReportBuilder = () => {
  const [fields, setFields] = useState(["date", "guest", "room", "revenue", "channel"]);
  const [range, setRange] = useState(30);

  const rows = useMemo(() => Array.from({ length: range }).map((_, i) => randomRow(i)), [range]);

  const toggle = (k) => setFields((s) => s.includes(k) ? s.filter((x) => x !== k) : [...s, k]);
  const applyPreset = (p) => { setFields(p.fields); toast.success(`Preset applied: ${p.name}`); };

  const exportCsv = () => {
    const header = fields.join(",");
    const body = rows.map((r) => fields.map((f) => JSON.stringify(r[f] ?? "")).join(",")).join("\n");
    const csv = header + "\n" + body;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `aura-report-${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  };

  const fmt = (v, type) => type === "money" ? `$${Number(v).toLocaleString()}` : String(v);

  return (
    <div className="space-y-4" data-testid="report-builder">
      <div className="p-4 rounded-[16px] bg-white border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-eyebrow text-slate-500 mr-2">Presets:</p>
            {presets.map((p) => (
              <button key={p.k} onClick={() => applyPreset(p)} className="px-3 py-1.5 rounded-full bg-brand-surface hover:bg-slate-100 text-xs text-slate-700" data-testid={`preset-${p.k}`}>{p.name}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-eyebrow text-slate-500">Range</label>
            <select value={range} onChange={(e) => setRange(Number(e.target.value))} className="px-3 py-1.5 rounded-full bg-brand-surface text-xs border-none outline-none" data-testid="report-range">
              <option value={7}>7 days</option><option value={30}>30 days</option><option value={90}>90 days</option>
            </select>
            <button onClick={exportCsv} className="px-4 py-2 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-xs shadow-[0_10px_28px_rgba(79,70,229,0.28)]" data-testid="report-export"><i className="fa-regular fa-arrow-down-to-line text-[10px] mr-1.5"></i>Export CSV</button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {allFields.map((f) => (
            <button key={f.k} onClick={() => toggle(f.k)} className={`px-3 py-1.5 rounded-full text-xs border transition-all ${fields.includes(f.k) ? "bg-brand-primary text-white border-brand-primary" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"}`} data-testid={`field-${f.k}`}>
              {fields.includes(f.k) && <i className="fa-solid fa-check text-[9px] mr-1"></i>}{f.l}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-slate-200 overflow-hidden">
        <table className="w-full text-sm" data-testid="report-table">
          <thead className="text-[10px] tracking-widest uppercase text-slate-400 bg-slate-50">
            <tr>{fields.map((k) => <th key={k} className="text-left px-4 py-2 font-medium">{allFields.find((f) => f.k === k)?.l}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                {fields.map((k) => {
                  const f = allFields.find((x) => x.k === k);
                  return <td key={k} className={`px-4 py-2 ${f?.type === "money" || f?.type === "num" ? "font-mono text-slate-900" : "text-slate-700"}`}>{fmt(r[k], f?.type)}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportBuilder;
