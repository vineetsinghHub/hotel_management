import { useMemo, useState } from "react";

// 90-day occupancy heatmap. Deterministic mock values based on date.
const DAYS = 60;
const pct = (d) => {
  const doy = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  const dow = d.getDay();
  const seed = (doy * 7) % 100;
  const weekendBoost = (dow === 5 || dow === 6) ? 20 : 0;
  return Math.min(100, Math.max(30, seed + weekendBoost));
};
const heat = (p) => {
  if (p >= 90) return "bg-emerald-600";
  if (p >= 75) return "bg-emerald-400";
  if (p >= 55) return "bg-brand-accent";
  if (p >= 35) return "bg-orange-300";
  return "bg-rose-300";
};

export const OccupancyHeatmap = () => {
  const cells = useMemo(() => {
    const start = new Date(new Date().toDateString());
    return Array.from({ length: DAYS }).map((_, i) => {
      const d = new Date(start.getTime() + i * 86400000);
      return { d, p: pct(d) };
    });
  }, []);
  const avg = Math.round(cells.reduce((s, c) => s + c.p, 0) / cells.length);

  // Group by week for a nicer grid
  const weeks = useMemo(() => {
    const rows = [];
    let row = new Array(7).fill(null);
    cells.forEach((c) => {
      const idx = c.d.getDay();
      if (idx === 0 && row.some(Boolean)) { rows.push(row); row = new Array(7).fill(null); }
      row[idx] = c;
    });
    if (row.some(Boolean)) rows.push(row);
    return rows;
  }, [cells]);

  const [hover, setHover] = useState(null);

  return (
    <div className="p-5 rounded-[16px] bg-white border border-slate-200 max-w-2xl" data-testid="occupancy-heatmap">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-eyebrow text-brand-accent">Occupancy — next 60 days</p>
          <p className="font-serif text-lg text-slate-900 mt-0.5">Avg <span className="font-mono">{avg}%</span></p>
        </div>
        <div className="flex items-center gap-2 text-[9px] tracking-widest uppercase text-slate-500">
          <span className="w-2.5 h-2.5 rounded bg-rose-300"></span>Low
          <span className="w-2.5 h-2.5 rounded bg-brand-accent"></span>Med
          <span className="w-2.5 h-2.5 rounded bg-emerald-600"></span>High
        </div>
      </div>

      <div className="space-y-1">
        {weeks.map((row, i) => (
          <div key={i} className="grid grid-cols-7 gap-1">
            {row.map((c, j) => (
              c ? (
                <button
                  key={j}
                  onMouseEnter={() => setHover({ d: c.d, p: c.p })}
                  onFocus={() => setHover({ d: c.d, p: c.p })}
                  onMouseLeave={() => setHover(null)}
                  className={`aspect-square rounded ${heat(c.p)} hover:ring-2 hover:ring-brand-primary transition-all`}
                  aria-label={`${c.d.toDateString()} — ${c.p}%`}
                  data-testid={`heatmap-day-${c.d.toISOString().slice(0,10)}`}
                ></button>
              ) : <div key={j} className="aspect-square"></div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 h-6 text-xs text-slate-600" data-testid="heatmap-tooltip">
        {hover ? <><span className="font-mono">{hover.d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span> · {hover.p}% occupied</> : "Hover a day for details"}
      </div>
    </div>
  );
};

export default OccupancyHeatmap;
