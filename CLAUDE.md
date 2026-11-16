# Goldeneye Developers — Next.js + Payload CMS Platform

Client: Goldeneye Developers (real estate, Bangladesh). Agency brief: River Brain Studio "Executive Brief".
This file is the single source of truth. **Nothing from the client brief may be dropped** — if a feature is deferred, it stays listed here with its phase.

## 0. Ground rules
- Language with the user: Banglish. Keep replies short.
- **Final design = the static HTML prototype** in `D:\wp\goldeneye-v2` (copied to `./prototype`). Pixel/behaviour parity is the goal; do not redesign.
- **Plain CSS only. No Tailwind.** Port the 7 existing stylesheets (`styles, shared, home, props, property, select`) as global/CSS-module files, keeping the tokens.
- Develop on localhost first. Production targets (Vercel, R2/S3, Redis, Cloudflare) come later.
- Local dev DB credential lives only in `.env` (never commit).

## 1. Stack (client-mandated)
| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, RSC), TypeScript |
| CMS/CRM/Admin | Payload CMS 3.0 (runs inside Next.js, admin at `/admin`) |
| DB | PostgreSQL 17 local (`@payloadcms/db-postgres`) |
| Styling | Plain CSS (ported prototype) |
| i18n | `/en`, `/bn` routes + Payload localization (en default) |
| Hosting (later) | Vercel, Cloudflare (CDN/WAF), R2/S3 uploads, Redis cache |
| Tooling | Node 22, pnpm 9 |

## 2. Scope from the client brief
- 1 corporate site (18 pages) + 5 microsites (15 pages each) = 93+ routes, bilingual (বাংলা + English).
- Admin CMS + CRM, **7 roles**, audit trail, revision history, lead workflow.
- Features: 3D virtual tour, PWA, real-time availability/inventory tracker, payment/EMI calculator, WhatsApp/SMS notifications, site-visit booking, master plan explorer, gallery/lightbox, compare, saved homes, NRB section, news, FAQ, testimonials.
- Security (six layers): Cloudflare WAF/CDN, HTTPS/HSTS+headers, auth hardening (rate limit, lockout, 2FA for admin), RBAC + field-level access, input validation/sanitization, audit logs + backups.
- SEO: metadata per page/locale, hreflang, sitemap, robots, JSON-LD (RealEstateListing, Organization), OG images, Core Web Vitals.
- Marketing: UTM capture, pixel/GA4 hooks, lead source attribution, newsletter.
- AI (phased): P1 chatbot, lead scoring, duplicate detection, admin translation. P2 auto-response, natural-language search, recommendations, description generation, content assistant, analytics. P3 visual search.

## 3. Data model (Payload collections)
- **Users** (auth; roles: super-admin, admin, sales-manager, sales-agent, content-editor, marketing, viewer) — staff.
- **Customers** (auth; buyer register/login; saved homes, enquiry history).
- **Projects** (name, slug, area, status, hero, gallery, amenities, master plan, handover, RAJUK flag, localized text).
- **Listings/Units** (project rel, type, beds, size, price, facing, floor, status available/hold/sold, images, featured; submitted from admin).
- **Leads** (name, phone BD regex, source, project/unit, status pipeline, assignee, notes, score) + **Visits** (site-visit bookings).
- **Testimonials, News, FAQ, Stats, Media, SiteSettings (globals: header/footer/contact/social), Homepage (global: section toggles)**.
- Versions/drafts on Projects, Listings, News; audit hook on every collection.

## 4. Source mapping (prototype → app)
- `index.html` → `app/[locale]/(site)/page.tsx` — dynamic: featured projects, stats, testimonials, news, FAQ.
- `properties.html` + `js/properties.js` + `js/listings.js` → `/[locale]/properties` (server-fetched listings, client filter UI; URL-state contract kept: `view, sort, q, cat, project, area, budget, size, beds, status, year, facing, amen, rajuk, saved`).
- `property.html` + `js/property.js` + `js/property-data.js` → `/[locale]/property/[id]?unit=`.
- `js/main.js` header/mega/wishlist → layout components; `select.js` → React `Select`.
- Wishlist: localStorage `gd-wish` (`u:<id>`, `p:<id>`) for guests; synced to Customer account when logged in.
- Seed from `listings.js` (12 listings), `property-data.js`, `data.js`.

## 5. Auth model (chosen)
- Customer: `/[locale]/register`, `/login`, `/account` (saved homes, enquiries).
- Staff: Payload `/admin`; sales/admin submit properties → appear on the front immediately (published status).

## 6. i18n (chosen)
Routes `/en`, `/bn`; Payload `localization` on; UI string dictionaries; some sample Bangla; English content first.

