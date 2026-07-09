import { useMemo, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@/admin/components/AdminLayout";
import { arrivals, roomsInventory, statusColor } from "@/admin/adminMockData";

// Convert "Mar 15" to a Date within 2026 (mock year for calendar rendering)
const parseMD = (s) => {
  const [mon, day] = s.split(" ");
  const monthMap = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  return new Date(2026, monthMap[mon], parseInt(day, 10));
};
const daysBetween = (a, b) => Math.round((b - a) / 86400000);

export default function Reservations() {
  const [f, setF] = useState("all");
  const [q, setQ] = useState("");
  const [view, setView] = useState("table"); // "table" | "calendar"
  // Anchor date for the calendar
  const [anchor, setAnchor] = useState(new Date(2026, 2, 12)); // Mar 12, 2026

  const rows = arrivals.filter((a) => (f === "all" || a.status === f) && (!q || a.guest.toLowerCase().includes(q.toLowerCase()) || a.id.toLowerCase().includes(q.toLowerCase())));

  return (
    <AdminLayout pageTitle="Reservations">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 flex-1 min-w-64">
          <i className="fa-solid fa-magnifying-glass text-xs text-slate-400"></i>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by guest or reservation ID..." className="flex-1 text-sm outline-none" data-testid="res-search" />
        </div>
        {["all","confirmed","checked_in","checked_out"].map((k) => (
          <button key={k} onClick={() => setF(k)} className={`px-4 py-2 text-xs rounded-full capitalize ${f === k ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600"}`} data-testid={`filter-${k}`}>{k.replace("_"," ")}</button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-full p-1" data-testid="view-toggle">
            <button onClick={() => setView("table")} className={`px-3 py-1.5 text-xs rounded-full flex items-center gap-1.5 ${view === "table" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`} data-testid="view-table"><i className="fa-solid fa-list text-[10px]"></i>List</button>
            <button onClick={() => setView("calendar")} className={`px-3 py-1.5 text-xs rounded-full flex items-center gap-1.5 ${view === "calendar" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`} data-testid="view-calendar"><i className="fa-solid fa-calendar-days text-[10px]"></i>Calendar</button>
          </div>
          <button onClick={() => toast.success("New reservation form opened")} className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs px-4 py-2 rounded-full" data-testid="new-reservation-btn">+ Reservation</button>
        </div>
      </div>

      {view === "table" ? (
        <div className="bg-white rounded-[16px] border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-[10px] tracking-widest uppercase text-slate-400 bg-slate-50">
              <tr><th className="text-left px-5 py-3 font-medium">Reservation</th><th className="text-left font-medium">Guest</th><th className="text-left font-medium">Room</th><th className="text-left font-medium">Dates</th><th className="text-left font-medium">Status</th><th className="text-right px-5 font-medium">Total</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => { const st = statusColor(r.status); return (
                <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50" data-testid={`res-${r.id}`}>
                  <td className="px-5 py-3 font-mono text-slate-900">{r.id}</td>
                  <td>{r.guest}</td><td>{r.room} <span className="text-slate-500 text-xs">· {r.roomType}</span></td>
                  <td className="text-slate-600 text-xs">{r.checkIn} — {r.checkOut}</td>
                  <td><span className={`text-[10px] px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>{st.label}</span></td>
                  <td className="px-5 text-right font-mono text-slate-900">₹{(r.total/1000).toFixed(1)}K</td>
                </tr>);
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <GanttCalendar rows={rows} anchor={anchor} onShift={(d) => setAnchor(new Date(anchor.getTime() + d * 86400000))} />
      )}
    </AdminLayout>
  );
}

const DAYS = 14;
const CELL_W = 56; // px
const LEFT_W = 200; // px

const GanttCalendar = ({ rows, anchor, onShift }) => {
  const dates = useMemo(() => Array.from({ length: DAYS }).map((_, i) => new Date(anchor.getTime() + i * 86400000)), [anchor]);
  const uniqueRooms = useMemo(() => {
    // Show unique rooms sorted by number that appear either in the data or in rooms inventory
    const bookedRooms = new Set(rows.map((r) => r.room));
    // Include some empty rooms for context (top 12 rooms + those booked)
    const invRooms = roomsInventory.slice(0, 14).map((r) => r.number);
    const all = Array.from(new Set([...invRooms, ...bookedRooms])).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    return all;
  }, [rows]);

  const anchorTime = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate()).getTime();

  // Compute bar positions per row
  const bars = useMemo(() => rows.map((r) => {
    const ci = parseMD(r.checkIn); const co = parseMD(r.checkOut);
    const startOffset = daysBetween(new Date(anchorTime), ci);
    const nights = daysBetween(ci, co);
    return { ...r, startOffset, nights };
  }).filter((b) => b.startOffset + b.nights > 0 && b.startOffset < DAYS), [rows, anchorTime]);

  const monthLabel = anchor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const statusBg = (s) => s === "checked_in" ? "bg-emerald-500/90 border-emerald-600 hover:bg-emerald-500" : s === "checked_out" ? "bg-slate-400 border-slate-500 hover:bg-slate-400/90" : "bg-[#4F46E5] border-indigo-700 hover:bg-[#4338CA]";

  return (
    <div className="bg-white rounded-[16px] border border-slate-200 overflow-hidden" data-testid="gantt-calendar">
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <p className="text-eyebrow text-[#C9A227]">Room-nights grid</p>
          <h3 className="mt-1 font-serif text-xl text-slate-900">{monthLabel}</h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button onClick={() => onShift(-7)} className="px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50" data-testid="gantt-prev"><i className="fa-solid fa-chevron-left text-[10px] mr-1"></i>Prev week</button>
          <button onClick={() => onShift(-1)} className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50" data-testid="gantt-prev-day"><i className="fa-solid fa-chevron-left text-[10px]"></i></button>
          <button onClick={() => onShift(1)} className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50" data-testid="gantt-next-day"><i className="fa-solid fa-chevron-right text-[10px]"></i></button>
          <button onClick={() => onShift(7)} className="px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50" data-testid="gantt-next">Next week<i className="fa-solid fa-chevron-right text-[10px] ml-1"></i></button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Header row */}
          <div className="flex sticky top-0 bg-white z-10 border-b border-slate-200">
            <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 border-r border-slate-100" style={{ width: LEFT_W }}>
              <i className="fa-solid fa-bed text-[10px] text-slate-400"></i>
              <span className="text-[10px] tracking-widest uppercase text-slate-500">Room</span>
            </div>
            {dates.map((d, i) => {
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              return (
                <div key={i} className={`flex-shrink-0 text-center py-2 border-r border-slate-100 ${isWeekend ? "bg-[#FAFAF8]" : ""}`} style={{ width: CELL_W }}>
                  <p className="text-[9px] tracking-widest uppercase text-slate-400">{d.toLocaleDateString("en-US", { weekday: "short" })}</p>
                  <p className={`font-mono text-sm ${isWeekend ? "text-[#C9A227]" : "text-slate-900"}`}>{d.getDate()}</p>
                </div>
              );
            })}
          </div>

          {/* Room rows */}
          {uniqueRooms.map((roomNum) => {
            const roomInfo = roomsInventory.find((r) => r.number === roomNum);
            const roomBars = bars.filter((b) => b.room === roomNum);
            return (
              <div key={roomNum} className="flex border-b border-slate-100 relative group hover:bg-[#FAFAF8]/60" data-testid={`gantt-row-${roomNum}`}>
                <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-r border-slate-100" style={{ width: LEFT_W }}>
                  <span className="font-serif text-lg text-slate-900">{roomNum}</span>
                  {roomInfo && <span className="text-[10px] text-slate-500">{roomInfo.type}</span>}
                </div>
                <div className="relative flex" style={{ width: CELL_W * DAYS }}>
                  {dates.map((d, i) => {
                    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                    return <div key={i} className={`flex-shrink-0 h-14 border-r border-slate-100 ${isWeekend ? "bg-[#FAFAF8]/60" : ""}`} style={{ width: CELL_W }} />;
                  })}
                  {roomBars.map((b) => {
                    const left = Math.max(0, b.startOffset) * CELL_W + 4;
                    const width = (b.startOffset + b.nights > DAYS ? DAYS - Math.max(0, b.startOffset) : b.nights - Math.max(0, -b.startOffset)) * CELL_W - 8;
                    if (width <= 0) return null;
                    return (
                      <button
                        key={b.id}
                        onClick={() => toast.success(`${b.guest} · ${b.id}`, { description: `${b.checkIn} → ${b.checkOut} · ${b.roomType}` })}
                        className={`absolute top-2 h-10 rounded-[10px] px-3 text-left border shadow-[0_4px_12px_rgba(15,23,42,0.10)] transition-all ${statusBg(b.status)}`}
                        style={{ left, width }}
                        data-testid={`gantt-bar-${b.id}`}
                      >
                        <p className="text-[11px] text-white font-medium truncate leading-tight">{b.guest}</p>
                        <p className="text-[9px] text-white/80 font-mono truncate">{b.id}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5 py-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#4F46E5]"></span>Confirmed / Arriving</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500"></span>In-house</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-400"></span>Departed</span>
        <span className="ml-auto text-[10px] text-slate-400">Click a bar for reservation details.</span>
      </div>
    </div>
  );
};
