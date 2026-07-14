import { useEffect } from "react";
import "@/App.css";
import "@/print.css";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";

import { AppProvider } from "@/context/AppContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import CurrencyLanguagePill from "@/components/CurrencyLanguagePill";
import { queryClient } from "@/lib/queryClient";
import { TenantProvider } from "@/tenants/TenantProvider";
import TenantSwitcher from "@/tenants/TenantSwitcher";
import GuestGlobalWidgets from "@/components/guest/GuestGlobalWidgets";

import Home from "@/pages/Home";
import RoomsPage from "@/pages/Rooms";
import Booking from "@/pages/Booking";
import Payment from "@/pages/Payment";
import Confirmation from "@/pages/Confirmation";
import Dashboard from "@/pages/Dashboard";
import Experiences from "@/pages/Experiences";
import Dining from "@/pages/Dining";
import Spa from "@/pages/Spa";
import GalleryContact from "@/pages/GalleryContact";

import AdminLogin from "@/admin/pages/AdminLogin";
import AdminDashboard from "@/admin/pages/AdminDashboard";
import FrontDesk from "@/admin/pages/FrontDesk";
import Reservations from "@/admin/pages/Reservations";
import AdminRooms from "@/admin/pages/Rooms";
import Guests from "@/admin/pages/Guests";
import Housekeeping from "@/admin/pages/Housekeeping";
import Restaurant from "@/admin/pages/Restaurant";
import AdminSpa from "@/admin/pages/AdminSpa";
import Events from "@/admin/pages/Events";
import Inventory from "@/admin/pages/Inventory";
import Staff from "@/admin/pages/Staff";
import Invoices from "@/admin/pages/Invoices";
import RateChannel from "@/admin/pages/RateChannel";
import Marketing from "@/admin/pages/Marketing";
import MessageCenter from "@/admin/pages/MessageCenter";
import Reviews from "@/admin/pages/Reviews";
import Reports from "@/admin/pages/Reports";
import Notifications from "@/admin/pages/Notifications";
import AdminSettings from "@/admin/pages/Settings";
import ProtectedAdmin from "@/admin/ProtectedAdmin";
import RequireGuestAuth from "@/components/RequireGuestAuth";

import SuperLogin from "@/superAdmin/pages/SuperLogin";
import SuperOverview from "@/superAdmin/pages/SuperOverview";
import SuperTenants from "@/superAdmin/pages/SuperTenants";
import SuperTenantDetail from "@/superAdmin/pages/SuperTenantDetail";
import SuperProvision from "@/superAdmin/pages/SuperProvision";
import SuperFlags from "@/superAdmin/pages/SuperFlags";
import SuperBilling from "@/superAdmin/pages/SuperBilling";
import SuperAudit from "@/superAdmin/pages/SuperAudit";
import { ProtectedSuperAdmin } from "@/superAdmin/SuperAdminLayout";

// Guest-site layout that wraps every /t/:slug/* route with the TenantProvider.
// The provider reads useParams().slug, loads that tenant's config into the
// zustand store, and applies its theme via CSS variables on <html>.
const GuestShell = () => (
  <TenantProvider>
    <Outlet />
    <GuestGlobalWidgets />
    <TenantSwitcher />
  </TenantProvider>
);

const guestRoutes = [
  { path: "", element: <Home /> },
  { path: "rooms", element: <RoomsPage /> },
  { path: "booking", element: <RequireGuestAuth reason="Sign in to complete your reservation."><Booking /></RequireGuestAuth> },
  { path: "payment", element: <RequireGuestAuth reason="Sign in to review your invoice and pay securely."><Payment /></RequireGuestAuth> },
  { path: "confirmation", element: <RequireGuestAuth reason="Sign in to see your reservation confirmation."><Confirmation /></RequireGuestAuth> },
  { path: "dashboard", element: <RequireGuestAuth reason="Sign in to view your reservations, itinerary and stay preferences."><Dashboard /></RequireGuestAuth> },
  { path: "experiences", element: <Experiences /> },
  { path: "dining", element: <Dining /> },
  { path: "spa", element: <Spa /> },
  { path: "gallery", element: <GalleryContact /> },
];

