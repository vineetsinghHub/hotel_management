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

// Guest-site layout that wraps every /t/:slug/* route with the TenantProvider.
// The provider reads useParams().slug, loads that tenant's config into the
// zustand store, and applies its theme via CSS variables on <html>.
const GuestShell = () => (
  <TenantProvider>
    <Outlet />
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

                  {/* ── Admin (PMS) ── */}
                  <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={guarded("dashboard", AdminDashboard)} />
                  <Route path="/admin/front-desk" element={guarded("front-desk", FrontDesk)} />
                  <Route path="/admin/reservations" element={guarded("reservations", Reservations)} />
                  <Route path="/admin/rooms" element={guarded("rooms", AdminRooms)} />
                  <Route path="/admin/guests" element={guarded("guests", Guests)} />
                  <Route path="/admin/housekeeping" element={guarded("housekeeping", Housekeeping)} />
                  <Route path="/admin/restaurant" element={guarded("restaurant", Restaurant)} />
                  <Route path="/admin/spa" element={guarded("spa", AdminSpa)} />
                  <Route path="/admin/events" element={guarded("events", Events)} />
                  <Route path="/admin/inventory" element={guarded("inventory", Inventory)} />
                  <Route path="/admin/staff" element={guarded("staff", Staff)} />
                  <Route path="/admin/invoices" element={guarded("invoices", Invoices)} />
                  <Route path="/admin/rate-channel" element={guarded("rate-channel", RateChannel)} />
                  <Route path="/admin/marketing" element={guarded("marketing", Marketing)} />
                  <Route path="/admin/messages" element={guarded("messages", MessageCenter)} />
                  <Route path="/admin/reviews" element={guarded("reviews", Reviews)} />
                  <Route path="/admin/reports" element={guarded("reports", Reports)} />
                  <Route path="/admin/notifications" element={guarded("notifications", Notifications)} />
                  <Route path="/admin/settings" element={guarded("settings", AdminSettings)} />
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

// Only mount the pill on guest-site routes (not /admin/*)
const GuestOnlyPill = () => {
  const isAdmin = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
  if (isAdmin) return null;
  return <CurrencyLanguagePill />;
};

export default App;
