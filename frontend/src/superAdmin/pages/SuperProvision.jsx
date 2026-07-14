import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SuperAdminLayout from "@/superAdmin/SuperAdminLayout";
import { TEMPLATES } from "@/tenants/tenantRegistry";
import BrandPreview from "@/superAdmin/components/BrandPreview";

// 4-step wizard for onboarding a new tenant. Purely mock — collects values
// and pretends to provision. In production this hits `/api/tenants` POST.

const STEPS = [
  { key: "profile", label: "Property", icon: "building" },
  { key: "domain", label: "Domain", icon: "globe" },
  { key: "brand", label: "Brand", icon: "palette" },
  { key: "seed", label: "Launch", icon: "rocket" },
];

const PRESETS = {
  luxury: { primary: "#4F46E5", accent: "#C9A227", surface: "#FAFAF8" },
  heritage: { primary: "#7B2C2C", accent: "#B8860B", surface: "#FBF6EE" },
  basic: { primary: "#0F766E", accent: "#F59E0B", surface: "#F8FAFC" },
};

export default function SuperProvision() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    brandName: "",
    legalName: "",
    tagline: "",
    email: "",
    phone: "",
    city: "",
    slug: "",
    domainMode: "path", // "path" | "subdomain"
    customDomain: "",
    template: "luxury",
    tier: "basic",
    primary: PRESETS.luxury.primary,
    accent: PRESETS.luxury.accent,
    surface: PRESETS.luxury.surface,
    seedRooms: true,
    seedStaff: true,
    seedMenu: true,
    launchInvite: "",
  });

  const set = (patch) => setForm((s) => ({ ...s, ...patch }));

  // Auto-derive slug from brand name when the user hasn't typed one manually.
  const autoSlug = useMemo(() =>
    form.brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    [form.brandName]
  );

  const canNext = () => {
    if (step === 0) return form.brandName && form.email && form.city;
    if (step === 1) return (form.slug || autoSlug).length >= 3;
    if (step === 2) return form.template && form.primary;
    return true;
  };

  const launch = () => {
    setBusy(true);
    setTimeout(() => {
      const slug = form.slug || autoSlug;
      setBusy(false);
      toast.success("Tenant provisioned", { description: `${form.brandName} is live at /t/${slug}` });
      nav("/super-admin/tenants");
    }, 1400);
  };

  return (
    <SuperAdminLayout pageTitle="Provision new tenant">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 max-w-3xl mx-auto" data-testid="provision-stepper">
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={s.key} className="flex-1 flex items-center gap-2 last:flex-none">
              <div className={`flex items-center gap-3 ${active ? "text-white" : done ? "text-emerald-400" : "text-slate-500"}`}>
                <span className={`w-9 h-9 rounded-full grid place-items-center flex-shrink-0 transition-all ${done ? "bg-emerald-500/20" : active ? "bg-[#4F46E5]" : "bg-white/5"}`} data-testid={`step-${s.key}`}>
                  {done ? <i className="fa-solid fa-check text-emerald-400 text-xs"></i> : <i className={`fa-solid fa-${s.icon} text-xs`}></i>}
                </span>
                <span className="text-xs tracking-wide hidden md:inline whitespace-nowrap">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <span className={`flex-1 h-px mx-2 ${done ? "bg-emerald-500/40" : "bg-white/10"}`}></span>}
            </div>
          );
        })}
      </div>

      <div className={`${step === 2 ? "max-w-6xl" : "max-w-3xl"} mx-auto`}>
        <div className={step === 2 ? "grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start" : ""}>
          <div className="p-8 rounded-[20px] bg-white/5 border border-white/10" data-testid="provision-panel">
        {step === 0 && (
          <div className="space-y-4" data-testid="provision-step-profile">
            <p className="text-eyebrow text-[#C9A227]">Step 1 of 4</p>
            <h3 className="font-serif text-2xl text-white">Property profile</h3>
            <p className="text-sm text-slate-400">Tell us about the hotel we're onboarding.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <Field label="Brand name" value={form.brandName} onChange={(v) => set({ brandName: v })} placeholder="Bhairavgarh Palace" testid="pv-brandName" required />
              <Field label="Legal name" value={form.legalName} onChange={(v) => set({ legalName: v })} placeholder="Bhairavgarh Heritage Estates" testid="pv-legalName" />
              <Field label="Tagline" value={form.tagline} onChange={(v) => set({ tagline: v })} placeholder="A Rajputana Legend Since 1732" testid="pv-tagline" className="md:col-span-2" />
              <Field label="Owner email" value={form.email} onChange={(v) => set({ email: v })} placeholder="gm@hotel.com" testid="pv-email" required />
              <Field label="Phone" value={form.phone} onChange={(v) => set({ phone: v })} placeholder="+91 …" testid="pv-phone" />
              <Field label="City" value={form.city} onChange={(v) => set({ city: v })} placeholder="Udaipur" testid="pv-city" required />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4" data-testid="provision-step-domain">
            <p className="text-eyebrow text-[#C9A227]">Step 2 of 4</p>
            <h3 className="font-serif text-2xl text-white">Domain</h3>
            <p className="text-sm text-slate-400">Choose how guests will reach the storefront.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {[
                { k: "path", l: "Path routing", d: "aurahotels.com/t/{slug}", i: "route", suggested: "Recommended" },
                { k: "subdomain", l: "Custom subdomain", d: "{slug}.aurahotels.com", i: "globe", suggested: "Available on Pro" },
              ].map((o) => (
                <button
                  key={o.k}
                  onClick={() => set({ domainMode: o.k })}
                  className={`p-5 text-left rounded-[14px] border transition-all ${form.domainMode === o.k ? "border-[#4F46E5] bg-[#4F46E5]/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                  data-testid={`domain-${o.k}`}
                >
                  <div className="flex items-center justify-between">
                    <i className={`fa-solid fa-${o.i} text-[#C9A227]`}></i>
                    <span className="text-[9px] tracking-widest uppercase text-slate-500">{o.suggested}</span>
                  </div>
                  <p className="mt-3 text-sm text-white">{o.l}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-1">{o.d}</p>
                </button>
              ))}
            </div>
            <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Slug" value={form.slug || autoSlug} onChange={(v) => set({ slug: v.toLowerCase().replace(/[^a-z0-9-]/g, "") })} placeholder="e.g. bhairavgarh" testid="pv-slug" required prefix="/t/" />
              {form.domainMode === "subdomain" && (
                <Field label="Custom domain (optional)" value={form.customDomain} onChange={(v) => set({ customDomain: v })} placeholder="stay.bhairavgarh.com" testid="pv-customDomain" />
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4" data-testid="provision-step-brand">
            <p className="text-eyebrow text-[#C9A227]">Step 3 of 4</p>
            <h3 className="font-serif text-2xl text-white">Brand & template</h3>
            <p className="text-sm text-slate-400">Pick a visual foundation. You can customise colours anytime from Settings.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {TEMPLATES.map((k) => {
                const active = form.template === k;
                const p = PRESETS[k];
                return (
                  <button
                    key={k}
                    onClick={() => set({ template: k, ...p })}
                    className={`p-5 text-left rounded-[14px] border transition-all ${active ? "border-[#4F46E5] bg-[#4F46E5]/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                    data-testid={`template-${k}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: p.primary }}></span>
                        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: p.accent }}></span>
                      </div>
                      {active && <i className="fa-solid fa-circle-check text-emerald-400 text-xs"></i>}
                    </div>
                    <p className="mt-3 font-serif text-lg text-white capitalize">{k}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {k === "luxury" && "Modern, spacious, high-radius"}
                      {k === "heritage" && "Rich, tactile, sharper edges"}
                      {k === "basic" && "Clean, minimal, budget-friendly"}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <ColorField label="Primary" value={form.primary} onChange={(v) => set({ primary: v })} testid="pv-primary" />
              <ColorField label="Accent" value={form.accent} onChange={(v) => set({ accent: v })} testid="pv-accent" />
              <ColorField label="Surface" value={form.surface} onChange={(v) => set({ surface: v })} testid="pv-surface" />
            </div>

            <div className="pt-2">
              <p className="text-[10px] tracking-widest uppercase text-slate-500 mb-2">Subscription tier</p>
              <div className="flex gap-2">
                <button onClick={() => set({ tier: "basic" })} className={`px-4 py-2 rounded-full text-xs ${form.tier === "basic" ? "bg-white text-slate-900" : "bg-white/5 text-slate-300 hover:bg-white/10"}`} data-testid="tier-basic">Basic · ₹4,999</button>
                <button onClick={() => set({ tier: "pro" })} className={`px-4 py-2 rounded-full text-xs flex items-center gap-1.5 ${form.tier === "pro" ? "bg-gradient-to-r from-[#C9A227] to-[#E6C868] text-slate-900" : "bg-white/5 text-slate-300 hover:bg-white/10"}`} data-testid="tier-pro">
                  <i className="fa-solid fa-crown text-[9px]"></i>Pro · ₹14,999
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4" data-testid="provision-step-seed">
            <p className="text-eyebrow text-[#C9A227]">Step 4 of 4</p>
            <h3 className="font-serif text-2xl text-white">Seed data & launch</h3>
            <p className="text-sm text-slate-400">Pre-populate the tenant with sensible defaults. You can edit everything after launch.</p>
            <div className="mt-4 space-y-2">
              {[
                { k: "seedRooms", l: "Seed 6 sample rooms + rate plans", i: "bed" },
                { k: "seedStaff", l: "Seed 4 admin roles (GM, FD, HK, F&B)", i: "id-badge" },
                { k: "seedMenu", l: "Seed sample restaurant menu (24 dishes)", i: "utensils" },
              ].map((it) => (
                <label key={it.k} className="flex items-center gap-3 p-3 rounded-[10px] bg-white/5 hover:bg-white/10 cursor-pointer" data-testid={`seed-${it.k}`}>
                  <input type="checkbox" checked={form[it.k]} onChange={(e) => set({ [it.k]: e.target.checked })} className="w-4 h-4 accent-[#4F46E5]" />
                  <i className={`fa-solid fa-${it.i} text-[#C9A227] text-xs w-4`}></i>
                  <span className="text-sm text-white flex-1">{it.l}</span>
                </label>
              ))}
            </div>
            <Field label="Send launch invite to" value={form.launchInvite || form.email} onChange={(v) => set({ launchInvite: v })} placeholder={form.email} testid="pv-invite" />
            <div className="mt-6 p-4 rounded-[12px] bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-xs text-emerald-300 flex items-center gap-2"><i className="fa-solid fa-circle-check"></i> Ready to launch <span className="text-white font-serif font-medium">{form.brandName}</span> at <span className="font-mono">/t/{form.slug || autoSlug}</span></p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="px-5 py-2 rounded-full text-sm text-slate-300 hover:bg-white/5 disabled:opacity-30" data-testid="provision-back">Back</button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep((s) => s + 1)} disabled={!canNext()} className="px-6 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-40 text-white text-sm shadow-[0_10px_28px_rgba(79,70,229,0.35)] flex items-center gap-2" data-testid="provision-next">
              Continue<i className="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
          ) : (
            <button onClick={launch} disabled={busy} className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 text-white text-sm shadow-[0_10px_28px_rgba(16,185,129,0.35)] flex items-center gap-2" data-testid="provision-launch">
              {busy ? <><i className="fa-solid fa-spinner animate-spin text-xs"></i>Provisioning…</> : <><i className="fa-solid fa-rocket text-[10px]"></i>Launch tenant</>}
            </button>
          )}
        </div>
          </div>

          {step === 2 && (
            <div className="hidden lg:block">
              <BrandPreview
                brandName={form.brandName}
                tagline={form.tagline || "Where every stay becomes a story"}
                primary={form.primary}
                accent={form.accent}
                surface={form.surface}
                template={form.template}
                tier={form.tier}
              />
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
}

const Field = ({ label, value, onChange, placeholder, testid, required, prefix, className = "" }) => (
  <div className={className}>
    <label className="text-[10px] tracking-widest uppercase text-slate-500">
      {label} {required && <span className="text-rose-400">*</span>}
    </label>
    <div className="mt-1 flex items-center bg-white/5 border border-white/10 rounded-full focus-within:border-[#4F46E5]">
      {prefix && <span className="pl-4 text-slate-500 font-mono text-xs">{prefix}</span>}
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white outline-none" data-testid={testid} />
    </div>
  </div>
);

const ColorField = ({ label, value, onChange, testid }) => (
  <div>
    <label className="text-[10px] tracking-widest uppercase text-slate-500">{label}</label>
    <div className="mt-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-full pl-2 pr-3 py-1">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 rounded-full bg-transparent border-0 cursor-pointer" data-testid={testid} />
      <input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-transparent text-sm text-white font-mono outline-none" />
    </div>
  </div>
);
