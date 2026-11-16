import type { CollectionConfig } from 'payload'
import { passwordPolicy } from '../access/password'
import { adminOnly, isStaff } from '../access'

const PHONE = /^(?:\+?88)?01[3-9]\d{8}$/

/** Public buyer accounts: register / login on the website. */
export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: { useAsTitle: 'email', group: 'CRM', defaultColumns: ['email', 'name', 'phone', 'createdAt'] },
  auth: { cookies: { secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' }, maxLoginAttempts: 5, lockTime: 10 * 60 * 1000, tokenExpiration: 60 * 60 * 24 * 7 },
  hooks: { beforeValidate: [passwordPolicy] },
  access: {
    create: () => true, // self-registration
    read: ({ req }) => (isStaff(req.user) ? true : req.user ? { id: { equals: req.user.id } } : false),
    update: ({ req }) => (isStaff(req.user) ? true : req.user ? { id: { equals: req.user.id } } : false),
    delete: adminOnly,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'phone',
      type: 'text',
      validate: (v: unknown) => !v || PHONE.test(String(v)) || 'Enter a valid Bangladeshi mobile number',
    },
    { name: 'isNRB', type: 'checkbox', label: 'Non-resident Bangladeshi' },
    { name: 'preferredLanguage', type: 'select', options: ['en', 'bn'], defaultValue: 'en' },
    {
      name: 'savedHomes',
      type: 'json',
      label: 'Saved homes',
      admin: { description: 'Wishlist ids, e.g. ["u:h1","p:riviera"]' },
      defaultValue: [],
    },
  ],
}
