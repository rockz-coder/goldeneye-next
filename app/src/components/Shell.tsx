import { toBangla } from '@/lib/bn'
import { partial, rewrite, scriptJson, type Locale } from '@/lib/site'

type Props = {
  locale: Locale
  /** partial name in src/partials (home | properties | property) or raw html */
  body: string
  /** html replacing the <!--TOKEN--> markers (e.g. STATS, NEWS, FAQ) */
  tokens?: Record<string, string>
  /** home page: transparent header over the hero */
  overlay?: boolean
  /** data exposed to the page scripts as window.__GD */
  data?: Record<string, unknown>
  /** page stylesheets from /public/css (styles, shared, select are global) */
  css: string[]
  /** scripts from /public/js, in order */
  scripts: string[]
}

/** Renders the prototype chrome + page body and loads the vanilla page scripts.
    Pages are full-document navigations (plain <a> links), so scripts always run on load. */
export default function Shell({ locale, body, tokens = {}, overlay = false, data = {}, css, scripts }: Props) {
  let header = partial('header')
  if (!overlay) header = header.replace(' site-header--overlay', '')
  let main = body
  for (const [k, v] of Object.entries(tokens)) main = main.replace(`<!--${k}-->`, v)
  main = main.replace('<!--FOOTER-->', partial('footer'))
  const merged = header + '\n' + main
  const html = rewrite(locale === 'bn' ? toBangla(merged) : merged, locale)
  const boot = `window.GD_BASE=${scriptJson('/' + locale)};window.GD_LOCALE=${scriptJson(locale)};window.__GD=${scriptJson(data)};`

  return (
    <>
      {css.map((c) => (
        <link key={c} rel="stylesheet" href={`/css/${c}.css`} />
      ))}
      <div style={{ display: 'contents' }} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />
      <script dangerouslySetInnerHTML={{ __html: boot }} />
      {scripts.map((s) => (
        <script key={s} src={`/js/${s}`} />
      ))}
    </>
  )
}
