import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PropertyMark } from "./PropertyMark";
import { useApp } from "@/context/AppContext";
import { useGuestAuth } from "@/lib/guestAuth";
import { useTenant } from "@/tenants/TenantProvider";
import GuestAuthModal from "@/components/GuestAuthModal";

const allLinks = [
  { path: "", key: "nav.home", module: null },
  { path: "rooms", key: "nav.rooms", module: "rooms" },
  { path: "experiences", key: "nav.experiences", module: "experiences" },
  { path: "dining", key: "nav.dining", module: "dining" },
  { path: "spa", key: "nav.spa", module: "spa" },
  { path: "gallery", key: "nav.gallery", module: "gallery" },
];

export const Navbar = ({ transparent = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { t } = useApp();
  const { tenant } = useTenant();
  const { user, isAuthed, signOut } = useGuestAuth();
  const nav = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [authReason, setAuthReason] = useState(null);
  const [pendingRoute, setPendingRoute] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const slug = tenant?.slug || "aura";
  const modules = tenant?.enabledModules || {};
  const withTenant = (p) => `/t/${slug}${p ? "/" + p : ""}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const guarded = (route, reason) => (e) => {
    if (!isAuthed) {
      e.preventDefault();
      setAuthReason(reason);
      setPendingRoute(route);
      setAuthOpen(true);
    }
  };

  const onAuthed = () => {
    setAuthOpen(false);
    if (pendingRoute) { nav(pendingRoute); setPendingRoute(null); }
  };

  // Only render links for modules the tenant has enabled.
  const linkDefs = allLinks.filter((l) => !l.module || modules[l.module] !== false);

  const solid = !transparent || scrolled;
  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${solid ? "glass py-4" : "bg-transparent py-6"}`}
        data-testid="site-navbar"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          <PropertyMark inverse={!solid} />
          <nav className="hidden lg:flex items-center gap-9" aria-label="Primary">
            {linkDefs.map((l) => {
              const label = t(l.key);
              const to = withTenant(l.path);
              return (
                <Link
                  key={l.path || "home"}
                  to={to}
                  className={`text-[13px] tracking-wide link-underline transition-colors ${
                    solid
                      ? pathname === to
                        ? "text-brand-ink font-medium"
                        : "text-brand-ink-soft hover:text-brand-ink"
                      : "text-white/90 hover:text-white"
                  }`}
                  data-testid={`nav-${l.key.split(".")[1]}`}
                  aria-current={pathname === to ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            {isAuthed ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className={`hidden md:inline-flex items-center gap-2 text-[13px] tracking-wide transition-colors ${solid ? "text-brand-ink-soft hover:text-brand-ink" : "text-white/90 hover:text-white"}`}
                  data-testid="nav-account"
                >
                  <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                  <span className="max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                  <i className="fa-solid fa-chevron-down text-[9px]"></i>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-brand-surface-elev border border-brand-border rounded-[14px] shadow-[0_20px_50px_rgba(15,23,42,0.10)] py-1.5" data-testid="nav-account-menu">
                    <Link to={withTenant("dashboard")} onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-brand-ink hover:bg-brand-primary-soft" data-testid="nav-menu-dashboard">
                      <i className="fa-regular fa-user text-[11px] mr-2 text-brand-ink-soft"></i>My account
                    </Link>
                    <Link to={withTenant("booking")} onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-brand-ink hover:bg-brand-primary-soft" data-testid="nav-menu-book">
                      <i className="fa-solid fa-calendar-plus text-[11px] mr-2 text-brand-ink-soft"></i>New reservation
                    </Link>
                    <div className="border-t border-brand-border my-1"></div>
                    <button
                      onClick={() => { signOut(); setMenuOpen(false); nav(withTenant("")); }}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                      data-testid="nav-menu-signout"
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket text-[11px] mr-2"></i>Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => { setAuthReason("Sign in to view your reservations, itinerary and stay preferences."); setPendingRoute(withTenant("dashboard")); setAuthOpen(true); }}
                className={`hidden md:inline-flex items-center gap-2 text-[13px] tracking-wide transition-colors ${solid ? "text-brand-ink-soft hover:text-brand-ink" : "text-white/90 hover:text-white"}`}
                data-testid="nav-account"
                aria-label={t("nav.account")}
              >
                <i className="fa-regular fa-user text-xs" aria-hidden="true"></i>
                {t("nav.account")}
              </button>
            )}
            <Link
              to={withTenant("booking")}
              onClick={guarded(withTenant("booking"), "Sign in to complete your booking. It only takes a moment.")}
              className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-brand-primary-fg text-[13px] tracking-wide px-5 py-2.5 rounded-full shadow-[0_6px_20px_rgba(15,23,42,0.15)] hover:-translate-y-0.5 transition-all duration-300 press-scale"
              data-testid="nav-book-cta"
            >
              {t("nav.book")}
              <i className="fa-solid fa-arrow-right text-[10px]" aria-hidden="true"></i>
            </Link>
          </div>
        </div>
      </header>

      <GuestAuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={onAuthed} reason={authReason} />
    </>
  );
};

export default Navbar;
