# Next.js 16.1.6 — WSC2026 minimal app

```bash
docker compose up --build
```

Open **http://localhost** — a minimal Next.js App Router app (server page + client counter).
JSON API: `GET /api/tasks`.

The task list is stored in **MySQL** via **Prisma 7.3.0** (`@prisma/adapter-mariadb`).
`DATABASE_URL` comes from the environment if set, otherwise from `.env.prod`; the entrypoint
runs `prisma migrate deploy` before starting the app, and three rows are seeded on first boot.

The database is shared with the competitor's other projects — see README.md before changing
the schema. Never run `prisma db push` against it.

Pinned: Node 24.1.0 / npm 11.5.0, Next.js 16.1.6, React 19.2.4, Prisma 7.3.0.
