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

## Test Credentials
No auth in this iteration (demo). See `/app/memory/test_credentials.md`.
