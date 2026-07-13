import { Navigate } from "react-router-dom";
import { getAdminUser } from "@/admin/adminAuth";
import { hasAccess } from "@/admin/roles";
import { canAccessModule, isProModule } from "@/admin/tier";
import AdminLayout from "@/admin/components/AdminLayout";
import TierGate from "@/admin/components/TierGate";

export const ProtectedAdmin = ({ routeKey, children }) => {
  const user = getAdminUser();
  if (!user) return <Navigate to="/admin/login" replace />;
  if (routeKey && !hasAccess(routeKey, user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  // Pro-tier gate — render an upgrade wall inside the console shell
  if (routeKey && isProModule(routeKey) && !canAccessModule(routeKey)) {
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
