import { Hono } from "hono";
import { eq, and, asc, desc } from "drizzle-orm";
import { db } from "../db";
import { settings, pageContents, services, categories, messages } from "../db/schema";
import { contactFormSchema } from "../validators";

const publicRouter = new Hono();

// GET /api/public/settings
publicRouter.get("/settings", async (c) => {
  const [data] = await db.select().from(settings).limit(1);
  if (!data) {
    return c.json({
      success: true,
      data: {
        storeName: "NEXUS Custom PC & Gaming Gear",
        tagline: "High-Performance Custom PC, Workstations & Gaming Peripherals",
        logoUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80",
        phone: "02-888-9999",
        email: "contact@nexuspc.co.th",
        address: "101/5 อาคารไอทีคอมเพล็กซ์ ชั้น 3 ถ.พระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพมหานคร 10310",
        businessHours: "จันทร์ - เสาร์: 10:00 - 20:00 น. (หยุดทุกวันอาทิตย์)",
        lineId: "@nexuspc",
        lineUrl: "https://line.me/R/ti/p/@nexuspc",
        facebookUrl: "https://facebook.com/nexuspc.th",
        instagramUrl: "https://instagram.com/nexuspc.th",
        googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.540871181816!2d100.5639693!3d13.7578135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29e84b8d7eb8f%3A0x6b7724a44b82967!2sFortune%20Town!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth",
      },
    });
  }
  return c.json({ success: true, data });
});

// GET /api/public/pages/:key
publicRouter.get("/pages/:key", async (c) => {
  const key = c.req.param("key");
  const [data] = await db.select().from(pageContents).where(eq(pageContents.pageKey, key)).limit(1);

  if (!data) {
    return c.json({ success: false, message: "Page content not found" }, 404);
  }
  return c.json({ success: true, data });
});

// GET /api/public/categories
publicRouter.get("/categories", async (c) => {
  const data = await db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name));
  return c.json({ success: true, data });
});

// GET /api/public/services (with optional ?categoryId=)
publicRouter.get("/services", async (c) => {
  const categoryIdParam = c.req.query("categoryId");
  const categoryId = categoryIdParam ? parseInt(categoryIdParam, 10) : undefined;

  let query = db
    .select({
      id: services.id,
      name: services.name,
      description: services.description,
      price: services.price,
      imageUrl: services.imageUrl,
      isFeatured: services.isFeatured,
      isActive: services.isActive,
      sortOrder: services.sortOrder,
      categoryId: services.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(services)
    .innerJoin(categories, eq(services.categoryId, categories.id))
    .where(
      categoryId
        ? and(eq(services.isActive, true), eq(services.categoryId, categoryId))
        : eq(services.isActive, true)
    )
    .orderBy(asc(services.sortOrder), asc(services.id));

  const data = await query;
  return c.json({ success: true, data });
});

// GET /api/public/featured-services (top 3 featured services for Home)
publicRouter.get("/featured-services", async (c) => {
  const data = await db
    .select({
      id: services.id,
      name: services.name,
      description: services.description,
      price: services.price,
      imageUrl: services.imageUrl,
      isFeatured: services.isFeatured,
      isActive: services.isActive,
      sortOrder: services.sortOrder,
      categoryId: services.categoryId,
      categoryName: categories.name,
    })
    .from(services)
    .innerJoin(categories, eq(services.categoryId, categories.id))
    .where(and(eq(services.isActive, true), eq(services.isFeatured, true)))
    .orderBy(asc(services.sortOrder), asc(services.id))
    .limit(3);

  return c.json({ success: true, data });
});

// POST /api/public/contact
publicRouter.post("/contact", async (c) => {
  const body = await c.req.json();
  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      {
        success: false,
        message: "ข้อมูลที่กรอกไม่ถูกต้อง กรุณาตรวจสอบข้อมูลอีกครั้ง",
        errors: parsed.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      },
      400
    );
  }

  const { name, phone, email, subject, message } = parsed.data;

  const [newMessage] = await db
    .insert(messages)
    .values({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || null,
      subject: subject?.trim() || "ข้อความติดต่อทั่วไป",
      message: message.trim(),
      isRead: false,
    })
    .returning();

  return c.json({
    success: true,
    message: "ส่งข้อความติดต่อเรียบร้อยแล้ว ทีมงานจะติดต่อกลับโดยเร็วที่สุด",
    data: { id: newMessage.id },
  });
});

export default publicRouter;
