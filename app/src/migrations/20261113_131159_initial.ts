import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'bn');
  CREATE TYPE "public"."enum_users_role" AS ENUM('super-admin', 'admin', 'sales-manager', 'sales-agent', 'content-editor', 'marketing', 'viewer');
  CREATE TYPE "public"."enum_customers_preferred_language" AS ENUM('en', 'bn');
  CREATE TYPE "public"."enum_projects_gallery_category" AS ENUM('Exterior', 'Interior', 'Site', 'Amenities');
  CREATE TYPE "public"."enum_projects_category" AS ENUM('Apartment', 'Duplex', 'Plot', 'Commercial');
  CREATE TYPE "public"."enum_projects_stage" AS ENUM('ready', 'construction', 'upcoming');
  CREATE TYPE "public"."enum_projects_badge_style" AS ENUM('ok', 'gold', 'ink', 'warn', 'white');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_gallery_category" AS ENUM('Exterior', 'Interior', 'Site', 'Amenities');
  CREATE TYPE "public"."enum__projects_v_version_category" AS ENUM('Apartment', 'Duplex', 'Plot', 'Commercial');
  CREATE TYPE "public"."enum__projects_v_version_stage" AS ENUM('ready', 'construction', 'upcoming');
  CREATE TYPE "public"."enum__projects_v_version_badge_style" AS ENUM('ok', 'gold', 'ink', 'warn', 'white');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_published_locale" AS ENUM('en', 'bn');
  CREATE TYPE "public"."enum_listings_amenities" AS ENUM('Pool', 'Gym', 'Parking', 'Lake view', 'Corner');
  CREATE TYPE "public"."enum_listings_category" AS ENUM('Apartment', 'Duplex', 'Penthouse', 'Plot', 'Commercial');
  CREATE TYPE "public"."enum_listings_size_unit" AS ENUM('sqft', 'katha');
  CREATE TYPE "public"."enum_listings_stage" AS ENUM('ready', 'construction', 'upcoming');
  CREATE TYPE "public"."enum_listings_availability" AS ENUM('available', 'hold', 'sold');
  CREATE TYPE "public"."enum_listings_facing" AS ENUM('North', 'South', 'East', 'West', 'Lake view');
  CREATE TYPE "public"."enum_listings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__listings_v_version_amenities" AS ENUM('Pool', 'Gym', 'Parking', 'Lake view', 'Corner');
  CREATE TYPE "public"."enum__listings_v_version_category" AS ENUM('Apartment', 'Duplex', 'Penthouse', 'Plot', 'Commercial');
  CREATE TYPE "public"."enum__listings_v_version_size_unit" AS ENUM('sqft', 'katha');
  CREATE TYPE "public"."enum__listings_v_version_stage" AS ENUM('ready', 'construction', 'upcoming');
  CREATE TYPE "public"."enum__listings_v_version_availability" AS ENUM('available', 'hold', 'sold');
  CREATE TYPE "public"."enum__listings_v_version_facing" AS ENUM('North', 'South', 'East', 'West', 'Lake view');
  CREATE TYPE "public"."enum__listings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__listings_v_published_locale" AS ENUM('en', 'bn');
  CREATE TYPE "public"."enum_leads_type" AS ENUM('enquiry', 'visit', 'reserve', 'callback', 'newsletter');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'contacted', 'qualified', 'site-visit', 'negotiation', 'won', 'lost');
  CREATE TYPE "public"."enum__leads_v_version_type" AS ENUM('enquiry', 'visit', 'reserve', 'callback', 'newsletter');
  CREATE TYPE "public"."enum__leads_v_version_status" AS ENUM('new', 'contacted', 'qualified', 'site-visit', 'negotiation', 'won', 'lost');
  CREATE TYPE "public"."enum_news_category" AS ENUM('Construction', 'Handover', 'Guide', 'Press', 'Offer');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_category" AS ENUM('Construction', 'Handover', 'Guide', 'Press', 'Offer');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_published_locale" AS ENUM('en', 'bn');
  CREATE TYPE "public"."enum_stats_icon" AS ENUM('calendar', 'home', 'family', 'area');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'super-admin' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "customers_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "customers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar,
  	"is_n_r_b" boolean,
  	"preferred_language" "enum_customers_preferred_language" DEFAULT 'en',
  	"saved_homes" jsonb DEFAULT '[]'::jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "projects_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "projects_specs_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "projects_tags_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_overview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "projects_overview_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "projects_facts_locales" (
  	"label" varchar,
  	"value" varchar,
  	"suffix" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "projects_stats_locales" (
  	"label" varchar,
  	"value" varchar,
  	"suffix" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_amenities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "projects_amenities_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"image_id" integer,
  	"position" varchar DEFAULT 'center'
  );
  
  CREATE TABLE "projects_timeline_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_nearby" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"place" varchar,
  	"kind" varchar,
  	"distance" varchar,
  	"time" varchar
  );
  
  CREATE TABLE "projects_docs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "projects_docs_locales" (
  	"title" varchar,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"category" "enum_projects_gallery_category",
  	"position" varchar DEFAULT 'center'
  );
  
  CREATE TABLE "projects_gallery_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "projects_faq_locales" (
  	"q" varchar,
  	"a" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_masterplan_spots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"x" numeric,
  	"y" numeric
  );
  
  CREATE TABLE "projects_masterplan_spots_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_layouts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"katha" numeric,
  	"coverage" varchar,
  	"typical" varchar
  );
  
  CREATE TABLE "projects_layouts_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_why_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "projects_why_points_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"short_name" varchar,
  	"slug" varchar,
  	"category" "enum_projects_category",
  	"area" varchar,
  	"stage" "enum_projects_stage" DEFAULT 'construction',
  	"plots" boolean,
  	"badge_style" "enum_projects_badge_style" DEFAULT 'ok',
  	"progress" numeric,
  	"handover_year" numeric,
  	"rajuk" boolean DEFAULT true,
  	"map_x" numeric,
  	"map_y" numeric,
  	"featured" boolean DEFAULT true,
  	"order" numeric DEFAULT 100,
  	"hero_image_id" integer,
  	"hero_position" varchar DEFAULT 'center',
  	"units_sold" numeric,
  	"units_total" numeric,
  	"road_label" varchar,
  	"masterplan_image_id" integer,
  	"masterplan_position" varchar DEFAULT 'center',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_locales" (
  	"name" varchar,
  	"location" varchar,
  	"badge" varchar,
  	"price_from" varchar,
  	"progress_label" varchar,
  	"loc_line" varchar,
  	"cta_label" varchar DEFAULT 'Explore homes',
  	"price_short" varchar,
  	"progress_note" varchar,
  	"deal_note" varchar,
  	"masterplan_alt" varchar,
  	"why_title" varchar,
  	"quote_text" varchar,
  	"quote_by" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_specs_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_tags_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_overview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_overview_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_facts_locales" (
  	"label" varchar,
  	"value" varchar,
  	"suffix" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_stats_locales" (
  	"label" varchar,
  	"value" varchar,
  	"suffix" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_amenities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_amenities_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"image_id" integer,
  	"position" varchar DEFAULT 'center',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_timeline_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_nearby" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"place" varchar,
  	"kind" varchar,
  	"distance" varchar,
  	"time" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_docs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_docs_locales" (
  	"title" varchar,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"category" "enum__projects_v_version_gallery_category",
  	"position" varchar DEFAULT 'center',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_gallery_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_faq_locales" (
  	"q" varchar,
  	"a" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_masterplan_spots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"x" numeric,
  	"y" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_masterplan_spots_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_layouts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"katha" numeric,
  	"coverage" varchar,
  	"typical" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_layouts_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_why_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_why_points_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_short_name" varchar,
  	"version_slug" varchar,
  	"version_category" "enum__projects_v_version_category",
  	"version_area" varchar,
  	"version_stage" "enum__projects_v_version_stage" DEFAULT 'construction',
  	"version_plots" boolean,
  	"version_badge_style" "enum__projects_v_version_badge_style" DEFAULT 'ok',
  	"version_progress" numeric,
  	"version_handover_year" numeric,
  	"version_rajuk" boolean DEFAULT true,
  	"version_map_x" numeric,
  	"version_map_y" numeric,
  	"version_featured" boolean DEFAULT true,
  	"version_order" numeric DEFAULT 100,
  	"version_hero_image_id" integer,
  	"version_hero_position" varchar DEFAULT 'center',
  	"version_units_sold" numeric,
  	"version_units_total" numeric,
  	"version_road_label" varchar,
  	"version_masterplan_image_id" integer,
  	"version_masterplan_position" varchar DEFAULT 'center',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__projects_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_projects_v_locales" (
  	"version_name" varchar,
  	"version_location" varchar,
  	"version_badge" varchar,
  	"version_price_from" varchar,
  	"version_progress_label" varchar,
  	"version_loc_line" varchar,
  	"version_cta_label" varchar DEFAULT 'Explore homes',
  	"version_price_short" varchar,
  	"version_progress_note" varchar,
  	"version_deal_note" varchar,
  	"version_masterplan_alt" varchar,
  	"version_why_title" varchar,
  	"version_quote_text" varchar,
  	"version_quote_by" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "listings_amenities" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_listings_amenities",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "listings_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"position" varchar DEFAULT 'center'
  );
  
  CREATE TABLE "listings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"project_id" integer,
  	"category" "enum_listings_category",
  	"beds" numeric DEFAULT 0,
  	"size" numeric,
  	"size_unit" "enum_listings_size_unit" DEFAULT 'sqft',
  	"price" numeric,
  	"stage" "enum_listings_stage" DEFAULT 'construction',
  	"availability" "enum_listings_availability" DEFAULT 'available',
  	"handover_year" numeric,
  	"facing" "enum_listings_facing",
  	"rajuk" boolean DEFAULT true,
  	"rank" numeric DEFAULT 100,
  	"submitted_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_listings_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "listings_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_listings_v_version_amenities" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__listings_v_version_amenities",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_listings_v_version_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"position" varchar DEFAULT 'center',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_listings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_project_id" integer,
  	"version_category" "enum__listings_v_version_category",
  	"version_beds" numeric DEFAULT 0,
  	"version_size" numeric,
  	"version_size_unit" "enum__listings_v_version_size_unit" DEFAULT 'sqft',
  	"version_price" numeric,
  	"version_stage" "enum__listings_v_version_stage" DEFAULT 'construction',
  	"version_availability" "enum__listings_v_version_availability" DEFAULT 'available',
  	"version_handover_year" numeric,
  	"version_facing" "enum__listings_v_version_facing",
  	"version_rajuk" boolean DEFAULT true,
  	"version_rank" numeric DEFAULT 100,
  	"version_submitted_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__listings_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__listings_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_listings_v_locales" (
  	"version_title" varchar,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "leads_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"note" varchar,
  	"at" timestamp(3) with time zone
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"type" "enum_leads_type" DEFAULT 'enquiry',
  	"project_id" integer,
  	"listing_id" integer,
  	"customer_id" integer,
  	"message" varchar,
  	"visit_date" timestamp(3) with time zone,
  	"visit_slot" varchar,
  	"status" "enum_leads_status" DEFAULT 'new' NOT NULL,
  	"score" numeric,
  	"assignee_id" integer,
  	"utm_source" varchar,
  	"utm_medium" varchar,
  	"utm_campaign" varchar,
  	"utm_page" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_leads_v_version_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"note" varchar,
  	"at" timestamp(3) with time zone,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_leads_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar NOT NULL,
  	"version_phone" varchar NOT NULL,
  	"version_email" varchar,
  	"version_type" "enum__leads_v_version_type" DEFAULT 'enquiry',
  	"version_project_id" integer,
  	"version_listing_id" integer,
  	"version_customer_id" integer,
  	"version_message" varchar,
  	"version_visit_date" timestamp(3) with time zone,
  	"version_visit_slot" varchar,
  	"version_status" "enum__leads_v_version_status" DEFAULT 'new' NOT NULL,
  	"version_score" numeric,
  	"version_assignee_id" integer,
  	"version_utm_source" varchar,
  	"version_utm_medium" varchar,
  	"version_utm_campaign" varchar,
  	"version_utm_page" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"initials" varchar NOT NULL,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials_locales" (
  	"meta" varchar,
  	"quote" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"category" "enum_news_category",
  	"date" timestamp(3) with time zone,
  	"image_id" integer,
  	"image_position" varchar DEFAULT 'center',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "news_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_category" "enum__news_v_version_category",
  	"version_date" timestamp(3) with time zone,
  	"version_image_id" integer,
  	"version_image_position" varchar DEFAULT 'center',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__news_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_news_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric NOT NULL,
  	"prefix" varchar,
  	"suffix" varchar,
  	"decimals" numeric DEFAULT 0,
  	"icon" "enum_stats_icon" DEFAULT 'home',
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"customers_id" integer,
  	"projects_id" integer,
  	"listings_id" integer,
  	"leads_id" integer,
  	"testimonials_id" integer,
  	"news_id" integer,
  	"faqs_id" integer,
  	"stats_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"customers_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"phone" varchar DEFAULT '+880 1700-000000',
  	"whatsapp" varchar,
  	"email" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"address" varchar,
  	"hero_headline" varchar DEFAULT 'Find a home you can trust',
  	"hero_sub" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "customers_sessions" ADD CONSTRAINT "customers_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_specs" ADD CONSTRAINT "projects_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_specs_locales" ADD CONSTRAINT "projects_specs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_specs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_tags" ADD CONSTRAINT "projects_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_tags_locales" ADD CONSTRAINT "projects_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_overview" ADD CONSTRAINT "projects_overview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_overview_locales" ADD CONSTRAINT "projects_overview_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_overview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_facts" ADD CONSTRAINT "projects_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_facts_locales" ADD CONSTRAINT "projects_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_stats" ADD CONSTRAINT "projects_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_stats_locales" ADD CONSTRAINT "projects_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_amenities" ADD CONSTRAINT "projects_amenities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_amenities_locales" ADD CONSTRAINT "projects_amenities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_amenities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_timeline" ADD CONSTRAINT "projects_timeline_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_timeline" ADD CONSTRAINT "projects_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_timeline_locales" ADD CONSTRAINT "projects_timeline_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_nearby" ADD CONSTRAINT "projects_nearby_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_docs" ADD CONSTRAINT "projects_docs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_docs_locales" ADD CONSTRAINT "projects_docs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_docs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_gallery_locales" ADD CONSTRAINT "projects_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_faq" ADD CONSTRAINT "projects_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_faq_locales" ADD CONSTRAINT "projects_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_masterplan_spots" ADD CONSTRAINT "projects_masterplan_spots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_masterplan_spots_locales" ADD CONSTRAINT "projects_masterplan_spots_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_masterplan_spots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_layouts" ADD CONSTRAINT "projects_layouts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_layouts_locales" ADD CONSTRAINT "projects_layouts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_layouts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_why_points" ADD CONSTRAINT "projects_why_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_why_points_locales" ADD CONSTRAINT "projects_why_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_why_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_masterplan_image_id_media_id_fk" FOREIGN KEY ("masterplan_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_specs" ADD CONSTRAINT "_projects_v_version_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_specs_locales" ADD CONSTRAINT "_projects_v_version_specs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_specs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_tags" ADD CONSTRAINT "_projects_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_tags_locales" ADD CONSTRAINT "_projects_v_version_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_overview" ADD CONSTRAINT "_projects_v_version_overview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_overview_locales" ADD CONSTRAINT "_projects_v_version_overview_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_overview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_facts" ADD CONSTRAINT "_projects_v_version_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_facts_locales" ADD CONSTRAINT "_projects_v_version_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_stats" ADD CONSTRAINT "_projects_v_version_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_stats_locales" ADD CONSTRAINT "_projects_v_version_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_amenities" ADD CONSTRAINT "_projects_v_version_amenities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_amenities_locales" ADD CONSTRAINT "_projects_v_version_amenities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_amenities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_timeline" ADD CONSTRAINT "_projects_v_version_timeline_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_timeline" ADD CONSTRAINT "_projects_v_version_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_timeline_locales" ADD CONSTRAINT "_projects_v_version_timeline_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_nearby" ADD CONSTRAINT "_projects_v_version_nearby_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_docs" ADD CONSTRAINT "_projects_v_version_docs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_docs_locales" ADD CONSTRAINT "_projects_v_version_docs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_docs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery_locales" ADD CONSTRAINT "_projects_v_version_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_faq" ADD CONSTRAINT "_projects_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_faq_locales" ADD CONSTRAINT "_projects_v_version_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_masterplan_spots" ADD CONSTRAINT "_projects_v_version_masterplan_spots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_masterplan_spots_locales" ADD CONSTRAINT "_projects_v_version_masterplan_spots_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_masterplan_spots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_layouts" ADD CONSTRAINT "_projects_v_version_layouts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_layouts_locales" ADD CONSTRAINT "_projects_v_version_layouts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_layouts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_why_points" ADD CONSTRAINT "_projects_v_version_why_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_why_points_locales" ADD CONSTRAINT "_projects_v_version_why_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_why_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_masterplan_image_id_media_id_fk" FOREIGN KEY ("version_masterplan_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_locales" ADD CONSTRAINT "_projects_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "listings_amenities" ADD CONSTRAINT "listings_amenities_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "listings_images" ADD CONSTRAINT "listings_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "listings_images" ADD CONSTRAINT "listings_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "listings" ADD CONSTRAINT "listings_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "listings" ADD CONSTRAINT "listings_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "listings_locales" ADD CONSTRAINT "listings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_listings_v_version_amenities" ADD CONSTRAINT "_listings_v_version_amenities_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_listings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_listings_v_version_images" ADD CONSTRAINT "_listings_v_version_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_listings_v_version_images" ADD CONSTRAINT "_listings_v_version_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_listings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_listings_v" ADD CONSTRAINT "_listings_v_parent_id_listings_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."listings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_listings_v" ADD CONSTRAINT "_listings_v_version_project_id_projects_id_fk" FOREIGN KEY ("version_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_listings_v" ADD CONSTRAINT "_listings_v_version_submitted_by_id_users_id_fk" FOREIGN KEY ("version_submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_listings_v_locales" ADD CONSTRAINT "_listings_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_listings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads_notes" ADD CONSTRAINT "leads_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_assignee_id_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leads_v_version_notes" ADD CONSTRAINT "_leads_v_version_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_leads_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_leads_v" ADD CONSTRAINT "_leads_v_parent_id_leads_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leads_v" ADD CONSTRAINT "_leads_v_version_project_id_projects_id_fk" FOREIGN KEY ("version_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leads_v" ADD CONSTRAINT "_leads_v_version_listing_id_listings_id_fk" FOREIGN KEY ("version_listing_id") REFERENCES "public"."listings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leads_v" ADD CONSTRAINT "_leads_v_version_customer_id_customers_id_fk" FOREIGN KEY ("version_customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leads_v" ADD CONSTRAINT "_leads_v_version_assignee_id_users_id_fk" FOREIGN KEY ("version_assignee_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials_locales" ADD CONSTRAINT "testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_locales" ADD CONSTRAINT "news_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_locales" ADD CONSTRAINT "_news_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_locales" ADD CONSTRAINT "faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stats_locales" ADD CONSTRAINT "stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_listings_fk" FOREIGN KEY ("listings_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stats_fk" FOREIGN KEY ("stats_id") REFERENCES "public"."stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social" ADD CONSTRAINT "site_settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "customers_sessions_order_idx" ON "customers_sessions" USING btree ("_order");
  CREATE INDEX "customers_sessions_parent_id_idx" ON "customers_sessions" USING btree ("_parent_id");
  CREATE INDEX "customers_updated_at_idx" ON "customers" USING btree ("updated_at");
  CREATE INDEX "customers_created_at_idx" ON "customers" USING btree ("created_at");
  CREATE UNIQUE INDEX "customers_email_idx" ON "customers" USING btree ("email");
  CREATE INDEX "projects_specs_order_idx" ON "projects_specs" USING btree ("_order");
  CREATE INDEX "projects_specs_parent_id_idx" ON "projects_specs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_specs_locales_locale_parent_id_unique" ON "projects_specs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_specs_locales_parent_id_idx" ON "projects_specs_locales" USING btree ("_parent_id");
  CREATE INDEX "projects_tags_order_idx" ON "projects_tags" USING btree ("_order");
  CREATE INDEX "projects_tags_parent_id_idx" ON "projects_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_tags_locales_locale_parent_id_unique" ON "projects_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_tags_locales_parent_id_idx" ON "projects_tags_locales" USING btree ("_parent_id");
  CREATE INDEX "projects_overview_order_idx" ON "projects_overview" USING btree ("_order");
  CREATE INDEX "projects_overview_parent_id_idx" ON "projects_overview" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_overview_locales_locale_parent_id_unique" ON "projects_overview_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_overview_locales_parent_id_idx" ON "projects_overview_locales" USING btree ("_parent_id");
  CREATE INDEX "projects_facts_order_idx" ON "projects_facts" USING btree ("_order");
  CREATE INDEX "projects_facts_parent_id_idx" ON "projects_facts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_facts_locales_locale_parent_id_unique" ON "projects_facts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_facts_locales_parent_id_idx" ON "projects_facts_locales" USING btree ("_parent_id");
  CREATE INDEX "projects_stats_order_idx" ON "projects_stats" USING btree ("_order");
  CREATE INDEX "projects_stats_parent_id_idx" ON "projects_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_stats_locales_locale_parent_id_unique" ON "projects_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_stats_locales_parent_id_idx" ON "projects_stats_locales" USING btree ("_parent_id");
  CREATE INDEX "projects_amenities_order_idx" ON "projects_amenities" USING btree ("_order");
  CREATE INDEX "projects_amenities_parent_id_idx" ON "projects_amenities" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_amenities_locales_locale_parent_id_unique" ON "projects_amenities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_amenities_locales_parent_id_idx" ON "projects_amenities_locales" USING btree ("_parent_id");
  CREATE INDEX "projects_timeline_order_idx" ON "projects_timeline" USING btree ("_order");
  CREATE INDEX "projects_timeline_parent_id_idx" ON "projects_timeline" USING btree ("_parent_id");
  CREATE INDEX "projects_timeline_image_idx" ON "projects_timeline" USING btree ("image_id");
  CREATE UNIQUE INDEX "projects_timeline_locales_locale_parent_id_unique" ON "projects_timeline_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_timeline_locales_parent_id_idx" ON "projects_timeline_locales" USING btree ("_parent_id");
  CREATE INDEX "projects_nearby_order_idx" ON "projects_nearby" USING btree ("_order");
  CREATE INDEX "projects_nearby_parent_id_idx" ON "projects_nearby" USING btree ("_parent_id");
  CREATE INDEX "projects_docs_order_idx" ON "projects_docs" USING btree ("_order");
  CREATE INDEX "projects_docs_parent_id_idx" ON "projects_docs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_docs_locales_locale_parent_id_unique" ON "projects_docs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_docs_locales_parent_id_idx" ON "projects_docs_locales" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_order_idx" ON "projects_gallery" USING btree ("_order");
  CREATE INDEX "projects_gallery_parent_id_idx" ON "projects_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_image_idx" ON "projects_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "projects_gallery_locales_locale_parent_id_unique" ON "projects_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_gallery_locales_parent_id_idx" ON "projects_gallery_locales" USING btree ("_parent_id");
  CREATE INDEX "projects_faq_order_idx" ON "projects_faq" USING btree ("_order");
  CREATE INDEX "projects_faq_parent_id_idx" ON "projects_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_faq_locales_locale_parent_id_unique" ON "projects_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_faq_locales_parent_id_idx" ON "projects_faq_locales" USING btree ("_parent_id");
  CREATE INDEX "projects_masterplan_spots_order_idx" ON "projects_masterplan_spots" USING btree ("_order");
  CREATE INDEX "projects_masterplan_spots_parent_id_idx" ON "projects_masterplan_spots" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_masterplan_spots_locales_locale_parent_id_unique" ON "projects_masterplan_spots_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_masterplan_spots_locales_parent_id_idx" ON "projects_masterplan_spots_locales" USING btree ("_parent_id");
  CREATE INDEX "projects_layouts_order_idx" ON "projects_layouts" USING btree ("_order");
  CREATE INDEX "projects_layouts_parent_id_idx" ON "projects_layouts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_layouts_locales_locale_parent_id_unique" ON "projects_layouts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_layouts_locales_parent_id_idx" ON "projects_layouts_locales" USING btree ("_parent_id");
  CREATE INDEX "projects_why_points_order_idx" ON "projects_why_points" USING btree ("_order");
  CREATE INDEX "projects_why_points_parent_id_idx" ON "projects_why_points" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_why_points_locales_locale_parent_id_unique" ON "projects_why_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_why_points_locales_parent_id_idx" ON "projects_why_points_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_hero_image_idx" ON "projects" USING btree ("hero_image_id");
  CREATE INDEX "projects_masterplan_masterplan_image_idx" ON "projects" USING btree ("masterplan_image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_locales_parent_id_idx" ON "projects_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_specs_order_idx" ON "_projects_v_version_specs" USING btree ("_order");
  CREATE INDEX "_projects_v_version_specs_parent_id_idx" ON "_projects_v_version_specs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_specs_locales_locale_parent_id_unique" ON "_projects_v_version_specs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_specs_locales_parent_id_idx" ON "_projects_v_version_specs_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_tags_order_idx" ON "_projects_v_version_tags" USING btree ("_order");
  CREATE INDEX "_projects_v_version_tags_parent_id_idx" ON "_projects_v_version_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_tags_locales_locale_parent_id_unique" ON "_projects_v_version_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_tags_locales_parent_id_idx" ON "_projects_v_version_tags_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_overview_order_idx" ON "_projects_v_version_overview" USING btree ("_order");
  CREATE INDEX "_projects_v_version_overview_parent_id_idx" ON "_projects_v_version_overview" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_overview_locales_locale_parent_id_unique" ON "_projects_v_version_overview_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_overview_locales_parent_id_idx" ON "_projects_v_version_overview_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_facts_order_idx" ON "_projects_v_version_facts" USING btree ("_order");
  CREATE INDEX "_projects_v_version_facts_parent_id_idx" ON "_projects_v_version_facts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_facts_locales_locale_parent_id_unique" ON "_projects_v_version_facts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_facts_locales_parent_id_idx" ON "_projects_v_version_facts_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_stats_order_idx" ON "_projects_v_version_stats" USING btree ("_order");
  CREATE INDEX "_projects_v_version_stats_parent_id_idx" ON "_projects_v_version_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_stats_locales_locale_parent_id_unique" ON "_projects_v_version_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_stats_locales_parent_id_idx" ON "_projects_v_version_stats_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_amenities_order_idx" ON "_projects_v_version_amenities" USING btree ("_order");
  CREATE INDEX "_projects_v_version_amenities_parent_id_idx" ON "_projects_v_version_amenities" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_amenities_locales_locale_parent_id_uniqu" ON "_projects_v_version_amenities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_amenities_locales_parent_id_idx" ON "_projects_v_version_amenities_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_timeline_order_idx" ON "_projects_v_version_timeline" USING btree ("_order");
  CREATE INDEX "_projects_v_version_timeline_parent_id_idx" ON "_projects_v_version_timeline" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_timeline_image_idx" ON "_projects_v_version_timeline" USING btree ("image_id");
  CREATE UNIQUE INDEX "_projects_v_version_timeline_locales_locale_parent_id_unique" ON "_projects_v_version_timeline_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_timeline_locales_parent_id_idx" ON "_projects_v_version_timeline_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_nearby_order_idx" ON "_projects_v_version_nearby" USING btree ("_order");
  CREATE INDEX "_projects_v_version_nearby_parent_id_idx" ON "_projects_v_version_nearby" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_docs_order_idx" ON "_projects_v_version_docs" USING btree ("_order");
  CREATE INDEX "_projects_v_version_docs_parent_id_idx" ON "_projects_v_version_docs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_docs_locales_locale_parent_id_unique" ON "_projects_v_version_docs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_docs_locales_parent_id_idx" ON "_projects_v_version_docs_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_gallery_order_idx" ON "_projects_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_projects_v_version_gallery_parent_id_idx" ON "_projects_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_gallery_image_idx" ON "_projects_v_version_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "_projects_v_version_gallery_locales_locale_parent_id_unique" ON "_projects_v_version_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_gallery_locales_parent_id_idx" ON "_projects_v_version_gallery_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_faq_order_idx" ON "_projects_v_version_faq" USING btree ("_order");
  CREATE INDEX "_projects_v_version_faq_parent_id_idx" ON "_projects_v_version_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_faq_locales_locale_parent_id_unique" ON "_projects_v_version_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_faq_locales_parent_id_idx" ON "_projects_v_version_faq_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_masterplan_spots_order_idx" ON "_projects_v_version_masterplan_spots" USING btree ("_order");
  CREATE INDEX "_projects_v_version_masterplan_spots_parent_id_idx" ON "_projects_v_version_masterplan_spots" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_masterplan_spots_locales_locale_parent_i" ON "_projects_v_version_masterplan_spots_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_masterplan_spots_locales_parent_id_idx" ON "_projects_v_version_masterplan_spots_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_layouts_order_idx" ON "_projects_v_version_layouts" USING btree ("_order");
  CREATE INDEX "_projects_v_version_layouts_parent_id_idx" ON "_projects_v_version_layouts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_layouts_locales_locale_parent_id_unique" ON "_projects_v_version_layouts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_layouts_locales_parent_id_idx" ON "_projects_v_version_layouts_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_why_points_order_idx" ON "_projects_v_version_why_points" USING btree ("_order");
  CREATE INDEX "_projects_v_version_why_points_parent_id_idx" ON "_projects_v_version_why_points" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_why_points_locales_locale_parent_id_uniq" ON "_projects_v_version_why_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_why_points_locales_parent_id_idx" ON "_projects_v_version_why_points_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_hero_image_idx" ON "_projects_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_projects_v_version_masterplan_version_masterplan_image_idx" ON "_projects_v" USING btree ("version_masterplan_image_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_snapshot_idx" ON "_projects_v" USING btree ("snapshot");
  CREATE INDEX "_projects_v_published_locale_idx" ON "_projects_v" USING btree ("published_locale");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_projects_v_locales_locale_parent_id_unique" ON "_projects_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_locales_parent_id_idx" ON "_projects_v_locales" USING btree ("_parent_id");
  CREATE INDEX "listings_amenities_order_idx" ON "listings_amenities" USING btree ("order");
  CREATE INDEX "listings_amenities_parent_idx" ON "listings_amenities" USING btree ("parent_id");
  CREATE INDEX "listings_images_order_idx" ON "listings_images" USING btree ("_order");
  CREATE INDEX "listings_images_parent_id_idx" ON "listings_images" USING btree ("_parent_id");
  CREATE INDEX "listings_images_image_idx" ON "listings_images" USING btree ("image_id");
  CREATE INDEX "listings_project_idx" ON "listings" USING btree ("project_id");
  CREATE INDEX "listings_submitted_by_idx" ON "listings" USING btree ("submitted_by_id");
  CREATE INDEX "listings_updated_at_idx" ON "listings" USING btree ("updated_at");
  CREATE INDEX "listings_created_at_idx" ON "listings" USING btree ("created_at");
  CREATE INDEX "listings__status_idx" ON "listings" USING btree ("_status");
  CREATE UNIQUE INDEX "listings_locales_locale_parent_id_unique" ON "listings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "listings_locales_parent_id_idx" ON "listings_locales" USING btree ("_parent_id");
  CREATE INDEX "_listings_v_version_amenities_order_idx" ON "_listings_v_version_amenities" USING btree ("order");
  CREATE INDEX "_listings_v_version_amenities_parent_idx" ON "_listings_v_version_amenities" USING btree ("parent_id");
  CREATE INDEX "_listings_v_version_images_order_idx" ON "_listings_v_version_images" USING btree ("_order");
  CREATE INDEX "_listings_v_version_images_parent_id_idx" ON "_listings_v_version_images" USING btree ("_parent_id");
  CREATE INDEX "_listings_v_version_images_image_idx" ON "_listings_v_version_images" USING btree ("image_id");
  CREATE INDEX "_listings_v_parent_idx" ON "_listings_v" USING btree ("parent_id");
  CREATE INDEX "_listings_v_version_version_project_idx" ON "_listings_v" USING btree ("version_project_id");
  CREATE INDEX "_listings_v_version_version_submitted_by_idx" ON "_listings_v" USING btree ("version_submitted_by_id");
  CREATE INDEX "_listings_v_version_version_updated_at_idx" ON "_listings_v" USING btree ("version_updated_at");
  CREATE INDEX "_listings_v_version_version_created_at_idx" ON "_listings_v" USING btree ("version_created_at");
  CREATE INDEX "_listings_v_version_version__status_idx" ON "_listings_v" USING btree ("version__status");
  CREATE INDEX "_listings_v_created_at_idx" ON "_listings_v" USING btree ("created_at");
  CREATE INDEX "_listings_v_updated_at_idx" ON "_listings_v" USING btree ("updated_at");
  CREATE INDEX "_listings_v_snapshot_idx" ON "_listings_v" USING btree ("snapshot");
  CREATE INDEX "_listings_v_published_locale_idx" ON "_listings_v" USING btree ("published_locale");
  CREATE INDEX "_listings_v_latest_idx" ON "_listings_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_listings_v_locales_locale_parent_id_unique" ON "_listings_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_listings_v_locales_parent_id_idx" ON "_listings_v_locales" USING btree ("_parent_id");
  CREATE INDEX "leads_notes_order_idx" ON "leads_notes" USING btree ("_order");
  CREATE INDEX "leads_notes_parent_id_idx" ON "leads_notes" USING btree ("_parent_id");
  CREATE INDEX "leads_project_idx" ON "leads" USING btree ("project_id");
  CREATE INDEX "leads_listing_idx" ON "leads" USING btree ("listing_id");
  CREATE INDEX "leads_customer_idx" ON "leads" USING btree ("customer_id");
  CREATE INDEX "leads_assignee_idx" ON "leads" USING btree ("assignee_id");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "_leads_v_version_notes_order_idx" ON "_leads_v_version_notes" USING btree ("_order");
  CREATE INDEX "_leads_v_version_notes_parent_id_idx" ON "_leads_v_version_notes" USING btree ("_parent_id");
  CREATE INDEX "_leads_v_parent_idx" ON "_leads_v" USING btree ("parent_id");
  CREATE INDEX "_leads_v_version_version_project_idx" ON "_leads_v" USING btree ("version_project_id");
  CREATE INDEX "_leads_v_version_version_listing_idx" ON "_leads_v" USING btree ("version_listing_id");
  CREATE INDEX "_leads_v_version_version_customer_idx" ON "_leads_v" USING btree ("version_customer_id");
  CREATE INDEX "_leads_v_version_version_assignee_idx" ON "_leads_v" USING btree ("version_assignee_id");
  CREATE INDEX "_leads_v_version_version_updated_at_idx" ON "_leads_v" USING btree ("version_updated_at");
  CREATE INDEX "_leads_v_version_version_created_at_idx" ON "_leads_v" USING btree ("version_created_at");
  CREATE INDEX "_leads_v_created_at_idx" ON "_leads_v" USING btree ("created_at");
  CREATE INDEX "_leads_v_updated_at_idx" ON "_leads_v" USING btree ("updated_at");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE UNIQUE INDEX "testimonials_locales_locale_parent_id_unique" ON "testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "testimonials_locales_parent_id_idx" ON "testimonials_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_image_idx" ON "news" USING btree ("image_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE UNIQUE INDEX "news_locales_locale_parent_id_unique" ON "news_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "news_locales_parent_id_idx" ON "news_locales" USING btree ("_parent_id");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_image_idx" ON "_news_v" USING btree ("version_image_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_snapshot_idx" ON "_news_v" USING btree ("snapshot");
  CREATE INDEX "_news_v_published_locale_idx" ON "_news_v" USING btree ("published_locale");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_news_v_locales_locale_parent_id_unique" ON "_news_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_news_v_locales_parent_id_idx" ON "_news_v_locales" USING btree ("_parent_id");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE UNIQUE INDEX "faqs_locales_locale_parent_id_unique" ON "faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faqs_locales_parent_id_idx" ON "faqs_locales" USING btree ("_parent_id");
  CREATE INDEX "stats_updated_at_idx" ON "stats" USING btree ("updated_at");
  CREATE INDEX "stats_created_at_idx" ON "stats" USING btree ("created_at");
  CREATE UNIQUE INDEX "stats_locales_locale_parent_id_unique" ON "stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "stats_locales_parent_id_idx" ON "stats_locales" USING btree ("_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_customers_id_idx" ON "payload_locked_documents_rels" USING btree ("customers_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_listings_id_idx" ON "payload_locked_documents_rels" USING btree ("listings_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_stats_id_idx" ON "payload_locked_documents_rels" USING btree ("stats_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_rels_customers_id_idx" ON "payload_preferences_rels" USING btree ("customers_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_social_order_idx" ON "site_settings_social" USING btree ("_order");
  CREATE INDEX "site_settings_social_parent_id_idx" ON "site_settings_social" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_locales_parent_id_idx" ON "site_settings_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "customers_sessions" CASCADE;
  DROP TABLE "customers" CASCADE;
  DROP TABLE "projects_specs" CASCADE;
  DROP TABLE "projects_specs_locales" CASCADE;
  DROP TABLE "projects_tags" CASCADE;
  DROP TABLE "projects_tags_locales" CASCADE;
  DROP TABLE "projects_overview" CASCADE;
  DROP TABLE "projects_overview_locales" CASCADE;
  DROP TABLE "projects_facts" CASCADE;
  DROP TABLE "projects_facts_locales" CASCADE;
  DROP TABLE "projects_stats" CASCADE;
  DROP TABLE "projects_stats_locales" CASCADE;
  DROP TABLE "projects_amenities" CASCADE;
  DROP TABLE "projects_amenities_locales" CASCADE;
  DROP TABLE "projects_timeline" CASCADE;
  DROP TABLE "projects_timeline_locales" CASCADE;
  DROP TABLE "projects_nearby" CASCADE;
  DROP TABLE "projects_docs" CASCADE;
  DROP TABLE "projects_docs_locales" CASCADE;
  DROP TABLE "projects_gallery" CASCADE;
  DROP TABLE "projects_gallery_locales" CASCADE;
  DROP TABLE "projects_faq" CASCADE;
  DROP TABLE "projects_faq_locales" CASCADE;
  DROP TABLE "projects_masterplan_spots" CASCADE;
  DROP TABLE "projects_masterplan_spots_locales" CASCADE;
  DROP TABLE "projects_layouts" CASCADE;
  DROP TABLE "projects_layouts_locales" CASCADE;
  DROP TABLE "projects_why_points" CASCADE;
  DROP TABLE "projects_why_points_locales" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "_projects_v_version_specs" CASCADE;
  DROP TABLE "_projects_v_version_specs_locales" CASCADE;
  DROP TABLE "_projects_v_version_tags" CASCADE;
  DROP TABLE "_projects_v_version_tags_locales" CASCADE;
  DROP TABLE "_projects_v_version_overview" CASCADE;
  DROP TABLE "_projects_v_version_overview_locales" CASCADE;
  DROP TABLE "_projects_v_version_facts" CASCADE;
  DROP TABLE "_projects_v_version_facts_locales" CASCADE;
  DROP TABLE "_projects_v_version_stats" CASCADE;
  DROP TABLE "_projects_v_version_stats_locales" CASCADE;
  DROP TABLE "_projects_v_version_amenities" CASCADE;
  DROP TABLE "_projects_v_version_amenities_locales" CASCADE;
  DROP TABLE "_projects_v_version_timeline" CASCADE;
  DROP TABLE "_projects_v_version_timeline_locales" CASCADE;
  DROP TABLE "_projects_v_version_nearby" CASCADE;
  DROP TABLE "_projects_v_version_docs" CASCADE;
  DROP TABLE "_projects_v_version_docs_locales" CASCADE;
  DROP TABLE "_projects_v_version_gallery" CASCADE;
  DROP TABLE "_projects_v_version_gallery_locales" CASCADE;
  DROP TABLE "_projects_v_version_faq" CASCADE;
  DROP TABLE "_projects_v_version_faq_locales" CASCADE;
  DROP TABLE "_projects_v_version_masterplan_spots" CASCADE;
  DROP TABLE "_projects_v_version_masterplan_spots_locales" CASCADE;
  DROP TABLE "_projects_v_version_layouts" CASCADE;
  DROP TABLE "_projects_v_version_layouts_locales" CASCADE;
  DROP TABLE "_projects_v_version_why_points" CASCADE;
  DROP TABLE "_projects_v_version_why_points_locales" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_locales" CASCADE;
  DROP TABLE "listings_amenities" CASCADE;
  DROP TABLE "listings_images" CASCADE;
  DROP TABLE "listings" CASCADE;
  DROP TABLE "listings_locales" CASCADE;
  DROP TABLE "_listings_v_version_amenities" CASCADE;
  DROP TABLE "_listings_v_version_images" CASCADE;
  DROP TABLE "_listings_v" CASCADE;
  DROP TABLE "_listings_v_locales" CASCADE;
  DROP TABLE "leads_notes" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "_leads_v_version_notes" CASCADE;
  DROP TABLE "_leads_v" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "testimonials_locales" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "news_locales" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "_news_v_locales" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "faqs_locales" CASCADE;
  DROP TABLE "stats" CASCADE;
  DROP TABLE "stats_locales" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_social" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_customers_preferred_language";
  DROP TYPE "public"."enum_projects_gallery_category";
  DROP TYPE "public"."enum_projects_category";
  DROP TYPE "public"."enum_projects_stage";
  DROP TYPE "public"."enum_projects_badge_style";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_gallery_category";
  DROP TYPE "public"."enum__projects_v_version_category";
  DROP TYPE "public"."enum__projects_v_version_stage";
  DROP TYPE "public"."enum__projects_v_version_badge_style";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum__projects_v_published_locale";
  DROP TYPE "public"."enum_listings_amenities";
  DROP TYPE "public"."enum_listings_category";
  DROP TYPE "public"."enum_listings_size_unit";
  DROP TYPE "public"."enum_listings_stage";
  DROP TYPE "public"."enum_listings_availability";
  DROP TYPE "public"."enum_listings_facing";
  DROP TYPE "public"."enum_listings_status";
  DROP TYPE "public"."enum__listings_v_version_amenities";
  DROP TYPE "public"."enum__listings_v_version_category";
  DROP TYPE "public"."enum__listings_v_version_size_unit";
  DROP TYPE "public"."enum__listings_v_version_stage";
  DROP TYPE "public"."enum__listings_v_version_availability";
  DROP TYPE "public"."enum__listings_v_version_facing";
  DROP TYPE "public"."enum__listings_v_version_status";
  DROP TYPE "public"."enum__listings_v_published_locale";
  DROP TYPE "public"."enum_leads_type";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum__leads_v_version_type";
  DROP TYPE "public"."enum__leads_v_version_status";
  DROP TYPE "public"."enum_news_category";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_category";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum__news_v_published_locale";
  DROP TYPE "public"."enum_stats_icon";`)
}
