import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_tracker_stage" AS ENUM('0', '1', '2', '3', '4');
  CREATE TYPE "public"."enum__projects_v_version_tracker_stage" AS ENUM('0', '1', '2', '3', '4');
  CREATE TABLE "projects_tracker_dates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "projects_tracker_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" varchar,
  	"image_id" integer,
  	"position" varchar DEFAULT 'center'
  );
  
  CREATE TABLE "projects_tracker_photos_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_tracker_dates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_tracker_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" varchar,
  	"image_id" integer,
  	"position" varchar DEFAULT 'center',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_tracker_photos_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "projects" ADD COLUMN "tracker_enabled" boolean;
  ALTER TABLE "projects" ADD COLUMN "tracker_stage" "enum_projects_tracker_stage" DEFAULT '1';
  ALTER TABLE "projects_locales" ADD COLUMN "tracker_loc_line" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "tracker_note" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_tracker_enabled" boolean;
  ALTER TABLE "_projects_v" ADD COLUMN "version_tracker_stage" "enum__projects_v_version_tracker_stage" DEFAULT '1';
  ALTER TABLE "_projects_v_locales" ADD COLUMN "version_tracker_loc_line" varchar;
  ALTER TABLE "_projects_v_locales" ADD COLUMN "version_tracker_note" varchar;
  ALTER TABLE "projects_tracker_dates" ADD CONSTRAINT "projects_tracker_dates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_tracker_photos" ADD CONSTRAINT "projects_tracker_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_tracker_photos" ADD CONSTRAINT "projects_tracker_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_tracker_photos_locales" ADD CONSTRAINT "projects_tracker_photos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_tracker_photos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_tracker_dates" ADD CONSTRAINT "_projects_v_version_tracker_dates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_tracker_photos" ADD CONSTRAINT "_projects_v_version_tracker_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_tracker_photos" ADD CONSTRAINT "_projects_v_version_tracker_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_tracker_photos_locales" ADD CONSTRAINT "_projects_v_version_tracker_photos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_tracker_photos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_tracker_dates_order_idx" ON "projects_tracker_dates" USING btree ("_order");
  CREATE INDEX "projects_tracker_dates_parent_id_idx" ON "projects_tracker_dates" USING btree ("_parent_id");
  CREATE INDEX "projects_tracker_photos_order_idx" ON "projects_tracker_photos" USING btree ("_order");
  CREATE INDEX "projects_tracker_photos_parent_id_idx" ON "projects_tracker_photos" USING btree ("_parent_id");
  CREATE INDEX "projects_tracker_photos_image_idx" ON "projects_tracker_photos" USING btree ("image_id");
  CREATE UNIQUE INDEX "projects_tracker_photos_locales_locale_parent_id_unique" ON "projects_tracker_photos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_tracker_photos_locales_parent_id_idx" ON "projects_tracker_photos_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_tracker_dates_order_idx" ON "_projects_v_version_tracker_dates" USING btree ("_order");
  CREATE INDEX "_projects_v_version_tracker_dates_parent_id_idx" ON "_projects_v_version_tracker_dates" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_tracker_photos_order_idx" ON "_projects_v_version_tracker_photos" USING btree ("_order");
  CREATE INDEX "_projects_v_version_tracker_photos_parent_id_idx" ON "_projects_v_version_tracker_photos" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_tracker_photos_image_idx" ON "_projects_v_version_tracker_photos" USING btree ("image_id");
  CREATE UNIQUE INDEX "_projects_v_version_tracker_photos_locales_locale_parent_id_" ON "_projects_v_version_tracker_photos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_tracker_photos_locales_parent_id_idx" ON "_projects_v_version_tracker_photos_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects_tracker_dates" CASCADE;
  DROP TABLE "projects_tracker_photos" CASCADE;
  DROP TABLE "projects_tracker_photos_locales" CASCADE;
  DROP TABLE "_projects_v_version_tracker_dates" CASCADE;
  DROP TABLE "_projects_v_version_tracker_photos" CASCADE;
  DROP TABLE "_projects_v_version_tracker_photos_locales" CASCADE;
  ALTER TABLE "projects" DROP COLUMN "tracker_enabled";
  ALTER TABLE "projects" DROP COLUMN "tracker_stage";
  ALTER TABLE "projects_locales" DROP COLUMN "tracker_loc_line";
  ALTER TABLE "projects_locales" DROP COLUMN "tracker_note";
  ALTER TABLE "_projects_v" DROP COLUMN "version_tracker_enabled";
  ALTER TABLE "_projects_v" DROP COLUMN "version_tracker_stage";
  ALTER TABLE "_projects_v_locales" DROP COLUMN "version_tracker_loc_line";
  ALTER TABLE "_projects_v_locales" DROP COLUMN "version_tracker_note";
  DROP TYPE "public"."enum_projects_tracker_stage";
  DROP TYPE "public"."enum__projects_v_version_tracker_stage";`)
}
