import { Link } from "react-router-dom";
import { useTenant } from "@/tenants/TenantProvider";

// Displays the current tenant's brand mark. Colour picks up the theme's
// accent for the star icon and ink/inverse for the wordmark.
export const PropertyMark = ({ inverse = false, size = "md" }) => {
  const { tenant } = useTenant();
  const color = inverse ? "text-white" : "text-brand-ink";
  const sizes = { sm: "text-xl", md: "text-2xl", lg: "text-3xl" };
  const home = `/t/${tenant?.slug || "aura"}`;
  return (
    <Link to={home} className={`inline-flex items-center gap-2.5 ${color}`} data-testid="brand-mark">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ color: inverse ? "#E6C868" : "var(--brand-accent)" }}>
        <path d="M12 2L14.5 8.5L21 9.3L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.3L9.5 8.5L12 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="1.6" fill="currentColor"/>
      </svg>
      <span className={`font-serif ${sizes[size]} tracking-tight`}>{tenant?.brandName || "Aura Hotels"}</span>
    </Link>
  );
};

export default PropertyMark;
