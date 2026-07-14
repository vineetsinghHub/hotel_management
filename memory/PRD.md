# Aura Hotels — PRD

## Product
An enterprise-grade luxury hospitality SaaS platform representing **one** heritage luxury property (Aura Hotels, Udaipur). Not a marketplace — an immersive editorial experience with a full booking flow, guest dashboard, dining, spa and experiences pages.

## Original Problem Statement
Design a full-fidelity luxury hospitality product (Aura Hotels) inspired by Aman Resorts, Six Senses, The Oberoi, The Leela, Taj, Four Seasons, Apple, Stripe, Linear. Include home, rooms, booking, payment, confirmation, guest dashboard, experiences, dining, spa, gallery/contact — all sharing the same design system.

## Design System (locked)
- Bg: `#FAFAF8` · Cards: `#FFFFFF` · Primary: `#4F46E5` (Indigo 600) · Accent: `#C9A227` (Warm Gold)
- Text: Slate 900 / Slate 500 · Border: Slate 200 · Success: Emerald · Error: Rose
- Fonts: Cormorant Garamond (headings), Plus Jakarta Sans (body), JetBrains Mono (numbers/prices)
- Radius: 20px · Buttons: pill, soft shadow · Glassmorphism on floating widgets

## Architecture
- **Frontend**: React 19 + React Router 7 + Tailwind + Shadcn + Sonner + FontAwesome + Google Fonts
- **Backend**: FastAPI stub (`/api/`) — unused in this frontend-first iteration
- **Data**: Static mock data at `/app/frontend/src/data/mockData.js`

## Personas
- **The Guest** — books a suite, curates upsells, uses the dashboard for QR check-in, spa, dining
- **The Concierge** (implied) — the dashboard hints at internal tools (future scope)

## Implemented (Feb 09, 2026)
- Home (`/`) — hero, glass booking widget (OPEN cal/guests/promo), highlights, 4 featured room cards with carousel, experiences tiles, testimonials carousel, IG masonry, footer
- Rooms & Suites (`/rooms`) — editorial banner, breadcrumbs, filters, grid, room detail modal with gallery, 360 pill, floor plan, policies, sticky booking card
- Booking (`/booking`) — 3-step progress, guest form with validation error, upsells (6 cards, one selected), policies accordion open, sticky summary
- Payment (`/payment`) — 5 methods (CC/UPI/Netbanking/GPay/Apple Pay), full CC form + billing, coupon, trust marks, success modal with confetti + QR + reservation number
- Confirmation (`/confirmation`) — celebration hero, journey timeline, guest+room, directions card, weather widget, contact, actions
- Dashboard (`/dashboard`) — luxury sidebar, upcoming stay hero with live countdown, weather, QR check-in, stat cards, booking history table, notifications, loyalty circle
- Experiences (`/experiences`) — editorial hero, 6 cards, details modal
- Dining (`/dining`) — restaurant hero, chef recommendation, reserve table (date/time/guests), tabbed menu (Breakfast/Lunch/Dinner/Desserts/Wine), gallery, reviews
- Spa (`/spa`) — treatments as selectable cards, therapist, available time slots (disabled + selected states), sticky reserve card
- Gallery & Contact (`/gallery`) — tabs (gallery/videos/tour/contact), masonry gallery, virtual tour placeholder, contact + map + nearby, FAQ accordion, newsletter

## Design tokens are consistent across all 10 pages
- Same navbar/footer, same glass, same fonts, same primary/accent, same radii

## Backlog / Next
- All P0/P1/P2 items from the July 2025 backlog are now shipped:
  - (P0) Guest Dashboard **Fast Check-out** QR modal ✅ (folio + QR + email + approve room charge)
  - (P1) Front Desk split view (Arrivals / In-house / Departures) ✅
  - (P1) Reservations Gantt-style calendar ✅
  - (P2) Housekeeping drag-assign (dnd-kit) ✅
  - (P2) Staff Custom Role Builder (module + read/write flags) ✅
  - (P2) Recharts in Admin Dashboard ✅
  - (P2) Audit-log filter/search in Settings ✅
  - (P2) Rate & Channel Manager UI (routed under new Revenue section) ✅

## Deferred
- Backend endpoints for real bookings / auth / invoices (still frontend-only, mock data)
- Real Stripe payment integration, .ics generation
- Multi-language / currency toggle
- Loyalty program engine, gift cards, corporate rates

## Frontend Polish Sprints (July 2025)

