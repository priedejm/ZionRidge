# Listings backend (PHP, flat-file, no database)

Standalone PHP scripts, not processed by Vite. They read/write a single
`data/projects.json` file and serve uploaded images from `assets/uploaded/`.
No `/api` prefix — every script is called as a root-relative path
(`/list-listings.php`, etc.) because in production this folder's contents
are copied into the same document root as the built frontend (`dist/`).

## Local development

1. Copy `config.example.php` to `config.php` and set `ADMIN_KEY` to
   whatever you want your local admin password to be (the default
   `changeme` works fine for local dev). `config.php` is gitignored —
   never commit your real value. This is the only place the password
   lives; the `/admin` login screen checks it via `login.php`.
2. Requires PHP installed locally (`php -v` to check). Run the built-in
   server from the repo root:
   ```
   php -S localhost:8080 -t server
   ```
3. In another terminal, `npm run dev` as usual. `vite.config.ts` proxies
   every `*.php` path (and `/assets/uploaded`) to `localhost:8080`, so the
   frontend's `fetch("/list-listings.php")` calls just work — no CORS
   config needed on the frontend side, and it behaves the same way it
   will in production (same-origin).

If PHP isn't available locally, these scripts can only be checked with
`php -l server/*.php` (syntax only) and tested for real after deploying to
cPanel.

## Deployment (cPanel shared hosting)

1. `npm run build` at the repo root.
2. Upload the contents of `dist/` to the cPanel document root.
3. Upload this entire `server/` folder's contents (all `.php` files,
   `data/`, `assets/`) into the same document root, alongside `dist/`'s
   files. **Do not** upload `config.example.php`'s placeholder value as
   your real `config.php` — set a real `ADMIN_KEY` before deploying.
   To change the password later, edit `ADMIN_KEY` in the live
   `config.php` — no rebuild needed.
4. Confirm PHP has write permission to `data/projects.json` and
   `assets/uploaded/` (cPanel's PHP typically runs as the account user,
   so this is usually fine by default — verify if writes 500).

## Site photos

The admin's **Site Photos** tab replaces fixed photos around the marketing
site (home sections, About banner, team headshots, the listing placeholder).
Overrides live in `data/site-images.json` keyed by slot, with files in
`assets/uploaded/site/`. A slot with no entry uses the photo built into the
frontend. Endpoints: `list-site-images.php` (public GET),
`upload-site-image.php` and `reset-site-image.php` (admin). To add a slot,
add it to both `SITE_IMAGE_SLOTS` in `_common.php` and
`src/lib/siteImages.ts`.

## Known limitations (accepted tradeoffs, not bugs)

- **No database, no locking library.** Reads/writes to `data/projects.json`
  use `flock()` to avoid the worst two-tabs-open corruption, but this is
  not a substitute for real concurrency control. Fine for single-admin use.
- **Basic image resizing only.** The admin UI downscales photos to 2400px
  JPEG in the browser before upload; no responsive `srcset` variants are
  generated.
- **Simple shared-password auth.** One password, no user accounts, no
  lockout (`login.php` only adds a 1s delay on a wrong guess). The
  password is kept in the browser's sessionStorage for the tab's session.
  Serve the site over HTTPS so it isn't sent in the clear.
