import { getPayload } from 'payload'
import config from '@payload-config'
import { seedDemo } from '@/lib/seedDemo'

export const dynamic = 'force-dynamic'

async function guard(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user || (user as { collection?: string }).collection !== 'users' || (user as { role?: string }).role !== 'super-admin') {
    return { payload, error: Response.json({ error: 'Super-admin only' }, { status: 403 }) }
  }
  return { payload, error: null }
}

export async function GET(req: Request) {
  const { payload, error } = await guard(req)
  if (error) return error
  const c = async (collection: 'projects' | 'listings' | 'news' | 'faqs' | 'testimonials' | 'stats' | 'media') =>
    (await payload.count({ collection })).totalDocs
  return Response.json({
    production: process.env.NODE_ENV === 'production',
    counts: { projects: await c('projects'), listings: await c('listings'), news: await c('news'), faqs: await c('faqs'), testimonials: await c('testimonials'), stats: await c('stats'), media: await c('media') },
  })
}

export async function POST(req: Request) {
  const { payload, error } = await guard(req)
  if (error) return error
  if (process.env.NODE_ENV === 'production') return Response.json({ error: 'Disabled in production' }, { status: 403 })
  let body: { reset?: boolean } = {}
  try { body = await req.json() } catch {}
  const logs: string[] = []
  try {
    const r = await seedDemo(payload, { reset: !!body.reset, log: (m) => logs.push(m) })
    return Response.json({ ok: true, skipped: r.skipped, log: logs })
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : 'Seed failed', log: logs }, { status: 500 })
  }
}
