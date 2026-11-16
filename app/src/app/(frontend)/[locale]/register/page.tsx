import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Shell from '@/components/Shell'
import { isLocale } from '@/lib/site'

export const metadata: Metadata = { title: 'Create account — Goldeneye Developers' }

const BODY = `
<main id="main" class="auth"><div class="auth__wrap">
  <div class="auth__side">
    <p class="eyebrow">Buyer account</p>
    <h1 class="disp">Keep your shortlist safe</h1>
    <p>A free account saves the homes you like and lets our team follow up on your enquiries.</p>
    <ul><li>Save homes and plots, see them on any device</li><li>Track your site visits and enquiries</li><li>NRB? We will schedule calls to suit your time zone</li></ul>
  </div>
  <div class="auth__card">
    <h2 class="disp">Create your account</h2>
    <form id="auth-register" class="auth__form" novalidate>
      <label>Full name<input type="text" name="name" autocomplete="name" required></label>
      <div class="auth__row">
        <label>Email<input type="email" name="email" autocomplete="email" required></label>
        <label>Mobile (optional)<input type="tel" name="phone" autocomplete="tel" placeholder="01712345678"></label>
      </div>
      <div class="auth__row">
        <label>Password<input type="password" name="password" autocomplete="new-password" required minlength="8"></label>
        <label>Confirm password<input type="password" name="confirm" autocomplete="new-password" required></label>
      </div>
      <label class="auth__check"><input type="checkbox" name="nrb"> I am a non-resident Bangladeshi (NRB)</label>
      <p class="auth__err" role="alert" hidden></p>
      <button type="submit" class="btn btn--gold">Create account</button>
    </form>
    <p class="auth__alt">Already registered? <a href="login.html">Sign in</a></p>
  </div>
</div></main>
<!--FOOTER-->`

export default async function Register({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <Shell locale={locale} body={BODY} css={['account']} scripts={['main.js', 'app.js', 'account.js']} />
}
