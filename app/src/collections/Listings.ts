import type { CollectionConfig } from 'payload'
import { canDelete, canEditContent, publishedOrStaff } from '../access'
import { requiredInDefault } from '../access/locale'

/** A single sellable unit / plot / floor. Sales staff submit these in /admin and they appear on the website. */
export const Listings: CollectionConfig = {
  slug: 'listings',
  admin: {
    useAsTitle: 'title',
    group: 'Properties',
    defaultColumns: ['title', 'project', 'category', 'price', 'stage', '_status'],
  },
  versions: { drafts: true, maxPerDoc: 25 },
  access: { read: publishedOrStaff, create: canEditContent, update: canEditContent, delete: canDelete },
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation === 'create' && req.user && req.user.collection === 'users' && !data.submittedBy) {
          data.submittedBy = req.user.id
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', localized: true, validate: requiredInDefault },
    { name: 'project', type: 'relationship', relationTo: 'projects', required: true },
    { name: 'category', type: 'select', required: true, options: ['Apartment', 'Duplex', 'Penthouse', 'Plot', 'Commercial'] },
    { name: 'beds', type: 'number', defaultValue: 0 },
    { name: 'size', type: 'number', required: true },
    { name: 'sizeUnit', type: 'select', defaultValue: 'sqft', options: ['sqft', 'katha'] },
    { name: 'price', type: 'number', required: true, admin: { description: 'In BDT, e.g. 11500000' } },
    {
      name: 'stage',
      type: 'select',
      required: true,
      defaultValue: 'construction',
      options: [
        { label: 'Ready to move', value: 'ready' },
        { label: 'Under construction', value: 'construction' },
        { label: 'Upcoming', value: 'upcoming' },
      ],
    },
    { name: 'availability', type: 'select', defaultValue: 'available', options: ['available', 'hold', 'sold'] },
    { name: 'handoverYear', type: 'number' },
    { name: 'facing', type: 'select', options: ['North', 'South', 'East', 'West', 'Lake view'] },
    { name: 'amenities', type: 'select', hasMany: true, options: ['Pool', 'Gym', 'Parking', 'Lake view', 'Corner'] },
    { name: 'rajuk', type: 'checkbox', label: 'RAJUK-approved', defaultValue: true },
    { name: 'rank', type: 'number', defaultValue: 100, admin: { description: 'Lower = shown first' } },
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'position', type: 'text', defaultValue: 'center' },
      ],
    },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'submittedBy', type: 'relationship', relationTo: 'users', admin: { position: 'sidebar', readOnly: true } },
  ],
}
