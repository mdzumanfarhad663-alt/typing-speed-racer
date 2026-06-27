# Matka Production System — Game Result Dashboard

Production-ready Next.js 14 app that displays game results in three styled sections (Lucky Number band, Live Matka Result list, Open-to-Close Free Game Zone) with an admin panel for CRUD + drag-reorder.

**This is a presentation + CMS system only.** No payments, wallets, betting, or gambling logic.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind
- Postgres via Vercel Postgres / Neon + Drizzle ORM
- JWT auth (jose) + bcrypt single-admin login from env vars
- Public dashboard polls every 3s

## Local setup

```bash
cd matka-dashboard
npm install
cp .env.example .env

# 1. Get a Neon / Vercel Postgres URL, paste into .env as POSTGRES_URL
# 2. Generate a JWT secret and an admin password hash:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"   # -> JWT_SECRET
npm run hash -- 'your-admin-password'                                       # -> ADMIN_PASSWORD_HASH
# ⚠ When pasting the hash into .env, escape every $ with a backslash:
#   raw : $2a$10$abcd...xyz
#   .env: \$2a\$10\$abcd...xyz
# (Vercel env-var UI does NOT need the backslashes — paste the raw hash there.)
# 3. Set ADMIN_EMAIL in .env

# 4. Push schema and seed sample data:
npm run db:push
npm run seed

# 5. Run dev server:
npm run dev
# Public dashboard:  http://localhost:3000
# Admin login:       http://localhost:3000/admin/login
```

## Deploy to Vercel

1. Push this folder to GitHub.
2. New Vercel project → set **Root Directory** to `matka-dashboard`.
3. Add Vercel Postgres (Neon) integration — `POSTGRES_URL` is injected automatically.
4. Add env vars: `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`.
5. After first deploy, run `npm run db:push` locally pointing at the prod DB (or wire it into a build step).

## What the admin can do

- Add / edit / delete rows in each of the 3 sections.
- Pick a per-row title color.
- Set Left/Right tags (Jodi / Panel) and Time Range.
- Mark a row as "highlighted" (yellow band like KALYAN MORNING).
- Add multi-line tips + a date label in the Free Zone.
- Drag-reorder rows; the public site reflects changes within 3s.
