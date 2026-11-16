import type { CollectionConfig } from 'payload'
import { anyone, canDelete, canEditContent } from '../access'
import { requiredInDefault } from '../access/locale'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  admin: { useAsTitle: 'question', group: 'Content' },
  access: { read: anyone, create: canEditContent, update: canEditContent, delete: canDelete },
  fields: [
    { name: 'question', type: 'text', localized: true, validate: requiredInDefault },
    { name: 'answer', type: 'textarea', localized: true, validate: requiredInDefault },
    { name: 'order', type: 'number', defaultValue: 100 },
  ],
}
