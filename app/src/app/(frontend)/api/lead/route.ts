import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

/* Public lead intake: site visit, reserve, callback, brochure and newsletter forms.
   Validated, rate-limited and honeypot-protected; the lead is created server-side so direct REST create can stay staff-only. */

const PHONE = /^(?:\+?88)?01[3-9]\d{8}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TYPES = ['enquiry', 'visit', 'reserve', 'callback', 'newsletter'] as const
const SCORE: Record<string, number> = { reserve: 90, visit: 75, callback: 55, enquiry: 40, newsletter: 10 }

const hits = new Map<string, number[]>()
const limited = (ip: string) => {
  const now = Date.now()
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60_000)
  arr.push(now)
  hits.set(ip, arr)
  return arr.length > 6
}

const clean = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const json = (body: unknown, status = 200) => Response.json(body, { status })

export async function POST(req: Request) {
  const h = await nextHeaders()
  const ip = (h.get('x-forwarded-for') || '').split(',')[0].trim() || 'local'
  if (limited(ip)) return json({ error: 'Too many requests. Please try again in a minute.' }, 429)

  let b: Record<string, unknown>
  try {
    b = await req.json()
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }
  if (clean(b.website)) return json({ ok: true }) // honeypot: pretend success

  const type = TYPES.includes(b.type as (typeof TYPES)[number]) ? (b.type as (typeof TYPES)[number]) : 'enquiry'
  const name = clean(b.name, 120) || (type === 'newsletter' ? 'Newsletter subscriber' : '')
  const phone = clean(b.phone, 20).replace(/[\s-]/g, '')
  const email = clean(b.email, 200)
  if (name.length < 2) return json({ error: 'Please enter your name.' }, 400)
  if (type !== 'newsletter' && !PHONE.test(phone)) return json({ error: 'Enter a valid Bangladeshi mobile number.' }, 400)
  if ((type === 'newsletter' || email) && !EMAIL.test(email)) return json({ error: 'Enter a valid email address.' }, 400)

  const payload = await getPayload({ config })

  let project: number | undefined
  const pk = clean(b.project, 120)
  if (pk) {
    const r = await payload.find({
      collection: 'projects',
      where: { or: [{ slug: { equals: pk } }, { shortName: { equals: pk } }, { name: { equals: pk } }] },
      limit: 1,
      depth: 0,
      pagination: false,
    })
    project = r.docs[0]?.id as number | undefined
  }
  const listingId = Number(b.listing)
  const listing = Number.isInteger(listingId) && listingId > 0 ? listingId : undefined

  let customer: number | undefined
  try {
    const { user } = await payload.auth({ headers: h })
    if (user?.collection === 'customers') customer = user.id as number
  } catch {
    /* anonymous */
  }

  const notes: { note: string; at: string }[] = []
  if (phone) {
    const dup = await payload.find({
      collection: 'leads',
      where: { and: [{ phone: { equals: phone } }, { createdAt: { greater_than: new Date(Date.now() - 7 * 864e5).toISOString() } }] },
      limit: 1,
      depth: 0,
      pagination: false,
    })
    if (dup.docs[0]) notes.push({ note: `Possible duplicate of lead #${dup.docs[0].id} (same phone within 7 days).`, at: new Date().toISOString() })
  }

  const utm = (b.utm && typeof b.utm === 'object' ? b.utm : {}) as Record<string, unknown>
  const visitDate = clean(b.visitDate, 40)
  const lead = await payload.create({
    collection: 'leads',
    data: {
      name,
      phone: phone || undefined,
      email: email || undefined,
      type,
      project,
      listing,
      customer,
      message: clean(b.message, 1500) || undefined,
      visitDate: visitDate && !Number.isNaN(Date.parse(visitDate)) ? new Date(visitDate).toISOString() : undefined,
      visitSlot: clean(b.visitSlot, 40) || undefined,
      status: 'new',
      score: SCORE[type],
      notes,
      utm: { source: clean(utm.source, 80), medium: clean(utm.medium, 80), campaign: clean(utm.campaign, 80), page: clean(utm.page, 200) },
    },
    overrideAccess: true,
  })
  return json({ ok: true, id: lead.id })
}