// Admin route table — mounted at both /t/:slug/admin/* (canonical, tenant-scoped)
// and /admin/* (legacy alias that redirects to /t/aura/admin/*).
const adminRoutes = [
  { path: "dashboard", key: "dashboard", Component: AdminDashboard },
  { path: "front-desk", key: "front-desk", Component: FrontDesk },
  { path: "reservations", key: "reservations", Component: Reservations },
  { path: "rooms", key: "rooms", Component: AdminRooms },
  { path: "guests", key: "guests", Component: Guests },
  { path: "housekeeping", key: "housekeeping", Component: Housekeeping },
  { path: "restaurant", key: "restaurant", Component: Restaurant },
  { path: "spa", key: "spa", Component: AdminSpa },
  { path: "events", key: "events", Component: Events },
  { path: "inventory", key: "inventory", Component: Inventory },
  { path: "staff", key: "staff", Component: Staff },
  { path: "invoices", key: "invoices", Component: Invoices },
  { path: "rate-channel", key: "rate-channel", Component: RateChannel },
  { path: "marketing", key: "marketing", Component: Marketing },
  { path: "messages", key: "messages", Component: MessageCenter },
  { path: "reviews", key: "reviews", Component: Reviews },
  { path: "reports", key: "reports", Component: Reports },
  { path: "notifications", key: "notifications", Component: Notifications },
  { path: "settings", key: "settings", Component: AdminSettings },
];

// Tenant-scoped admin shell — wraps every /t/:slug/admin/* route in the
// TenantProvider so ProtectedAdmin + AdminLayout can access useTenant()
// (tier, enabledModules, brand tokens) for per-hotel gating.
const AdminShell = () => (
  <TenantProvider>
    <Outlet />
  </TenantProvider>
);

function App() {
  useEffect(() => { document.title = "Aura Hotels | Timeless Heritage & Luxury"; }, []);
  const guarded = (key, Comp) => <ProtectedAdmin routeKey={key}><Comp /></ProtectedAdmin>;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <div className="App">
            <a href="#main-content" className="skip-link" data-testid="skip-link">Skip to content</a>
            <BrowserRouter>
              <Toaster position="top-center" richColors />
              <main id="main-content">
                <Routes>
                  {/* ── Multi-tenant guest storefront under /t/:slug/… ── */}
                  <Route path="/t/:slug" element={<GuestShell />}>
                    {guestRoutes.map((r) => (
                      <Route key={r.path || "index"} index={r.path === ""} path={r.path || undefined} element={r.element} />
                    ))}
                  </Route>

                  {/* ── Legacy no-slug routes redirect to default tenant ── */}
                  <Route path="/" element={<Navigate to="/t/aura" replace />} />
                  {guestRoutes.filter((r) => r.path).map((r) => (
                    <Route key={r.path} path={`/${r.path}`} element={<Navigate to={`/t/aura/${r.path}`} replace />} />
                  ))}

                  {/* ── Admin (PMS) — canonical per-tenant routes ── */}
                  <Route path="/t/:slug/admin" element={<AdminShell />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="login" element={<AdminLogin />} />
                    {adminRoutes.map(({ path, key, Component }) => (
                      <Route key={path} path={path} element={guarded(key, Component)} />
                    ))}
                  </Route>

                  {/* ── Legacy /admin/* → redirects to default tenant (aura) ── */}
                  <Route path="/admin" element={<Navigate to="/t/aura/admin/dashboard" replace />} />
                  <Route path="/admin/login" element={<Navigate to="/t/aura/admin/login" replace />} />
                  {adminRoutes.map(({ path }) => (
                    <Route key={`legacy-${path}`} path={`/admin/${path}`} element={<Navigate to={`/t/aura/admin/${path}`} replace />} />
                  ))}

                  {/* ── Super Admin (SaaS control plane) ── */}
                  <Route path="/super-admin" element={<Navigate to="/super-admin/overview" replace />} />
                  <Route path="/super-admin/login" element={<SuperLogin />} />
                  <Route path="/super-admin/overview" element={<ProtectedSuperAdmin><SuperOverview /></ProtectedSuperAdmin>} />
                  <Route path="/super-admin/tenants" element={<ProtectedSuperAdmin><SuperTenants /></ProtectedSuperAdmin>} />
                  <Route path="/super-admin/tenants/:slug" element={<ProtectedSuperAdmin><SuperTenantDetail /></ProtectedSuperAdmin>} />
                  <Route path="/super-admin/provision" element={<ProtectedSuperAdmin><SuperProvision /></ProtectedSuperAdmin>} />
                  <Route path="/super-admin/flags" element={<ProtectedSuperAdmin><SuperFlags /></ProtectedSuperAdmin>} />
                  <Route path="/super-admin/billing" element={<ProtectedSuperAdmin><SuperBilling /></ProtectedSuperAdmin>} />
                  <Route path="/super-admin/audit" element={<ProtectedSuperAdmin><SuperAudit /></ProtectedSuperAdmin>} />
                </Routes>
              </main>
              <GuestOnlyPill />
            </BrowserRouter>
          </div>
        </AppProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

// Only mount the pill on guest-site routes (not /admin/* or /super-admin/*)
const GuestOnlyPill = () => {
  const p = typeof window !== "undefined" ? window.location.pathname : "";
  if (p.startsWith("/admin") || p.startsWith("/super-admin")) return null;
  return <CurrencyLanguagePill />;
};

export default App;
