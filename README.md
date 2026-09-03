# Next.js 16.1.6 — WSC2026

A small, real **Next.js** application (version **16.1.6**), part of the WorldSkills 2026
Web Technologies (TP17) set. Runtime pinned to the competition spec. Task data lives in
**MySQL**, accessed through **Prisma 7.3.0**.

## Configuration

The app needs one environment variable, a MySQL connection string, resolved in this order:

1. `DATABASE_URL` in the environment (compose, Kubernetes, your shell) — always wins.
2. `.env` — local development. Copy from `.env.example`. Gitignored, and excluded from the
   Docker build context.
3. `.env.prod` — the deployed configuration, written per competitor with their own database.
   The entrypoint copies it to `.env` when the environment supplies nothing.

```bash
cp .env.example .env   # then fill in your database
```

Note that Prisma 7's CLI does not read `.env` by itself; `prisma.config.ts` loads it with
`process.loadEnvFile()`.

## Run it

```bash
docker compose up --build
```

Then open **http://localhost**. With no `DATABASE_URL` in your shell the container falls back
to `.env.prod`. It applies pending migrations, then starts the dev server.

Stop it with `docker compose down`.

## Develop

For a hot-reloading loop on your machine you need **Node 24.1.0** and **npm 11.5.0**
installed locally (the same versions the Docker image pins).

```bash
npm install
npm run db:migrate   # applies prisma/migrations to the database
npx prisma generate  # generates the client into node_modules
npm run dev
```

The dev server runs on **http://localhost** and reloads on save.
Edit **app/page.js** and **app/Counter.js** to change the app.

## Database

Tasks live in MySQL in a table named **`next_tasks`**. `app/page.js` is a server component that
queries Prisma directly (marked `force-dynamic` so it re-reads on every request);
`app/api/tasks/route.js` returns the same data as JSON. The client is created once in
`lib/prisma.js` and cached on `globalThis` so dev hot-reloads do not open a new connection pool.

## ⚠️ The database is shared

Every project a competitor creates points at the **same** MySQL database, so it will already
contain other projects' tables (a Laravel app's `users`, `notes`, `sessions`, `migrations`, …).

1. **Never run `prisma db push` or `prisma migrate dev`.** Both diff the whole database against
   `schema.prisma` and **drop every table they do not know about** — that is another project's
   data. `db push` is deliberately absent from `package.json` for this reason.
2. Model tables are **prefixed** with `@@map()` so they cannot collide. Rename the prefix per
   project; do not remove it.

Schema changes are made as **create-only migration files** and applied with
`prisma migrate deploy`, which only runs the SQL under `prisma/migrations/` and never computes a
destructive diff:

```bash
npx prisma migrate diff \
  --from-migrations prisma/migrations \
  --to-schema prisma/schema.prisma \
  --script > prisma/migrations/<timestamp>_<name>/migration.sql
npm run db:migrate
```

On first boot against a database that already holds other tables, Prisma reports `P3005`
(“schema is not empty”). The entrypoint handles this automatically: it applies each migration's
SQL directly and records it with `prisma migrate resolve --applied`, so later boots are an
ordinary no-op. Migrations ship as `CREATE TABLE IF NOT EXISTS` to make that safe.

## Tailwind CSS

Tailwind **4.1.18** is installed and wired up, but nothing in the template uses it — it is here
for you to reach for if you want it, and it costs nothing if you don't. Add utility classes to
your markup and they work straight away:

```html
<div class="rounded-xl bg-slate-800 p-6 text-slate-100">…</div>
```

`@tailwindcss/postcss` is registered in `postcss.config.mjs`. The entry stylesheet is
`app/globals.css`, imported from `app/layout.js`.

The template's own CSS lives inside Tailwind's `base` layer, and that detail matters: unlayered
CSS outranks *every* cascade layer, so left as it was a rule like `button { background: … }`
would silently beat `class="bg-blue-500"` and the class would appear to do nothing. Inside
`base` those rules still style unclassed elements, while utilities override them as expected.

Tailwind 4 needs no `tailwind.config.js` — it is configured in CSS. Customise the theme with
`@theme { … }` in `app/globals.css`. Docs: <https://tailwindcss.com/docs>

## Stack

- Node 24.1.0 / npm 11.5.0
- Next.js 16.1.6
- Prisma 7.3.0 (`@prisma/adapter-mariadb`, MySQL driver adapter)
- Tailwind CSS 4.1.18 — installed and configured, use it or ignore it