### Sprint 1 — Foundations
- Dark mode (attribute-based CSS overrides — no per-file rewrites)
- Currency switcher (USD / INR / EUR / AED with mock FX)
- Language switcher (EN / FR / JA / HI) with translated Navbar
- Skeleton loaders + Empty-state SVG illustrations (reusable components)
- Global ErrorBoundary with elegant recovery UI
- Undo toast helper
- prefers-reduced-motion respected
- Focus rings + skip-link + basic a11y
- Micro-interactions (hover-lift, press-scale)

### Sprint 2 — Guest Dashboard super-charged
- Floating Concierge Chat (scripted AI + quick actions)
- Room Service order flow (menu, cart, tip, ETA → adds to folio)
- Digital Key tab (rotating QR + NFC pulse animation)
- Review prompt on check-out (5 stars + tags, stored in localStorage)
- Referral card (share/copy code + link)
- Photo diary (auto-curated album on completed stay)
- Itinerary planner (dnd-kit drag-drop into time slots + PDF export)
- Wishlist heart on RoomCard + saved list section
- Guest command palette (`/` or `⌘K`)
- Toast history recorder (wraps sonner globally)

### Sprint 3 — Booking flow
- Live availability calendar (60-day grid with best-price / peak / sold-out bands)
- Compare suites modal (side-by-side spec table for up to 3 rooms)
- Currency-aware pricing across RoomCard

### Sprint 4 — Admin Guest 360 + Reservations
- Guest 360 profile drawer (Overview / Stays / Preferences / Messages / Loyalty tabs, tags, avatar, KPIs)
- Kanban board view for Reservations (Booked → In-house → Departed → Closed with card-move arrows)

### Sprint 5 — Admin Analytics
- 90-day Occupancy heatmap (weekend boost, 5-band color scale, hover tooltip)

### Sprint 6 — Admin UX polish
- Onboarding tour (4-step, dismissable, persisted)
- Print stylesheet for folio / invoice
- PWA manifest (installable)

### Sprint 7 — Roles, Tiers & Staff Chat (Feb 13, 2026)
- **Role-specific Dashboards**: 7 tailored dashboard variants driven off `getAdminUser().role`
  - Executive (GM / Super Admin) — full KPI matrix, revenue trend, occupancy donut, arrivals, channels, heatmap
  - Front Desk — arriving/in-house/departing lists, walk-in estimate, quick-action tile
  - Housekeeping — priority queue, room-status donut, cleaning KPIs
  - F&B — covers-per-day bars, top items today, revenue
  - Spa — appointment schedule, therapist utilisation
  - Marketing — campaign performance table, audience KPIs
  - Accounting — invoices, revenue trend, GST payable, refunds
  - Read-only — compact viewer with KPIs + activity
- **Strict role-based hiding across the console**:
  - Sidebar filters by `hasAccess()` (existing) + Pro badges rendered next to premium modules
  - Topbar "New" menu filters by role permission (hidden entirely if role has no perms)
  - Command-palette (⌘K) page list filters by role
  - FAB Quick actions and Jump-to links filter by role
- **Basic vs Pro Subscription Tiers** (`/app/frontend/src/admin/tier.js`)
  - Basic: `₹4,999/mo` — front desk, reservations, rooms, guest CRM, housekeeping, inventory, basic invoicing
  - Pro: `₹14,999/mo` — everything + OTA sync, master rate calendar, report builder, marketing automation, broadcast messaging
  - **Pro-gated modules**: `rate-channel`, `reports`, `marketing` (hard-locked) · `messages` (soft-locked broadcast + WhatsApp)
  - Beautiful `TierGate` upgrade wall with gradient hero, dual plan cards, in-mock upgrade CTA
  - Tier stored in `localStorage` (`aura_admin_tier`); toggle from **Settings → Subscription**
  - `ProBadge` component rendered on Pro modules in sidebar
- **FAB Staff Messaging** (`AdminFloatingActions.jsx`)
  - New "Messages" tab in FAB drawer alongside Quick actions & Ask
  - Red unread-count badge on the FAB button itself (like notifications)
  - Horizontal thread strip of colleagues (Front Desk / Housekeeping / F&B / Spa / Marketing)
  - Full conversation UI with online status, avatars, chat bubbles, input, "Open Message Center →"
  - `messagesStore.js` provides shared unread state across the app
- **Basic tier UX in shared modules**
  - Message Center: WhatsApp channel hidden on Basic · Broadcast button shows Pro badge and opens a locked upgrade modal
  - Executive dashboard: bottom "Advanced analytics" section becomes a Pro teaser card on Basic

