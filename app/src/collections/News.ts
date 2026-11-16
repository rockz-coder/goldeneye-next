import type { CollectionConfig } from 'payload'
import { canDelete, canEditContent, publishedOrStaff } from '../access'
import { requiredInDefault } from '../access/locale'

export const News: CollectionConfig = {
  slug: 'news',
  admin: { useAsTitle: 'title', group: 'Content' },
  versions: { drafts: true },
  access: { read: publishedOrStaff, create: canEditContent, update: canEditContent, delete: canDelete },
  fields: [
    { name: 'title', type: 'text', localized: true, validate: requiredInDefault },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: ['Construction', 'Handover', 'Guide', 'Press', 'Offer'],
    },
    { name: 'date', type: 'date', required: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'imagePosition', type: 'text', defaultValue: 'center' },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'body', type: 'richText', localized: true },
  ],
}
