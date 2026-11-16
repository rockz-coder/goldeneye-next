import type { CollectionConfig } from 'payload'
import { passwordPolicy } from '../access/password'
import { ROLES, adminFieldOnly, adminOnly, staffOnly } from '../access'

/** Staff accounts (Payload /admin). Buyers live in the Customers collection. */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email', group: 'Team' },
  auth: { cookies: { secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' }, maxLoginAttempts: 5, lockTime: 10 * 60 * 1000 },
  hooks: { beforeValidate: [passwordPolicy] },
  access: {
    read: staffOnly,
    create: adminOnly,
    update: ({ req }) => {
      if (!req.user) return false
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (['super-admin', 'admin'].includes((req.user as any).role)) return true
      return { id: { equals: req.user.id } }
    },
    delete: adminOnly,
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      options: ROLES,
      defaultValue: 'super-admin',
      required: true,
      saveToJWT: true,
      access: { update: adminFieldOnly },
    },
  ],
}
