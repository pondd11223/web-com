CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"email" varchar(255),
	"subject" varchar(255),
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_contents" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_key" varchar(50) NOT NULL,
	"hero_title" text,
	"hero_subtitle" text,
	"hero_image_url" text,
	"hero_cta_text" text,
	"about_story" text,
	"about_image_url" text,
	"highlights" jsonb,
	"meta_title" varchar(255),
	"meta_description" text,
	"og_image_url" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "page_contents_page_key_unique" UNIQUE("page_key")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"image_url" text NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_name" varchar(255) NOT NULL,
	"tagline" varchar(255),
	"logo_url" text,
	"phone" varchar(50),
	"email" varchar(255),
	"address" text,
	"business_hours" text,
	"line_id" varchar(100),
	"line_url" text,
	"facebook_url" text,
	"instagram_url" text,
	"google_maps_url" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;