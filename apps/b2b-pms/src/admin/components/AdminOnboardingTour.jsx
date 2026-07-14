import { useEffect, useState } from "react";

const KEY = "aura_admin_tour_v1";

// Simple 4-step onboarding tour for admin. Backdrop click and ESC both dismiss.
const STEPS = [
  { t: "Welcome to Aura Console", d: "This quick tour will point out the tools you use every day. It takes 30 seconds.", i: "sparkles" },
  { t: "Command palette", d: "Press ⌘K or / anywhere to jump to any page, guest, room, or reservation.", i: "magnifying-glass" },
  { t: "Front Desk & Reservations", d: "Split-view arrivals, Gantt calendar and Kanban board — all one click from the sidebar.", i: "concierge-bell" },
  { t: "Guest 360", d: "Click any guest name to open their full profile with stays, preferences and messages.", i: "user-tie" },
];

export const AdminOnboardingTour = () => {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(KEY);
      if (!seen) setOpen(true);
    } catch (e) {}
  }, []);

  const finish = () => {
    try { localStorage.setItem(KEY, "1"); } catch (e) {}
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") finish(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;
  const s = STEPS[step];
  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4" data-testid="admin-tour" onClick={finish}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white rounded-[20px] shadow-[0_40px_100px_rgba(15,23,42,0.35)] overflow-hidden relative">
        <button onClick={finish} className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-slate-50 grid place-items-center z-10" aria-label="Close tour" data-testid="tour-close">
          <i className="fa-solid fa-xmark text-slate-500 text-sm"></i>
        </button>
        <div className="h-2 bg-slate-100"><div className="h-full bg-brand-primary transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}></div></div>
        <div className="p-8">
          <div className="w-14 h-14 rounded-full bg-brand-accent/12 text-brand-accent grid place-items-center"><i className={`fa-solid fa-${s.i} text-2xl`}></i></div>
          <p className="text-eyebrow text-brand-accent mt-5">{`Step ${step + 1} of ${STEPS.length}`}</p>
          <h3 className="mt-1 font-serif text-2xl text-slate-900">{s.t}</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.d}</p>
          <div className="mt-6 flex items-center justify-between">
            <button onClick={finish} className="text-xs text-slate-500 hover:text-slate-900" data-testid="tour-skip">Skip tour</button>
            <div className="flex items-center gap-2">
              {step > 0 && <button onClick={() => setStep((s) => s - 1)} className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-xs" data-testid="tour-prev">Back</button>}
              {step < STEPS.length - 1 ? (
                <button onClick={() => setStep((s) => s + 1)} className="px-5 py-2 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-xs shadow-[0_10px_28px_rgba(79,70,229,0.28)]" data-testid="tour-next">Next →</button>
              ) : (
                <button onClick={finish} className="px-5 py-2 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-xs shadow-[0_10px_28px_rgba(79,70,229,0.28)]" data-testid="tour-done">Get started</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOnboardingTour;
