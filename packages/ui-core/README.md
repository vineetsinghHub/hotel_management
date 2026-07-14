# @aura/ui-core

Cross-app design-system primitives. Zero business logic — no fetch calls,
no store subscriptions, no route awareness. Just typed React components +
global CSS.

## Planned exports (post-phase 2)

- `PropertyMark` — the wordmark used in the navbar, admin sidebar, and super admin
- `Button`, `Card`, `Modal`, `Toaster`, `Skeleton`, `Badge`
- `hero-overlay`, `.text-eyebrow`, print / A11Y globals from `App.css` + `print.css`
- Tailwind config `brand-*` colour tokens

## Current source of truth

**Not yet extracted.** These pieces live under `/app/frontend/src/components/*`,
`/app/frontend/src/App.css`, `/app/frontend/src/print.css`, and
`/app/frontend/tailwind.config.js`. Phase 2 will move them here.
