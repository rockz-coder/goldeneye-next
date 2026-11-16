/* Demo-content seeding, shared by the CLI (src/seed.ts) and the admin "Demo Data" page. Reads ../prototype/js/*.js. */
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import type { Payload } from 'payload'

export async function seedDemo(payload: Payload, opts: { reset?: boolean; log?: (m: string) => void } = {}) {
  const reset = !!opts.reset
  const log = opts.log ?? ((m: string) => console.log('[seed]', m))
  const proto = path.resolve(process.cwd(), '../prototype')
  const read = (f: string) => fs.readFileSync(path.join(proto, 'js', f), 'utf8')
  const ctx = vm.createContext({})
  vm.runInContext([read('listings.js'), read('data.js'), read('property-data.js')].join('\n;\n'), ctx)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const get = (name: string): any => vm.runInContext(name, ctx)
  const LISTINGS = get('LISTINGS')
  const PROJECTS = get('PROJECTS')
  const DETAILS = get('DETAILS')
  const TESTIMONIALS = get('TESTIMONIALS')
  const TRACKER = get('TRACKER')
  if (reset) {
    for (const c of ['listings', 'leads', 'projects', 'testimonials', 'news', 'faqs', 'stats', 'media'] as const) {
      await payload.delete({ collection: c, where: { id: { exists: true } }, overrideAccess: true })
    }
    log('cleared content collections')
  }
  const existing = await payload.count({ collection: 'projects' })
  if (existing.totalDocs > 0) {
    log('projects already exist, nothing to do (run with --reset to re-seed)')
    return { skipped: true }
  }

  // ---- first super-admin (credentials from .env, local dev only)
  const adminEmail = process.env.SEED_ADMIN_EMAIL
  const adminPassword = process.env.SEED_ADMIN_PASSWORD
  if (adminEmail && adminPassword) {
    const u = await payload.count({ collection: 'users' })
    if (u.totalDocs === 0) {
      await payload.create({ collection: 'users', data: { email: adminEmail, password: adminPassword, name: 'Admin', role: 'super-admin' } })
      log('super-admin created')
    }
  }

  // ---- media
  const media: Record<string, number> = {}
  const alts: Record<string, string> = {
    heights: 'Goldeneye Heights tower', riviera: 'Riviera residential towers beside a lake', greenvalley: 'Green Valley plots and roads',
    orchid: 'Orchid duplex with pool at dusk', interior: 'Home interior', masterplan: 'Master plan', nrb: 'Community hall', tour: 'Podium pool deck',
  }
  for (const key of Object.keys(alts)) {
    const doc = await payload.create({
      collection: 'media',
      data: { alt: alts[key] },
      filePath: path.join(proto, 'images', `${key}.jpg`),
    })
    media[key] = doc.id as number
  }
  log(`media: ${Object.keys(media).length}`)

  // ---- projects
  const projectId: Record<string, number> = {}
  let order = 0
  for (const p of PROJECTS) {
    const d = DETAILS[p.id]
    order += 10
    const doc = await payload.create({
      collection: 'projects',
      draft: false,
      data: {
        _status: 'published',
        name: p.name,
        shortName: d.short,
        slug: p.id,
        category: p.type,
        area: d.area,
        location: p.loc,
        stage: p.key === 'plots' ? 'construction' : p.key,
        plots: d.kind === 'plot',
        badge: p.badge,
        badgeStyle: p.badgeCls,
        specs: p.specs.map((text: string) => ({ text })),
        priceFrom: p.price,
        progress: p.prog,
        progressLabel: p.progLabel,
        rajuk: p.id !== 'horizon',
        featured: true,
        order,
        heroImage: media[d.hero[0]],
        heroPosition: d.hero[1],
        tags: d.tags.map((text: string) => ({ text })),
        locLine: d.locLine,
        ctaLabel: d.cta[0],
        priceShort: d.from,
        unitsSold: d.sold[0],
        unitsTotal: d.sold[1],
        progressNote: d.progressNote,
        whyTitle: d.why[0],
        whyPoints: d.why[1].map((text: string) => ({ text })),
        quoteText: d.quote[0],
        quoteBy: d.quote[1],
        masterplan: d.masterplan
          ? {
              image: media[d.masterplan.img[0]],
              position: d.masterplan.img[1],
              alt: d.masterplan.alt,
              spots: d.masterplan.spots.map(([x, y, title, text]: (number | string)[]) => ({ x, y, title, text })),
            }
          : undefined,
        layouts: d.layouts
          ? d.layouts.map(([katha, , title, coverage, typical]: (number | string)[]) => ({ katha, title, coverage, typical }))
          : undefined,
        overview: d.overview.map((text: string) => ({ text })),
        dealNote: d.deal,
        facts: d.facts.map(([label, value, suffix]: string[]) => ({ label, value, suffix })),
        stats: d.stats.map(([label, value]: string[]) => ({ label, value })),
        amenities: d.amenities.map((text: string) => ({ text })),
        timeline: d.timeline.map(([year, title, text, im]: (string | string[])[]) => ({
          year, title, text,
          image: im ? media[im[0]] : undefined,
          position: im ? im[1] : undefined,
        })),
        nearby: d.nearby.map(([place, kind, distance, time]: string[]) => ({ place, kind, distance, time })),
        roadLabel: d.roadLbl,
        docs: d.docs.map(([title, note]: string[]) => ({ title, note })),
        gallery: d.gallery.map(([img, position, caption, category]: string[]) => ({ image: media[img], position, caption, category })),
        faq: d.faq.map(([q, a]: string[]) => ({ q, a })),
        tracker: (() => {
          const t = TRACKER.find((x: { label: string }) => x.label.toLowerCase() === d.short.toLowerCase())
          if (!t) return { enabled: false }
          return {
            enabled: true,
            locLine: t.loc,
            note: t.note,
            stage: String(t.stage),
            dates: t.dates.map((text: string) => ({ text })),
            photos: t.photos.map((ph: { date: string; title: string; img: string; pos: string }) => ({
              date: ph.date,
              title: ph.title,
              image: media[ph.img.replace('images/', '').replace('.jpg', '')],
              position: ph.pos,
            })),
          }
        })() as never,
        metaTitle: `${p.name} · ${p.loc}`,
        metaDescription: d.overview[0],
      },
    })
    projectId[p.id] = doc.id as number
  }
  log(`projects: ${PROJECTS.length}`)

  // ---- listings
  for (const l of LISTINGS) {
    await payload.create({
      collection: 'listings',
      draft: false,
      data: {
        _status: 'published',
        title: l.title,
        project: projectId[l.projId],
        category: l.cat,
        beds: l.beds,
        size: l.size,
        sizeUnit: l.unit,
        price: l.price,
        stage: l.status,
        availability: 'available',
        handoverYear: l.handover,
        facing: l.facing,
        amenities: l.amen,
        rajuk: l.rajuk,
        rank: l.rank,
        images: l.imgs.map(([k, position]: string[]) => ({ image: media[k], position })),
      },
    })
  }
  log(`listings: ${LISTINGS.length}`)

  // ---- testimonials
  let t = 0
  for (const x of TESTIMONIALS) {
    await payload.create({ collection: 'testimonials', data: { name: x.name, initials: x.ini, meta: x.meta, quote: x.quote, order: (t += 10) } })
  }

  // ---- news
  const news = [
    ['Riviera Tower B tops out its 11th floor slab, two weeks early', 'riviera-tower-b-11th-floor', 'Construction', '2026-10-28', 'riviera', 'center'],
    ['46 families receive keys at Goldeneye Heights, Bashundhara', 'heights-handover-46-families', 'Handover', '2026-09-12', 'heights', 'center 20%'],
    ['Buying land in Purbachal: the 7 documents to check first', 'purbachal-land-7-documents', 'Guide', '2026-08-20', 'greenvalley', 'center'],
  ] as const
  for (const [title, slug, category, date, img, pos] of news) {
    await payload.create({ collection: 'news', draft: false, data: { _status: 'published', title, slug, category, date, image: media[img], imagePosition: pos } })
  }

  // ---- FAQs (from index.html)
  const html = fs.readFileSync(path.join(proto, 'index.html'), 'utf8')
  const faqs = [...html.matchAll(/<summary>(.*?)<span class="plus"[^>]*>\+<\/span><\/summary><p>(.*?)<\/p>/g)]
  let f = 0
  for (const m of faqs) await payload.create({ collection: 'faqs', data: { question: m[1], answer: m[2].replace(/<[^>]+>/g, ''), order: (f += 10) } })
  log(`faqs: ${faqs.length}`)

  // ---- stats (homepage counters)
  const statRows = [
    ['Years building in Dhaka', 17, '', '', 0, 'calendar'],
    ['Projects handed over', 12, '', '', 0, 'home'],
    ['Families living in a Goldeneye home', 2500, '', '+', 0, 'family'],
    ['Square feet delivered', 3.1, '', ' M', 1, 'area'],
  ] as const
  let s = 0
  for (const [label, value, prefix, suffix, decimals, icon] of statRows) {
    await payload.create({ collection: 'stats', data: { label, value, prefix, suffix, decimals, icon, order: (s += 10) } })
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      phone: '+880 1700-000000',
      email: 'hello@goldeneye.test',
      heroHeadline: 'Find a home you can trust',
      heroSub: 'Verified land papers, fixed prices and handover on time.',
    },
  })

  log('done')
  return { skipped: false }
}
