# Goldeneye — local setup & demo import

## Requirements
Node 22, pnpm 9, PostgreSQL 17 (empty database named `goldeneye`).

## Steps (from the `app` folder)
1. Create the DB: `createdb goldeneye` (or via pgAdmin).
2. `powershell -File scripts/setup.ps1` — first run creates `.env`; edit `DATABASE_URL` (your Postgres password) and `SEED_ADMIN_PASSWORD`, then run it again.
   Manual equivalent: copy `.env.example` to `.env`, then `pnpm install`, `pnpm payload migrate`, `pnpm seed`.
3. `pnpm dev` → site http://localhost:3000, admin http://localhost:3000/admin
4. Log in with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `.env`.

## Demo data
- CLI: `pnpm seed` (skips if content exists), `pnpm seed --reset` (wipes content, reloads demo).
- Admin UI: sidebar → **Demo Data** (super-admin only): *Import demo data* / *Reset to demo*. Reset keeps users and customers, deletes content and leads. Disabled when `NODE_ENV=production`.

## Notes
- Database schema comes from migrations (`pnpm payload migrate`); the admin button cannot create tables.
- The prototype in `../prototype` must stay next to `app` (the seed reads it).