## 7. Roadmap
1. **Setup** — Postgres 17, DB `goldeneye`, scaffold Next 16 + Payload 3, `.env`, plain-CSS port.
2. **Demo (first client showing)** — collections + seed; dynamic Properties list & Property detail; homepage sections editable; admin submits property → visible on front; customer register/login; /en,/bn skeleton.
3. **Core** — leads/visits forms saved to CRM, roles & access, wishlist sync, emails/WhatsApp stubs.
4. **Corporate pages** (18) then **5 microsites** (15 each) via a project template.
5. **Features** — 3D tour, PWA, availability, calculator, audit/revisions UI.
6. **Security + SEO hardening, performance.**
7. **AI phases 1→3.**
8. **Deploy** — Vercel, R2, Redis, Cloudflare, backups.

## 8. Local environment
- Postgres 17 via winget, port 5432, user `postgres`; DB `goldeneye`. Connection string in `.env` as `DATABASE_URI`.
- App lives in `./app` (scaffolded with create-payload-app 3.93, Next 16.4, `.env` uses `DATABASE_URL`). Node 22.16 triggers an engine warning (wants ^22.23.5) but works; upgrade Node later.
- DB schema via migrations (`app/src/migrations`): `pnpm payload migrate:create <name>` then `pnpm payload migrate`. Do NOT rely on dev push (it stalls on prompts). Seed: `pnpm seed` (tsx; needs `SEED_ADMIN_*` in `.env`).
- Run: `cd app && pnpm dev` → http://localhost:3000 (site), `/admin` (CMS).

## 9. Front-end architecture (built)
- **Hybrid port:** prototype HTML/CSS/JS reused for pixel parity. `app/scripts/build-partials.py` extracts header/footer/page bodies from `prototype/*.html` into `app/src/partials/`. Dynamic home sections (stats, news, FAQ) use `<!--TOKEN-->` markers filled server-side; projects/listings/details/testimonials are injected as `window.__GD` and consumed by the page scripts in `app/public/js` (they fall back to prototype data if absent).
- Server code: `src/lib/site.ts` (Payload -> prototype data shapes, link rewriting), `src/lib/homeSections.ts`, `src/components/Shell.tsx`.
- Routes: `/[locale]/` (home), `/properties`, `/property?id=<slug>&unit=<listingId>`, `/login`, `/register`, `/account`, `/coming-soon`. `/` redirects to `/en`. Pages are `force-dynamic`, so anything published in `/admin` shows immediately.
- Public API only returns published docs (`publishedOrStaff`). Customers register at `/api/customers`, sign in at `/api/customers/login`; wishlist (`gd-wish`) merges into `savedHomes`.
- Header/footer/page bodies are still HTML strings; converting them to React components is a later refactor (roadmap step 5+).
- **Leads:** public forms (home visit, property callback/reserve/brochure, footer newsletter) POST to `/api/lead` (validation, honeypot, rate limit, duplicate-phone note, UTM, auto-link to signed-in customer, score by type). Direct REST create on `leads` is staff-only. Customers see their own enquiries on `/account`.
- **Tracker:** home construction tracker comes from Projects > "Plan & story" > Construction tracker.
- **Bangla:** `src/lib/bn.ts` translates nav/footer/section headings (starter text; needs native review). CMS content translated per-locale in `/admin` (falls back to English).
- **Verified:** `pnpm build` passes, `pnpm start` serves all routes (prod smoke test), lead intake works end to end.
- **Not yet done (next phases):** 18 corporate pages + 5 microsites, roles-based admin dashboards/audit-trail UI, WhatsApp/SMS sending, 3D tour, PWA, AI features, real hosting (Vercel + R2 + Redis, move uploads off local `media/`), 2FA, React-component refactor of partials, real Bangla copy for all body text, master plan block on home from CMS.

## 10. QA pass (done)
Full QA sweep (crawl, forms, auth, roles, i18n, security, UI controls) done. Fixes: empty img src, password policy hook, GraphQL disabled, sparse-project property page crash, CMS-driven finder/visit selects, `requiredInDefault` for localized fields (bn saves), role access gaps (projects/leads), security headers + CSP + Secure cookies. Test data cleaned and DB re-seeded.
Known gaps: rate limiter trusts `x-forwarded-for` (OK behind Vercel/Cloudflare); brochure toast promises WhatsApp send (not implemented); mega-menu/footer project links static; `/property?id=<bad>` returns 200 then client-redirects; hero finder budget options static; Bangla body copy mostly English.

## 11. Demo data tooling
- `app/src/lib/seedDemo.ts` (shared seed), CLI `pnpm seed [--reset]`, API `/api/demo-data` (super-admin; POST disabled in production), admin view `/admin/demo-data` (sidebar link "Demo Data"). Setup docs: `SETUP.md`, `app/scripts/setup.ps1`, `.env.example` (Postgres URL).
