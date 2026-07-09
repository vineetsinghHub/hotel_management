import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LOCALES, CURRENCIES, t } from "@/i18n/translations";

const KEY_THEME = "aura_theme";
const KEY_LOCALE = "aura_locale";
const KEY_CURRENCY = "aura_currency";
const KEY_WISHLIST = "aura_wishlist";

const AppContext = createContext(null);

const getStored = (k, fallback) => {
  try {
    const v = localStorage.getItem(k);
    return v == null ? fallback : JSON.parse(v);
  } catch (e) {
    return fallback;
  }
};

export const AppProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => getStored(KEY_THEME, "system"));
  const [locale, setLocaleState] = useState(() => getStored(KEY_LOCALE, "en"));
  const [currency, setCurrencyState] = useState(() => getStored(KEY_CURRENCY, "USD"));
  const [wishlist, setWishlist] = useState(() => getStored(KEY_WISHLIST, []));

  // Apply theme to <html>. "system" follows prefers-color-scheme live.
  useEffect(() => {
    const root = document.documentElement;
    const mm = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const isDark = theme === "dark" || (theme === "system" && mm.matches);
      root.classList.toggle("dark", isDark);
      root.setAttribute("data-theme", isDark ? "dark" : "light");
      root.style.colorScheme = isDark ? "dark" : "light";
    };
    apply();
    if (theme === "system") {
      mm.addEventListener("change", apply);
      return () => mm.removeEventListener("change", apply);
    }
  }, [theme]);

  useEffect(() => { localStorage.setItem(KEY_THEME, JSON.stringify(theme)); }, [theme]);
  useEffect(() => { localStorage.setItem(KEY_LOCALE, JSON.stringify(locale)); }, [locale]);
  useEffect(() => { localStorage.setItem(KEY_CURRENCY, JSON.stringify(currency)); }, [currency]);
  useEffect(() => { localStorage.setItem(KEY_WISHLIST, JSON.stringify(wishlist)); }, [wishlist]);

  const setTheme = (v) => setThemeState(v);
  const toggleTheme = () => setThemeState((s) => (s === "dark" ? "light" : "dark"));
  const setLocale = (v) => setLocaleState(v);
  const setCurrency = (v) => setCurrencyState(v);

  // Wishlist helpers
  const isWishlisted = (id) => wishlist.includes(id);
  const toggleWishlist = (id) => setWishlist((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  // i18n helper bound to current locale
  const tt = (key) => t(locale, key);

  // Currency helpers
  const cur = useMemo(() => CURRENCIES.find((c) => c.key === currency) || CURRENCIES[0], [currency]);
  const formatPrice = (usdAmount, { showSymbol = true, decimals } = {}) => {
    if (usdAmount == null || isNaN(usdAmount)) return "";
    const value = Number(usdAmount) * cur.rate;
    const d = decimals == null ? (cur.key === "USD" || cur.key === "EUR" ? (Math.abs(value) < 10 ? 2 : 0) : 0) : decimals;
    const formatted = value.toLocaleString(cur.locale, { minimumFractionDigits: d, maximumFractionDigits: d });
    if (!showSymbol) return formatted;
    return cur.key === "AED" ? `${cur.symbol} ${formatted}` : `${cur.symbol}${formatted}`;
  };

  const value = {
    theme, setTheme, toggleTheme,
    locale, setLocale, locales: LOCALES,
    currency, setCurrency, currencies: CURRENCIES, cur,
    formatPrice, t: tt,
    wishlist, isWishlisted, toggleWishlist,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
};

export const useI18n = () => useApp().t;
export const useCurrency = () => {
  const { formatPrice, cur, currency, setCurrency, currencies } = useApp();
  return { formatPrice, cur, currency, setCurrency, currencies };
};
export const useTheme = () => {
  const { theme, setTheme, toggleTheme } = useApp();
  return { theme, setTheme, toggleTheme };
};
export const useWishlist = () => {
  const { wishlist, isWishlisted, toggleWishlist } = useApp();
  return { wishlist, isWishlisted, toggleWishlist };
};
