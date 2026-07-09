import { useState } from "react";
import { toast } from "sonner";

// Simple CSV parser (no external deps). Handles quoted fields, commas, newlines.
const parseCsv = (text) => {
  const rows = [];
  let cell = "", row = [], inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (inQuotes) {
      if (c === '"' && n === '"') { cell += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else cell += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(cell); cell = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && n === "\n") i++;
        row.push(cell); if (row.length > 1 || row[0] !== "") rows.push(row);
        row = []; cell = "";
      } else cell += c;
    }
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((x) => x && x.trim()));
};

export const BulkCsvImport = ({ open, onClose, entity = "Guests", onCommit }) => {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  if (!open) return null;

  const onFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    if (!/\.csv$/i.test(file.name)) { setError("Please upload a .csv file"); return; }
    try {
      const text = await file.text();
      const parsed = parseCsv(text);
      if (parsed.length < 2) { setError("CSV needs a header row + at least one data row"); setRows(null); return; }
      setRows(parsed); setError("");
    } catch (e) {
      setError("Could not parse file"); setRows(null);
    }
  };

  const commit = () => {
    const data = rows.slice(1).map((r) => Object.fromEntries(rows[0].map((h, i) => [h, r[i]])));
    onCommit && onCommit(data);
    toast.success(`Imported ${data.length} ${entity.toLowerCase()}`);
    onClose && onClose();
    setRows(null); setFileName("");
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} data-testid="bulk-import">
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-3xl rounded-[20px] p-8 shadow-[0_40px_100px_rgba(15,23,42,0.35)] max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-eyebrow text-[#C9A227]">Bulk import</p>
            <h3 className="mt-1 font-serif text-2xl text-slate-900">Upload {entity} CSV</h3>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center" aria-label="Close" data-testid="bulk-close"><i className="fa-solid fa-xmark text-slate-500"></i></button>
        </div>

        {!rows ? (
          <label className="mt-6 block border-2 border-dashed border-slate-200 rounded-[16px] p-10 text-center cursor-pointer hover:border-[#4F46E5] transition-colors" data-testid="bulk-dropzone">
            <i className="fa-solid fa-file-csv text-4xl text-[#C9A227]"></i>
            <p className="mt-3 text-sm text-slate-700">Drop a CSV or click to select</p>
            <p className="text-xs text-slate-400 mt-1">First row = column headers</p>
            <input type="file" accept=".csv" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} data-testid="bulk-file-input" />
          </label>
        ) : (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-600"><i className="fa-solid fa-file-csv text-[#C9A227]"></i>{fileName} · <span className="font-mono">{rows.length - 1}</span> rows</div>
              <button onClick={() => { setRows(null); setFileName(""); }} className="text-xs text-slate-500 hover:text-slate-900" data-testid="bulk-clear">Clear</button>
            </div>
            <div className="mt-4 border border-slate-200 rounded-[12px] overflow-hidden max-h-72 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-[10px] tracking-widest uppercase text-slate-500">
                  <tr>{rows[0].map((h, i) => <th key={i} className="px-3 py-2 text-left font-medium">{h}</th>)}</tr>
                </thead>
                <tbody data-testid="bulk-preview">
                  {rows.slice(1, 26).map((r, ri) => (
                    <tr key={ri} className="border-t border-slate-100">
                      {rows[0].map((_, ci) => <td key={ci} className="px-3 py-1.5 text-slate-700">{r[ci]}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length > 26 && <p className="text-[10px] text-slate-400 mt-2">Preview first 25 rows of {rows.length - 1}</p>}
          </div>
        )}

        {error && <p className="mt-4 text-sm text-rose-600" data-testid="bulk-error">{error}</p>}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-sm">Cancel</button>
          <button onClick={commit} disabled={!rows} className="px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm shadow-[0_10px_28px_rgba(79,70,229,0.28)] disabled:opacity-50 disabled:cursor-not-allowed" data-testid="bulk-commit">Import</button>
        </div>
      </div>
    </div>
  );
};

export default BulkCsvImport;
