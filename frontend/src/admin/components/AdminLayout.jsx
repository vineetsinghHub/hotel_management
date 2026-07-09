import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getAdminUser, clearAdminUser } from "@/admin/adminAuth";
import { hasAccess, roleLabel, roleColor } from "@/admin/roles";

const groups = [
  { label: "Operations", items: [
    { k: "dashboard", to: "/admin/dashboard", label: "Dashboard", icon: "gauge" },
    { k: "front-desk", to: "/admin/front-desk", label: "Front Desk", icon: "concierge-bell", badge: 30 },
    { k: "reservations", to: "/admin/reservations", label: "Reservations", icon: "calendar-days" },
    { k: "rooms", to: "/admin/rooms", label: "Rooms", icon: "bed" },
    { k: "guests", to: "/admin/guests", label: "Guests", icon: "user-group" },
    { k: "housekeeping", to: "/admin/housekeeping", label: "Housekeeping", icon: "broom", badge: 13 },
  ]},
  { label: "Services", items: [
    { k: "restaurant", to: "/admin/restaurant", label: "Restaurant", icon: "utensils" },
    { k: "spa", to: "/admin/spa", label: "Spa", icon: "spa" },
    { k: "events", to: "/admin/events", label: "Events", icon: "calendar-heart" },
    { k: "inventory", to: "/admin/inventory", label: "Inventory", icon: "boxes-stacked" },
  ]},
  { label: "Business", items: [
    { k: "staff", to: "/admin/staff", label: "Staff", icon: "id-badge" },
    { k: "invoices", to: "/admin/invoices", label: "Invoices", icon: "file-invoice-dollar" },
    { k: "marketing", to: "/admin/marketing", label: "Marketing", icon: "bullhorn" },
    { k: "reviews", to: "/admin/reviews", label: "Reviews", icon: "star" },
  ]},
  { label: "Insights", items: [
    { k: "reports", to: "/admin/reports", label: "Reports", icon: "chart-line" },
    { k: "notifications", to: "/admin/notifications", label: "Notifications", icon: "bell" },
    { k: "settings", to: "/admin/settings", label: "Settings", icon: "gear" },
  ]},
];

export const AdminLayout = ({ pageTitle, children }) => {
  const user = getAdminUser();
  const nav = useNavigate();
  const loc = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const doLogout = () => { clearAdminUser(); toast.success("Signed out"); nav("/admin/login"); };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex" data-testid="admin-layout">
      {/* Sidebar */}
      <aside className={`flex flex-col w-64 bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-40 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`} data-testid="admin-sidebar">
        <div className="px-5 py-5 border-b border-slate-100 flex items-center gap-2">
          <span className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#4F46E5] to-[#312E81] text-white grid place-items-center font-serif text-lg">A</span>
          <div className="leading-tight">
            <p className="font-serif text-slate-900 text-sm">Aura Console</p>
            <p className="text-[10px] tracking-widest uppercase text-slate-400">Heritage Palace</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          {groups.map((g) => {
            const visible = g.items.filter((it) => user && hasAccess(it.k, user.role));
            if (visible.length === 0) return null;
            return (
              <div key={g.label} className="mb-3">
                <p className="px-5 mb-1 text-[9px] tracking-[0.22em] uppercase text-slate-400 font-medium">{g.label}</p>
                {visible.map((it) => {
                  const active = loc.pathname === it.to;
                  return (
                    <Link key={it.k} to={it.to} onClick={() => setMobileOpen(false)}
                      className={`mx-3 px-3 py-2 rounded-[10px] text-sm flex items-center gap-3 transition-all ${active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                      data-testid={`nav-${it.k}`}
                    >
                      <i className={`fa-solid fa-${it.icon} text-[11px] w-4`}></i>
                      <span className="flex-1">{it.label}</span>
                      {it.badge != null && <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-[#C9A227]/15 text-[#C9A227]"}`}>{it.badge}</span>}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Profile */}
        {user && (
          <div className="p-3 border-t border-slate-100 relative">
            <button onClick={() => setProfileOpen((v) => !v)} className="w-full flex items-center gap-3 p-2 rounded-[12px] hover:bg-slate-50" data-testid="profile-toggle">
              <span className="relative">
                <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full grid place-items-center" style={{ backgroundColor: roleColor(user.role) }}>
                  <i className="fa-solid fa-shield text-white text-[7px]"></i>
                </span>
              </span>
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm text-slate-900 font-medium truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{roleLabel(user.role)}</p>
              </div>
              <i className="fa-solid fa-chevron-up text-[9px] text-slate-400"></i>
            </button>
            {profileOpen && (
              <div className="absolute bottom-full left-3 right-3 mb-1 bg-white border border-slate-200 rounded-[12px] shadow-[0_12px_32px_rgba(15,23,42,0.10)] py-2" data-testid="profile-menu">
                <Link to="/admin/settings" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Profile & settings</Link>
                <a href="/" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Guest site ↗</a>
                <button onClick={doLogout} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50" data-testid="logout-btn">Sign out</button>
              </div>
            )}
          </div>
        )}
      </aside>
      {mobileOpen && <div onClick={() => setMobileOpen(false)} className="lg:hidden fixed inset-0 bg-slate-900/40 z-30"></div>}

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 bg-[#FAFAF8]/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} data-testid="hamburger-btn" aria-label="Open menu" className="lg:hidden w-9 h-9 rounded-full border border-slate-200 grid place-items-center">
              <i className="fa-solid fa-bars text-xs text-slate-600"></i>
            </button>
            <h1 className="font-serif text-xl text-slate-900" data-testid="page-title">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 w-96 max-w-full">
              <i className="fa-solid fa-magnifying-glass text-xs text-slate-400"></i>
              <input placeholder="Search or jump to..." className="flex-1 text-sm outline-none bg-transparent" />
              <kbd className="text-[10px] text-slate-400 border border-slate-200 rounded px-1.5">⌘K</kbd>
            </div>
            <button className="w-9 h-9 rounded-full border border-slate-200 hover:bg-white grid place-items-center" title="Help">
              <i className="fa-regular fa-circle-question text-xs text-slate-600"></i>
            </button>
            <button className="w-9 h-9 rounded-full border border-slate-200 hover:bg-white grid place-items-center relative">
              <i className="fa-regular fa-bell text-xs text-slate-600"></i>
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-mono grid place-items-center">3</span>
            </button>
            <button onClick={() => toast.info("Choose an action from the module")} className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm px-4 py-2 rounded-full shadow-[0_6px_20px_rgba(79,70,229,0.28)]" data-testid="new-btn">
              <i className="fa-solid fa-plus text-[10px]"></i>New
            </button>
          </div>
        </header>
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
