# @aura/super-admin

Platform control plane — the Aura ops team's cockpit at `/super-admin/*`.

## Routes owned

- `/super-admin/login`
- `/super-admin/overview`
- `/super-admin/tenants` — TanStack Table data grid + Preview-as-tenant iframe
- `/super-admin/tenants/:slug` — detail drawer
- `/super-admin/provision` — provisioning wizard with live Brand preview
- `/super-admin/flags` — feature flags console
- `/super-admin/billing`
- `/super-admin/audit`

## Current source of truth

**Not yet extracted.** Super Admin pages live at `/app/frontend/src/superAdmin/*`.
Phase 3 of the monorepo migration will move them here.

## Depends on

- `@aura/ui-core`
- `@aura/shared`
