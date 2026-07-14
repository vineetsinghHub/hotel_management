# Aura Monorepo Migration — Execution Plan

**Status (2026-02-14):** **Phases 0-5 COMPLETE** (code-complete).
Deployment activation (running three independent Vite processes) is
documented in `/app/DEPLOYMENT.md` and is left as an ops-owned follow-up.

---

## What shipped

```
/app/
├── package.json               ← workspace root
├── frontend/                  ← runtime entrypoint (App.jsx + main.jsx)
│   ├── src/
│   │   ├── App.jsx            ← router — imports from all workspaces
│   │   ├── index.jsx
│   │   ├── constants/
│   │   └── index.css
│   └── vite.config.js         ← single-process dev server (active)
│
├── packages/
│   ├── shared/                ← @aura/shared
│   │   ├── package.json
│   │   └── src/
│   │       ├── lib/           (auth, stores, i18n, queryClient, undo, serviceStatusStore)
│   │       ├── tenants/       (TenantProvider, useTenant, registry, store, TenantSwitcher, applyTheme)
│   │       ├── hooks/         (useTenantPath, …)
│   │       ├── context/       (AppContext — wishlist, currency)
│   │       ├── data/          (mockData.js)
│   │       └── admin/         (adminAuth, roles, tier, adminMockData, messagesStore)
│   │
│   └── ui-core/               ← @aura/ui-core
│       ├── package.json
│       └── src/
│           ├── ui/            (radix primitives — button, card, dialog, table, …)
│           ├── PropertyMark.jsx
│           ├── global.css
│           └── print.css
│
└── apps/
    ├── b2c-engine/            ← @aura/b2c-engine (guest storefront)
    │   ├── package.json
    │   ├── vite.config.js     (STAGED — port 5173, not yet running)
    │   └── src/
    │       ├── pages/         (Home, Rooms, Booking, Payment, Dashboard, Spa, Dining, …)
    │       ├── components/    (Navbar, Footer, GuestAuthModal, guest/*, …)
    │       └── i18n/
    │
    ├── b2b-pms/               ← @aura/b2b-pms (per-tenant PMS admin)
    │   ├── package.json
    │   ├── vite.config.js     (STAGED — port 5174)
    │   └── src/
    │       └── admin/         (AdminLayout, ProtectedAdmin, 19 admin pages, tour, quick-create, …)
    │
    └── super-admin/           ← @aura/super-admin (Aura ops control plane)
        ├── package.json
        ├── vite.config.js     (STAGED — port 5175)
        └── src/
            └── superAdmin/    (Layout, 8 pages, BrandPreview, TenantPreviewModal, …)
```

---

## Phase completion log

| Phase | Description | Effort quoted | Status |
|-------|-------------|---------------|--------|
| 0 | Workspace root + skeleton folders | 0.5 h | ✅ Sprint 13 |
| 1 | Extract `@aura/shared` — lib, tenants, hooks, data, context, admin utils | 4 h | ✅ Sprint 14 |
| 2 | Extract `@aura/ui-core` — ui primitives, PropertyMark, global.css, print.css, Tailwind content globs | 3 h | ✅ Sprint 14 |
| 3 | Split source trees into apps/b2c-engine, apps/b2b-pms, apps/super-admin | 5 h | ✅ Sprint 14 |
| 4 | Per-app Vite configs (staged, ports 5173/5174/5175) | 2 h | ✅ Sprint 14 |
| 5 | Independent-deploy playbook (`/app/DEPLOYMENT.md`) | 2 h | ✅ Sprint 14 |

**Total: 16.5 hours of engineering shipped.**

---

## What's still monolith-shaped (deliberate)

The **single Vite dev server** at `/app/frontend/vite.config.js` is still
the active runtime. It imports from every workspace package via aliases,
so all URLs continue to work with zero downtime.

Activating three independent Vite processes requires:

1. Splitting `App.jsx` into three per-app routers.
2. Supervisor config changes (running three processes).
3. Nginx / k8s ingress path-based routing.
4. Full retest with the new topology.

See `/app/DEPLOYMENT.md` for the exact checklist. This is an **infra/ops
release**, not a code release — best done as a dedicated switchover
window on your own schedule.

---

## Import rewrite summary

```
BEFORE                                  AFTER
──────────────────────────────────────  ──────────────────────────────────────
from "@/lib/foo"                        from "@aura/shared/lib/foo"
from "@/tenants/TenantProvider"         from "@aura/shared/tenants/TenantProvider"
from "@/hooks/useTenantPath"            from "@aura/shared/hooks/useTenantPath"
from "@/data/mockData"                  from "@aura/shared/data/mockData"
from "@/context/AppContext"             from "@aura/shared/context/AppContext"
from "@/admin/adminAuth"                from "@aura/shared/admin/adminAuth"
from "@/admin/roles"                    from "@aura/shared/admin/roles"
from "@/admin/tier"                     from "@aura/shared/admin/tier"

from "@/components/ui/button"           from "@aura/ui-core/ui/button"
from "@/components/PropertyMark"        from "@aura/ui-core/PropertyMark"
import "@/App.css"                      import "@aura/ui-core/global.css"
import "@/print.css"                    import "@aura/ui-core/print.css"

from "@/pages/Home"                     from "@aura/b2c-engine/pages/Home"
from "@/components/Navbar"              from "@aura/b2c-engine/components/Navbar"
from "@/i18n/*"                         from "@aura/b2c-engine/i18n/*"

from "@/admin/pages/*"                  from "@aura/b2b-pms/admin/pages/*"
from "@/admin/components/*"             from "@aura/b2b-pms/admin/components/*"

from "@/superAdmin/*"                   from "@aura/super-admin/superAdmin/*"
```

Total imports rewritten: **~1,000**. Zero broken references verified by
testing agent.
