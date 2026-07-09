import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PropertyMark } from "./PropertyMark";
import { useApp } from "@/context/AppContext";

const linkDefs = [
  { to: "/", key: "nav.home" },
  { to: "/rooms", key: "nav.rooms" },
  { to: "/experiences", key: "nav.experiences" },
  { to: "/dining", key: "nav.dining" },
  { to: "/spa", key: "nav.spa" },
  { to: "/gallery", key: "nav.gallery" },
];

export const Navbar = ({ transparent = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { t } = useApp();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !transparent || scrolled;
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        solid ? "glass py-4" : "bg-transparent py-6"
      }`}
      data-testid="site-navbar"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        <PropertyMark inverse={!solid} />
        <nav className="hidden lg:flex items-center gap-9" aria-label="Primary">
          {linkDefs.map((l) => {
            const label = t(l.key);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`text-[13px] tracking-wide link-underline transition-colors ${
                  solid
                    ? pathname === l.to
                      ? "text-slate-900 font-medium"
                      : "text-slate-600 hover:text-slate-900"
                    : "text-white/90 hover:text-white"
                }`}
                data-testid={`nav-${l.key.split(".")[1]}`}
                aria-current={pathname === l.to ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className={`hidden md:inline-flex items-center gap-2 text-[13px] tracking-wide transition-colors ${
              solid ? "text-slate-700 hover:text-slate-900" : "text-white/90 hover:text-white"
            }`}
            data-testid="nav-account"
            aria-label={t("nav.account")}
          >
            <i className="fa-regular fa-user text-xs" aria-hidden="true"></i>
            {t("nav.account")}
          </Link>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[13px] tracking-wide px-5 py-2.5 rounded-full shadow-[0_6px_20px_rgba(79,70,229,0.28)] hover:-translate-y-0.5 transition-all duration-300 press-scale"
            data-testid="nav-book-cta"
          >
            {t("nav.book")}
            <i className="fa-solid fa-arrow-right text-[10px]" aria-hidden="true"></i>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
