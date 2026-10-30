import { pgTable, serial, text, varchar, numeric, boolean, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .references(() => categories.id, { onDelete: "restrict" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  storeName: varchar("store_name", { length: 255 }).notNull(),
  tagline: varchar("tagline", { length: 255 }),
  logoUrl: text("logo_url"),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  businessHours: text("business_hours"),
  lineId: varchar("line_id", { length: 100 }),
  lineUrl: text("line_url"),
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  googleMapsUrl: text("google_maps_url"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pageContents = pgTable("page_contents", {
  id: serial("id").primaryKey(),
  pageKey: varchar("page_key", { length: 50 }).notNull().unique(), // 'home', 'about', 'contact'
  heroTitle: text("hero_title"),
  heroSubtitle: text("hero_subtitle"),
  heroImageUrl: text("hero_image_url"),
  heroCtaText: text("hero_cta_text"),
  aboutStory: text("about_story"),
  aboutImageUrl: text("about_image_url"),
  highlights: jsonb("highlights").$type<Array<{ icon: string; title: string; description: string }>>(),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  ogImageUrl: text("og_image_url"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  services: many(services),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  category: one(categories, {
    fields: [services.categoryId],
    references: [categories.id],
  }),
}));
