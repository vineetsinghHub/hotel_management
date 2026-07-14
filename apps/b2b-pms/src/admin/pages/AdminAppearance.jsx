import { useMemo, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@aura/b2b-pms/admin/components/AdminLayout";
import {
  CURSOR_OPTIONS,
  BUTTON_OPTIONS,
  INPUT_OPTIONS,
  ANIMATION_OPTIONS,
  TIER_LABEL,
  TIER_PRICE,
  canUseOption,
} from "@aura/shared/templates/templateRegistry";
import {
  usePublishedTemplates,
  useTemplateStore,
  useTenantAppearance,
  useTenantUnlocks,
} from "@aura/shared/templates/templateStore";
import { useTenant } from "@aura/shared/tenants/TenantProvider";
import { useTier } from "@aura/shared/admin/tier";

const FAMILY_META = {
  cursor: { label: "Cursor", icon: "arrow-pointer" },
  button: { label: "Buttons", icon: "square-caret-right" },
  input: { label: "Inputs", icon: "keyboard" },
  animation: { label: "Animations", icon: "wand-magic-sparkles" },
};

const FAMILIES = [
  ["cursor", CURSOR_OPTIONS],
  ["button", BUTTON_OPTIONS],
  ["input", INPUT_OPTIONS],
  ["animation", ANIMATION_OPTIONS],
];

export default function AdminAppearance() {
  const { tenant } = useTenant();
  const slug = tenant?.slug || "aura";
  const { tier } = useTier();
  const templates = usePublishedTemplates();
  const appearance = useTenantAppearance(slug, tenant);
  const unlocks = useTenantUnlocks(slug);
  const setTenantAppearance = useTemplateStore((s) => s.setTenantAppearance);
  const unlockOption = useTemplateStore((s) => s.unlockOption);
  const [buyModal, setBuyModal] = useState(null);   // { family, option }

  const activeTemplate = useMemo(
    () => templates.find((t) => t.id === appearance.templateId) || templates[0],
    [templates, appearance.templateId]
  );

  const pickTemplate = (t) => {
    setTenantAppearance(slug, {
      templateId: t.id,
      cursor: t.defaults?.cursor,
      button: t.defaults?.button,
      input: t.defaults?.input,
      animation: t.defaults?.animation,
    });
    toast.success(`Template applied · ${t.name}`, { description: "Your storefront now reflects the new look." });
  };

  const pickOption = (family, option) => {
    const withFamily = { ...option, family };
    if (!canUseOption(withFamily, tier, unlocks)) {
      setBuyModal({ family, option });
      return;
    }
    setTenantAppearance(slug, { [family]: option.key });
    toast.success(`${FAMILY_META[family].label} updated`, { description: option.label });
  };

  const purchase = () => {
    if (!buyModal) return;
    unlockOption(slug, buyModal.family, buyModal.option.key);
    setTenantAppearance(slug, { [buyModal.family]: buyModal.option.key });
    toast.success(`Purchased · ${buyModal.option.label}`, { description: "Applied to your storefront." });
    setBuyModal(null);
  };

  const isUnlocked = (family, opt) => unlocks.includes(`${family}:${opt.key}`);

  return (
    <AdminLayout pageTitle="Appearance">
      <div className="mb-6">
        <p className="text-eyebrow text-[#C9A227]">Design</p>
        <h1 className="mt-1 font-serif text-3xl text-slate-900">Appearance</h1>
        <p className="mt-2 text-sm text-slate-500 max-w-2xl">Pick a template to change the overall look of your storefront, then fine-tune cursors, buttons, inputs and animations. Premium styles are available for one-time unlock.</p>
      </div>

      {/* Template picker */}
      <section className="mb-8" data-testid="appearance-templates">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl text-slate-900">Template</h2>
          <span className="text-xs text-slate-500">Active: <span className="text-slate-900 font-medium">{activeTemplate?.name || "—"}</span></span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => {
            const active = t.id === appearance.templateId;
            return (
              <button
                key={t.id}
                onClick={() => pickTemplate(t)}
                className={`text-left rounded-[16px] overflow-hidden border-2 transition-all ${active ? "border-[#4F46E5] ring-4 ring-[#4F46E5]/15" : "border-slate-200 hover:border-slate-300"}`}
                data-testid={`pick-template-${t.id}`}
              >
                <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${t.previewImage})` }}>
                  <div className="w-full h-full bg-gradient-to-t from-slate-900/70 to-transparent p-3 flex flex-col justify-end">
                    <p className="text-[10px] tracking-widest uppercase text-white/70">Base · {t.base}</p>
                    <p className="font-serif text-white text-lg leading-tight">{t.name}</p>
                  </div>
                </div>
                <div className="p-3 bg-white">
                  <p className="text-xs text-slate-600 line-clamp-2 min-h-[32px]">{t.description}</p>
                  {active && <p className="mt-2 text-[10px] text-[#4F46E5] font-medium"><i className="fa-solid fa-check text-[9px] mr-1"></i>Applied</p>}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Sub-option families */}
      {FAMILIES.map(([family, options]) => {
        const meta = FAMILY_META[family];
        const activeKey = appearance[family];
        return (
          <section key={family} className="mb-8" data-testid={`appearance-${family}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-[10px] bg-slate-900 text-white grid place-items-center"><i className={`fa-solid fa-${meta.icon} text-xs`}></i></span>
              <h2 className="font-serif text-xl text-slate-900">{meta.label}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {options.map((opt) => {
                const withFamily = { ...opt, family };
                const unlocked = isUnlocked(family, opt);
                const canUse = canUseOption(withFamily, tier, unlocks);
                const active = activeKey === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => pickOption(family, opt)}
                    className={`text-left p-4 rounded-[14px] border-2 transition-all relative ${active ? "border-[#4F46E5] bg-[#4F46E5]/5" : canUse ? "border-slate-200 hover:border-slate-300 bg-white" : "border-slate-200 bg-slate-50"}`}
                    data-testid={`pick-${family}-${opt.key}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-serif text-base ${canUse ? "text-slate-900" : "text-slate-500"}`}>{opt.label}</p>
                      {opt.tier === "free" ? (
                        <span className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700">{TIER_LABEL.free}</span>
                      ) : opt.tier === "pro" ? (
                        <span className={`text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full ${canUse ? "bg-[#4F46E5]/15 text-[#4F46E5]" : "bg-slate-200 text-slate-500"}`}>
                          <i className={`fa-solid fa-${canUse ? "check" : "lock"} text-[8px] mr-1`}></i>{TIER_LABEL.pro}
                        </span>
                      ) : (
                        <span className={`text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full ${unlocked ? "bg-[#C9A227]/25 text-[#C9A227]" : "bg-slate-200 text-slate-500"}`}>
                          <i className={`fa-solid fa-${unlocked ? "crown" : "lock"} text-[8px] mr-1`}></i>{unlocked ? "Owned" : TIER_LABEL.premium}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{opt.desc}</p>
                    {active && <p className="mt-2 text-[10px] text-[#4F46E5] font-medium"><i className="fa-solid fa-check text-[9px] mr-1"></i>Active</p>}
                    {!canUse && !active && (
                      <p className="mt-2 text-[10px] font-medium text-slate-600">
                        {opt.tier === "pro" ? "Upgrade to Pro" : `Buy · ₹${(TIER_PRICE.premium / 100).toFixed(0)}`}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Buy modal */}
      {buyModal && (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/70 backdrop-blur p-4" onClick={() => setBuyModal(null)} data-testid="buy-modal">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white rounded-[20px] p-6 shadow-[0_40px_100px_rgba(15,23,42,0.25)]">
            <p className="text-eyebrow text-[#C9A227]">Marketplace</p>
            <h3 className="mt-2 font-serif text-2xl text-slate-900">Unlock “{buyModal.option.label}”</h3>
            <p className="mt-2 text-sm text-slate-600">{buyModal.option.desc}</p>
            {buyModal.option.tier === "pro" && tier !== "pro" ? (
              <div className="mt-4 p-4 rounded-[12px] bg-[#4F46E5]/8 border border-[#4F46E5]/20 text-sm text-slate-700">
                This style is included in the <b>Aura Pro</b> subscription. Upgrade for unlimited access to all Pro-tier cursors, buttons, inputs and animations.
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-[12px] bg-[#C9A227]/10 border border-[#C9A227]/25 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span>One-time à la carte unlock</span>
                  <span className="font-mono font-medium text-slate-900">₹{(TIER_PRICE.premium / 100).toFixed(0)}</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Applies to this hotel only. Included in your monthly invoice.</p>
              </div>
            )}
            <div className="mt-6 flex items-center justify-end gap-2">
              <button onClick={() => setBuyModal(null)} className="px-4 py-2 rounded-full text-sm text-slate-600 hover:bg-slate-100" data-testid="buy-cancel">Cancel</button>
              {buyModal.option.tier === "pro" && tier !== "pro" ? (
                <button onClick={() => { setBuyModal(null); toast.info("Upgrade Pro from Settings → Subscription"); }} className="px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm" data-testid="buy-upgrade">Upgrade to Pro</button>
              ) : (
                <button onClick={purchase} className="px-5 py-2.5 rounded-full bg-[#C9A227] hover:bg-[#E6C868] text-slate-900 text-sm" data-testid="buy-confirm">Buy & apply</button>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
