# Apps

Each directory here is an independently buildable, deployable Vite application that
shares code through the workspace packages in `../packages`.

| App | Deploys to | Owner responsibility |
|-----|-----------|----------------------|
| `b2c-engine` | Guest-facing storefront (`/`, `/t/:slug/*`) | Marketing + Design |
| `b2b-pms` | Hotel operations console (`/t/:slug/admin/*`) | Product + Operations |
| `super-admin` | Aura platform control plane (`/super-admin/*`) | Platform team |

## Migration status (July 2025 → sprint 13)

- [x] **Phase 0 — Foundation.** Root workspace config + app / package folder skeleton
      created (this commit).
- [ ] **Phase 1 — Extract shared packages.** Move `src/lib/*`, `src/tenants/*`,
      `src/data/mockData.js`, `src/context/*`, `src/hooks/*` into `packages/shared`.
- [ ] **Phase 2 — Extract UI core.** Move `src/components/ui/*`, `src/components/PropertyMark.jsx`,
      the print / global styles into `packages/ui-core`.
- [ ] **Phase 3 — Split source trees.** Move `src/pages/*` + guest components →
      `apps/b2c-engine/src`, `src/admin/*` → `apps/b2b-pms/src`, `src/superAdmin/*` →
      `apps/super-admin/src`.
- [ ] **Phase 4 — Independent Vite configs.** Give each app its own
      `vite.config.js`, `index.html`, `tsconfig`, and dev port.
- [ ] **Phase 5 — Independent deploys.** Point each Vercel / Railway target at the
      corresponding `apps/*` directory. Nginx / ingress routes traffic by path prefix.

Until phase 3 completes, all three apps continue to live inside `/app/frontend/src`
as a single monolithic Vite app. The skeleton here is intentionally non-destructive.

See `/app/MONOREPO_MIGRATION.md` for the detailed migration plan.
