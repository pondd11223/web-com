CREATE TABLE "promotions" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"specs" text NOT NULL,
	"tag" varchar(100) NOT NULL,
	"price" varchar(50) NOT NULL,
	"original_price" varchar(50),
	"image" text NOT NULL,
	"badge" varchar(100) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
