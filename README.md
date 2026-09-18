# Tyre Club Mobile Frontend

Frontend-only Tyre Club mobile app built from the referenced design system.

## Stack

- Vite
- React
- TypeScript
- Capacitor
- Tailwind CSS
- React Router
- React Hook Form + Zod
- TanStack Query
- Zustand
- Axios API client with mock mode

## Setup

```bash
npm install
npm run dev
npm run build
npx cap add ios
npx cap add android
npx cap sync
```

## Environment

The project includes `.env.development`, `.env.staging`, and `.env.production`.

```bash
VITE_API_BASE_URL=http://localhost:4000/api
VITE_USE_MOCK_API=false
VITE_APP_NAME=Tyre Club
VITE_ENVIRONMENT=development
VITE_GOOGLE_CLIENT_ID=
```

Set `VITE_USE_MOCK_API=false` to use the real backend (this is the default in `.env.development`). Set it to `true` to run the app fully offline against local mock data.

## Backend

The Node/Express/Prisma API lives in [`server/`](server/README.md). It's a separate project with its own `package.json` — see that README for setup (Neon Postgres, Google sign-in, email, Render deployment). Quick start:

```bash
cd server
cp .env.example .env   # fill in DATABASE_URL, JWT secrets
npm install
npm run prisma:migrate -- --name init
npm run seed
npm run dev             # http://localhost:4000
```

Then in the repo root, run the frontend as usual (`npm run dev`) — it talks to `http://localhost:4000/api` by default via `.env.development`.

## Deploying (Vercel + Render)

The frontend deploys to **Vercel**, the backend to **Render** (see [server/README.md](server/README.md)).

1. Push this repo to GitHub (Vercel and Render's blueprint flow both need a connected repo).
2. **Backend first**: in the Render dashboard, New -> Blueprint -> select this repo. It picks up `render.yaml` at the repo root. Fill in `DATABASE_URL` (Neon), leave `CORS_ORIGIN` for now. Note the resulting URL, e.g. `https://tyre-club-api.onrender.com`.
3. **Frontend**: in the Vercel dashboard, New Project -> import this repo. Vercel auto-detects Vite (`vercel.json` at the repo root sets the SPA rewrite so client-side routing works on refresh). Add an environment variable `VITE_API_BASE_URL` = `https://tyre-club-api.onrender.com/api` (your Render URL + `/api`), and `VITE_USE_MOCK_API` = `false`. Deploy. Note the resulting URL, e.g. `https://tyre-club.vercel.app`.
4. Back in Render, set `CORS_ORIGIN` to your Vercel URL (`https://tyre-club.vercel.app`) and `APP_PUBLIC_URL` to the same, then redeploy the backend so it accepts requests from the live frontend and builds correct email links.

Render's free web service spins down after inactivity — the first request after idle takes ~30-50s to wake up. That's normal on the free tier.

## Architecture

Code is feature-based. Shared UI, hooks, services, API clients, auth helpers, types, and mock data live under `src/shared`.

Components do not call APIs directly. Screens compose components and call hooks. Hooks call services. Services call `apiClient` or mock data depending on environment.

## Routes

Public routes:

- `/splash`
- `/sign-in`
- `/sign-up`
- `/forgot-password`
- `/reset-password`
- `/verify-email`

Protected routes:

- `/home`
- `/vehicles`
- `/vehicles/add`
- `/vehicles/:vehicleId`
- `/vehicles/:vehicleId/edit`
- `/vehicles/:vehicleId/checks/:checkId`
- `/health`
- `/trips`
- `/trips/plan`
- `/trips/:tripId`
- `/trips/:tripId/active`
- `/trips/:tripId/edit`
- `/deals`
- `/deals/credit`
- `/deals/maz`
- `/deals/buy-tyres`
- `/tyre-club`
- `/tyre-club/branches`
- `/tyre-club/products`
- `/tyre-club/help`
- `/profile`
- `/profile/notifications`
- `/profile/settings`

## Deep Links

The Capacitor app listens for:

- `tyreclub://vehicle/:id`
- `tyreclub://vehicle/:id/check/:checkId`
- `tyreclub://trip/:id`
- `tyreclub://deal/:id`
- `tyreclub://deals/:dealId`
- `tyreclub://branch/:id/map`

## Quality Commands

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
