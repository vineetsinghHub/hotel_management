# @aura/b2c-engine

Guest-facing storefront — the marketing site + booking flow + guest dashboard.

## Routes owned

- `/` and `/t/:slug` — Home
- `/t/:slug/rooms`, `/t/:slug/experiences`, `/t/:slug/dining`, `/t/:slug/spa`, `/t/:slug/gallery`
- `/t/:slug/booking`, `/t/:slug/payment`, `/t/:slug/confirmation`
- `/t/:slug/dashboard`

## Current source of truth

**Not yet extracted.** Guest pages still live at `/app/frontend/src/pages/*`
and guest components at `/app/frontend/src/components/*`. See
`/app/MONOREPO_MIGRATION.md` — phase 3 will move them here.

## Dev server (planned)

```bash
yarn workspace @aura/b2c-engine dev   # port 5173
```

## Depends on

- `@aura/ui-core` — buttons, cards, layout primitives
- `@aura/shared` — tenants store, i18n, mock data, guest auth
