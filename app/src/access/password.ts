import { APIError, type CollectionBeforeValidateHook } from 'payload'

/** Rejects weak passwords on create/update (Payload itself accepts any non-empty password). */
export const passwordPolicy: CollectionBeforeValidateHook = ({ data }) => {
  const pw = data?.password
  if (typeof pw === 'string' && pw.length > 0) {
    if (pw.length < 8) throw new APIError('Password must be at least 8 characters.', 400, undefined, true)
    if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) throw new APIError('Password must include letters and numbers.', 400, undefined, true)
  }
  return data
}
