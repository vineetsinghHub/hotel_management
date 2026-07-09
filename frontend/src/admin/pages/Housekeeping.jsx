import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, useDraggable, useDroppable } from "@dnd-kit/core";
import AdminLayout from "@/admin/components/AdminLayout";
import { housekeeping, hkAttendants, statusColor } from "@/admin/adminMockData";
import FloorPlanBoard from "@/admin/components/FloorPlanBoard";

export default function Housekeeping() {
  const [rows, setRows] = useState(housekeeping);
  const [view, setView] = useState("board"); // "table" | "board" | "floor"
  const [dragging, setDragging] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const setStatus = (id, to) => { setRows((s) => s.map((r) => r.id === id ? { ...r, status: to } : r)); toast.success(`Room ${rows.find((r) => r.id === id)?.number} → ${to}`); };

  const handleDragEnd = (event) => {
    setDragging(null);
    const { active, over } = event;
    if (!over) return;
    const roomId = active.id;
    const attendantName = over.id;
    setRows((s) => s.map((r) => r.id === roomId ? { ...r, attendant: attendantName } : r));
    const room = rows.find((r) => r.id === roomId);
    toast.success(`Room ${room?.number} assigned to ${attendantName}`, { description: `${room?.type} · Priority ${room?.priority}` });
  };

  const byAttendant = useMemo(() => {
    const map = {};
    hkAttendants.forEach((a) => { map[a.name] = []; });
    rows.forEach((r) => { if (map[r.attendant]) map[r.attendant].push(r); else { map[r.attendant] = [r]; } });
    return map;
  }, [rows]);

  const draggingRoom = rows.find((r) => r.id === dragging);

  return (
    <AdminLayout pageTitle="Housekeeping">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-eyebrow text-[#C9A227]">Room status & assignments</p>
          <h2 className="mt-1 font-serif text-2xl text-slate-900">{rows.length} rooms tracked today</h2>
        </div>
        <div className="flex items-center bg-slate-100 rounded-full p-1" data-testid="hk-view-toggle">
          <button onClick={() => setView("board")} className={`px-3 py-1.5 text-xs rounded-full flex items-center gap-1.5 ${view === "board" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`} data-testid="hk-view-board"><i className="fa-solid fa-columns text-[10px]"></i>Assign board</button>
          <button onClick={() => setView("floor")} className={`px-3 py-1.5 text-xs rounded-full flex items-center gap-1.5 ${view === "floor" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`} data-testid="hk-view-floor"><i className="fa-solid fa-map text-[10px]"></i>Floor plan</button>
          <button onClick={() => setView("table")} className={`px-3 py-1.5 text-xs rounded-full flex items-center gap-1.5 ${view === "table" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`} data-testid="hk-view-table"><i className="fa-solid fa-list text-[10px]"></i>Room list</button>
        </div>
      </div>

      {view === "table" ? (
        <div className="bg-white rounded-[16px] border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-[10px] tracking-widest uppercase text-slate-400 bg-slate-50"><tr><th className="text-left px-5 py-3 font-medium">Room</th><th className="text-left font-medium">Type</th><th className="text-left font-medium">Status</th><th className="text-left font-medium">Attendant</th><th className="text-left font-medium">ETA</th><th className="text-left font-medium">Priority</th><th className="text-right px-5 font-medium">Actions</th></tr></thead>
            <tbody>
              {rows.map((r) => { const st = statusColor(r.status); return (
                <tr key={r.id} className="border-t border-slate-100" data-testid={`hk-${r.id}`}>
                  <td className="px-5 py-3 font-serif text-lg text-slate-900">{r.number}</td>
                  <td className="text-slate-600 text-xs">{r.type}</td>
                  <td><span className={`text-[10px] px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>{st.label}</span></td>
                  <td className="text-slate-700 text-xs">{r.attendant}</td>
                  <td className="text-slate-500 text-xs font-mono">{r.eta}</td>
                  <td><span className={`text-[10px] px-2 py-0.5 rounded-full ${r.priority === "high" ? "bg-rose-50 text-rose-700" : r.priority === "medium" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{r.priority}</span></td>
                  <td className="px-5 text-right space-x-2">
                    <button onClick={() => setStatus(r.id, "clean")} className="text-xs px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50">Mark clean</button>
                    <button onClick={() => setStatus(r.id, "inspected")} className="text-xs px-3 py-1.5 rounded-full bg-[#4F46E5] text-white">Inspect</button>
                  </td>
                </tr>);
              })}
            </tbody>
          </table>
        </div>
      ) : view === "board" ? (
        <DndContext sensors={sensors} onDragStart={(e) => setDragging(e.active.id)} onDragEnd={handleDragEnd} onDragCancel={() => setDragging(null)}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="hk-board">
            {hkAttendants.map((a) => (
              <AttendantColumn key={a.id} attendant={a} rooms={byAttendant[a.name] || []} />
            ))}
          </div>

          <DragOverlay dropAnimation={null}>
            {draggingRoom ? <RoomCard room={draggingRoom} overlay /> : null}
          </DragOverlay>

          <p className="mt-6 text-xs text-slate-500"><i className="fa-solid fa-hand text-[#C9A227] mr-1.5"></i>Drag a room to reassign it to another attendant.</p>
        </DndContext>
      ) : (
        <FloorPlanBoard />
      )}
    </AdminLayout>
  );
}

const AttendantColumn = ({ attendant, rooms }) => {
  const { setNodeRef, isOver } = useDroppable({ id: attendant.name });
  const highPri = rooms.filter((r) => r.priority === "high").length;
  return (
    <div
      ref={setNodeRef}
      className={`bg-white rounded-[16px] border transition-all ${isOver ? "border-[#4F46E5] shadow-[0_10px_28px_rgba(79,70,229,0.15)] ring-2 ring-[#4F46E5]/10" : "border-slate-200"}`}
      data-testid={`hk-col-${attendant.id}`}
    >
      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
        <img src={attendant.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-900 truncate">{attendant.name}</p>
          <p className="text-[10px] text-slate-500 truncate">{attendant.shift}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-xs text-slate-900">{rooms.length}</p>
          <p className="text-[9px] tracking-widest uppercase text-slate-400">rooms</p>
        </div>
      </div>
      <div className="p-3 space-y-2 min-h-48">
        {rooms.length === 0 ? (
          <div className="p-6 text-center rounded-[10px] border border-dashed border-slate-200">
            <p className="text-xs text-slate-400">Drop rooms here</p>
          </div>
        ) : rooms.map((r) => <RoomCard key={r.id} room={r} />)}
        {highPri > 0 && (
          <p className="text-[10px] text-rose-600 mt-2"><i className="fa-solid fa-triangle-exclamation mr-1"></i>{highPri} high-priority room{highPri > 1 ? "s" : ""}</p>
        )}
      </div>
    </div>
  );
};

const RoomCard = ({ room, overlay = false }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: room.id });
  const st = statusColor(room.status);
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-3 rounded-[12px] border bg-white cursor-grab active:cursor-grabbing select-none transition-all ${overlay ? "border-[#4F46E5] shadow-[0_20px_50px_rgba(79,70,229,0.30)] rotate-2" : isDragging ? "opacity-30 border-slate-200" : "border-slate-200 hover:border-slate-300 hover:shadow-sm"}`}
      data-testid={`hk-card-${room.id}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-serif text-lg text-slate-900">{room.number}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>{st.label}</span>
      </div>
      <p className="mt-1 text-[11px] text-slate-500">{room.type}</p>
      <div className="mt-2 flex items-center justify-between text-[10px]">
        <span className="text-slate-400 font-mono">{room.eta}</span>
        <span className={`px-1.5 py-0.5 rounded-full ${room.priority === "high" ? "bg-rose-50 text-rose-700" : room.priority === "medium" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{room.priority}</span>
      </div>
    </div>
  );
};
