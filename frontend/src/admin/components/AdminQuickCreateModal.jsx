import { useState } from "react";
import { toast } from "sonner";

// Universal "quick create" modal for the admin top-bar's "New" menu.
// Persists to localStorage keyed per-entity so the values show up in the
// relevant page's list after refresh (best-effort mock persistence).

const FORMS = {
  reservation: {
    title: "New Reservation",
    icon: "calendar-plus",
    key: "aura_new_reservations",
    fields: [
      { k: "guest", l: "Guest name", type: "text", req: true, placeholder: "e.g. Aarav Malhotra" },
      { k: "room", l: "Room / Suite", type: "text", req: true, placeholder: "e.g. Maharajah Suite" },
      { k: "arrival", l: "Arrival", type: "date", req: true },
      { k: "nights", l: "Nights", type: "number", req: true, placeholder: "3" },
      { k: "channel", l: "Channel", type: "select", options: ["Direct", "Booking.com", "Expedia", "Agoda", "Corporate"] },
    ],
  },
  guest: {
    title: "New Guest",
    icon: "user-plus",
    key: "aura_new_guests",
    fields: [
      { k: "name", l: "Full name", type: "text", req: true },
      { k: "email", l: "Email", type: "email", req: true },
      { k: "phone", l: "Phone", type: "tel" },
      { k: "country", l: "Country", type: "text" },
      { k: "tier", l: "Loyalty tier", type: "select", options: ["Silver", "Gold", "Platinum", "Diamond"] },
    ],
  },
  staff: {
    title: "New Staff",
    icon: "id-badge",
    key: "aura_new_staff",
    fields: [
      { k: "name", l: "Full name", type: "text", req: true },
      { k: "role", l: "Role", type: "select", options: ["Front Desk", "Housekeeping", "F&B", "Spa", "Concierge", "Manager"] },
      { k: "email", l: "Work email", type: "email", req: true },
      { k: "phone", l: "Phone", type: "tel" },
      { k: "shift", l: "Default shift", type: "select", options: ["Morning (07–15)", "Evening (15–23)", "Night (23–07)"] },
    ],
  },
  invoice: {
    title: "New Invoice",
    icon: "file-invoice-dollar",
    key: "aura_new_invoices",
    fields: [
      { k: "guest", l: "Bill to", type: "text", req: true },
      { k: "resid", l: "Reservation ID", type: "text", placeholder: "AH-..." },
      { k: "amount", l: "Amount ($)", type: "number", req: true },
      { k: "due", l: "Due date", type: "date", req: true },
      { k: "status", l: "Status", type: "select", options: ["Draft", "Sent", "Paid"] },
    ],
  },
  event: {
    title: "New Event",
    icon: "calendar-heart",
    key: "aura_new_events",
    fields: [
      { k: "name", l: "Event name", type: "text", req: true, placeholder: "e.g. Kapoor Wedding" },
      { k: "venue", l: "Venue", type: "select", options: ["Palace Ballroom", "Courtyard", "Garden Pavilion", "Terrace"] },
      { k: "date", l: "Date", type: "date", req: true },
      { k: "guests", l: "Guests", type: "number", placeholder: "120" },
      { k: "contact", l: "Primary contact", type: "text" },
    ],
  },
  menu: {
    title: "New Menu Item",
    icon: "utensils",
    key: "aura_new_menu",
    fields: [
      { k: "name", l: "Dish name", type: "text", req: true },
      { k: "category", l: "Category", type: "select", options: ["Breakfast", "All-day", "Beverages", "Sweet", "Chef's Special"] },
      { k: "price", l: "Price ($)", type: "number", req: true },
      { k: "desc", l: "Description", type: "textarea" },
      { k: "veg", l: "Vegetarian?", type: "select", options: ["Yes", "No"] },
    ],
  },
  campaign: {
    title: "New Campaign",
    icon: "bullhorn",
    key: "aura_new_campaigns",
    fields: [
      { k: "name", l: "Campaign name", type: "text", req: true },
      { k: "channel", l: "Channel", type: "select", options: ["Email", "SMS", "Push", "Social", "Web"] },
      { k: "audience", l: "Audience", type: "select", options: ["All members", "Platinum+", "Corporate", "Local guests", "Past guests"] },
      { k: "budget", l: "Budget ($)", type: "number" },
      { k: "start", l: "Start date", type: "date", req: true },
    ],
  },
};

export const AdminQuickCreateModal = ({ entity, onClose }) => {
  const cfg = FORMS[entity];
  const [values, setValues] = useState(() => Object.fromEntries((cfg?.fields || []).map((f) => [f.k, ""])));
  if (!cfg) return null;

  const set = (k, v) => setValues((s) => ({ ...s, [k]: v }));
  const submit = () => {
    for (const f of cfg.fields) {
      if (f.req && !String(values[f.k] || "").trim()) { toast.error(`Please fill: ${f.l}`); return; }
    }
    try {
      const arr = JSON.parse(localStorage.getItem(cfg.key) || "[]");
      arr.unshift({ id: `${entity}-${Date.now()}`, ...values, createdAt: new Date().toISOString() });
      localStorage.setItem(cfg.key, JSON.stringify(arr.slice(0, 100)));
    } catch (e) {}
    toast.success(`${cfg.title} created`, { description: values.name || values.guest || values.email || "Saved locally" });
    onClose && onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-8 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} data-testid={`quick-create-${entity}`}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-md rounded-t-[24px] md:rounded-[24px] p-8 shadow-[0_40px_100px_rgba(15,23,42,0.35)] relative max-h-[92vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center" aria-label="Close" data-testid="quick-create-close">
          <i className="fa-solid fa-xmark text-slate-500 text-sm"></i>
        </button>
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-[#C9A227]/12 text-[#C9A227] grid place-items-center"><i className={`fa-solid fa-${cfg.icon} text-sm`}></i></span>
          <div>
            <p className="text-eyebrow text-[#C9A227]">Quick create</p>
            <h3 className="font-serif text-2xl text-slate-900">{cfg.title}</h3>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {cfg.fields.map((f) => (
            <label key={f.k} className="block">
              <span className="text-eyebrow text-slate-500">{f.l}{f.req && <span className="text-rose-500 ml-1">*</span>}</span>
              {f.type === "textarea" ? (
                <textarea rows={3} value={values[f.k]} onChange={(e) => set(f.k, e.target.value)} placeholder={f.placeholder} className="mt-1 w-full bg-[#FAFAF8] border border-slate-200 rounded-[12px] px-3 py-2 text-sm outline-none focus:border-[#4F46E5]" data-testid={`qc-${entity}-${f.k}`} />
              ) : f.type === "select" ? (
                <select value={values[f.k]} onChange={(e) => set(f.k, e.target.value)} className="mt-1 w-full bg-[#FAFAF8] border border-slate-200 rounded-full px-3 py-2 text-sm outline-none focus:border-[#4F46E5]" data-testid={`qc-${entity}-${f.k}`}>
                  <option value="">Choose…</option>
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type} value={values[f.k]} onChange={(e) => set(f.k, e.target.value)} placeholder={f.placeholder} className="mt-1 w-full bg-[#FAFAF8] border border-slate-200 rounded-full px-3 py-2 text-sm outline-none focus:border-[#4F46E5]" data-testid={`qc-${entity}-${f.k}`} />
              )}
            </label>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-sm">Cancel</button>
          <button onClick={submit} className="px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm shadow-[0_10px_28px_rgba(79,70,229,0.28)]" data-testid={`qc-${entity}-submit`}>
            <i className="fa-solid fa-check text-[10px] mr-1.5"></i>Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminQuickCreateModal;
