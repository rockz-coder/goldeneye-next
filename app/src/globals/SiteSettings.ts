import type { GlobalConfig } from 'payload'
import { adminOnly, anyone } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: adminOnly },
  fields: [
    { name: 'phone', type: 'text', defaultValue: '+880 1700-000000' },
    { name: 'whatsapp', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'address', type: 'textarea', localized: true },
    { name: 'social', type: 'array', fields: [{ name: 'platform', type: 'text' }, { name: 'url', type: 'text' }] },
    { name: 'heroHeadline', type: 'text', localized: true, defaultValue: 'Find a home you can trust' },
    { name: 'heroSub', type: 'textarea', localized: true },
  ],
}
