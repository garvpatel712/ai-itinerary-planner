# AI Itinerary Planner

A Next.js (app router) TypeScript app that generates AI travel itineraries, persists them to Supabase, and provides a user dashboard and admin interface.

**Contents**
- Project overview
- Local development setup
- Supabase setup (tables, RLS)
- Auth & admin workflow
- Running tests
- Development workflow
- Troubleshooting

---

**Project Overview**

- Purpose: Generate personalized travel itineraries using an AI backend (webhook), save results to a Postgres DB (Supabase), and provide user and admin dashboards.
- Tech: Next.js (14, App Router), React, TypeScript, Tailwind, Supabase (Auth + Postgres), Lucide icons.

---

**Prerequisites**

- Node.js 18+ and `pnpm` (or change commands to `npm`/`yarn`)
- A Supabase project with Auth and Postgres
- Environment file `.env` or `.env.local` configured (see below)

---

**Environment Variables**

Create a `.env.local` file in the project root with the following keys:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
# Optional: local AI webhook URL or keys
OPENAI_API_KEY=...
# Next.js specific
NODE_ENV=development
```

Never commit secret keys to source control. Use your CI/CD secrets for deployments.

---

**Quick Start (Local)**

1. Install dependencies:

```powershell
pnpm install
```

2. Copy `.env.sample` (if present) or create `.env.local` with the variables above.

3. Start the development server:

```powershell
pnpm dev
```

4. Open your browser at `http://localhost:3000` (or the port printed by Next).

5. Sign up or sign in. If you want an admin account for testing, follow the Supabase steps below.

---

**Supabase Setup**

Run the SQL in `SUPABASE_SETUP.md` (open that file) in the Supabase SQL Editor. Important items:

- Create `user_profiles` table and `itineraries` table (schema includes `payload`, `title`, `source`).
- Create `admin_users` table to track admin emails/user ids.
- Enable Row Level Security (RLS) for `user_profiles` and `itineraries` and add policies using `auth.uid() = user_id` so users can only access their own rows.
- Add an admin user (example):

```sql
-- create admin account link
INSERT INTO admin_users (user_id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'admin@gmail.com'
ON CONFLICT (email) DO NOTHING;
```

Notes:
- RLS must be enabled for per-user security. The app uses client-side Supabase queries that rely on RLS.
- If you run tests that insert rows directly, use the `SUPABASE_SERVICE_ROLE_KEY` in a secure environment.

---

**Authentication & Admin**

- The project uses Supabase Auth. The login flow checks the `admin_users` table to decide whether to redirect a user to `/admin` or `/dashboard` after sign-in.
- To create the admin account, create the user under Supabase Auth and then insert them into `admin_users` (see SQL above).

---

**Persistence / Itineraries**

- Generated itineraries are saved to the `itineraries` table with the following rules:
  - `user_id` set to the current authenticated user
  - `payload` (JSONB) contains the full AI response
  - `title`, `summary`, `destination` and other normalized columns are stored for fast queries
  - `source` defaults to `ai-generator-v1`

---

**API Endpoints**

- `POST /api/generate-itinerary` — Sends preferences to the AI webhook and returns parsed itinerary.
- `GET /api/dashboard/itineraries` — Paginated itinerary history for the authenticated user (supports `page`, `limit`, `search`).
- `/api/user/itineraries` — (GET/POST) manage itineraries via API (client mostly uses Supabase client instead of server API to respect RLS).
- `POST /api/auth/check-admin` — Check whether an email belongs to an admin account.

---

**Run Tests**

There is a simple test script that uses the Supabase service role key to insert test rows and verify ordering.

Prepare a `.env` with these variables for the test runner (do NOT commit service role key):

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
TEST_USER_ID=uuid-of-test-user
```

Run:

```powershell
pnpm run test:itineraries
```

This script is a sanity check and uses the service role key to create rows and verify results. Use it only in trusted environments.

---

**Development Workflow**

- Branching: create feature branches off `main` and open PRs for review.
- Formatting/linting: run `pnpm lint` and `pnpm build` before merging.
- Tests: run the itinerary test locally if you intend to modify DB-related logic.

---

**Deployment Notes**

- When deploying, set environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) in your hosting provider's secret store.
- Ensure RLS policies are configured in production Supabase instance.

---

**Troubleshooting**

- 401 / Unauthorized on API routes: Make sure RLS policies allow the authenticated user's `auth.uid()` and the client has a valid Supabase session.
- Itinerary not saved: check browser console for `Itinerary saved to database` log and Supabase table rows.
- Admin login failing: ensure the admin user exists in Supabase Auth and exists in `admin_users`.

---

If you want, I can also:
- Add a `README` badge matrix, CI workflow file, or a Dockerfile for production
- Add end-to-end tests that create two users and verify RLS blocks cross-user access (requires test infra)

---

**Contact / Maintainers**

Repo owner: garvpatel712

***

Generated on: 2025-11-22
