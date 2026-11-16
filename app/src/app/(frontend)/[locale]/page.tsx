import Shell from '@/components/Shell'
import { areasHtml, faqHtml, newsHtml, statsHtml, visitProjectsHtml } from '@/lib/homeSections'
import { getFaqs, getNews, getProjectOptions, getProjects, getStats, getTestimonials, getTracker, isLocale, partial } from '@/lib/site'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const [PROJECTS, TESTIMONIALS, stats, news, faqs, TRACKER, PROJECTS_RAW] = await Promise.all([
    getProjects(locale),
    getTestimonials(locale),
    getStats(locale),
    getNews(locale),
    getFaqs(locale),
    getTracker(locale),
    getProjectOptions(locale),
  ])
  return (
    <Shell
      locale={locale}
      overlay
      body={partial('home')}
      tokens={{
        STATS: statsHtml(stats),
        NEWS: newsHtml(news, locale),
        FAQ: faqHtml(faqs),
        AREAS: areasHtml(PROJECTS_RAW),
        VISIT_PROJECTS: visitProjectsHtml(PROJECTS_RAW),
      }}
      data={{ PROJECTS, TESTIMONIALS, TRACKER }}
      css={['home']}
      scripts={['data.js', 'main.js', 'select.js', 'home.js', 'app.js']}
    />
  )
}
