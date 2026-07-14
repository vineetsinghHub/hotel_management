import { useMemo } from "react";
import { useTenant } from "@aura/shared/tenants/TenantProvider";

// Small hook that returns a path builder scoped to the active tenant.
// Usage: const t = useTenantPath(); <Link to={t("booking")} />
// Handles both "booking" and "/booking" input consistently.
export const useTenantPath = () => {
  const { tenant } = useTenant();
  const slug = tenant?.slug || "aura";
  return useMemo(
    () => (p = "") => `/t/${slug}${p ? (p.startsWith("/") ? p : "/" + p) : ""}`,
    [slug]
  );
};

export default useTenantPath;
