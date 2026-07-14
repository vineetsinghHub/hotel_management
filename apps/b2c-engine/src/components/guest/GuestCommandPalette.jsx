import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const pages = [
  { l: "Home", to: "/" },
  { l: "Rooms & Suites", to: "/rooms" },
  { l: "Experiences", to: "/experiences" },
  { l: "Dining", to: "/dining" },
  { l: "Spa", to: "/spa" },
  { l: "Gallery & Contact", to: "/gallery" },
  { l: "Book a stay", to: "/booking" },
  { l: "My Dashboard", to: "/dashboard" },
];
const rooms = ["Maharajah Suite", "Lake Palace Villa", "Royal Rajwada", "Garden Pavilion", "Aravalli Retreat"];
const experiences = ["Sunrise Boat Puja", "Chef's Cooking Class", "Palace Heritage Walk", "Ayurveda Ritual", "Rooftop Sundowner"];

export const GuestCommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target && e.target.tagName) || "";
      const inField = ["INPUT", "TEXTAREA"].includes(tag) || e.target?.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(true); }
      else if (e.key === "/" && !inField && !e.metaKey && !e.ctrlKey) { e.preventDefault(); setOpen(true); }
      else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const s = q.toLowerCase(); const out = [];
    pages.forEach((p) => p.l.toLowerCase().includes(s) && out.push({ type: "Page", l: p.l, to: p.to }));
    rooms.forEach((r) => r.toLowerCase().includes(s) && out.push({ type: "Suite", l: r, to: "/rooms" }));
    experiences.forEach((r) => r.toLowerCase().includes(s) && out.push({ type: "Experience", l: r, to: "/experiences" }));
    return out.slice(0, 10);
  }, [q]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center pt-24 p-4 bg-slate-900/60 backdrop-blur-sm print:hidden" onClick={() => setOpen(false)} data-testid="guest-palette">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl bg-white rounded-[20px] shadow-[0_40px_100px_rgba(15,23,42,0.35)] overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Jump to a page, suite or experience…" className="flex-1 text-sm outline-none bg-transparent" data-testid="guest-palette-input" />
          <kbd className="text-[10px] text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">esc</kbd>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {!q.trim() ? (
            <div className="p-6">
              <p className="text-eyebrow text-slate-400 mb-3">Quick access</p>
              <div className="grid grid-cols-2 gap-2">
                {pages.slice(0, 6).map((p) => (
                  <button key={p.to} onClick={() => { nav(p.to); setOpen(false); }} className="text-left px-3 py-2 rounded-[10px] hover:bg-brand-surface text-slate-700 text-sm" data-testid={`guest-palette-quick-${p.to.slice(1) || "home"}`}>{p.l}</button>
                ))}
              </div>
              <p className="mt-4 text-[10px] text-slate-400">Tip: press <kbd className="border border-slate-200 rounded px-1 mx-0.5">/</kbd> or <kbd className="border border-slate-200 rounded px-1">⌘K</kbd> anywhere.</p>
            </div>
          ) : results.length === 0 ? (
            <p className="p-6 text-sm text-slate-500 text-center">No results for &ldquo;{q}&rdquo;</p>
          ) : (
            <ul>
              {results.map((r, i) => (
                <li key={i}>
                  <button onClick={() => { nav(r.to); setOpen(false); }} className="w-full text-left px-5 py-3 hover:bg-brand-surface flex items-center gap-3 border-t border-slate-100" data-testid={`guest-palette-result-${i}`}>
                    <span className="text-[10px] tracking-widest uppercase text-brand-accent w-24">{r.type}</span>
                    <span className="text-sm text-slate-900 flex-1">{r.l}</span>
                    <i className="fa-solid fa-arrow-right text-[10px] text-slate-400"></i>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestCommandPalette;
