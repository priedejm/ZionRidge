
## Zion Ridge Development — Investor Website

A 4-page marketing site (Home, About, Projects, Contact) with a strict dark green / cream alternating palette, bold condensed typography, and reusable section components. Mobile-first.

---

### Design system (src/styles.css)

- Tokens (oklch equivalents of the hexes):
  - `--background` = cream `#F0EDE6`
  - `--foreground` = dark green `#2D5240`
  - `--primary` = dark green, `--primary-foreground` = cream
  - `--accent-green` (lighter green for ticker / hover states)
  - `--border` = subtle cream-on-green / green-on-cream variants
- No white anywhere; every section is either `bg-primary text-primary-foreground` (dark green) or `bg-background text-foreground` (cream).
- Typography via `<link>` in `__root.tsx`:
  - Headings: **Oswald** (bold, condensed, uppercase tracking-wide for labels)
  - Body: **Inter** (clean, readable)
  - Tokens: `--font-display`, `--font-body` in `@theme`
- Buttons: square corners only (`rounded-none`) — `cream-outline` (transparent w/ cream border) and `green-solid` variants. No pill shapes.
- Logo: upload `ZRD_LOGO.svg` via lovable-assets; derive mountain-mark-only favicon (crop) — used in nav top-left and footer.

### Global layout

- `src/routes/__root.tsx` — html shell, font links, favicon link, mounts `<Nav />` + `<Outlet />` + `<Footer />`.
- `components/site/Nav.tsx` — sticky dark-green bar: cream logo left, links right (Home · About · Projects · Contact). Mobile: hamburger → cream sheet over green.
- `components/site/Footer.tsx` — dark green, 3 columns (nav links · contact info · logo mark + disclaimer line at bottom).
- `components/site/SectionTransition` helper to enforce alternating green↔cream.
- Reusable: `StatTicker`, `ProjectCard`, `StepItem`, `TeamCard`, `Button` variants.

### Routes

```text
src/routes/
  __root.tsx
  index.tsx          → Home
  about.tsx          → About
  projects.tsx       → Projects (with filter)
  contact.tsx        → Contact
```

Each route file sets its own `head()` (title, description, og:title, og:description).

### Home (`/`)

1. **Hero** — near-full-viewport dark green, centered Oswald headline "Driven by Vision. Built for Returns.", subtext, single cream-outlined CTA → `/projects`. No imagery.
2. **Stats ticker** — slightly lighter green strip, infinite horizontal marquee (CSS keyframes, duplicated track) — Projects Completed · Land Acquired · Active Developments · Investors Partnered with placeholder numbers.
3. **What We Do** — dark green; 3 cards with subtle cream 1px borders: Land Acquisition / Development / Investor Partnerships. Each: spaced-caps label, bold Oswald title, 2-sentence body.
4. **About teaser** — split 50/50: left cream w/ brand story + "Meet the Team" link → `/about`; right full-bleed property photo (generated image).
5. **Featured Projects** — dark green; 3 cards (photo, name, location, status badge Active/Completed/Upcoming).
6. **How to Partner** — cream; numbered steps 1–3 left, property photo right.
7. **CTA strip** — dark green band, "Ready to invest with us?" + "Schedule a Call" → `/contact`.

### About (`/about`)

- Hero (dark green): page title + intro.
- Brand story (cream): mission + values, two-column long-form.
- Team (dark green): grid of headshot placeholder cards (3–4), name, role.
- Stats bar (cream): projects · acreage · markets.
- CTA strip.

### Projects (`/projects`)

- Hero (dark green): title + 1-line summary.
- Filter bar (cream): All / Previous / Current / Future — segmented buttons (square), client-side filter via `useState`.
- Photo grid (dark green): cards with photo, name, location, status badge, 1-line description. Cream text, subtle cream borders.
- CTA strip.

### Contact (`/contact`)

- Hero (dark green): "Schedule a Call" / "Get in Touch".
- Cream section: contact details + simple inquiry form (name, email, message). Form is presentational only (no backend in this plan).

### Images

- Generate 4–5 property/landscape photos for hero teasers, About split, How-to-Partner, Project cards. Earthy/mountain/development imagery to match the warm photo-driven feel.
- Upload provided `ZRD_LOGO.svg` via lovable-assets; use crop/mountain-mark for favicon.

### Out of scope (this plan)

- No backend / Lovable Cloud (no form submission, no CMS). Form is UI-only.
- No analytics, payments, or auth.

---

### Technical notes

- Tailwind v4: tokens in `@theme inline` in `src/styles.css`; fonts loaded via `<link>` in `__root.tsx` head (never `@import` URL).
- Marquee: pure CSS `@keyframes` translateX with duplicated content for seamless loop, `prefers-reduced-motion` pauses it.
- All buttons authored with cva variants; square corners enforced.
- Status badges: small uppercase Oswald label with colored dot (Active=accent green, Completed=cream, Upcoming=muted).
- Filter on Projects uses local `useState` over a typed array of project objects in `src/data/projects.ts`.
