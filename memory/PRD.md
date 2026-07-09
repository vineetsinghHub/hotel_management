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
- **P0** — Backend endpoints for real bookings (rooms CRUD, availability check, reservation create/get, upsell items), guest auth (JWT), invoice PDF generation
- **P1** — Real Stripe payment integration, email confirmation, calendar (.ics) generation, admin dashboard
- **P1** — Room availability calendar synced to DB, dynamic pricing
- **P2** — Multi-language (EN/FR/JA), currency toggle (USD/INR/EUR), CMS for editorial content
- **P2** — Loyalty program engine (Aura Circle), gift cards, corporate rates

## Test Credentials
No auth in this iteration (demo). See `/app/memory/test_credentials.md`.
