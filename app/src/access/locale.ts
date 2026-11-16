import type { Validate } from 'payload'

/** Required in the default locale only, so translators can save a Bangla draft without re-entering every required field
    (missing translations fall back to English on the site). */
export const requiredInDefault: Validate = (value, { req }) => {
  if (req?.locale && req.locale !== 'en') return true
  const empty = value === undefined || value === null || (typeof value === 'string' && value.trim() === '')
  return empty ? 'This field is required.' : true
}
