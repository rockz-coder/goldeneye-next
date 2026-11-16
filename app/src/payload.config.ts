import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Customers } from './collections/Customers'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Listings } from './collections/Listings'
import { Leads } from './collections/Leads'
import { Testimonials } from './collections/Testimonials'
import { News } from './collections/News'
import { Faqs } from './collections/Faqs'
import { Stats } from './collections/Stats'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' — Goldeneye CMS' },
    components: {
      afterNavLinks: ['/components/admin/DemoDataLink#default'],
      views: { demoData: { Component: '/components/admin/DemoDataView#default', path: '/demo-data' } },
    },
  },
  collections: [Users, Customers, Projects, Listings, Leads, Testimonials, News, Faqs, Stats, Media],
  globals: [SiteSettings],
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'বাংলা', code: 'bn' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  graphQL: { disable: true },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    push: false,
    pool: { connectionString: process.env.DATABASE_URL || '' },
  }),
  sharp,
  plugins: [],
})
