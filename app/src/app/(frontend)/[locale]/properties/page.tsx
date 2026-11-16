import type { Metadata } from 'next'
import Shell from '@/components/Shell'
import { getListings, isLocale, partial } from '@/lib/site'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Properties — Goldeneye Developers',
  description: 'Browse apartments, duplexes, plots and commercial space across Dhaka.',
}

export default async function Properties({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const LISTINGS = await getListings(locale)
  return (
    <Shell
      locale={locale}
      body={partial('properties')}
      data={{ LISTINGS }}
      css={['props']}
      scripts={['listings.js', 'main.js', 'select.js', 'properties.js', 'app.js']}
    />
  )
}
