import { useMemo, useState } from "react";
import { toast } from "sonner";

const SHIFTS = [
  { k: "morning", l: "Morning", i: "sun", time: "07:00 — 15:00", color: "#F59E0B" },
  { k: "evening", l: "Evening", i: "moon", time: "15:00 — 23:00", color: "#4F46E5" },
  { k: "night", l: "Night", i: "star", time: "23:00 — 07:00", color: "#0F172A" },
  { k: "off", l: "Off", i: "bed", time: "—", color: "#94A3B8" },
];

const KEY = "aura_staff_shifts_v1";
const readSchedule = () => { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } };
const writeSchedule = (obj) => { try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch (e) {} };

const seed = (staff, days) => {
  const out = {};
  staff.forEach((s, i) => {
    days.forEach((d, di) => {
      const key = `${s.id}::${d}`;
      const seedIdx = (i + di) % SHIFTS.length;
      out[key] = SHIFTS[seedIdx].k;
    });
  });
  return out;
};

export const StaffShifts = ({ staff = [] }) => {
  const days = useMemo(() => {
    const arr = [];
    const today = new Date(new Date().toDateString());
    for (let i = 0; i < 7; i++) {
      const d = new Date(today.getTime() + i * 86400000);
      arr.push(d.toISOString().slice(0, 10));
    }
    return arr;
  }, []);

  const [schedule, setSchedule] = useState(() => {
    const existing = readSchedule();
    return existing && staff.every((s) => days.some((d) => existing[`${s.id}::${d}`]))
      ? existing
      : seed(staff.slice(0, 20), days);
  });
  const [swapOpen, setSwapOpen] = useState(null);

  const list = staff.slice(0, 12);

  const setCell = (staffId, day, k) => {
    setSchedule((s) => {
      const next = { ...s, [`${staffId}::${day}`]: k };
      writeSchedule(next);
      return next;
    });
    toast.success(`Updated → ${SHIFTS.find((x) => x.k === k)?.l}`);
  };

  const requestSwap = (staffId, day) => {
    setSwapOpen({ staffId, day });
  };

  const acceptSwap = (withStaffId) => {
    const { staffId, day } = swapOpen;
    const a = schedule[`${staffId}::${day}`];
    const b = schedule[`${withStaffId}::${day}`];
    setSchedule((s) => {
      const next = { ...s, [`${staffId}::${day}`]: b, [`${withStaffId}::${day}`]: a };
      writeSchedule(next);
      return next;
    });
    toast.success("Shift swap approved");
    setSwapOpen(null);
  };

  return (
    <section className="bg-white rounded-[16px] border border-slate-200 overflow-hidden" data-testid="staff-shifts">
      <div className="p-5 border-b border-slate-100 flex items-center flex-wrap gap-3 justify-between">
        <div>
          <p className="text-eyebrow text-brand-accent">This week</p>
          <h3 className="font-serif text-xl text-slate-900">Shift schedule</h3>
        </div>
        <div className="flex items-center flex-wrap gap-3">
          {SHIFTS.map((s) => (
            <span key={s.k} className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-slate-500" data-testid={`shift-legend-${s.k}`}>
              <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: s.color }}></span>{s.l}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full text-sm">
          <thead className="text-[10px] tracking-widest uppercase text-slate-400 bg-slate-50">
            <tr>
              <th className="text-left px-4 py-2 font-medium sticky left-0 bg-slate-50">Staff</th>
              {days.map((d) => {
                const dt = new Date(d);
                return <th key={d} className="text-center font-medium min-w-[86px]"><div>{dt.toLocaleDateString("en-US", { weekday: "short" })}</div><div className="font-mono">{dt.getDate()}</div></th>;
              })}
              <th className="text-center font-medium">Total hrs</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => {
              const totalHrs = days.reduce((n, d) => n + (schedule[`${s.id}::${d}`] && schedule[`${s.id}::${d}`] !== "off" ? 8 : 0), 0);
              return (
                <tr key={s.id} className="border-t border-slate-100" data-testid={`shift-row-${s.id}`}>
                  <td className="px-4 py-2 sticky left-0 bg-white">
                    <p className="text-sm text-slate-900">{s.name}</p>
                    <p className="text-[10px] text-slate-500">{s.role}</p>
                  </td>
                  {days.map((d) => {
                    const k = schedule[`${s.id}::${d}`] || "off";
                    const cfg = SHIFTS.find((x) => x.k === k);
                    const idx = SHIFTS.findIndex((x) => x.k === k);
                    return (
                      <td key={d} className="px-1 py-1 text-center">
                        <div className="relative group">
                          <button
                            onClick={() => setCell(s.id, d, SHIFTS[(idx + 1) % SHIFTS.length].k)}
                            className="w-full py-1.5 rounded-[10px] text-white text-[10px] font-mono hover:ring-2 hover:ring-brand-primary transition-all"
                            style={{ backgroundColor: cfg.color }}
                            data-testid={`shift-cell-${s.id}-${d}`}
                            aria-label={`${s.name} — ${d} — ${cfg.l}`}
                          >{cfg.l[0]}</button>
                          <button onClick={() => requestSwap(s.id, d)} className="hidden group-hover:block absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-900 text-white text-[9px]" aria-label="Request swap" data-testid={`shift-swap-${s.id}-${d}`}><i className="fa-solid fa-arrows-rotate"></i></button>
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-4 py-2 text-center font-mono text-slate-900">{totalHrs}h</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {swapOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSwapOpen(null)} data-testid="shift-swap-modal">
          <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-md rounded-[20px] p-6 shadow-[0_40px_100px_rgba(15,23,42,0.35)]">
            <p className="text-eyebrow text-brand-accent">Shift swap</p>
            <h3 className="mt-1 font-serif text-xl text-slate-900">Swap with…</h3>
            <p className="text-xs text-slate-500 mt-1">On {new Date(swapOpen.day).toDateString()}</p>
            <ul className="mt-4 max-h-72 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-[12px]">
              {list.filter((x) => x.id !== swapOpen.staffId).map((s) => (
                <li key={s.id} className="p-3 flex items-center justify-between">
                  <div><p className="text-sm text-slate-900">{s.name}</p><p className="text-[10px] text-slate-500">{s.role} · currently {SHIFTS.find((x) => x.k === schedule[`${s.id}::${swapOpen.day}`])?.l}</p></div>
                  <button onClick={() => acceptSwap(s.id)} className="px-3 py-1.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-xs" data-testid={`swap-accept-${s.id}`}>Swap</button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end"><button onClick={() => setSwapOpen(null)} className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-xs">Cancel</button></div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StaffShifts;
