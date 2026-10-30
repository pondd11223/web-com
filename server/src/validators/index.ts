import { z } from "zod";

// Auth
export const loginSchema = z.object({
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});
export type LoginInput = z.infer<typeof loginSchema>;

// Contact Form
export const contactFormSchema = z.object({
  name: z.string().min(2, "กรุณาระบุชื่อ-นามสกุล (อย่างน้อย 2 ตัวอักษร)"),
  phone: z.string().min(9, "กรุณาระบุเบอร์โทรศัพท์ที่ถูกต้อง (อย่างน้อย 9 หลัก)"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง").optional().or(z.literal("")),
  subject: z.string().max(200, "หัวข้อต้องไม่เกิน 200 ตัวอักษร").optional().or(z.literal("")),
  message: z.string().min(5, "กรุณาระบุข้อความอย่างน้อย 5 ตัวอักษร"),
});
export type ContactFormInput = z.infer<typeof contactFormSchema>;

// Category
export const categorySchema = z.object({
  name: z.string().min(1, "กรุณาระบุชื่อหมวดหมู่"),
  slug: z.string().min(1, "กรุณาระบุ slug สำหรับหมวดหมู่"),
  description: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
});
export type CategoryInput = z.infer<typeof categorySchema>;

// Service / Product
export const serviceSchema = z.object({
  categoryId: z.number().int({ message: "กรุณาเลือกหมวดหมู่" }),
  name: z.string().min(1, "กรุณาระบุชื่อสินค้า/บริการ"),
  description: z.string().min(1, "กรุณาระบุรายละเอียด"),
  price: z.coerce.number().min(0, "ราคาต้องไม่ต่ำกว่า 0"),
  imageUrl: z.string().url("กรุณาระบุ URL รูปภาพที่ถูกต้อง"),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});
export type ServiceInput = z.infer<typeof serviceSchema>;

// Website Settings
export const settingsSchema = z.object({
  storeName: z.string().min(1, "กรุณาระบุชื่อร้าน"),
  tagline: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  businessHours: z.string().optional().nullable(),
  lineId: z.string().optional().nullable(),
  lineUrl: z.string().optional().nullable(),
  facebookUrl: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  googleMapsUrl: z.string().optional().nullable(),
});
export type SettingsInput = z.infer<typeof settingsSchema>;

// Page Content & SEO
export const highlightItemSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

export const pageContentSchema = z.object({
  heroTitle: z.string().optional().nullable(),
  heroSubtitle: z.string().optional().nullable(),
  heroImageUrl: z.string().optional().nullable(),
  heroCtaText: z.string().optional().nullable(),
  aboutStory: z.string().optional().nullable(),
  aboutImageUrl: z.string().optional().nullable(),
  highlights: z.array(highlightItemSchema).optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  ogImageUrl: z.string().optional().nullable(),
});
export type PageContentInput = z.infer<typeof pageContentSchema>;
