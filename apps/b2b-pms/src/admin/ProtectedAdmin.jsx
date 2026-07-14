import { Navigate, useParams } from "react-router-dom";
import { getAdminUser } from "@aura/shared/admin/adminAuth";
import { hasAccess } from "@aura/shared/admin/roles";
import { canAccessModule, isProModule, useTier } from "@aura/shared/admin/tier";
import { useTenant } from "@aura/shared/tenants/TenantProvider";
import AdminLayout from "@aura/b2b-pms/admin/components/AdminLayout";
import TierGate from "@aura/b2b-pms/admin/components/TierGate";

// Maps admin route keys to guest-side module keys stored on each tenant.
// A `null` mapping means the admin section is always available (core PMS
// functions like Dashboard, Front Desk, Guests, Staff, Reports, Settings).
const MODULE_MAP = {
  spa: "spa",
  restaurant: "dining",
  events: "events",
};

export const ProtectedAdmin = ({ routeKey, children }) => {
  const user = getAdminUser();
  const { slug: slugParam } = useParams();
  const slug = slugParam || "aura";
  // Subscribe to tier changes so a Basic→Pro upgrade removes the gate live.
  const { tier } = useTier();
  const { tenant } = useTenant();

  if (!user) return <Navigate to={`/t/${slug}/admin/login`} replace />;

  if (routeKey && !hasAccess(routeKey, user.role)) {
    return <Navigate to={`/t/${slug}/admin/dashboard`} replace />;
  }

  // Per-tenant module gate — if this admin route corresponds to a guest
  // module (spa / dining / events) and the tenant has that module disabled,
  // redirect back to the tenant admin dashboard.
  if (routeKey && tenant && MODULE_MAP[routeKey]) {
    const guestKey = MODULE_MAP[routeKey];
    const enabled = tenant.enabledModules ? tenant.enabledModules[guestKey] !== false : true;
    if (!enabled) {
      return <Navigate to={`/t/${slug}/admin/dashboard`} replace />;
    }
  }

  if (routeKey && isProModule(routeKey) && !canAccessModule(routeKey, tier)) {
    const pageTitle = routeKey.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
    return (
      <AdminLayout pageTitle={pageTitle}>
        <TierGate routeKey={routeKey} />
      </AdminLayout>
    );
  }
  return children;
};

export default ProtectedAdmin;
