import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Shell from '@/components/Shell'
import { esc, isLocale } from '@/lib/site'

export const metadata: Metadata = { title: 'Coming soon — Goldeneye Developers' }

export default async function ComingSoon({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const { page } = await searchParams
  const body = `
<main id="main" class="auth"><div class="auth__wrap" style="grid-template-columns:1fr;text-align:center">
  <div><p class="eyebrow">${esc(page || 'This page')}</p><h1 class="disp" style="font-size:clamp(34px,5vw,60px);margin:0 0 14px">Coming soon</h1>
  <p style="margin:0 auto 24px;color:var(--muted)">We are building this page. In the meantime, browse our homes or talk to a relationship manager.</p>
  <a href="properties.html" class="btn btn--gold">Browse properties</a></div>
</div></main>
<!--FOOTER-->`
  return <Shell locale={locale} body={body} css={['account']} scripts={['main.js', 'app.js']} />
}
