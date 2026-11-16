/* Server-side data access for the public website.
   Reads Payload content (published only) and maps it to the shapes the prototype scripts expect (window.__GD). */
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'

export const LOCALES = ['en', 'bn'] as const
export type Locale = (typeof LOCALES)[number]
export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v)

/* ---------- partial HTML (extracted from the prototype by scripts/build-partials.py) ---------- */
const cache = new Map<string, string>()
export function partial(name: string): string {
  if (process.env.NODE_ENV === 'production' && cache.has(name)) return cache.get(name)!
  const html = fs.readFileSync(path.join(process.cwd(), 'src/partials', `${name}.html`), 'utf8')
  cache.set(name, html)
  return html
}

/** Rewrites prototype *.html links and image paths to Next routes for a locale. */
export function rewrite(html: string, locale: Locale): string {
  const base = `/${locale}`
  return html
    .replace(/index\.html#visit/g, `${base}#visit`)
    .replace(/href="index\.html"/g, `href="${base}"`)
    .replace(/properties\.html/g, `${base}/properties`)
    .replace(/property\.html/g, `${base}/property`)
    .replace(/coming-soon\.html/g, `${base}/coming-soon`)
    .replace(/login\.html/g, `${base}/login`)
    .replace(/(src|href)="images\//g, '$1="/images/')
    .replace(/url\((['"]?)images\//g, 'url($1/images/')
}

export const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c as '&'] as string)

/** JSON that is safe inside an inline <script>. */
export const scriptJson = (v: unknown) =>
  JSON.stringify(v)
    .replace(/</g, '\\u003c')
    .split(String.fromCharCode(0x2028)).join('\\u2028')
    .split(String.fromCharCode(0x2029)).join('\\u2029')

/* ---------- mapping helpers ---------- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = any

const url = (m: Doc, size?: string): string => {
  if (!m || typeof m !== 'object') return ''
  return (size && m.sizes?.[size]?.url) || m.url || ''
}
const list = (a: Doc, key = 'text'): string[] => (Array.isArray(a) ? a.map((x) => x?.[key] ?? '') : [])

const getP = () => getPayload({ config })
const published = { _status: { equals: 'published' } } as const

export async function getListings(locale: Locale) {
  const payload = await getP()
  const res = await payload.find({
    collection: 'listings', where: published, limit: 500, depth: 2, locale, fallbackLocale: 'en', sort: 'rank', draft: false,
  })
  return res.docs
    .filter((l: Doc) => l.project && typeof l.project === 'object')
    .map((l: Doc) => ({
      id: String(l.id),
      projId: l.project.slug,
      title: l.title,
      project: l.project.shortName,
      cat: l.category,
      area: l.project.area,
      loc: l.project.location,
      beds: l.beds ?? 0,
      size: l.size,
      unit: l.sizeUnit || 'sqft',
      price: l.price,
      status: l.stage,
      avail: l.availability,
      handover: l.handoverYear || l.project.handoverYear || 0,
      rajuk: !!l.rajuk,
      facing: l.facing || '',
      amen: l.amenities || [],
      rank: l.rank ?? 100,
      imgs: (l.images || []).map((i: Doc) => [url(i.image, 'card'), i.position || 'center']),
      x: l.project.mapX ?? 50,
      y: l.project.mapY ?? 50,
    }))
}

async function getProjectDocs(locale: Locale) {
  const payload = await getP()
  const res = await payload.find({
    collection: 'projects', where: published, limit: 100, depth: 2, locale, fallbackLocale: 'en', sort: 'order', draft: false,
  })
  return res.docs as Doc[]
}

export async function getProjects(locale: Locale) {
  const docs = await getProjectDocs(locale)
  return docs
    .filter((p) => p.featured !== false)
    .map((p) => ({
      id: p.slug,
      short: p.shortName,
      key: p.plots ? 'plots' : p.stage,
      name: p.name,
      loc: p.location,
      type: p.category,
      badge: p.badge || '',
      badgeCls: p.badgeStyle || 'ok',
      specs: list(p.specs),
      progLabel: p.progressLabel || '',
      prog: p.progress ?? 0,
      price: p.priceFrom || '',
      img: url(p.heroImage, 'card'),
      pos: p.heroPosition || 'center',
      alt: p.name,
      href: `/${locale}/property?id=${p.slug}`,
    }))
}

export async function getTracker(locale: Locale) {
  const docs = (await getProjectDocs(locale)).filter((p) => p.tracker?.enabled)
  return docs.map((p) => ({
    label: p.shortName,
    name: p.name,
    loc: p.tracker.locLine || p.location,
    pct: p.progress ?? 0,
    note: p.tracker.note || '',
    stage: Number(p.tracker.stage ?? 1),
    dates: list(p.tracker.dates),
    photos: (p.tracker.photos || []).map((x: Doc) => ({ date: x.date, title: x.title, img: url(x.image, 'card'), pos: x.position || 'center' })),
  }))
}

/** every published project (name + area) for form dropdowns */
export async function getProjectOptions(locale: Locale) {
  const docs = await getProjectDocs(locale)
  return docs.map((p) => ({ name: p.name as string, area: p.area as string }))
}

const DEFAULT_FAQ = [
  ['Can I see the documents before I pay anything?', 'Yes. Every document listed on this page is shared with you and your lawyer before any booking money is taken.'],
  ['What are the registration costs?', 'Government registration fees, stamp duty and taxes are paid by the buyer at registration. We give you a written estimate with your price sheet.'],
  ['Can I visit the site?', 'Free site visits run seven days a week. Book one from the form and we arrange pick-up from your area on request.'],
]

export async function getDetails(locale: Locale) {
  const docs = await getProjectDocs(locale)
  const out: Record<string, unknown> = {}
  for (const p of docs) {
    const gal = (p.gallery || []).map((g: Doc) => [url(g.image, 'hero'), g.position || 'center', g.caption || '', g.category || 'Exterior'])
    const mp = p.masterplan?.image
    const stageLabel = ({ ready: 'Ready to move', construction: 'Under construction', upcoming: 'Upcoming' } as Record<string, string>)[p.stage] || ''
    const overview = list(p.overview)
    while (overview.length < 2) overview.push(overview.length === 0 ? `${p.name} in ${p.area}` : p.location || '')
    const facts = (p.facts || []).map((f: Doc) => [f.label, f.value, f.suffix || ''])
    if (!facts.length) {
      facts.push(['Starting price', p.priceFrom || 'On request', ''], ['Type', p.category, ''], ['Area', p.area, ''], ['Status', stageLabel, ''])
    }
    const stats = (p.stats || []).map((s: Doc) => [s.label, s.value])
    if (!stats.length) stats.push(['Location', p.area], ['Type', p.category], ['Status', stageLabel])
    out[p.slug] = {
      id: p.slug,
      kind: p.plots ? 'plot' : 'unit',
      name: p.name,
      short: p.shortName,
      area: p.area,
      loc: p.location,
      locLine: p.locLine || p.location,
      hero: [url(p.heroImage, 'hero'), p.heroPosition || 'center'],
      tags: list(p.tags),
      deal: p.dealNote || '',
      cta: [p.ctaLabel || 'Explore homes', 'plot'],
      facts,
      from: p.priceShort || p.priceFrom || '',
      sold: [p.unitsSold ?? 0, p.unitsTotal ?? 0],
      progress: p.progress ?? 0,
      progressNote: p.progressNote || '',
      overview,
      stats,
      amenities: list(p.amenities),
      masterplan: mp
        ? {
            img: [url(mp, 'hero'), p.masterplan.position || 'center'],
            alt: p.masterplan.alt || '',
            spots: (p.masterplan.spots || []).map((s: Doc) => [s.x, s.y, s.title || '', s.text || '']),
          }
        : null,
      layouts: p.layouts?.length ? p.layouts.map((l: Doc) => [l.katha, l.katha, l.title || '', l.coverage || '', l.typical || '']) : null,
      timeline: (p.timeline || []).map((t: Doc) => [t.year, t.title, t.text, ...(t.image ? [[url(t.image, 'card'), t.position || 'center']] : [])]),
      nearby: (p.nearby || []).map((n: Doc) => [n.place, n.kind, n.distance, n.time]),
      roadLbl: p.roadLabel || '',
      docs: (p.docs || []).map((d: Doc) => [d.title, d.note]),
      why: [p.whyTitle || '', list(p.whyPoints)],
      quote: [p.quoteText || '', p.quoteBy || ''],
      faq: p.faq?.length ? p.faq.map((f: Doc) => [f.q, f.a]) : DEFAULT_FAQ,
      gallery: gal.length ? gal : [[url(p.heroImage, 'hero'), p.heroPosition || 'center', p.name, 'Exterior']],
    }
  }
  return out
}

export async function getTestimonials(locale: Locale) {
  const payload = await getP()
  const res = await payload.find({ collection: 'testimonials', limit: 50, sort: 'order', locale, fallbackLocale: 'en', depth: 0 })
  return res.docs.map((t: Doc) => ({ ini: t.initials, name: t.name, meta: t.meta || '', quote: t.quote }))
}

export async function getStats(locale: Locale) {
  const payload = await getP()
  return (await payload.find({ collection: 'stats', limit: 20, sort: 'order', locale, fallbackLocale: 'en', depth: 0 })).docs as Doc[]
}
export async function getNews(locale: Locale) {
  const payload = await getP()
  return (
    await payload.find({ collection: 'news', where: published, limit: 3, sort: '-date', locale, fallbackLocale: 'en', depth: 1, draft: false })
  ).docs as Doc[]
}
export async function getFaqs(locale: Locale) {
  const payload = await getP()
  return (await payload.find({ collection: 'faqs', limit: 50, sort: 'order', locale, fallbackLocale: 'en', depth: 0 })).docs as Doc[]
}
export const mediaUrl = url
