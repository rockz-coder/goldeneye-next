import type { Metadata } from 'next'
import Shell from '@/components/Shell'
import { getDetails, getListings, isLocale, partial } from '@/lib/site'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Property — Goldeneye Developers' }

export default async function Property({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const [LISTINGS, DETAILS] = await Promise.all([getListings(locale), getDetails(locale)])
  return (
    <Shell
      locale={locale}
      body={partial('property')}
      data={{ LISTINGS, DETAILS }}
      css={['props', 'property']}
      scripts={['listings.js', 'property-data.js', 'main.js', 'select.js', 'property.js', 'app.js']}
    />
  )
}
