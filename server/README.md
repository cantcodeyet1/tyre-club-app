# Tyre Club API

Express + TypeScript + Prisma backend for the Tyre Club app. Talks to Postgres (Neon free tier) and exposes the REST API the React/Capacitor frontend consumes.

## 1. Create a free Neon database

1. Go to https://neon.tech and sign up (no card required).
2. Create a project (any region close to you).
3. Copy the **Prisma-compatible connection string** from the dashboard (Connection Details, "Prisma" tab). It looks like:
   `postgresql://user:password@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require`

## 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in `DATABASE_URL` with the Neon connection string. Generate the two JWT secrets:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Run that twice and paste the values into `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.

Leave `GOOGLE_CLIENT_ID` and `RESEND_API_KEY` blank to start — Google sign-in and outgoing email are optional (see below).

## 3. Install, migrate, seed

```bash
npm install
npm run prisma:migrate -- --name init
npm run seed
```

This creates all tables in Neon and seeds the static reference data (branches, products, deals).

## 4. Run it

```bash
npm run dev
```

The API listens on `http://localhost:4000`. Health check: `GET /health`.

## Google Sign-In (optional, currently dimmed in the UI)

The Google button on Sign In / Sign Up is greyed out for now (`isGoogleSignInEnabled = false` in `src/features/auth/components/AuthScreenChrome.tsx`). The server and client wiring are both fully built — flip that flag once you're ready to turn it on:

1. https://console.cloud.google.com/apis/credentials -> Create OAuth client ID -> Application type: **Web application**.
2. Authorized JavaScript origins: `http://localhost:5173` (and your production frontend origin, e.g. your Vercel URL).
3. Copy the Client ID into `GOOGLE_CLIENT_ID` here **and** into the frontend's `VITE_GOOGLE_CLIENT_ID` env var.
4. No client secret is needed — the frontend opens a Google OAuth2 popup to get an access token, and this server verifies it directly against Google's userinfo endpoint.
5. Set `isGoogleSignInEnabled` back to `true`.

## Outgoing email (optional)

Password-reset and verify-email links are logged to the server console by default (fine for development). To send real emails for free:

1. https://resend.com -> sign up free (3,000 emails/month, no card).
2. Create an API key, put it in `RESEND_API_KEY`.
3. Verify a sending domain, or leave `MAIL_FROM` as the Resend sandbox address for testing.

## Deploying (Render free tier)

A `render.yaml` blueprint lives at the repo root. In the Render dashboard: New -> Blueprint -> connect this repo (needs to be pushed to GitHub first). Render will create the web service from `server/`, using `npm run build` then `npm run start`, running `prisma migrate deploy` automatically. You'll be prompted for `DATABASE_URL`, `CORS_ORIGIN` (your deployed Vercel frontend origin, e.g. `https://tyre-club.vercel.app`), `GOOGLE_CLIENT_ID`, `RESEND_API_KEY`, and `APP_PUBLIC_URL`.

The frontend deploys separately to Vercel — see the root [README.md](../README.md#deploying-vercel--render). Once both are live, update `CORS_ORIGIN` here to the real Vercel URL and `VITE_API_BASE_URL` there to the real Render URL.
