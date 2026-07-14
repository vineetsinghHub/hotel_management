import { useEffect } from "react";
import "@aura/ui-core/global.css";
import "@aura/ui-core/print.css";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";

import { AppProvider } from "@aura/shared/context/AppContext";
import ErrorBoundary from "@aura/b2c-engine/components/ErrorBoundary";
import { queryClient } from "@aura/shared/lib/queryClient";
import { TenantProvider } from "@aura/shared/tenants/TenantProvider";
import TenantSwitcher from "@aura/shared/tenants/TenantSwitcher";
import GuestGlobalWidgets from "@aura/b2c-engine/components/guest/GuestGlobalWidgets";

import Home from "@aura/b2c-engine/pages/Home";
import RoomsPage from "@aura/b2c-engine/pages/Rooms";
import Booking from "@aura/b2c-engine/pages/Booking";
import Payment from "@aura/b2c-engine/pages/Payment";
import Confirmation from "@aura/b2c-engine/pages/Confirmation";
import Dashboard from "@aura/b2c-engine/pages/Dashboard";
import Experiences from "@aura/b2c-engine/pages/Experiences";
import Dining from "@aura/b2c-engine/pages/Dining";
import Spa from "@aura/b2c-engine/pages/Spa";
import GalleryContact from "@aura/b2c-engine/pages/GalleryContact";

import AdminLogin from "@aura/b2b-pms/admin/pages/AdminLogin";
import AdminDashboard from "@aura/b2b-pms/admin/pages/AdminDashboard";
import FrontDesk from "@aura/b2b-pms/admin/pages/FrontDesk";
import Reservations from "@aura/b2b-pms/admin/pages/Reservations";
import AdminRooms from "@aura/b2b-pms/admin/pages/Rooms";
import Guests from "@aura/b2b-pms/admin/pages/Guests";
import Housekeeping from "@aura/b2b-pms/admin/pages/Housekeeping";
import Restaurant from "@aura/b2b-pms/admin/pages/Restaurant";
import AdminSpa from "@aura/b2b-pms/admin/pages/AdminSpa";
import Events from "@aura/b2b-pms/admin/pages/Events";
import Inventory from "@aura/b2b-pms/admin/pages/Inventory";
import Staff from "@aura/b2b-pms/admin/pages/Staff";
import Invoices from "@aura/b2b-pms/admin/pages/Invoices";
import RateChannel from "@aura/b2b-pms/admin/pages/RateChannel";
import Marketing from "@aura/b2b-pms/admin/pages/Marketing";
import MessageCenter from "@aura/b2b-pms/admin/pages/MessageCenter";
import Reviews from "@aura/b2b-pms/admin/pages/Reviews";
import Reports from "@aura/b2b-pms/admin/pages/Reports";
import Notifications from "@aura/b2b-pms/admin/pages/Notifications";
import AdminSettings from "@aura/b2b-pms/admin/pages/Settings";
import ProtectedAdmin from "@aura/b2b-pms/admin/ProtectedAdmin";
import RequireGuestAuth from "@aura/b2c-engine/components/RequireGuestAuth";

import SuperLogin from "@aura/super-admin/superAdmin/pages/SuperLogin";
import SuperOverview from "@aura/super-admin/superAdmin/pages/SuperOverview";
import SuperTenants from "@aura/super-admin/superAdmin/pages/SuperTenants";
import SuperTenantDetail from "@aura/super-admin/superAdmin/pages/SuperTenantDetail";
import SuperProvision from "@aura/super-admin/superAdmin/pages/SuperProvision";
import SuperFlags from "@aura/super-admin/superAdmin/pages/SuperFlags";
import SuperBilling from "@aura/super-admin/superAdmin/pages/SuperBilling";
import SuperAudit from "@aura/super-admin/superAdmin/pages/SuperAudit";
import { ProtectedSuperAdmin } from "@aura/super-admin/superAdmin/SuperAdminLayout";

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
            </BrowserRouter>
          </div>
        </AppProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
