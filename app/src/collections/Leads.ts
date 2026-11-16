import type { CollectionConfig } from 'payload'
import { canDelete, canManageLeads, canReadLeads, canUpdateLeads } from '../access'

const PHONE = /^(?:\+?88)?01[3-9]\d{8}$/

/** Website forms (site visit, reserve, enquiry, newsletter) land here: the CRM. */
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    group: 'CRM',
    defaultColumns: ['name', 'phone', 'type', 'status', 'assignee', 'createdAt'],
  },
  versions: { maxPerDoc: 50 },
  access: {
    // public forms post to /api/lead (validated, rate-limited, server-side create); direct REST create is staff-only
    create: canManageLeads,
    read: canReadLeads,
    update: canUpdateLeads,
    delete: canDelete,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'phone',
      type: 'text',
      validate: (v: unknown, { siblingData }: { siblingData: { type?: string } }) =>
        siblingData?.type === 'newsletter' || PHONE.test(String(v || '')) || 'Enter a valid Bangladeshi mobile number',
    },
    { name: 'email', type: 'email' },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'enquiry',
      options: [
        { label: 'Enquiry', value: 'enquiry' },
        { label: 'Site visit', value: 'visit' },
        { label: 'Reserve (72h hold)', value: 'reserve' },
        { label: 'Callback', value: 'callback' },
        { label: 'Newsletter', value: 'newsletter' },
      ],
    },
    { name: 'project', type: 'relationship', relationTo: 'projects' },
    { name: 'listing', type: 'relationship', relationTo: 'listings' },
    { name: 'customer', type: 'relationship', relationTo: 'customers' },
    { name: 'message', type: 'textarea' },
    { name: 'visitDate', type: 'date' },
    { name: 'visitSlot', type: 'text' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      required: true,
      options: ['new', 'contacted', 'qualified', 'site-visit', 'negotiation', 'won', 'lost'],
    },
    { name: 'score', type: 'number', min: 0, max: 100, admin: { description: 'Lead score (AI phase 1)' } },
    { name: 'assignee', type: 'relationship', relationTo: 'users' },
    {
      name: 'notes',
      type: 'array',
      fields: [
        { name: 'note', type: 'textarea' },
        { name: 'at', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    {
      name: 'utm',
      type: 'group',
      fields: [
        { name: 'source', type: 'text' },
        { name: 'medium', type: 'text' },
        { name: 'campaign', type: 'text' },
        { name: 'page', type: 'text' },
      ],
    },
  ],
}
