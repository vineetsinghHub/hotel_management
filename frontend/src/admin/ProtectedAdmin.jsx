import { Navigate } from "react-router-dom";
import { getAdminUser } from "@/admin/adminAuth";
import { hasAccess } from "@/admin/roles";

export const ProtectedAdmin = ({ routeKey, children }) => {
  const user = getAdminUser();
  if (!user) return <Navigate to="/admin/login" replace />;
  if (routeKey && !hasAccess(routeKey, user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
};

export default ProtectedAdmin;
