# @aura/shared

Cross-app application plumbing — everything an app needs to render itself but
that has no UI of its own.

## Planned exports (post-phase 1)

- **Tenants:** `TenantProvider`, `useTenant`, `useTenantPath`, `TENANTS` registry,
  `tenantStore`, `applyTheme`
- **Auth:** `useGuestAuth`, `getAdminUser`, `mockLogin`, `roles`, `tier`
- **Data:** all mock data in `data/mockData.js` and `admin/adminMockData.js`
- **State:** `serviceStatusStore`, `messagesStore`, `wishlist`, `currency`
- **Feature flags & config:** feature-flags console reads/writes

## Current source of truth

Most of this lives under `/app/frontend/src/lib`, `/app/frontend/src/tenants`,
`/app/frontend/src/context`, `/app/frontend/src/hooks`, and
`/app/frontend/src/admin/*Store.js`. Phase 1 will move them.
