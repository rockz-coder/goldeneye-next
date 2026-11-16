import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "leads" ALTER COLUMN "phone" DROP NOT NULL;
  ALTER TABLE "_leads_v" ALTER COLUMN "version_phone" DROP NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "leads" ALTER COLUMN "phone" SET NOT NULL;
  ALTER TABLE "_leads_v" ALTER COLUMN "version_phone" SET NOT NULL;`)
}
