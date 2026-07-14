import { useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, useDraggable, useDroppable, DragOverlay } from "@dnd-kit/core";
import { toast } from "sonner";

const catalogue = [
  { id: "e1", title: "Sunrise Boat Puja", when: "05:30", duration: "75 min", icon: "om", tint: "bg-amber-100 text-amber-800" },
  { id: "e2", title: "Palace Heritage Walk", when: "09:00", duration: "90 min", icon: "person-walking", tint: "bg-emerald-100 text-emerald-800" },
  { id: "e3", title: "Chef's Cooking Class", when: "11:00", duration: "2 hrs", icon: "utensils", tint: "bg-rose-100 text-rose-800" },
  { id: "e4", title: "Ayurveda Spa", when: "14:00", duration: "90 min", icon: "spa", tint: "bg-fuchsia-100 text-fuchsia-800" },
  { id: "e5", title: "Rooftop Sundowner", when: "18:00", duration: "60 min", icon: "martini-glass", tint: "bg-orange-100 text-orange-800" },
  { id: "e6", title: "Palace Table Tasting", when: "20:00", duration: "2.5 hrs", icon: "champagne-glasses", tint: "bg-violet-100 text-violet-800" },
  { id: "e7", title: "Astronomy on Terrace", when: "22:00", duration: "60 min", icon: "star", tint: "bg-slate-100 text-slate-800" },
];

const SLOTS = ["Morning", "Midday", "Afternoon", "Evening", "Night"];

const DraggableCard = ({ item }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `cat-${item.id}`, data: item });
  return (
    <div ref={setNodeRef} {...attributes} {...listeners}
      className={`p-3 rounded-[14px] border border-slate-200 bg-white cursor-grab active:cursor-grabbing hover-lift ${isDragging ? "opacity-40" : ""}`}
      data-testid={`itin-cat-${item.id}`}
    >
      <div className="flex items-center gap-3">
        <span className={`w-9 h-9 rounded-full grid place-items-center ${item.tint}`}><i className={`fa-solid fa-${item.icon} text-sm`}></i></span>
        <div className="min-w-0">
          <p className="text-sm text-slate-900 truncate">{item.title}</p>
          <p className="text-[10px] text-slate-500">{item.when} · {item.duration}</p>
        </div>
      </div>
    </div>
  );
};

const SlotColumn = ({ slot, items, onRemove }) => {
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${slot}` });
  return (
    <div ref={setNodeRef} className={`p-3 rounded-[16px] border border-dashed transition-colors ${isOver ? "border-brand-primary bg-indigo-50/50" : "border-slate-200 bg-brand-surface"}`} data-testid={`itin-slot-${slot.toLowerCase()}`}>
      <p className="text-eyebrow text-brand-accent mb-2">{slot}</p>
      {items.length === 0 ? <p className="text-xs text-slate-400 py-4 text-center">Drop an experience here</p> : (
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li key={`${it.id}-${i}`} className="p-2 rounded-[10px] bg-white border border-slate-100 text-xs flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full grid place-items-center ${it.tint}`}><i className={`fa-solid fa-${it.icon} text-[10px]`}></i></span>
              <span className="flex-1 truncate">{it.title}</span>
              <button onClick={() => onRemove(slot, i)} className="text-slate-400 hover:text-rose-500" aria-label={`Remove ${it.title}`} data-testid={`itin-remove-${slot.toLowerCase()}-${i}`}><i className="fa-solid fa-xmark text-[10px]"></i></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const ItineraryPlanner = () => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const [plan, setPlan] = useState(() => Object.fromEntries(SLOTS.map((s) => [s, []])));
  const [dragItem, setDragItem] = useState(null);

  const onDragEnd = (evt) => {
    setDragItem(null);
    if (!evt.over) return;
    const slot = String(evt.over.id).replace("slot-", "");
    const item = evt.active.data.current;
    setPlan((p) => ({ ...p, [slot]: [...p[slot], item] }));
    toast.success(`${item.title} → ${slot}`);
  };
  const remove = (slot, i) => setPlan((p) => ({ ...p, [slot]: p[slot].filter((_, k) => k !== i) }));
  const clear = () => { setPlan(Object.fromEntries(SLOTS.map((s) => [s, []]))); toast.success("Day cleared"); };
  const exportPdf = () => { window.print(); };

  return (
    <section className="bg-white rounded-[28px] border border-slate-200 p-8 md:p-10" data-testid="itinerary-planner">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-eyebrow text-brand-accent">Curate your day</p>
          <h3 className="mt-1 font-serif text-3xl text-slate-900">Itinerary Planner</h3>
          <p className="text-sm text-slate-500 mt-1">Drag experiences into time slots. Save it and we'll set everything up.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={clear} className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-xs" data-testid="itin-clear">Clear</button>
          <button onClick={exportPdf} className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs" data-testid="itin-export"><i className="fa-regular fa-file-pdf text-[10px] mr-1.5"></i>Print / PDF</button>
          <button onClick={() => toast.success("Itinerary saved & sent to concierge")} className="px-4 py-2 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-xs shadow-[0_10px_28px_rgba(79,70,229,0.28)]" data-testid="itin-save">Save</button>
        </div>
      </div>

      <DndContext sensors={sensors} onDragStart={(e) => setDragItem(e.active.data.current)} onDragEnd={onDragEnd} onDragCancel={() => setDragItem(null)}>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1 space-y-2">
            <p className="text-eyebrow text-slate-500">Available</p>
            {catalogue.map((c) => <DraggableCard key={c.id} item={c} />)}
          </div>
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
            {SLOTS.map((s) => <SlotColumn key={s} slot={s} items={plan[s]} onRemove={remove} />)}
          </div>
        </div>
        <DragOverlay>
          {dragItem ? (
            <div className="p-3 rounded-[14px] border border-brand-primary bg-white shadow-[0_20px_50px_rgba(79,70,229,0.35)]">
              <div className="flex items-center gap-3">
                <span className={`w-9 h-9 rounded-full grid place-items-center ${dragItem.tint}`}><i className={`fa-solid fa-${dragItem.icon} text-sm`}></i></span>
                <div className="min-w-0"><p className="text-sm text-slate-900">{dragItem.title}</p></div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </section>
  );
};

export default ItineraryPlanner;