### Sprint 8 — Guest Auth, Team Chat & Read-Only Enforcement (Feb 13, 2026)
- **Guest-side authentication gate** (`/app/frontend/src/lib/guestAuth.js`, `RequireGuestAuth`)
  - Mock guest auth store with `useGuestAuth()` hook (any email + non-empty password)
  - `GuestAuthModal` glass-styled sign-in / sign-up modal
  - Wall + modal render on `/dashboard`, `/booking`, `/payment`, `/confirmation` when unauthed
  - Navbar swaps "My account" link for user menu (avatar + first name + Sign out) when signed in
- **Message Center Guests / Team segregation** (`MessageCenter.jsx`)
  - Segment switcher (Guests / Team) with independent unread counts
  - Team segment merges the staff threads used by the FAB
  - Segment-specific right panel (guest templates vs team templates)
  - Per-thread × button to remove from list; localStorage-persisted, with Undo toast
- **FAB Ops-assistant thread removal**
  - × button on each staff thread pill (data-testid `fab-thread-remove-{id}`)
  - Removal syncs with `aura_fab_removed_threads` localStorage
  - Global FAB unread badge updates when a thread with unread messages is removed
- **Read-only mode enforcement** (`ReadOnlyBanner`, `useReadOnly`)
  - New reusable banner + hook driven by `isReadOnly(user.role)`
  - Every write CTA hidden for the Auditor role across Events, Reservations, Restaurant, Marketing, Inventory, Guests
  - Topbar "+ New" button hidden entirely for read-only role
  - Restaurant menu toggle disabled with error toast on click
- **Tier reactivity** — `tier.js` refactored with `subscribeTier()` + `useTier()` hook. TierGate upgrade, Settings switcher and sidebar Pro badges all update **live** without page reload.
- **Per-role landing pages** (`ROLE_LANDING` map in `roles.js`)
  - After login, each role goes to their most-relevant page (HK→housekeeping, F&B→restaurant, Spa→spa, Marketing→marketing, Accounting→invoices, Front Desk→front-desk, GM/Super Admin/Audit→dashboard)

### Sprint 9 — SaaS Foundation: Multi-Tenancy, Zustand, React Query (Feb 13, 2026)
- **Design token system** — `--brand-*` CSS variables in `index.css` + semantic Tailwind aliases (`bg-brand-primary`, `text-brand-accent`, `bg-brand-surface`, etc.). Any component using these classes now themes automatically per tenant.
- **`<TenantProvider>` + `useTenant()`** (`/app/frontend/src/tenants/`)
  - Path-based routing: **`/t/:slug/*`** for all guest routes
  - Legacy paths (`/`, `/rooms`, `/booking`, …) 302-redirect to `/t/aura/…`
  - Zustand-backed tenant store, applies theme via CSS variables on `<html>`
  - Sets `data-tenant` + `data-template` attributes for scoped CSS
  - Renders a 404 wall for unknown slugs
- **Tenant registry** (`/app/frontend/src/tenants/tenantRegistry.js`) with 3 seed tenants:
  - **Aura Hotels** (luxury / Basic tier / indigo + gold) — default
  - **Bhairavgarh Palace** (heritage / Pro tier / maroon + brass)
  - **Hill Haven Boutique** (basic / Basic tier / teal + amber, no spa/events)
- **3 template variants** (heritage / luxury / basic) — scoped CSS in `index.css` adjusts radii, serif face, hero overlays without touching component code
- **Module-based nav filtering** — Navbar/Footer honour `tenant.enabledModules` (Hill Haven correctly hides Spa)
- **Preview TenantSwitcher** — floating pill (bottom-left) swaps tenants live on guest routes
- **Zustand migration** — `tier.js`, `guestAuth.js` refactored to `zustand + persist` middleware (backwards-compatible public API preserved). Custom pub-sub in `tier.js` replaced.
- **React Query scaffold** — `QueryClientProvider` wired at app root with sensible defaults (30s stale, no window-focus refetch, retry:1). `apiClient.js` axios instance auto-attaches `X-Tenant` header from the URL. Ready to swap mocks for backend calls without touching UI.
- **`useTenantPath()`** hook centralises tenant-scoped path building across guest components (`Navbar`, `Footer`, `Home`, `Rooms`, `RoomCard`, `RequireGuestAuth`).

