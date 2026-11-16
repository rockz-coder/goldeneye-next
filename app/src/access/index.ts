import type { Access, FieldAccess } from 'payload'

export type Role =
  | 'super-admin'
  | 'admin'
  | 'sales-manager'
  | 'sales-agent'
  | 'content-editor'
  | 'marketing'
  | 'viewer'

export const ROLES: { label: string; value: Role }[] = [
  { label: 'Super admin', value: 'super-admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Sales manager', value: 'sales-manager' },
  { label: 'Sales agent', value: 'sales-agent' },
  { label: 'Content editor', value: 'content-editor' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Viewer (read-only)', value: 'viewer' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const has = (user: any, roles: Role[]) =>
  Boolean(user && user.collection !== 'customers' && roles.includes(user.role))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isStaff = (user: any) => Boolean(user && user.collection !== 'customers')

export const anyone: Access = () => true
export const staffOnly: Access = ({ req }) => isStaff(req.user)
export const adminOnly: Access = ({ req }) => has(req.user, ['super-admin', 'admin'])

/** May create/edit properties and site content. */
export const canEditContent: Access = ({ req }) =>
  has(req.user, ['super-admin', 'admin', 'sales-manager', 'sales-agent', 'content-editor'])

/** Projects are curated by managers/editors; sales agents only submit listings. */
export const canEditProjects: Access = ({ req }) =>
  has(req.user, ['super-admin', 'admin', 'sales-manager', 'content-editor'])

/** Leads: managers see all; sales agents only leads assigned to them or still unassigned; viewers read-only. */
const leadScope = (req: Parameters<Access>[0]['req'], roles: Role[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const u = req.user as any
  if (!u || u.collection === 'customers') return false
  if (u.role === 'sales-agent') return { or: [{ assignee: { equals: u.id } }, { assignee: { exists: false } }] }
  return roles.includes(u.role)
}
export const canReadLeads: Access = ({ req }) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req.user as any)?.collection === 'customers'
    ? { customer: { equals: req.user!.id } }
    : leadScope(req, ['super-admin', 'admin', 'sales-manager', 'marketing', 'viewer'])
export const canUpdateLeads: Access = ({ req }) => leadScope(req, ['super-admin', 'admin', 'sales-manager', 'marketing'])

export const canManageLeads: Access = ({ req }) =>
  has(req.user, ['super-admin', 'admin', 'sales-manager', 'sales-agent', 'marketing'])

export const canDelete: Access = ({ req }) =>
  has(req.user, ['super-admin', 'admin', 'sales-manager'])

/** Public sees published records only; staff see everything. */
export const publishedOrStaff: Access = ({ req }) =>
  isStaff(req.user) ? true : { _status: { equals: 'published' } }

export const adminFieldOnly: FieldAccess = ({ req }) => has(req.user, ['super-admin', 'admin'])
