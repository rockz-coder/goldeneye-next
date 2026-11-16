import type { CollectionConfig } from 'payload'
import { anyone, canDelete, canEditContent } from '../access'
import { requiredInDefault } from '../access/locale'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'name', group: 'Content' },
  access: { read: anyone, create: canEditContent, update: canEditContent, delete: canDelete },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'initials', type: 'text', required: true, maxLength: 3 },
    { name: 'meta', type: 'text', localized: true, admin: { description: 'e.g. Goldeneye Heights · Bashundhara' } },
    { name: 'quote', type: 'textarea', localized: true, validate: requiredInDefault },
    { name: 'order', type: 'number', defaultValue: 100 },
  ],
}