### Sprint 10 — Super Admin Hub (Phase F, Feb 13, 2026)
- **New app at `/super-admin/*`** — the SaaS platform's control plane, isolated from tenant PMS and guest storefront.
- **Separate operator auth** (`superAdminAuth.js`, Zustand-persisted) with 3 demo roles:
  - `platform@aurahotels.com` — Platform Admin (full write)
  - `support@aurahotels.com` — Support (read-only+impersonation)
  - `billing@aurahotels.com` — Billing (invoices+refunds)
- **Screens shipped:**
  - **Login** (`SuperLogin.jsx`) — dual-panel dark hero + demo tiles
  - **Overview** (`SuperOverview.jsx`) — 4 KPIs (Active Tenants / MRR / Avg. Health / Uptime SLA), MRR area chart, sign-ups bar chart, Top 6 tenants table, Recent Activity audit feed, At-Risk callout
  - **Tenants grid** (`SuperTenants.jsx`) — TanStack Table with search, tier/status/template filter pills, MRR sort, pagination (10 per page), per-row actions (preview storefront, impersonate, drill-in)
  - **Tenant detail** (`SuperTenantDetail.jsx`) — Identity + stats + billing + enabled modules + danger zone
  - **Provision wizard** (`SuperProvision.jsx`) — 4-step: Profile → Domain (path vs subdomain) → Brand (3 template presets + color pickers + tier) → Launch (seed data checkboxes)
  - **Feature Flags** (`SuperFlags.jsx`) — 7 flags with global on/off + per-tenant override chips
  - **Billing** (`SuperBilling.jsx`) — 3-month invoice table with paid/pending/overdue statuses
  - **Audit log** (`SuperAudit.jsx`) — operator action feed
