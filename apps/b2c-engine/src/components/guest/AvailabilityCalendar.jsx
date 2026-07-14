import { useMemo, useState } from "react";
import { useCurrency } from "@aura/shared/context/AppContext";

// Live-ish availability calendar. Mock data — uses deterministic sold-out /
// pricing bands based on the room id + day-of-year so it looks realistic.
const DAYS = 60;

const dayBand = (roomId, d) => {
  const doy = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  const seed = doy * 13 + (roomId?.charCodeAt(0) || 65);
  const dow = d.getDay();
  const weekend = dow === 0 || dow === 6;
  const roll = (seed % 100);
  if (roll < 8) return { kind: "soldout", label: "Sold out" };
  if (weekend || roll < 25) return { kind: "peak", label: "Peak", factor: 1.35 };
  if (roll < 55) return { kind: "standard", label: "Standard", factor: 1 };
  return { kind: "best", label: "Best price", factor: 0.85 };
};

export const AvailabilityCalendar = ({ room, onPick }) => {
  const { formatPrice } = useCurrency();
  const [anchor, setAnchor] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const cells = useMemo(() => {
    const first = new Date(anchor);
    const startDow = first.getDay();
    const total = DAYS;
    return Array.from({ length: total }).map((_, i) => {
      const d = new Date(first.getTime() + i * 86400000);
      return { d, band: dayBand(room.id, d), isPast: d < new Date(new Date().toDateString()) };
    });
  }, [anchor, room]);
  const monthLabel = anchor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <section className="bg-white rounded-[24px] border border-slate-200 p-6 md:p-8" data-testid="availability-calendar">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-eyebrow text-brand-accent">Live availability</p>
          <h3 className="mt-1 font-serif text-2xl text-slate-900">{room.name} · next 60 days</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { const d = new Date(anchor); d.setMonth(d.getMonth() - 1); setAnchor(d); }} className="w-9 h-9 rounded-full border border-slate-200 hover:bg-slate-50" aria-label="Prev month" data-testid="avail-prev"><i className="fa-solid fa-chevron-left text-xs"></i></button>
          <span className="text-sm text-slate-700 font-mono min-w-32 text-center">{monthLabel}</span>
          <button onClick={() => { const d = new Date(anchor); d.setMonth(d.getMonth() + 1); setAnchor(d); }} className="w-9 h-9 rounded-full border border-slate-200 hover:bg-slate-50" aria-label="Next month" data-testid="avail-next"><i className="fa-solid fa-chevron-right text-xs"></i></button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-[10px] tracking-widest uppercase text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Best price</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400"></span>Standard</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-accent"></span>Peak</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400"></span>Sold out</span>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1.5">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="text-[10px] tracking-widest uppercase text-slate-400 text-center py-1">{d}</div>)}
        {Array.from({ length: cells[0].d.getDay() }).map((_, i) => <div key={`sp-${i}`}></div>)}
        {cells.map(({ d, band, isPast }) => {
          const cls = band.kind === "soldout" ? "bg-rose-50 text-rose-500 border-rose-100" :
                      band.kind === "peak" ? "bg-brand-accent/10 text-[#B08D1E] border-brand-accent/25" :
                      band.kind === "best" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                      "bg-brand-surface text-slate-700 border-transparent";
          const disabled = band.kind === "soldout" || isPast;
          const price = band.factor ? room.price * band.factor : 0;
          return (
            <button
              key={d.toISOString()}
              disabled={disabled}
              onClick={() => onPick && onPick(d, band, price)}
              className={`p-2 rounded-[10px] border text-left hover:scale-[1.02] transition-transform disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed ${cls}`}
              data-testid={`avail-day-${d.toISOString().slice(0,10)}`}
              aria-label={`${d.toDateString()} — ${band.label}`}
            >
              <div className="font-mono text-sm">{d.getDate()}</div>
              <div className="text-[9px] mt-1 truncate">
                {band.kind === "soldout" ? "—" : formatPrice(price, { decimals: 0 })}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default AvailabilityCalendar;
