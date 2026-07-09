import { useMemo, useState } from "react";
import { toast } from "sonner";

// Room-status floor-plan board. Two floors, 13 rooms per floor. Click a
// room to cycle its status.
const STATUS = [
  { k: "clean", l: "Clean", fill: "#10B981" },
  { k: "cleaning", l: "Cleaning", fill: "#C9A227" },
  { k: "dirty", l: "Dirty", fill: "#F43F5E" },
  { k: "inspected", l: "Inspected", fill: "#4F46E5" },
  { k: "ooo", l: "OOO", fill: "#94A3B8" },
];

const byKey = Object.fromEntries(STATUS.map((s) => [s.k, s]));
const nextStatus = (k) => {
  const i = STATUS.findIndex((s) => s.k === k);
  return STATUS[(i + 1) % STATUS.length].k;
};

const seed = () => {
  const rooms = [];
  const floors = [
    { f: 1, prefix: 1 }, { f: 2, prefix: 2 },
  ];
  floors.forEach(({ f, prefix }) => {
    const numRooms = 12;
    for (let i = 0; i < numRooms; i++) {
      const status = STATUS[(i * 3 + f * 5) % STATUS.length].k;
      rooms.push({
        id: `${prefix}${String(i + 1).padStart(2, "0")}`,
        floor: f, x: i, status,
      });
    }
  });
  return rooms;
};

export const FloorPlanBoard = () => {
  const [rooms, setRooms] = useState(seed);
  const counts = useMemo(() => {
    const m = Object.fromEntries(STATUS.map((s) => [s.k, 0]));
    rooms.forEach((r) => { m[r.status] += 1; });
    return m;
  }, [rooms]);

  const toggle = (id) => {
    let newStatus = null;
    setRooms((s) => s.map((r) => {
      if (r.id !== id) return r;
      newStatus = nextStatus(r.status);
      return { ...r, status: newStatus };
    }));
    setTimeout(() => toast.success(`Room ${id} → ${byKey[newStatus]?.l}`), 0);
  };

  return (
    <div className="bg-white rounded-[16px] border border-slate-200 p-5" data-testid="floor-plan">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-eyebrow text-[#C9A227]">Floor plan</p>
          <h3 className="font-serif text-xl text-slate-900">Room status board</h3>
        </div>
        <div className="flex items-center flex-wrap gap-3">
          {STATUS.map((s) => (
            <span key={s.k} className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-slate-500" data-testid={`fp-legend-${s.k}`}>
              <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: s.fill }}></span>{s.l} · {counts[s.k]}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {[1, 2].map((f) => (
          <div key={f} data-testid={`fp-floor-${f}`}>
            <p className="text-[10px] tracking-widest uppercase text-slate-400 mb-2">Floor {f}</p>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-1.5">
              {rooms.filter((r) => r.floor === f).map((r) => (
                <button
                  key={r.id}
                  onClick={() => toggle(r.id)}
                  className="aspect-square rounded-[10px] text-white text-[10px] font-mono grid place-items-center hover:scale-105 transition-transform relative"
                  style={{ backgroundColor: byKey[r.status]?.fill }}
                  data-testid={`fp-room-${r.id}`}
                  aria-label={`Room ${r.id} — ${byKey[r.status]?.l}`}
                >
                  {r.id}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloorPlanBoard;
