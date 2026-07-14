// Applies a tenant's theme by writing CSS variables to :root. The variables
// declared in index.css act as fallbacks — anything the tenant provides here
// overrides them. Also sets a data attribute for template-scoped CSS.

export const applyTenantTheme = (tenant) => {
  if (!tenant) return;
  const root = document.documentElement;
  const theme = tenant.theme || {};
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
  root.setAttribute("data-tenant", tenant.slug);
  root.setAttribute("data-template", tenant.template);
  // Favicon and title
  if (tenant.favicon) {
    const link = document.querySelector("link[rel='icon']");
    if (link) link.href = tenant.favicon;
  }
  document.title = tenant.brandName;
};

// Handy inverse — reverts back to whatever :root defines.
export const resetTenantTheme = () => {
  const root = document.documentElement;
  root.removeAttribute("data-tenant");
  root.removeAttribute("data-template");
};
