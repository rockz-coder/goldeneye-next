import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Shell from '@/components/Shell'
import { isLocale } from '@/lib/site'

export const metadata: Metadata = { title: 'Sign in — Goldeneye Developers' }

const BODY = `
<main id="main" class="auth"><div class="auth__wrap">
  <div class="auth__side">
    <p class="eyebrow">Buyer account</p>
    <h1 class="disp">Welcome back</h1>
    <p>Sign in to see the homes you saved and pick up where you left off.</p>
    <ul><li>Saved homes on every device</li><li>Your enquiry history in one place</li><li>Priority callbacks from our relationship managers</li></ul>
  </div>
  <div class="auth__card">
    <h2 class="disp">Sign in</h2>
    <form id="auth-login" class="auth__form" novalidate>
      <label>Email<input type="email" name="email" autocomplete="email" required></label>
      <label>Password<input type="password" name="password" autocomplete="current-password" required></label>
      <p class="auth__err" role="alert" hidden></p>
      <button type="submit" class="btn btn--gold">Sign in</button>
    </form>
    <p class="auth__alt">New here? <a href="register.html">Create an account</a></p>
  </div>
</div></main>
<!--FOOTER-->`

export default async function Login({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <Shell locale={locale} body={BODY.replace('register.html', `/${locale}/register`)} css={['account']} scripts={['main.js', 'app.js', 'account.js']} />
}
