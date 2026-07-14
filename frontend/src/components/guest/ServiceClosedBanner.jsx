import { useServiceStatus, SERVICE_META } from "@/lib/serviceStatusStore";
import { useTenant } from "@/tenants/TenantProvider";

// Guest-side banner that appears at the top of a service page (Spa, Dining,
// Experiences) whenever an admin has flipped that service to "closed".
// While closed, the surrounding page should also disable its Reserve CTAs
// (see the `closed` flag returned by useServiceClosedForCurrentTenant).

export default function ServiceClosedBanner({ service }) {
  const { tenant } = useTenant();
  const slug = tenant?.slug || "aura";
  const status = useServiceStatus(slug, service);
  const meta = SERVICE_META[service] || { label: service, icon: "circle" };
  if (status.status !== "closed") return null;

  return (
    <div
      className="max-w-7xl mx-auto px-6 md:px-10 pt-8"
      data-testid={`service-closed-${service}`}
    >
      <div className="p-5 rounded-[18px] bg-rose-500/10 border border-rose-500/25 flex items-start gap-4">
        <span className="w-11 h-11 rounded-[12px] bg-rose-500/20 text-rose-700 grid place-items-center flex-shrink-0">
          <i className={`fa-solid fa-${meta.icon}`}></i>
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-eyebrow text-rose-700">Temporarily closed</p>
          <h3 className="mt-1 font-serif text-2xl text-slate-900">
            The {meta.label.toLowerCase()} is not accepting new bookings
          </h3>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            {status.note ||
              `Our team is preparing something wonderful. ${meta.label} reservations are paused until further notice — please check back soon or speak to your concierge.`}
          </p>
          {status.closedAt && (
            <p className="mt-2 text-[10px] text-slate-500 font-mono">
              paused {new Date(status.closedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Hook helper for pages that need the boolean state.
export const useServiceClosed = (service) => {
  const { tenant } = useTenant();
  const slug = tenant?.slug || "aura";
  const status = useServiceStatus(slug, service);
  return status.status === "closed";
};
