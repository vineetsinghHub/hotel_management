# @aura/b2b-pms

Hotel operations console — the per-tenant PMS at `/t/:slug/admin/*`.

## Routes owned

- `/t/:slug/admin/login`
- `/t/:slug/admin/dashboard`, `/front-desk`, `/reservations`, `/rooms`, `/guests`,
  `/housekeeping`, `/restaurant`, `/spa`, `/events`, `/inventory`, `/staff`,
  `/invoices`, `/rate-channel`, `/marketing`, `/messages`, `/reviews`, `/reports`,
  `/notifications`, `/settings`.

## Gates

- **Auth:** `getAdminUser()` — mock JWT in localStorage.
- **Role:** `hasAccess(routeKey, user.role)` from `@aura/shared/admin/roles`.
- **Per-tenant module:** `tenant.enabledModules[moduleKey]` — Hillhaven has
  `spa: false, events: false`, so those routes redirect to dashboard.
- **Tier:** `isProModule(routeKey) && canAccessModule(routeKey, tier)` — Basic
  users hit the compact TierGate modal instead.

## Current source of truth

**Not yet extracted.** Admin pages still live at `/app/frontend/src/admin/*`.
Phase 3 of the monorepo migration will move them here.

## Depends on

- `@aura/ui-core`
- `@aura/shared`
