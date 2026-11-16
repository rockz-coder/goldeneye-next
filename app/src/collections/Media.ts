import type { CollectionConfig } from 'payload'
import { anyone, canEditContent } from '../access'
import { requiredInDefault } from '../access/locale'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content' },
  access: { read: anyone, create: canEditContent, update: canEditContent, delete: canEditContent },
  fields: [{ name: 'alt', type: 'text', localized: true, validate: requiredInDefault }],
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumb', width: 480 },
      { name: 'card', width: 960 },
      { name: 'hero', width: 1920 },
    ],
  },
}
