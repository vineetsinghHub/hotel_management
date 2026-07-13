import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getAdminUser, clearAdminUser, seedUsers } from "@/admin/adminAuth";
import { hasAccess, roleLabel, roleColor } from "@/admin/roles";
import { arrivals, roomsInventory, guests, notificationsAdmin } from "@/admin/adminMockData";
import { isProModule, isPro } from "@/admin/tier";
import { ProBadge } from "@/admin/components/TierGate";
import AdminOnboardingTour from "@/admin/components/AdminOnboardingTour";
import AdminQuickCreateModal from "@/admin/components/AdminQuickCreateModal";
import AdminFloatingActions from "@/admin/components/AdminFloatingActions";

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
    { k: "messages", to: "/admin/messages", label: "Messages", icon: "comments" },
    { k: "reviews", to: "/admin/reviews", label: "Reviews", icon: "star" },
  ]},
  { label: "Revenue", items: [
    { k: "rate-channel", to: "/admin/rate-channel", label: "Rate & Channel", icon: "money-bill-trend-up" },
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
                  const proBadge = isProModule(it.k);
                  return (
                    <Link key={it.k} to={it.to} onClick={() => setMobileOpen(false)}
                      className={`mx-3 px-3 py-2 rounded-[10px] text-sm flex items-center gap-3 transition-all ${active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                      data-testid={`nav-${it.k}`}
                    >
                      <i className={`fa-solid fa-${it.icon} text-[11px] w-4`}></i>
                      <span className="flex-1">{it.label}</span>
                      {proBadge && <ProBadge />}
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
                <div className="flex items-center gap-1.5">
                  <p className="text-[10px] text-slate-500 truncate">{roleLabel(user.role)}</p>
                  <span className={`text-[8px] tracking-[0.15em] uppercase font-medium px-1.5 py-0.5 rounded-[4px] ${isPro() ? "bg-gradient-to-r from-[#C9A227] to-[#E6C868] text-slate-900" : "bg-slate-200 text-slate-600"}`} data-testid="tier-pill">
                    {isPro() ? "Pro" : "Basic"}
                  </span>
                </div>
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

      <TopbarAndMain pageTitle={pageTitle} onOpenMobile={() => setMobileOpen(true)}>{children}</TopbarAndMain>
      <AdminOnboardingTour />
    </div>
  );
};

const TopbarAndMain = ({ pageTitle, onOpenMobile, children }) => {
  const nav = useNavigate();
  const user = getAdminUser();
  const [searchOpen, setSearchOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [quickEntity, setQuickEntity] = useState(null);
  const [notifs, setNotifs] = useState(notificationsAdmin);
  const unread = notifs.filter((n) => !n.read).length;

  const newItems = [
    { l: "New Reservation", i: "calendar-plus", entity: "reservation", perm: "reservations" },
    { l: "New Guest", i: "user-plus", entity: "guest", perm: "guests" },
    { l: "New Staff", i: "id-badge", entity: "staff", perm: "staff" },
    { l: "New Invoice", i: "file-invoice-dollar", entity: "invoice", perm: "invoices" },
    { l: "New Event", i: "calendar-heart", entity: "event", perm: "events" },
    { l: "New Menu Item", i: "utensils", entity: "menu", perm: "restaurant" },
    { l: "New Campaign", i: "bullhorn", entity: "campaign", perm: "marketing" },
  ].filter((it) => !user || hasAccess(it.perm, user.role));

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "Escape") { setSearchOpen(false); setHelpOpen(false); setNotifOpen(false); setNewOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex-1 lg:ml-64">
      <header className="sticky top-0 z-30 bg-[#FAFAF8]/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onOpenMobile} data-testid="hamburger-btn" aria-label="Open menu" className="lg:hidden w-9 h-9 rounded-full border border-slate-200 grid place-items-center"><i className="fa-solid fa-bars text-xs text-slate-600"></i></button>
          <h1 className="font-serif text-xl text-slate-900" data-testid="page-title">{pageTitle}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setSearchOpen(true)} className="hidden md:flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 w-96 text-left" data-testid="search-toggle">
            <i className="fa-solid fa-magnifying-glass text-xs text-slate-400"></i>
            <span className="flex-1 text-sm text-slate-400">Search or jump to...</span>
            <kbd className="text-[10px] text-slate-400 border border-slate-200 rounded px-1.5">⌘K</kbd>
          </button>
          <button onClick={() => setHelpOpen(true)} className="w-9 h-9 rounded-full border border-slate-200 hover:bg-white grid place-items-center" data-testid="help-toggle"><i className="fa-regular fa-circle-question text-xs text-slate-600"></i></button>
          <div className="relative">
            <button onClick={() => setNotifOpen((v) => !v)} className="w-9 h-9 rounded-full border border-slate-200 hover:bg-white grid place-items-center relative" data-testid="notif-toggle">
              <i className="fa-regular fa-bell text-xs text-slate-600"></i>
              {unread > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-mono grid place-items-center">{unread}</span>}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-slate-200 rounded-[16px] shadow-[0_20px_50px_rgba(15,23,42,0.10)] p-4 z-40" data-testid="notif-dropdown">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-serif text-lg text-slate-900">Notifications</p>
                  <button onClick={() => { setNotifs((s) => s.map((n) => ({ ...n, read: true }))); toast.success("All read"); }} className="text-xs text-[#4F46E5] hover:underline" data-testid="topbar-mark-all">Mark all read</button>
                </div>
                <ul className="space-y-2 max-h-80 overflow-y-auto">
                  {notifs.slice(0, 5).map((n) => (
                    <li key={n.id} className={`p-3 rounded-[12px] flex items-start gap-3 ${!n.read ? "bg-indigo-50/40" : ""}`}>
                      <span className="w-8 h-8 rounded-full bg-[#4F46E5]/12 text-[#4F46E5] grid place-items-center"><i className="fa-solid fa-bell text-[11px]"></i></span>
                      <div className="flex-1"><p className="text-sm text-slate-900">{n.title}</p><p className="text-xs text-slate-500 mt-0.5">{n.body}</p><p className="text-[10px] text-slate-400 mt-0.5">{n.when}</p></div>
                      <button onClick={() => setNotifs((s) => s.filter((x) => x.id !== n.id))} className="text-slate-400 hover:text-rose-500 text-xs" data-testid={`topbar-dismiss-${n.id}`}><i className="fa-solid fa-xmark"></i></button>
                    </li>
                  ))}
                </ul>
                <Link to="/admin/notifications" onClick={() => setNotifOpen(false)} className="mt-3 block text-center text-xs text-[#4F46E5] hover:underline">Open notifications center →</Link>
              </div>
            )}
          </div>
          <div className="relative">
            {newItems.length > 0 && (
              <button onClick={() => setNewOpen((v) => !v)} className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm px-4 py-2 rounded-full shadow-[0_6px_20px_rgba(79,70,229,0.28)]" data-testid="new-btn"><i className="fa-solid fa-plus text-[10px]"></i>New</button>
            )}
            {newOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-[16px] shadow-[0_20px_50px_rgba(15,23,42,0.10)] py-2 z-40" data-testid="new-menu">
                {newItems.length === 0 && (
                  <p className="px-4 py-3 text-xs text-slate-400">No quick-create actions available for your role.</p>
                )}
                {newItems.map((it) => (
                  <button key={it.l} onClick={() => { setNewOpen(false); setQuickEntity(it.entity); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3" data-testid={`new-${it.entity}`}>
                    <span className="w-7 h-7 rounded-full bg-[#C9A227]/12 text-[#C9A227] grid place-items-center"><i className={`fa-solid fa-${it.i} text-[11px]`}></i></span>
                    {it.l}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="p-6 md:p-8">{children}</main>

      {searchOpen && <SearchPalette onClose={() => setSearchOpen(false)} user={user} />}
      {helpOpen && <HelpDrawer onClose={() => setHelpOpen(false)} />}
      {quickEntity && <AdminQuickCreateModal entity={quickEntity} onClose={() => setQuickEntity(null)} />}
      <AdminFloatingActions />
    </div>
  );
};

const SearchPalette = ({ onClose, user }) => {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const allPages = [
    { l: "Dashboard", to: "/admin/dashboard", k: "dashboard" }, { l: "Front Desk", to: "/admin/front-desk", k: "front-desk" },
    { l: "Reservations", to: "/admin/reservations", k: "reservations" }, { l: "Rooms", to: "/admin/rooms", k: "rooms" },
    { l: "Guests", to: "/admin/guests", k: "guests" }, { l: "Housekeeping", to: "/admin/housekeeping", k: "housekeeping" },
    { l: "Restaurant", to: "/admin/restaurant", k: "restaurant" }, { l: "Spa", to: "/admin/spa", k: "spa" },
    { l: "Events", to: "/admin/events", k: "events" }, { l: "Inventory", to: "/admin/inventory", k: "inventory" },
    { l: "Staff", to: "/admin/staff", k: "staff" }, { l: "Invoices", to: "/admin/invoices", k: "invoices" },
    { l: "Rate & Channel", to: "/admin/rate-channel", k: "rate-channel" },
    { l: "Marketing", to: "/admin/marketing", k: "marketing" }, { l: "Reviews", to: "/admin/reviews", k: "reviews" },
    { l: "Reports", to: "/admin/reports", k: "reports" }, { l: "Notifications", to: "/admin/notifications", k: "notifications" },
    { l: "Settings", to: "/admin/settings", k: "settings" },
  ];
  const pages = user ? allPages.filter((p) => hasAccess(p.k, user.role)) : allPages;
  const results = useMemo(() => {
    if (!q.trim()) return [];
    const s = q.toLowerCase(); const out = [];
    pages.forEach((p) => { if (p.l.toLowerCase().includes(s)) out.push({ type: "Page", l: p.l, to: p.to }); });
    arrivals.forEach((a) => { if (a.id.toLowerCase().includes(s) || a.guest.toLowerCase().includes(s)) out.push({ type: "Reservation", l: `${a.guest} · ${a.id}`, to: "/admin/reservations" }); });
    guests.forEach((g) => { if (g.name.toLowerCase().includes(s) || g.id.toLowerCase().includes(s)) out.push({ type: "Guest", l: `${g.name} · ${g.id}`, to: "/admin/guests" }); });
    roomsInventory.forEach((r) => { if (r.number.includes(s) || r.type.toLowerCase().includes(s)) out.push({ type: "Room", l: `Room ${r.number} · ${r.type}`, to: "/admin/rooms" }); });
    seedUsers.forEach((u) => { if (u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)) out.push({ type: "Staff", l: `${u.name} · ${u.email}`, to: "/admin/staff" }); });
    return out.slice(0, 12);
  }, [q]);
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} data-testid="search-palette">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl bg-white rounded-[20px] shadow-[0_40px_100px_rgba(15,23,42,0.35)] overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type to search reservations, guests, rooms, staff, pages..." className="flex-1 text-sm outline-none" data-testid="search-input" />
          <kbd className="text-[10px] text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">esc</kbd>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {!q.trim() ? (
            <div className="p-6 text-sm text-slate-500">
              <p className="text-eyebrow text-slate-400 mb-3">Quick access</p>
              <div className="grid grid-cols-2 gap-2">
                {pages.slice(0, 8).map((p) => (
                  <button key={p.to} onClick={() => { nav(p.to); onClose(); }} className="text-left px-3 py-2 rounded-[10px] hover:bg-slate-50 text-slate-700">{p.l}</button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="p-6 text-sm text-slate-500 text-center">No results for &ldquo;{q}&rdquo;</p>
          ) : (
            <ul>
              {results.map((r, i) => (
                <li key={i}>
                  <button onClick={() => { nav(r.to); onClose(); }} className="w-full text-left px-5 py-3 hover:bg-[#FAFAF8] flex items-center gap-3 border-t border-slate-100" data-testid={`search-result-${i}`}>
                    <span className="text-[10px] tracking-widest uppercase text-[#C9A227] w-24">{r.type}</span>
                    <span className="text-sm text-slate-900 flex-1">{r.l}</span>
                    <i className="fa-solid fa-arrow-right text-[10px] text-slate-400"></i>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const HelpDrawer = ({ onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-stretch justify-end bg-slate-900/60 backdrop-blur-sm" onClick={onClose} data-testid="help-drawer">
    <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white h-full overflow-y-auto p-8 shadow-[0_40px_100px_rgba(15,23,42,0.35)]">
      <div className="flex items-center justify-between">
        <div><p className="text-eyebrow text-[#C9A227]">Help</p><h3 className="mt-1 font-serif text-2xl text-slate-900">Shortcuts & Docs</h3></div>
        <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center" data-testid="help-close"><i className="fa-solid fa-xmark text-slate-500 text-sm"></i></button>
      </div>
      <p className="text-eyebrow text-slate-500 mt-8">Keyboard shortcuts</p>
      <ul className="mt-3 space-y-2 text-sm">
        {[["Open command palette", "⌘K"], ["Go to Dashboard", "G D"], ["Go to Reservations", "G R"], ["Go to Rooms", "G O"], ["Go to Guests", "G U"], ["New reservation", "N R"], ["Close modal / dropdown", "Esc"]].map(([l, k]) => (
          <li key={l} className="flex items-center justify-between py-2 border-b border-slate-100"><span className="text-slate-700">{l}</span><kbd className="text-[10px] text-slate-500 border border-slate-200 rounded px-2 py-0.5 font-mono">{k}</kbd></li>
        ))}
      </ul>
      <p className="text-eyebrow text-slate-500 mt-8">Guides</p>
      <ul className="mt-3 space-y-2 text-sm">
        {["Front desk daily flow", "How role permissions work", "Managing the folio & extras", "Setting up rate plans", "Responding to reviews"].map((g) => (
          <li key={g}><a href="#" className="flex items-center justify-between py-2 text-slate-700 hover:text-slate-900"><span>{g}</span><i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-400"></i></a></li>
        ))}
      </ul>
      <div className="mt-8 p-4 rounded-[14px] bg-[#FAFAF8] border border-slate-100">
        <p className="text-sm text-slate-900">Still need help?</p>
        <p className="text-xs text-slate-500 mt-1">Ping the Aura ops channel or email <span className="font-mono">ops@aurahotels.com</span></p>
      </div>
    </div>
  </div>
);

export default AdminLayout;
