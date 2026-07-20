# Listings backend (PHP, flat-file, no database)

Standalone PHP scripts, not processed by Vite. They read/write a single
`data/projects.json` file and serve uploaded images from `assets/uploaded/`.
No `/api` prefix — every script is called as a root-relative path
(`/list-listings.php`, etc.) because in production this folder's contents
are copied into the same document root as the built frontend (`dist/`).

## Local development

1. Copy `config.example.php` to `config.php` and set `ADMIN_KEY` to
   whatever you want your local admin password / shared secret to be
   (the default `changeme` works fine for local dev). `config.php` is
   gitignored — never commit your real value.
2. At the repo root, copy `.env.example` to `.env` and set
   `VITE_ADMIN_PASSWORD` to the **same value** as `ADMIN_KEY` above — the
   `/admin` login screen and the `X-Admin-Key` header it sends both come
   from this one value. `.env` is gitignored.
3. Requires PHP installed locally (`php -v` to check). Run the built-in
   server from the repo root:
   ```
   php -S localhost:8080 -t server
   ```
4. In another terminal, `npm run dev` as usual. `vite.config.ts` proxies
   every `*.php` path (and `/assets/uploaded`) to `localhost:8080`, so the
   frontend's `fetch("/list-listings.php")` calls just work — no CORS
   config needed on the frontend side, and it behaves the same way it
   will in production (same-origin).

If PHP isn't available locally, these scripts can only be checked with
`php -l server/*.php` (syntax only) and tested for real after deploying to
cPanel.

## Deployment (cPanel shared hosting)

1. Set a real `VITE_ADMIN_PASSWORD` in `.env` (repo root) and the matching
   `ADMIN_KEY` in `server/config.php` — do this *before* building, since
   Vite inlines `VITE_*` vars into the JS bundle at build time.
2. `npm run build` at the repo root.
3. Upload the contents of `dist/` to the cPanel document root.
4. Upload this entire `server/` folder's contents (all `.php` files,
   `data/`, `assets/`) into the same document root, alongside `dist/`'s
   files. **Do not** upload `config.example.php`'s placeholder value as
   your real `config.php` — set a real `ADMIN_KEY` before deploying.
5. Confirm PHP has write permission to `data/projects.json` and
   `assets/uploaded/` (cPanel's PHP typically runs as the account user,
   so this is usually fine by default — verify if writes 500).

## Known limitations (accepted tradeoffs, not bugs)

- **No database, no locking library.** Reads/writes to `data/projects.json`
  use `flock()` to avoid the worst two-tabs-open corruption, but this is
  not a substitute for real concurrency control. Fine for single-admin use.
- **No image resizing.** Uploaded images are stored and served at whatever
  resolution was uploaded — no responsive `srcset` variants are generated.
- **The admin "auth" is not real security.** See `config.example.php` for
  the full explanation — the shared secret ships in the client bundle.
