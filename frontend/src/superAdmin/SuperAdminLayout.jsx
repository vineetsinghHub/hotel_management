import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { getSuperAdmin, useSuperAdminAuth } from "@/superAdmin/superAdminAuth";
import { toast } from "sonner";

export const ProtectedSuperAdmin = ({ children }) => {
  const user = getSuperAdmin();
  if (!user) return <Navigate to="/super-admin/login" replace />;
  return children;
};

const NAV = [
  { to: "/super-admin/overview", label: "Overview", icon: "chart-line" },
  { to: "/super-admin/tenants", label: "Tenants", icon: "building" },
  { to: "/super-admin/provision", label: "Provision", icon: "plus-circle" },
  { to: "/super-admin/flags", label: "Feature Flags", icon: "flag" },
  { to: "/super-admin/billing", label: "Billing", icon: "receipt" },
  { to: "/super-admin/audit", label: "Audit Log", icon: "clock-rotate-left" },
];

export const SuperAdminLayout = ({ pageTitle, children, rightSlot }) => {
  const { user, signOut } = useSuperAdminAuth();
  const { pathname } = useLocation();
  const nav = useNavigate();
  const doLogout = () => { signOut(); toast.success("Signed out"); nav("/super-admin/login"); };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100" data-testid="super-admin-shell">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-white/5 bg-slate-950">
        <div className="p-6 border-b border-white/5">
          <p className="text-eyebrow text-[#C9A227]">Platform</p>
          <div className="mt-2 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#4F46E5] to-[#C9A227] grid place-items-center">
              <i className="fa-solid fa-bolt text-slate-900 text-xs"></i>
            </span>
            <div>
              <p className="font-serif text-lg leading-none text-white">Aura Ops</p>
              <p className="text-[10px] text-slate-500 tracking-widest uppercase mt-0.5">Super Admin</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-3 space-y-1">
          {NAV.map((n) => {
            const active = pathname === n.to || pathname.startsWith(n.to + "/");
            return (
              <Link key={n.to} to={n.to}
                className={`mx-3 px-3 py-2 rounded-[10px] text-sm flex items-center gap-3 transition-all ${active ? "bg-[#4F46E5] text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
                data-testid={`super-nav-${n.to.split("/").pop()}`}
              >
                <i className={`fa-solid fa-${n.icon} text-[11px] w-4`}></i>
                <span className="flex-1">{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5 flex items-center gap-3">
          {user && <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{user?.role}</p>
          </div>
          <button onClick={doLogout} className="w-8 h-8 rounded-full hover:bg-white/10 grid place-items-center text-slate-400 hover:text-white" aria-label="Sign out" data-testid="super-signout">
            <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="px-6 md:px-10 py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-widest uppercase text-slate-500">Aura SaaS Platform</p>
            <h1 className="font-serif text-2xl text-white mt-0.5">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-2">{rightSlot}</div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950">{children}</div>
      </main>
    </div>
  );
};

export default SuperAdminLayout;