- **Isolation verified:** PMS and guest storefront untouched. CurrencyLanguagePill hidden on /super-admin/*.
- **12 platform tenants seeded** — mix of tiers, templates, statuses (2 at-risk) for realistic ops demos.
- **TanStack Table 8.21.3 installed** — reusable pattern for future data grids.

### Sprint 11 — Super Admin Sales Demo Tools + Bug Fixes (Feb 14, 2026)
- **Provisioning Wizard live preview panel** (`SuperProvision.jsx` + new `BrandPreview.jsx`) — Step 3 (Brand) now shows a right-side mini storefront (browser chrome + navbar + hero + RoomCard + token legend) that live-updates on template / primary / accent / surface / tier changes. Turns the form into a design tool for sales calls.
- **"Preview as tenant" iframe modal** (`SuperTenants.jsx` + new `TenantPreviewModal.jsx`) — new eye-icon action on every tenant row opens a full-screen modal with:
  - Toolbar (avatar + mock URL bar + device toggle [desktop/tablet/mobile] + reload + copy-link + open-in-new-tab + close)
  - Left rail with 7 route buttons (Home, Rooms, Dining, Spa, Experiences, Booking, Gallery), disabled + locked for modules a tenant doesn't have
  - Tier + template callout
  - Themed iframe stage sized to the selected device; loading overlay while the iframe boots
  - ESC + backdrop dismiss; body scroll lock; `?embed=1` suppresses the storefront's TenantSwitcher pill
- **Bug fix** — Basic-tier Broadcast modal on `/admin/messages` was way too large (full-page TierGate, ~750px tall, no close button):
  - New `compact` prop on `TierGate` — tightens paddings, drops icon tile to 12×12, headline to 2xl, caps plan feature lists at 3
  - MessageCenter's broadcast-locked wrapper now uses `max-h-[88vh] overflow-y-auto` + a `broadcast-locked-close` X button
  - Verified modal renders at ~478px height in a 900px viewport (compact & scrollable)


## Test Credentials
No auth in this iteration (demo). See `/app/memory/test_credentials.md`.

### Sprint 12 — Global Chatbot, Admin Shortcut, Service Closures (Feb 14, 2026)
- **Global guest widgets** (`GuestGlobalWidgets.jsx`) — the concierge chatbot and command palette are now mounted at the app root inside `GuestShell`, gated on `useGuestAuth().isAuthed`. They follow the signed-in guest across every storefront page (Home, Rooms, Experiences, Dining, Spa, Gallery, Booking, Payment, Confirmation, Dashboard). Auto-suppressed on admin/super-admin routes and inside `?embed=1` iframe previews. `Dashboard.jsx` no longer renders them locally.
- **Admin quick-access button** — new outline pill `nav-admin-cta` (shield icon + "Admin") in the guest Navbar between the account menu and the Book-Your-Stay CTA. Adapts to the transparent-hero and scrolled-solid navbar variants; routes to `/admin/login`.
- **Cross-cutting service closures** — new `serviceStatusStore.js` (Zustand + localStorage, keyed by tenant slug). Admin can now close/reopen Spa, Dining and Experiences from:
  - `/admin/spa` (dedicated card at the top)
  - `/admin/restaurant` (dedicated card at the top)
  - `/admin/settings` → new "Service closures" section (consolidated control for all three)
  When a service is closed:
  * Admin view dims the appointment/reservation table to 50% opacity, KPIs zero out, status pill turns rose.
  * Guest pages (`/spa`, `/dining`, `/experiences`) render a rose "Temporarily closed" banner with the operator-supplied reason.
  * All Reserve/Reserve-Table/Reserve-Experience CTAs disable and re-label to "Currently closed" with a lock icon. Time-slot pickers on `/spa` all disable/strikethrough. Modal Reserve inside `/experiences` respects the flag.
  Store fix: the OPEN_DEFAULT / EMPTY_MAP returns use frozen module-level singletons to avoid Zustand's "getSnapshot should be cached" infinite-loop trap.


### Sprint 13 — Per-Hotel Admin Migration + Brand-Token Sweep + Monorepo Phase 0 (Feb 14, 2026)

**Big-lift structural sprint. Three items shipped together.**

- **Per-hotel PMS console (`/admin/*` → `/t/:slug/admin/*`)** — every hotel now has its own admin console at `/t/:slug/admin/*`. Legacy `/admin/*` routes redirect to `/t/aura/admin/*` for backward compatibility.
  - `App.jsx` — new `AdminShell` wraps tenant-scoped admin routes inside `<TenantProvider>`. Route table generated from a shared `adminRoutes[]` config (one source of truth for both canonical and legacy mounts).
  - `ProtectedAdmin` — reads `useParams().slug` + `useTenant()`. New `MODULE_MAP` blocks admin routes whose corresponding guest module is disabled on the tenant (`spa→spa`, `restaurant→dining`, `events→events`). Hillhaven (`spa:false, events:false`) automatically redirects `/t/hillhaven/admin/spa` and `.../events` to dashboard.
  - `AdminLayout` — sidebar branding now reads `tenant.brandName` + `tenant.city` and uses `tenant.theme.brand-primary` for the initial tile. `isModuleEnabled(moduleKey)` hides Spa/Events/Restaurant items on tenants that don't have the module. All links built at render time via `useTenantPath()`.
  - `AdminLogin` — hero card re-brands per tenant. `mockLogin` redirects use `tenantify(landingFor(role))`.
  - `RoleDashboards` — introduced a lightweight `TLink` wrapper that transparently rewrites `to="/admin/xxx"` → `to="/t/:slug/admin/xxx"`. Six role dashboards + the Front Desk quick-action grid all rewritten in one shot.
  - `AdminFloatingActions` "View messages" jump + `Navbar` "Admin" CTA + `AdminSpa`/`Restaurant`/`Settings` service-closure panels — all tenant-aware.
  - Added `city` field to every entry in `tenantRegistry` (Aura → Mumbai, Bhairavgarh → Udaipur, Hill Haven → Munnar).
- **Brand-token sweep** — swept ~140 hardcoded hex codes across `Booking.jsx`, `Payment.jsx`, `Dashboard.jsx`, and `AdminLogin.jsx` into `brand-*` Tailwind tokens (`bg-brand-primary`, `text-brand-accent`, `bg-brand-surface`, `ring-brand-primary/15`, `accent-brand-primary`, etc.). Booking is now token-pure (0 hex remaining); Payment/Dashboard have only SVG-attribute and Recharts color-array holdouts remaining. Verified by loading `/t/bhairavgarh/dashboard` and confirming the primary color re-themes to maroon (`#7B2C2C`).
- **Monorepo Phase 0 foundation** — landed the workspace skeleton without moving any source files:
  - `/app/package.json` — new workspace root with `workspaces: ["frontend", "apps/*", "packages/*"]`.
  - `/app/apps/{b2c-engine,b2b-pms,super-admin}/README.md` — each documents which routes the app will own + gates + dependencies.
  - `/app/packages/{ui-core,shared}/README.md` — documents planned exports post-extraction.
  - `/app/MONOREPO_MIGRATION.md` — full phased execution plan with per-phase effort estimates. Remaining work: 16h across phases 1–5 (extract `@aura/shared`, extract `@aura/ui-core`, split source trees, independent Vite configs, independent deploys).


### Sprint 14 — Monorepo Phases 1–5 + Full Hex-Code Sweep (Feb 14, 2026)

**Structural refactor sprint. 16.5 hours of quoted work landed in one session.**

- **Phase 1 — `@aura/shared`** — extracted `lib/`, `tenants/`, `hooks/`, `data/`, `context/` and the pure-logic admin utilities (`adminAuth`, `roles`, `tier`, `adminMockData`, `messagesStore`) into `packages/shared/src/`. Package registered as `@aura/shared` in yarn workspaces.
- **Phase 2 — `@aura/ui-core`** — extracted `components/ui/` (all Radix primitives), `PropertyMark.jsx`, `App.css` → `global.css`, `print.css` into `packages/ui-core/src/`. Tailwind `content` globs now scan `packages/**/src` + `apps/**/src` so JIT picks up classes across workspaces.
- **Phase 3 — split source trees** — moved `pages/`, `components/`, `i18n/` → `apps/b2c-engine/src/`, `admin/` → `apps/b2b-pms/src/admin/`, `superAdmin/` → `apps/super-admin/src/superAdmin/`. `/app/frontend/src/` is now down to just `App.jsx`, `index.jsx`, `constants/`, `index.css`.
- **Phase 4 — per-app Vite configs (staged)** — created `apps/*/vite.config.js` for each app on ports 5173 / 5174 / 5175 with proper aliases + HMR wiring for k8s ingress. Not yet activated; the single-process dev server at `/app/frontend` still handles all traffic via workspace aliases.
- **Phase 5 — deployment playbook** — `/app/DEPLOYMENT.md` documents the exact steps to activate three independent processes: supervisor blocks, nginx path routing, per-app CI builds, rollback story.
- **~1,000 import rewrites** — every `from "@/lib/foo"` became `from "@aura/shared/lib/foo"`, `from "@/components/ui/button"` became `from "@aura/ui-core/ui/button"`, `from "@/pages/Home"` became `from "@aura/b2c-engine/pages/Home"`, etc. Zero broken references — verified by testing agent across every guest page, admin page, super admin page, service-closure flow, and broadcast modal.
- **Full-codebase hex-code sweep** — went from **1,020 → 370** hardcoded hex codes. Applied the same brand-token mappings across every `.jsx`/`.js` file. Remaining 370 are legitimately SVG `fill=`, chart color arrays, and notification color maps — data values that Tailwind cannot apply to.

**What's still monolith-shaped (deliberate):** the runtime is still a single Vite process because activating three independent processes needs supervisor + nginx changes that are an ops release, not a code release. The code shape is now 100% monorepo — teams can independently own `apps/b2c-engine`, `apps/b2b-pms`, `apps/super-admin`.


### Sprint 15 — Guest UX polish (Feb 14, 2026)

Five small UX fixes bundled into one round after user testing:

- **Currency/Language pill moved inline into Navbar** — `CurrencyLanguagePill` gains an `inline` prop that swaps the floating bottom-right chip (`fixed bottom-20 right-6`) for a subtle outline pill in the navbar row. Dropdown panel repositions from `bottom-14` → `top-12` when inline. `GuestOnlyPill` wrapper removed from `App.jsx` — no more floating widget.
- **Dashboard account dropdown with sign-out** — the top-right avatar+name area on `/dashboard` is now a clickable `top-account` button that opens `top-account-menu` with 4 items: Profile, Preferences, My reservations, Sign out. Sign-out fires `useGuestAuth().signOut()`, toasts, then `navigate(withTenant(""))` sending the guest back to the landing screen. Previously guests had to leave the dashboard to sign out.
- **Dashboard Quick Actions wired** — the 4-tile grid (Concierge / Room Service / Car Service / Pool Access) now does real things. `Concierge` dispatches a `aura:open-concierge` window event that `ConciergeChat.jsx` listens for and opens the panel; `Room Service` jumps to the in-suite menu section; `Car Service` and `Pool Access` fire the correct toasts (with a `Track` action button on Car Service).
- **HMR / reload-loop fix** — widened Vite `server.fs.allow` to the monorepo root so files under `packages/*` and `apps/*` no longer trigger occasional full-page reloads.
- **Preferences link wired** — the dashboard's Settings section already contained the currency + language selects; the new `account-menu-preferences` button routes to `setActive("settings")` which reveals the Preferences card. No orphaned section.

