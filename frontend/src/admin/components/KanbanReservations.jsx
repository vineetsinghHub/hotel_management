import { useMemo, useState } from "react";
import { arrivals, statusColor } from "@/admin/adminMockData";

const COLS = [
  { k: "confirmed", l: "Booked", i: "clipboard-check" },
  { k: "in_house", l: "In-house", i: "user-group" },
  { k: "checked_out", l: "Departed", i: "right-from-bracket" },
  { k: "closed", l: "Closed", i: "lock" },
];

// Simple in-memory Kanban. Rows are moved by clicking the arrows (fast, no dnd).
export const KanbanReservations = ({ initial = arrivals }) => {
  const [rows, setRows] = useState(() => initial.map((r) => ({ ...r, status: r.status === "checked_out" ? "checked_out" : r.status || "confirmed" })));
  const byCol = useMemo(() => {
    const m = {}; COLS.forEach((c) => { m[c.k] = []; });
    rows.forEach((r) => { const k = m[r.status] ? r.status : "confirmed"; m[k].push(r); });
    return m;
  }, [rows]);

  const move = (id, dir) => setRows((s) => s.map((r) => {
    if (r.id !== id) return r;
    const idx = COLS.findIndex((c) => c.k === r.status);
    const next = COLS[Math.max(0, Math.min(COLS.length - 1, idx + dir))].k;
    return { ...r, status: next };
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3" data-testid="kanban-view">
      {COLS.map((c) => (
        <div key={c.k} className="p-3 rounded-[16px] bg-[#FAFAF8] border border-slate-100 min-h-[240px]" data-testid={`kanban-col-${c.k}`}>
          <div className="flex items-center justify-between px-1 mb-2">
            <p className="text-eyebrow text-slate-500 flex items-center gap-2"><i className={`fa-solid fa-${c.i} text-[10px]`}></i>{c.l}</p>
            <span className="text-[10px] font-mono text-slate-500">{byCol[c.k].length}</span>
          </div>
          <div className="space-y-2">
            {byCol[c.k].map((r) => (
              <div key={r.id} className="p-3 rounded-[12px] bg-white border border-slate-100 shadow-[0_2px_6px_rgba(15,23,42,0.04)]" data-testid={`kanban-card-${r.id}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono tracking-widest uppercase text-slate-500">{r.id}</p>
                    <p className="text-sm text-slate-900 truncate">{r.guest}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Room {r.room} · {r.nights || 3}n</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => move(r.id, -1)} disabled={c.k === COLS[0].k} className="w-6 h-6 rounded-full border border-slate-200 hover:bg-slate-50 grid place-items-center disabled:opacity-30" aria-label="Move back" data-testid={`kanban-back-${r.id}`}><i className="fa-solid fa-arrow-left text-[9px]"></i></button>
                    <button onClick={() => move(r.id, 1)} disabled={c.k === COLS[COLS.length - 1].k} className="w-6 h-6 rounded-full border border-slate-200 hover:bg-slate-50 grid place-items-center disabled:opacity-30" aria-label="Move forward" data-testid={`kanban-fwd-${r.id}`}><i className="fa-solid fa-arrow-right text-[9px]"></i></button>
                  </div>
                </div>
              </div>
            ))}
            {byCol[c.k].length === 0 && <p className="text-[10px] text-slate-400 text-center py-3">No reservations</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanReservations;
