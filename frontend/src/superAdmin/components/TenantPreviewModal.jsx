import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

// Live "Preview as tenant" modal — used by Super Admin ops to walk a prospect
// through their exact branded storefront during a sales call. Renders the
// tenant's public routes inside a themed device frame with a route selector
// + device-size toggle + open-in-new-tab shortcut.

const DEVICE_SIZES = {
  desktop: { width: 1280, height: 720, label: "Desktop", icon: "desktop" },
  tablet: { width: 820, height: 1180, label: "Tablet", icon: "tablet-screen-button" },
  mobile: { width: 390, height: 780, label: "Mobile", icon: "mobile-screen-button" },
};

const ROUTES = [
  { key: "", label: "Home", icon: "house" },
  { key: "rooms", label: "Rooms", icon: "bed" },
  { key: "dining", label: "Dining", icon: "utensils" },
  { key: "spa", label: "Spa", icon: "spa" },
  { key: "experiences", label: "Experiences", icon: "compass" },
  { key: "booking", label: "Booking", icon: "calendar-check" },
  { key: "gallery", label: "Gallery", icon: "images" },
];

export default function TenantPreviewModal({ tenant, open, onClose }) {
  const [device, setDevice] = useState("desktop");
  const [route, setRoute] = useState("");
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  // Reset internal state whenever a new tenant is opened
  useEffect(() => {
    if (open) {
      setDevice("desktop");
      setRoute("");
      setLoading(true);
    }
  }, [open, tenant?.slug]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    // Lock body scroll while modal is open
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const src = useMemo(() => {
    if (!tenant) return "about:blank";
    const base = route ? `/t/${tenant.slug}/${route}` : `/t/${tenant.slug}`;
    // Pass a flag the storefront can read to suppress ops-only floating widgets
    // (like the tenant-switcher pill). Storefront is free to ignore it.
    return `${base}?embed=1`;
  }, [tenant, route]);

  if (!open || !tenant) return null;

  const size = DEVICE_SIZES[device];
  const displayUrl = `aurahotels.com/t/${tenant.slug}${route ? "/" + route : ""}`;

  const modal = (
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-slate-950/85 backdrop-blur-md"
      onClick={onClose}
      data-testid="tenant-preview-modal"
    >
      {/* Top toolbar */}
      <div
        className="flex items-center gap-3 px-4 md:px-6 py-3 border-b border-white/10 bg-slate-900/70"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="w-9 h-9 rounded-[10px] grid place-items-center text-xs font-serif text-slate-900 flex-shrink-0"
            style={{ backgroundColor: tenant.accent || "#C9A227" }}
          >
            {tenant.brandName?.[0] || "T"}
          </span>
          <div className="min-w-0">
            <p className="text-white text-sm truncate leading-tight">
              Preview as <span className="font-serif">{tenant.brandName}</span>
            </p>
            <p className="text-[10px] text-slate-400 font-mono truncate">/{tenant.slug}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1 ml-4 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 min-w-0">
          <i className="fa-solid fa-lock text-[9px] text-emerald-400"></i>
          <span className="text-[10px] text-slate-400 font-mono truncate">{displayUrl}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Device toggle */}
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10">
            {Object.entries(DEVICE_SIZES).map(([k, d]) => (
              <button
                key={k}
                onClick={() => { setDevice(k); setLoading(true); }}
                className={`w-8 h-8 rounded-full grid place-items-center text-xs transition-colors ${device === k ? "bg-white text-slate-900" : "text-slate-400 hover:text-white"}`}
                title={d.label}
                data-testid={`preview-device-${k}`}
              >
                <i className={`fa-solid fa-${d.icon}`}></i>
              </button>
            ))}
          </div>

          <button
            onClick={() => { setReloadKey((k) => k + 1); setLoading(true); }}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 grid place-items-center text-slate-400 hover:text-white"
            title="Reload"
            data-testid="preview-reload"
          >
            <i className="fa-solid fa-rotate-right text-xs"></i>
          </button>

          <a
            href={`/t/${tenant.slug}${route ? "/" + route : ""}`}
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 grid place-items-center text-slate-400 hover:text-white"
            title="Open in new tab"
            data-testid="preview-open-new-tab"
          >
            <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
          </a>

          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.origin + `/t/${tenant.slug}${route ? "/" + route : ""}`);
              toast.success("Link copied", { description: "Share with the prospect during your call." });
            }}
            className="hidden md:flex px-3 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 items-center gap-2 text-xs text-slate-300 hover:text-white"
            data-testid="preview-copy-link"
          >
            <i className="fa-solid fa-link text-[10px]"></i>Copy link
          </button>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-white"
            title="Close (ESC)"
            data-testid="preview-close"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>
      </div>

      {/* Route rail + stage */}
      <div
        className="flex-1 flex min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left rail — route selector */}
        <div className="hidden md:flex flex-col gap-1 w-[168px] p-3 border-r border-white/10 bg-slate-950/60 overflow-y-auto">
          <p className="text-[9px] tracking-[0.22em] uppercase text-slate-500 px-2 py-1.5">Pages</p>
          {ROUTES.map((r) => {
            const active = route === r.key;
            const enabled =
              !r.key ||
              !tenant.enabledModules ||
              tenant.enabledModules[r.key] !== false;
            return (
              <button
                key={r.key || "home"}
                onClick={() => { if (enabled) { setRoute(r.key); setLoading(true); } }}
                disabled={!enabled}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs transition-colors ${active ? "bg-white/10 text-white" : enabled ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-600 cursor-not-allowed"}`}
                data-testid={`preview-route-${r.key || "home"}`}
              >
                <i className={`fa-solid fa-${r.icon} w-4 text-[11px]`}></i>
                <span className="flex-1 text-left">{r.label}</span>
                {!enabled && <i className="fa-solid fa-lock text-[9px] text-slate-600"></i>}
              </button>
            );
          })}
          <div className="mt-4 p-3 rounded-[10px] bg-[#4F46E5]/10 border border-[#4F46E5]/20">
            <p className="text-[9px] tracking-widest uppercase text-[#E6C868] mb-1">Tier</p>
            <p className="text-xs text-white capitalize">{tenant.tier || "basic"}</p>
            <p className="text-[10px] text-slate-400 mt-1 capitalize">{tenant.template || "luxury"} template</p>
          </div>
        </div>

        {/* Stage */}
        <div className="flex-1 grid place-items-center p-4 md:p-8 overflow-auto">
          <div
            className="relative bg-white shadow-[0_40px_100px_rgba(2,6,23,0.7)] rounded-[14px] overflow-hidden border border-white/10"
            style={{
              width: `min(${size.width}px, calc(100vw - 232px))`,
              height: `min(${size.height}px, calc(100vh - 140px))`,
              maxWidth: "100%",
              maxHeight: "100%",
            }}
            data-testid={`preview-stage-${device}`}
          >
            {loading && (
              <div className="absolute inset-0 grid place-items-center bg-white/80 z-10 pointer-events-none" data-testid="preview-loading">
                <div className="flex flex-col items-center gap-2">
                  <i className="fa-solid fa-spinner animate-spin text-[#4F46E5] text-lg"></i>
                  <span className="text-[10px] text-slate-500 tracking-widest uppercase">Loading storefront…</span>
                </div>
              </div>
            )}
            <iframe
              key={`${tenant.slug}-${route}-${reloadKey}`}
              src={src}
              title={`Preview ${tenant.brandName}`}
              className="w-full h-full border-0 block"
              onLoad={() => setLoading(false)}
              data-testid="preview-iframe"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
