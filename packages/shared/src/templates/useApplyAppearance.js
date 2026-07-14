// useApplyAppearance — reads the tenant's active template + resolved
// options and writes them onto <html> as data attributes so the CSS in
// packages/ui-core/src/templates.css can target them.
//
//   <html data-template="luxury-classic"
//         data-base="luxury"
//         data-cursor="luxe"
//         data-button="pill"
//         data-input="underline"
//         data-animation="subtle">

import { useEffect } from "react";
import { useTenant } from "@aura/shared/tenants/TenantProvider";
import { useTenantAppearance } from "@aura/shared/templates/templateStore";

export const useApplyAppearance = () => {
  const { tenant } = useTenant();
  const slug = tenant?.slug || "aura";
  const appearance = useTenantAppearance(slug, tenant);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-template", appearance.templateId);
    root.setAttribute("data-base", appearance.base);
    root.setAttribute("data-cursor", appearance.cursor);
    root.setAttribute("data-button", appearance.button);
    root.setAttribute("data-input", appearance.input);
    root.setAttribute("data-animation", appearance.animation);
  }, [
    appearance.templateId,
    appearance.base,
    appearance.cursor,
    appearance.button,
    appearance.input,
    appearance.animation,
  ]);

  return appearance;
};

// Component-shaped helper for places where a hook is inconvenient
// (renders nothing, just applies the effect).
export const AppearanceBridge = () => {
  useApplyAppearance();
  return null;
};

export default useApplyAppearance;
