import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import { LOCALES, isLocale } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Goldeneye Developers — Homes built on proof, not promises',
  description:
    'RAJUK-approved apartments and planned plot communities across Dhaka, with every land document, price and construction photo out in the open.',
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..700&family=Instrument+Sans:wght@400..700&family=Hind+Siliguri:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/css/styles.css" />
        <link rel="stylesheet" href="/css/shared.css" />
        <link rel="stylesheet" href="/css/select.css" />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');" }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
