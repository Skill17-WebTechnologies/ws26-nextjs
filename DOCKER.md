# Next.js 16.1.6 — WSC2026 minimal app

```bash
docker compose up --build
```

Open **http://localhost** — a minimal Next.js App Router app (server page + client counter).
JSON API: `GET /api/tasks`.

The task list is read from a self-contained **SQLite** file (`prisma/dev.db`) with
**Prisma 7.3.0** — no database server. The entrypoint runs `prisma db push` before
starting the app, which seeds three rows on first boot.

Pinned: Node 24.1.0 / npm 11.5.0, Next.js 16.1.6, React 19.2.4, Prisma 7.3.0.
