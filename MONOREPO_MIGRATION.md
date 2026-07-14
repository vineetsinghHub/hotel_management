# Aura Monorepo Migration — Execution Plan

**Status (2026-02-14):** Phase 0 complete. Foundation folder skeleton
and root workspace config are in place. The Vite dev server still runs
the monolith at `/app/frontend`; nothing has been moved yet.

All subsequent phases can be shipped independently. **Each phase should
land behind a green CI + testing-agent pass before starting the next.**

---

## Phase 0 — Foundation (DONE ✅)

**Goal:** Introduce the workspace shape without breaking the live app.

- [x] Root `/app/package.json` gets `workspaces: ["apps/*", "packages/*", "frontend"]`
      so yarn treats the existing monolith as a workspace peer.
- [x] `apps/{b2c-engine,b2b-pms,super-admin}` + `packages/{ui-core,shared}` folders
      created with READMEs.
- [x] This migration document lives in the repo root.

**Non-goals:** we intentionally do **not** move any source files in this phase.

**Rollback:** delete the new folders + revert the root package.json workspaces
field. Zero application code touched.

---

## Phase 1 — Extract `@aura/shared` (~4 hrs)

**Goal:** All non-UI runtime plumbing lives in `packages/shared`.

Move into `packages/shared/src`:

```
frontend/src/lib/*              → packages/shared/src/lib/*
frontend/src/tenants/*          → packages/shared/src/tenants/*
frontend/src/hooks/useTenantPath.js  → packages/shared/src/hooks/useTenantPath.js
frontend/src/data/mockData.js   → packages/shared/src/data/mockData.js
frontend/src/context/*          → packages/shared/src/context/*
frontend/src/admin/adminAuth.js
frontend/src/admin/adminMockData.js
frontend/src/admin/roles.js
frontend/src/admin/tier.js
frontend/src/admin/messagesStore.js
```

Add to `packages/shared/package.json`:

```json
{ "name": "@aura/shared", "private": true, "main": "src/index.js",
  "exports": { "./tenants": "./src/tenants/index.js", "./lib/*": "./src/lib/*.js", ... }}
```

Rewrite imports in the monolith from `@/lib/foo` → `@aura/shared/lib/foo`.
A codemod (`jscodeshift`) makes this trivial — provided in `scripts/codemods/`
in a future commit.

**Testing agent brief for phase 1:** re-run the entire /admin/ and /t/aura/
regression suite; each page must still load with zero console errors.

---

## Phase 2 — Extract `@aura/ui-core` (~3 hrs)

**Goal:** Shared design-system + global CSS + Tailwind preset.

Move into `packages/ui-core/src`:

```
frontend/src/App.css      → packages/ui-core/src/global.css
frontend/src/print.css    → packages/ui-core/src/print.css
frontend/src/components/PropertyMark.jsx → packages/ui-core/src/PropertyMark.jsx
frontend/src/components/ui/* → packages/ui-core/src/*
frontend/tailwind.config.js  → packages/ui-core/tailwind-preset.js  (as a preset)
```

Each app's own `tailwind.config.js` then `presets: [require('@aura/ui-core/tailwind-preset')]`.

---

## Phase 3 — Split source trees (~5 hrs)

```
frontend/src/pages/* + everything imported only by guest routes
                                → apps/b2c-engine/src/
frontend/src/admin/*            → apps/b2b-pms/src/
frontend/src/superAdmin/*       → apps/super-admin/src/
frontend/src/App.jsx (the router) → split into three per-app entrypoints
```

Each app now has its own `main.jsx`, `App.jsx`, and route table.

---

## Phase 4 — Independent Vite configs (~2 hrs)

Each app gets:
- `vite.config.js` with `base` and `resolve.alias` for `@aura/*`
- `index.html`
- Own dev port (b2c: 5173, b2b: 5174, super: 5175)

Supervisor updated to run three vite processes.

---

## Phase 5 — Independent deploys (~2 hrs)

Vercel / Railway / Nginx-ingress config split. Each app deploys on its own
CI trigger. Path-based routing via ingress:

- `/`, `/t/:slug/*` (guest routes) → b2c-engine
- `/t/:slug/admin/*` → b2b-pms
- `/super-admin/*` → super-admin

---

## Total estimate

| Phase | Effort | Status |
|-------|--------|--------|
| 0 — Foundation | 0.5 h | ✅ done |
| 1 — @aura/shared | 4 h | queued |
| 2 — @aura/ui-core | 3 h | queued |
| 3 — Split source trees | 5 h | queued |
| 4 — Independent Vite configs | 2 h | queued |
| 5 — Independent deploys | 2 h | queued |
| **Total remaining** | **16 h** | |

This is roughly the ~1.5 days originally quoted in the roadmap. The
foundation phase (this commit) is the safest possible entry point:
zero source-file changes, a fully reversible README-only footprint,
and a clear execution plan for the remaining phases.
