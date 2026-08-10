import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

// SQLite only — a self-contained file, no external database server. The entrypoint runs
// `prisma db push` to create it before the server starts.
function createClient() {
  const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./prisma/dev.db' })
  return new PrismaClient({ adapter })
}

// `next dev` re-evaluates modules on every hot reload; cache the client on globalThis so
// each reload does not open another connection to the SQLite file.
const globalForPrisma = globalThis
export const prisma = globalForPrisma.prisma || createClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function getTasks() {
  try {
    return await prisma.task.findMany({ orderBy: { id: 'asc' } })
  } catch (e) {
    return null // database unavailable
  }
}

// Seed once per process, not once per request.
let seeding
export function ensureSeeded() {
  return (seeding ??= seed())
}

async function seed() {
  try {
    if ((await prisma.task.count()) === 0) {
      await prisma.task.createMany({
        data: [
          { title: 'Define the schema', done: true },
          { title: 'Run prisma db push', done: true },
          { title: 'Query from a server component', done: false },
        ],
      })
    }
  } catch (e) {
    console.error('seed skipped (database not ready):', e.message)
  }
}
