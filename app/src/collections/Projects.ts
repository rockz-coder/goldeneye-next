import type { CollectionConfig, Field } from 'payload'
import { canDelete, canEditProjects, publishedOrStaff } from '../access'
import { requiredInDefault } from '../access/locale'

const pairs = (name: string): Field => ({
  name,
  type: 'array',
  fields: [
    { name: 'label', type: 'text', localized: true },
    { name: 'value', type: 'text', localized: true },
    { name: 'suffix', type: 'text', localized: true },
  ],
})

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'name',
    group: 'Properties',
    defaultColumns: ['name', 'category', 'area', 'stage', '_status'],
  },
  versions: { drafts: true, maxPerDoc: 25 },
  access: { read: publishedOrStaff, create: canEditProjects, update: canEditProjects, delete: canDelete },
  fields: [
    { name: 'name', type: 'text', localized: true, validate: requiredInDefault },
    { name: 'shortName', type: 'text', required: true, admin: { description: 'e.g. Heights (used in filters)' } },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, admin: { description: 'URL id, e.g. heights' } },
    { name: 'category', type: 'select', required: true, options: ['Apartment', 'Duplex', 'Plot', 'Commercial'] },
    { name: 'area', type: 'text', required: true },
    { name: 'location', type: 'text', localized: true, validate: requiredInDefault },
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
    { name: 'plots', type: 'checkbox', label: 'Plot project (land)' },
    { name: 'badge', type: 'text', localized: true },
    { name: 'badgeStyle', type: 'select', defaultValue: 'ok', options: ['ok', 'gold', 'ink', 'warn', 'white'] },
    { name: 'specs', type: 'array', fields: [{ name: 'text', type: 'text', localized: true }] },
    { name: 'priceFrom', type: 'text', localized: true, admin: { description: 'Display text, e.g. ৳1.15 Crore' } },
    { name: 'progress', type: 'number', min: 0, max: 100 },
    { name: 'progressLabel', type: 'text', localized: true },
    { name: 'handoverYear', type: 'number' },
    { name: 'rajuk', type: 'checkbox', label: 'RAJUK-approved', defaultValue: true },
    { name: 'mapX', type: 'number', admin: { description: 'Map pin X % (0-100)' } },
    { name: 'mapY', type: 'number', admin: { description: 'Map pin Y % (0-100)' } },
    { name: 'featured', type: 'checkbox', label: 'Show on homepage', defaultValue: true },
    { name: 'order', type: 'number', defaultValue: 100 },
    { name: 'heroImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'heroPosition', type: 'text', defaultValue: 'center' },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            { name: 'tags', type: 'array', fields: [{ name: 'text', type: 'text', localized: true }] },
            { name: 'locLine', type: 'text', localized: true, admin: { description: 'Line under the hero title' } },
            { name: 'ctaLabel', type: 'text', localized: true, defaultValue: 'Explore homes' },
            { name: 'priceShort', type: 'text', localized: true, admin: { description: 'e.g. ৳1.15 Cr' } },
            { name: 'unitsSold', type: 'number' },
            { name: 'unitsTotal', type: 'number' },
            { name: 'progressNote', type: 'text', localized: true },
            { name: 'overview', type: 'array', fields: [{ name: 'text', type: 'textarea', localized: true }] },
            { name: 'dealNote', type: 'text', localized: true },
            pairs('facts'),
            pairs('stats'),
            { name: 'amenities', type: 'array', fields: [{ name: 'text', type: 'text', localized: true }] },
          ],
        },
        {
          label: 'Timeline & location',
          fields: [
            {
              name: 'timeline',
              type: 'array',
              fields: [
                { name: 'year', type: 'text' },
                { name: 'title', type: 'text', localized: true },
                { name: 'text', type: 'textarea', localized: true },
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'position', type: 'text', defaultValue: 'center' },
              ],
            },
            {
              name: 'nearby',
              type: 'array',
              fields: [
                { name: 'place', type: 'text' },
                { name: 'kind', type: 'text' },
                { name: 'distance', type: 'text' },
                { name: 'time', type: 'text' },
              ],
            },
            { name: 'roadLabel', type: 'text' },
            {
              name: 'docs',
              type: 'array',
              label: 'Verified documents',
              fields: [
                { name: 'title', type: 'text', localized: true },
                { name: 'note', type: 'text', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Gallery & FAQ',
          fields: [
            {
              name: 'gallery',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'caption', type: 'text', localized: true },
                { name: 'category', type: 'select', options: ['Exterior', 'Interior', 'Site', 'Amenities'] },
                { name: 'position', type: 'text', defaultValue: 'center' },
              ],
            },
            {
              name: 'faq',
              type: 'array',
              fields: [
                { name: 'q', type: 'text', localized: true },
                { name: 'a', type: 'textarea', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Plan & story',
          fields: [
            {
              name: 'masterplan',
              type: 'group',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'position', type: 'text', defaultValue: 'center' },
                { name: 'alt', type: 'text', localized: true },
                {
                  name: 'spots',
                  type: 'array',
                  fields: [
                    { name: 'x', type: 'number', required: true },
                    { name: 'y', type: 'number', required: true },
                    { name: 'title', type: 'text', localized: true },
                    { name: 'text', type: 'textarea', localized: true },
                  ],
                },
              ],
            },
            {
              name: 'layouts',
              type: 'array',
              label: 'Plot layouts',
              fields: [
                { name: 'katha', type: 'number', required: true },
                { name: 'title', type: 'text', localized: true },
                { name: 'coverage', type: 'text' },
                { name: 'typical', type: 'text', admin: { description: 'Format: Typical: 36 ft × 90 ft' } },
              ],
            },
            {
              name: 'tracker',
              type: 'group',
              label: 'Construction tracker (home page)',
              fields: [
                { name: 'enabled', type: 'checkbox', label: 'Show in tracker' },
                { name: 'locLine', type: 'text', localized: true },
                { name: 'note', type: 'text', localized: true, admin: { description: 'e.g. On schedule · Floor 11 of 18 cast' } },
                {
                  name: 'stage',
                  type: 'select',
                  defaultValue: '1',
                  options: [
                    { label: 'Foundation', value: '0' },
                    { label: 'Structure', value: '1' },
                    { label: 'Brickwork', value: '2' },
                    { label: 'Finishing', value: '3' },
                    { label: 'Handover', value: '4' },
                  ],
                },
                { name: 'dates', type: 'array', maxRows: 5, admin: { description: 'Milestone dates in stage order' }, fields: [{ name: 'text', type: 'text' }] },
                {
                  name: 'photos',
                  type: 'array',
                  label: 'Progress photos',
                  fields: [
                    { name: 'date', type: 'text' },
                    { name: 'title', type: 'text', localized: true },
                    { name: 'image', type: 'upload', relationTo: 'media', required: true },
                    { name: 'position', type: 'text', defaultValue: 'center' },
                  ],
                },
              ],
            },
            { name: 'whyTitle', type: 'text', localized: true },
            { name: 'whyPoints', type: 'array', fields: [{ name: 'text', type: 'text', localized: true }] },
            { name: 'quoteText', type: 'textarea', localized: true },
            { name: 'quoteBy', type: 'text', localized: true },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'metaTitle', type: 'text', localized: true },
            { name: 'metaDescription', type: 'textarea', localized: true },
          ],
        },
      ],
    },
  ],
}
