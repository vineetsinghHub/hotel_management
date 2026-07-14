# Packages

Internal libraries consumed by every app in `../apps`. All packages are
private (`"private": true` in their package.json) and published only inside
this workspace via yarn workspaces protocol.

| Package | Purpose |
|---------|---------|
| `ui-core` | Design-system primitives — buttons, cards, dialogs, print styles, global CSS. |
| `shared` | Cross-app plumbing — tenant registry, i18n, mock data, guest & admin auth, feature flags, service closures. |

## Import rules

1. `apps/*` can import from any package.
2. Packages can import from other packages **only if** the import is acyclic —
   `ui-core` **cannot** import from `shared`; `shared` **cannot** import from
   `ui-core`. Both are peer siblings.
3. Packages **never** import from `apps/*`.

## Migration status

**Not yet populated.** See `/app/MONOREPO_MIGRATION.md`.
