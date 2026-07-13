import { Navigate } from "react-router-dom";
import { getAdminUser } from "@/admin/adminAuth";
import { hasAccess } from "@/admin/roles";
import { canAccessModule, isProModule, useTier } from "@/admin/tier";
import AdminLayout from "@/admin/components/AdminLayout";
import TierGate from "@/admin/components/TierGate";

export const ProtectedAdmin = ({ routeKey, children }) => {
  const user = getAdminUser();
  // Subscribe to tier changes so a Basic→Pro upgrade removes the gate live.
  const { tier } = useTier();
  if (!user) return <Navigate to="/admin/login" replace />;
  if (routeKey && !hasAccess(routeKey, user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
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
