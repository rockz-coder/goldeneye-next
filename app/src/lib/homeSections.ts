import { STAT_ICONS } from './statIcons'
import { esc, mediaUrl, type Locale } from './site'

/* eslint-disable @typescript-eslint/no-explicit-any */
export function statsHtml(stats: any[]): string {
  return stats
    .map((s) => {
      const v = Number(s.value)
      const dec = s.decimals ? ` data-dec="${s.decimals}"` : ''
      const sep = v >= 1000 ? ' data-sep="1"' : ''
      const shown = v.toLocaleString('en-US', { minimumFractionDigits: s.decimals || 0, maximumFractionDigits: s.decimals || 0 })
      const suf = String(s.suffix || '').trim()
      const sufHtml = suf ? (suf === '+' ? `<b>${esc(suf)}</b>` : `<b class="stat__u">${esc(suf)}</b>`) : ''
      return `<article class="stat"><span class="stat__ic">${STAT_ICONS[s.icon] || STAT_ICONS.home}</span><p class="disp num stat__n"><span data-count="${v}"${dec}${sep}>${shown}</span>${sufHtml}</p><p class="stat__l">${esc(s.label)}</p><span class="stat__line" aria-hidden="true"></span></article>`
    })
    .join('\n')
}

export function newsHtml(news: any[], locale: Locale): string {
  return news
    .map((n) => {
      const d = new Date(n.date)
      const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
      const img = mediaUrl(n.image, 'card')
      return `<a href="/${locale}/coming-soon?page=News" class="news__item" data-reveal><span class="news__img zoom"><img src="${esc(img)}" alt="${esc(n.title)}" style="object-position:${esc(n.imagePosition || 'center')}" loading="lazy"></span><span class="news__meta">${esc(String(n.category).toUpperCase())} · ${date}</span><span class="news__t disp">${esc(n.title)}</span></a>`
    })
    .join('\n')
}

export function faqHtml(faqs: any[]): string {
  return faqs
    .map(
      (f, i) =>
        `<details name="faq"${i === 0 ? ' open' : ''}><summary>${esc(f.question)}<span class="plus" aria-hidden="true">+</span></summary><p>${esc(f.answer)}</p></details>`,
    )
    .join('\n')
}

export function areasHtml(projects: { area: string }[]): string {
  const areas = [...new Set(projects.map((p) => p.area).filter(Boolean))]
  return `<option value="">All of Dhaka</option>` + areas.map((a) => `<option>${esc(a)}</option>`).join('')
}

export function visitProjectsHtml(projects: { name: string }[]): string {
  return projects.map((p) => `<option>${esc(p.name)}</option>`).join('') + '<option>Not sure yet</option>'
}
