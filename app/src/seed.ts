/* CLI: pnpm seed   (idempotent: skips if projects exist; --reset wipes seeded content first) */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'
import { seedDemo } from './lib/seedDemo'

async function main() {
  const payload = await getPayload({ config })
  await seedDemo(payload, { reset: process.argv.includes('--reset') })
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
