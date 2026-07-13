import { useState } from "react";
import { toast } from "sonner";
import { PRO_MODULES, TIERS, getTier, setTier } from "@/admin/tier";

// Beautiful "Upgrade to Pro" wall — rendered instead of the actual module when
// a Basic-tier user hits a Pro route. Also usable inline for partial locks
// inside a page (e.g. Message Center broadcast panel).

export const TierGate = ({ routeKey, inline = false, onUpgrade }) => {
  const info = PRO_MODULES[routeKey] || {
    title: "Premium feature",
    hook: "Unlock advanced tools built for growing hotels.",
    reason: "This feature is included in the Pro plan.",
    icon: "crown",
  };
  const [busy, setBusy] = useState(false);

  const upgrade = () => {
    setBusy(true);
    setTimeout(() => {
      setTier("pro");
      toast.success("Welcome to Aura Pro", { description: "All premium modules unlocked." });
      setBusy(false);
      if (onUpgrade) onUpgrade();
      else window.location.reload();
    }, 900);
  };

  return (
    <div className={inline ? "" : "min-h-[calc(100vh-160px)] grid place-items-center px-4 py-10"} data-testid={`tier-gate-${routeKey}`}>
      <div className="relative w-full max-w-3xl">
        {/* Ambient glow */}
        <div className="absolute -inset-6 bg-gradient-to-tr from-[#4F46E5]/20 via-[#C9A227]/10 to-transparent blur-3xl -z-10 rounded-[32px]"></div>

        <div className="bg-white/95 backdrop-blur-xl rounded-[24px] border border-slate-200 overflow-hidden shadow-[0_40px_100px_rgba(15,23,42,0.12)]">
          {/* Hero band */}
          <div className="relative px-8 pt-10 pb-8 bg-gradient-to-br from-slate-900 via-[#312E81] to-[#4F46E5] text-white overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#C9A227]/25 blur-3xl"></div>
            <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/15">
              <i className="fa-solid fa-lock text-[10px] text-[#E6C868]"></i>
              <span className="text-[10px] tracking-[0.22em] uppercase text-white/90">Pro feature</span>
            </div>
            <div className="relative flex items-start gap-5">
              <span className="w-16 h-16 rounded-[16px] bg-white/10 backdrop-blur border border-white/15 grid place-items-center flex-shrink-0">
                <i className={`fa-solid fa-${info.icon} text-2xl text-[#E6C868]`}></i>
              </span>
              <div>
                <p className="text-eyebrow text-[#E6C868]">Aura Pro Tier</p>
                <h2 className="mt-1 font-serif text-3xl sm:text-4xl leading-tight">{info.title}</h2>
                <p className="mt-2 text-sm text-white/80 max-w-lg leading-relaxed">{info.hook}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            <div className="p-4 rounded-[14px] bg-[#4F46E5]/8 border border-[#4F46E5]/15 flex gap-3 items-start">
              <i className="fa-solid fa-circle-info text-[#4F46E5] text-sm mt-0.5"></i>
              <p className="text-sm text-slate-700 leading-relaxed">{info.reason}</p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current */}
              <div className="p-5 rounded-[16px] border border-slate-200 bg-[#FAFAF8]">
                <div className="flex items-center justify-between">
                  <p className="text-eyebrow text-slate-500">Your plan</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">Current</span>
                </div>
                <p className="mt-2 font-serif text-2xl text-slate-900">{TIERS.BASIC.label}</p>
                <p className="text-xs text-slate-500 font-mono">{TIERS.BASIC.price}</p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  {TIERS.BASIC.features.map((f) => (
                    <li key={f} className="flex items-start gap-2"><i className="fa-solid fa-check text-emerald-500 text-[10px] mt-0.5"></i><span>{f}</span></li>
                  ))}
                </ul>
              </div>

              {/* Pro */}
              <div className="p-5 rounded-[16px] border-2 border-[#4F46E5] bg-gradient-to-br from-white to-[#F5F3FF] relative">
                <span className="absolute -top-3 left-5 text-[10px] tracking-[0.22em] uppercase bg-[#C9A227] text-slate-900 px-2 py-1 rounded-full font-medium">Recommended</span>
                <div className="flex items-center justify-between">
                  <p className="text-eyebrow text-[#4F46E5]">Upgrade to</p>
                  <i className="fa-solid fa-crown text-[#C9A227]"></i>
                </div>
                <p className="mt-2 font-serif text-2xl text-slate-900">{TIERS.PRO.label}</p>
                <p className="text-xs text-slate-500 font-mono">{TIERS.PRO.price}</p>
                <ul className="mt-4 space-y-2 text-xs text-slate-700">
                  {TIERS.PRO.features.map((f) => (
                    <li key={f} className="flex items-start gap-2"><i className="fa-solid fa-check text-[#4F46E5] text-[10px] mt-0.5"></i><span>{f}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                <i className="fa-solid fa-shield-heart mr-1.5 text-emerald-500"></i>
                Cancel anytime · 14-day money-back guarantee
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toast.info("Our team will reach out shortly", { description: "sales@aurahotels.com" })}
                  className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-sm text-slate-700"
                  data-testid={`tier-gate-contact-${routeKey}`}
                >
                  Talk to sales
                </button>
                <button
                  onClick={upgrade}
                  disabled={busy}
                  className="px-6 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium shadow-[0_10px_28px_rgba(79,70,229,0.35)] flex items-center gap-2 disabled:opacity-70"
                  data-testid={`tier-gate-upgrade-${routeKey}`}
                >
                  {busy ? <><i className="fa-solid fa-spinner animate-spin text-xs"></i>Upgrading…</> : <><i className="fa-solid fa-arrow-up text-[10px]"></i>Upgrade to Pro</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Small badge to sprinkle in sidebar / cards.
export const ProBadge = ({ className = "" }) => (
  <span
    className={`inline-flex items-center gap-1 text-[8px] tracking-[0.15em] uppercase font-medium px-1.5 py-0.5 rounded-[4px] bg-gradient-to-r from-[#C9A227] to-[#E6C868] text-slate-900 ${className}`}
    data-testid="pro-badge"
  >
    <i className="fa-solid fa-crown text-[7px]"></i>Pro
  </span>
);

export default TierGate;
