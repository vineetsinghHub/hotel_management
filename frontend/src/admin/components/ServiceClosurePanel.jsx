import { useState } from "react";
import { toast } from "sonner";
import {
  useServiceStatus,
  setServiceStatus,
  SERVICE_META,
} from "@/lib/serviceStatusStore";
import { useReadOnly } from "@/admin/components/ReadOnlyBanner";

// Admin-side card that lets a manager close (or reopen) an ancillary service.
// When flipped to "closed", the guest storefront blocks new bookings on the
// matching page (e.g. AdminSpa closes /spa reservations, Restaurant closes
// /dining reservations).
//
// Uses tenant slug from the current URL if not provided (assumes /admin/* is
// still shared today — will be per-tenant after the /t/:slug/admin migration).

export default function ServiceClosurePanel({ tenantSlug = "aura", service = "spa" }) {
  const status = useServiceStatus(tenantSlug, service);
  const readOnly = useReadOnly();
  const [note, setNote] = useState(status.note || "");
  const closed = status.status === "closed";
  const meta = SERVICE_META[service] || { label: service, icon: "circle", guestPath: service };

  const toggle = () => {
    if (readOnly) {
      toast.error("Read-only mode — updates disabled");
      return;
    }
    if (closed) {
      setServiceStatus(tenantSlug, service, "open", null);
      setNote("");
      toast.success(`${meta.label} reopened`, {
        description: `Guests can now book ${meta.label.toLowerCase()} again.`,
      });
    } else {
      setServiceStatus(tenantSlug, service, "closed", note || null);
      toast.warning(`${meta.label} closed`, {
        description: `Guest bookings for ${meta.label.toLowerCase()} are now blocked.`,
      });
    }
  };

  return (
    <div
      className={`p-5 rounded-[16px] border transition-colors ${
        closed
          ? "bg-rose-50/60 border-rose-200"
          : "bg-emerald-50/40 border-emerald-100"
      }`}
      data-testid={`service-closure-${service}`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`w-11 h-11 rounded-[12px] grid place-items-center flex-shrink-0 ${
            closed ? "bg-rose-500/15 text-rose-600" : "bg-emerald-500/15 text-emerald-600"
          }`}
        >
          <i className={`fa-solid fa-${meta.icon} text-base`}></i>
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-serif text-lg text-slate-900">{meta.label} availability</p>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                closed ? "bg-rose-500/15 text-rose-700" : "bg-emerald-500/15 text-emerald-700"
              }`}
              data-testid={`service-status-${service}`}
            >
              {closed ? "Closed" : "Accepting bookings"}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {closed
              ? "Guests currently see a closure banner and cannot make new reservations."
              : "Guests can book new appointments and reservations."}
          </p>
          {closed && status.closedAt && (
            <p className="mt-1 text-[10px] text-slate-500 font-mono">
              closed at {new Date(status.closedAt).toLocaleString()}
            </p>
          )}

          {!closed && (
            <div className="mt-3">
              <label className="text-[10px] tracking-widest uppercase text-slate-500">
                Reason (optional, shown to guests)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Annual maintenance, deep clean, staff off-site"
                className="mt-1 w-full bg-white border border-slate-200 rounded-[10px] px-3 py-2 text-sm outline-none focus:border-[#4F46E5]"
                data-testid={`service-closure-note-${service}`}
              />
            </div>
          )}
        </div>

        <button
          onClick={toggle}
          disabled={readOnly}
          className={`flex-shrink-0 px-4 py-2.5 rounded-full text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            closed
              ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_6px_18px_rgba(16,185,129,0.25)]"
              : "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_6px_18px_rgba(244,63,94,0.25)]"
          }`}
          data-testid={`service-toggle-${service}`}
        >
          <i className={`fa-solid fa-${closed ? "unlock" : "lock"} mr-1.5 text-[10px]`}></i>
          {closed ? `Reopen ${meta.label}` : `Close ${meta.label}`}
        </button>
      </div>
    </div>
  );
}
