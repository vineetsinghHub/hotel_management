import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useApp } from "@aura/shared/context/AppContext";

// Floating pill in the bottom-right on guest pages. Opens a compact popover
// for currency, language and theme. Persists via AppContext + localStorage.
// The `inline` prop lets us also embed it inside the Navbar (Sprint 15) so
// it's not a floating bottom-right element anymore. When inline, we drop the
// fixed positioning and use a subtle bordered pill sized for the navbar row.
export const CurrencyLanguagePill = ({ inline = false }) => {
  const { locale, setLocale, locales, currency, setCurrency, currencies, theme, setTheme, t } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const curObj = currencies.find((c) => c.key === currency) || currencies[0];
  const locObj = locales.find((l) => l.key === locale) || locales[0];

  const wrapperCls = inline
    ? "relative print:hidden"
    : "fixed bottom-20 right-6 z-[60] print:hidden";
  const panelCls = inline
    ? "absolute top-12 right-0 w-72 rounded-[18px] bg-white border border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.15)] p-4 dark-surface z-50"
    : "absolute bottom-14 right-0 w-72 rounded-[18px] bg-white border border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.15)] p-4 dark-surface";

  return (
    <div ref={ref} className={wrapperCls} data-testid="cur-lang-pill-wrap">
      {open && (
        <div
          className={panelCls}
          data-testid="cur-lang-panel"
          role="dialog"
          aria-label="Preferences"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-eyebrow text-brand-accent">{t("common.currency")}</p>
          <div className="mt-2 grid grid-cols-4 gap-2" data-testid="currency-grid">
            {currencies.map((c) => (
              <button
                key={c.key}
                onClick={() => { setCurrency(c.key); toast.success(`Currency → ${c.key}`); }}
                className={`px-2 py-2 rounded-[10px] text-xs font-mono border transition-all ${
                  currency === c.key
                    ? "bg-brand-primary text-white border-brand-primary"
                    : "bg-brand-surface text-slate-700 border-transparent hover:border-slate-200"
                }`}
                data-testid={`currency-${c.key}`}
                aria-pressed={currency === c.key}
              >
                {c.key}
              </button>
            ))}
          </div>
          <p className="text-eyebrow text-brand-accent mt-4">{t("common.language")}</p>
          <div className="mt-2 grid grid-cols-2 gap-2" data-testid="language-grid">
            {locales.map((l) => (
              <button
                key={l.key}
                onClick={() => { setLocale(l.key); toast.success(`Language → ${l.label}`); }}
                className={`px-3 py-2 rounded-[10px] text-xs border text-left flex items-center gap-2 transition-all ${
                  locale === l.key
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-brand-surface text-slate-700 border-transparent hover:border-slate-200"
                }`}
                data-testid={`locale-${l.key}`}
                aria-pressed={locale === l.key}
              >
                <span aria-hidden>{l.flag}</span>
                <span className="truncate">{l.label}</span>
              </button>
            ))}
          </div>
          <p className="text-eyebrow text-brand-accent mt-4">{t("common.theme")}</p>
          <div className="mt-2 grid grid-cols-3 gap-2" data-testid="theme-grid">
            {[
              { k: "light", i: "sun", l: t("common.light") },
              { k: "dark", i: "moon", l: t("common.dark") },
              { k: "system", i: "desktop", l: t("common.system") },
            ].map((it) => (
              <button
                key={it.k}
                onClick={() => setTheme(it.k)}
                className={`px-2 py-2 rounded-[10px] text-xs border flex items-center justify-center gap-1.5 transition-all ${
                  theme === it.k
                    ? "bg-brand-accent text-slate-900 border-brand-accent"
                    : "bg-brand-surface text-slate-700 border-transparent hover:border-slate-200"
                }`}
                data-testid={`theme-${it.k}`}
                aria-pressed={theme === it.k}
              >
                <i className={`fa-solid fa-${it.i} text-[10px]`}></i>
                {it.l}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className={inline
          ? "flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-[11px] tracking-wide transition-all"
          : "flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-slate-900 text-white shadow-[0_10px_28px_rgba(15,23,42,0.25)] hover:-translate-y-0.5 transition-all"
        }
        data-testid="cur-lang-pill"
        aria-label="Currency, language and theme"
        aria-expanded={open}
      >
        <span className={inline
          ? "w-5 h-5 rounded-full bg-slate-100 grid place-items-center text-[10px] font-mono text-slate-700"
          : "w-6 h-6 rounded-full bg-white/10 grid place-items-center text-[10px] font-mono"
        }>{curObj.symbol}</span>
        <span className="text-[11px] tracking-widest uppercase">{curObj.key} · {locObj.key.toUpperCase()}</span>
        <i className={`fa-solid fa-chevron-${open ? "up" : "down"} text-[9px]`}></i>
      </button>
    </div>
  );
};

export default CurrencyLanguagePill;
