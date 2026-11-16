import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Shell from '@/components/Shell'
import { isLocale } from '@/lib/site'

export const metadata: Metadata = { title: 'My account — Goldeneye Developers' }

const BODY = `
<main id="main" class="acct" id="account"><div class="acct__wrap" id="account">
  <p id="acct-loading" class="auth__muted">Loading your account…</p>
  <div id="acct-body" hidden>
    <div class="acct__head">
      <div><p class="eyebrow">My account</p><h1 class="disp" id="acct-name"></h1><p id="acct-email"></p></div>
      <button type="button" class="btn btn--ghost-dark" id="acct-logout">Sign out</button>
    </div>
    <h2 class="disp">My enquiries</h2>
    <ul class="acct__list" id="acct-enq"></ul>
    <h2 class="disp" style="margin-top:40px">Saved homes</h2>
    <div class="acct__grid" id="acct-saved"></div>
  </div>
</div></main>
<!--FOOTER-->`

export default async function Account({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <Shell locale={locale} body={BODY} css={['account']} scripts={['main.js', 'app.js', 'account.js']} />
}
