import type { CollectionConfig } from 'payload'
import { anyone, canDelete, canEditContent } from '../access'
import { requiredInDefault } from '../access/locale'

export const Stats: CollectionConfig = {
  slug: 'stats',
  admin: { useAsTitle: 'label', group: 'Content' },
  access: { read: anyone, create: canEditContent, update: canEditContent, delete: canDelete },
  fields: [
    { name: 'label', type: 'text', localized: true, validate: requiredInDefault },
    { name: 'value', type: 'number', required: true },
    { name: 'prefix', type: 'text' },
    { name: 'suffix', type: 'text' },
    { name: 'decimals', type: 'number', defaultValue: 0 },
    { name: 'icon', type: 'select', options: ['calendar', 'home', 'family', 'area'], defaultValue: 'home' },
    { name: 'order', type: 'number', defaultValue: 100 },
  ],
}
