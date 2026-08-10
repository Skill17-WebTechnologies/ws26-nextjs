import { getTasks, ensureSeeded } from '../../../lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  await ensureSeeded()
  const tasks = await getTasks()
  if (!tasks) {
    return Response.json(
      { framework: 'Next.js', version: '16.1.6', error: 'database unavailable' },
      { status: 503 },
    )
  }
  return Response.json({ framework: 'Next.js', version: '16.1.6', orm: 'Prisma 7.3.0', tasks })
}
