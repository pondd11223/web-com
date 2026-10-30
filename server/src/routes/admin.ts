import { Hono } from "hono";
import { eq, desc, asc, ilike, and, sql, count } from "drizzle-orm";
import { db } from "../db";
import { settings, pageContents, services, categories, messages, admins } from "../db/schema";
import { authGuard, type AdminPayload } from "../middleware/auth";
import {
  settingsSchema,
  pageContentSchema,
  serviceSchema,
  categorySchema,
} from "../validators";

const adminRouter = new Hono<{ Variables: { admin: AdminPayload } }>();

// Apply authGuard to all /api/admin routes
adminRouter.use("*", authGuard);

// -------------------------------------------------------------
// DASHBOARD
// -------------------------------------------------------------
adminRouter.get("/dashboard", async (c) => {
  // Unread messages count
  const [unreadCountResult] = await db
    .select({ value: count(messages.id) })
    .from(messages)
    .where(eq(messages.isRead, false));

  // Total services count
  const [totalServicesResult] = await db
    .select({ value: count(services.id) })
    .from(services);

  // Total categories count
  const [totalCategoriesResult] = await db
    .select({ value: count(categories.id) })
    .from(categories);

  // Latest 5 messages
  const latestMessages = await db
    .select()
    .from(messages)
    .orderBy(desc(messages.createdAt))
    .limit(5);

  return c.json({
    success: true,
    data: {
      unreadMessagesCount: Number(unreadCountResult?.value || 0),
      totalServicesCount: Number(totalServicesResult?.value || 0),
      totalCategoriesCount: Number(totalCategoriesResult?.value || 0),
      latestMessages,
    },
  });
});

// -------------------------------------------------------------
// SETTINGS (/admin/settings)
// -------------------------------------------------------------
adminRouter.get("/settings", async (c) => {
  const [data] = await db.select().from(settings).limit(1);
  return c.json({ success: true, data: data || null });
});

adminRouter.put("/settings", async (c) => {
  const body = await c.req.json();
  const parsed = settingsSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ success: false, message: "ข้อมูลการตั้งค่าไม่ถูกต้อง", errors: parsed.error.errors }, 400);
  }

  const existing = await db.select().from(settings).limit(1);

  let updated;
  if (existing.length === 0) {
    [updated] = await db
      .insert(settings)
      .values({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .returning();
  } else {
    [updated] = await db
      .update(settings)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(eq(settings.id, existing[0].id))
      .returning();
  }

  return c.json({ success: true, message: "บันทึกการตั้งค่าเว็บไซต์เรียบร้อยแล้ว", data: updated });
});

// -------------------------------------------------------------
// PAGES & SEO (/admin/pages)
// -------------------------------------------------------------
adminRouter.get("/pages", async (c) => {
  const data = await db.select().from(pageContents);
  return c.json({ success: true, data });
});

adminRouter.get("/pages/:key", async (c) => {
  const key = c.req.param("key");
  const [data] = await db.select().from(pageContents).where(eq(pageContents.pageKey, key)).limit(1);
  if (!data) {
    return c.json({ success: false, message: "ไม่พบหน้าดังกล่าว" }, 404);
  }
  return c.json({ success: true, data });
});

adminRouter.put("/pages/:key", async (c) => {
  const key = c.req.param("key");
  const body = await c.req.json();
  const parsed = pageContentSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ success: false, message: "ข้อมูลเนื้อหาหน้าไม่ถูกต้อง", errors: parsed.error.errors }, 400);
  }

  const existing = await db.select().from(pageContents).where(eq(pageContents.pageKey, key)).limit(1);

  let updated;
  if (existing.length === 0) {
    [updated] = await db
      .insert(pageContents)
      .values({
        pageKey: key,
        ...parsed.data,
        updatedAt: new Date(),
      })
      .returning();
  } else {
    [updated] = await db
      .update(pageContents)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(eq(pageContents.pageKey, key))
      .returning();
  }

  return c.json({ success: true, message: `อัปเดตข้อมูลหน้า ${key} และ SEO สำเร็จ`, data: updated });
});

// -------------------------------------------------------------
// SERVICES / PRODUCTS (/admin/services)
// -------------------------------------------------------------
adminRouter.get("/services", async (c) => {
  const search = c.req.query("search")?.trim() || "";
  const categoryIdParam = c.req.query("categoryId");
  const categoryId = categoryIdParam && categoryIdParam !== "all" ? parseInt(categoryIdParam, 10) : undefined;
  const page = parseInt(c.req.query("page") || "1", 10);
  const limit = parseInt(c.req.query("limit") || "10", 10);
  const offset = (page - 1) * limit;

  // Build filter conditions
  const conditions = [];
  if (search) {
    conditions.push(ilike(services.name, `%${search}%`));
  }
  if (categoryId) {
    conditions.push(eq(services.categoryId, categoryId));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Total count for pagination
  const [totalCountResult] = await db
    .select({ value: count(services.id) })
    .from(services)
    .where(whereClause);

  const totalItems = Number(totalCountResult?.value || 0);
  const totalPages = Math.ceil(totalItems / limit) || 1;

  // Query paginated items with category name
  const items = await db
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
      createdAt: services.createdAt,
      updatedAt: services.updatedAt,
    })
    .from(services)
    .innerJoin(categories, eq(services.categoryId, categories.id))
    .where(whereClause)
    .orderBy(asc(services.sortOrder), asc(services.id))
    .limit(limit)
    .offset(offset);

  return c.json({
    success: true,
    data: {
      items,
      pagination: {
        total: totalItems,
        page,
        limit,
        totalPages,
      },
    },
  });
});

adminRouter.post("/services", async (c) => {
  const body = await c.req.json();
  const parsed = serviceSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ success: false, message: "ข้อมูลสินค้า/บริการไม่ถูกต้อง", errors: parsed.error.errors }, 400);
  }

  const [newService] = await db
    .insert(services)
    .values({
      categoryId: parsed.data.categoryId,
      name: parsed.data.name.trim(),
      description: parsed.data.description.trim(),
      price: parsed.data.price.toString(),
      imageUrl: parsed.data.imageUrl.trim(),
      isFeatured: parsed.data.isFeatured,
      isActive: parsed.data.isActive,
      sortOrder: parsed.data.sortOrder,
      updatedAt: new Date(),
    })
    .returning();

  return c.json({ success: true, message: "เพิ่มสินค้า/บริการเรียบร้อยแล้ว", data: newService }, 201);
});

adminRouter.put("/services/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const body = await c.req.json();
  const parsed = serviceSchema.partial().safeParse(body);

  if (!parsed.success) {
    return c.json({ success: false, message: "ข้อมูลสินค้า/บริการไม่ถูกต้อง", errors: parsed.error.errors }, 400);
  }

  const updateData: any = { ...parsed.data, updatedAt: new Date() };
  if (parsed.data.price !== undefined) {
    updateData.price = parsed.data.price.toString();
  }

  const [updated] = await db
    .update(services)
    .set(updateData)
    .where(eq(services.id, id))
    .returning();

  if (!updated) {
    return c.json({ success: false, message: "ไม่พบสินค้า/บริการที่ต้องการแก้ไข" }, 404);
  }

  return c.json({ success: true, message: "แก้ไขสินค้า/บริการเรียบร้อยแล้ว", data: updated });
});

adminRouter.delete("/services/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const [deleted] = await db.delete(services).where(eq(services.id, id)).returning();

  if (!deleted) {
    return c.json({ success: false, message: "ไม่พบสินค้า/บริการที่ต้องการลบ" }, 404);
  }

  return c.json({ success: true, message: "ลบสินค้า/บริการเรียบร้อยแล้ว" });
});

// -------------------------------------------------------------
// CATEGORIES (/admin/categories)
// -------------------------------------------------------------
adminRouter.get("/categories", async (c) => {
  const list = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      sortOrder: categories.sortOrder,
      servicesCount: count(services.id),
      createdAt: categories.createdAt,
    })
    .from(categories)
    .leftJoin(services, eq(categories.id, services.categoryId))
    .groupBy(categories.id)
    .orderBy(asc(categories.sortOrder), asc(categories.name));

  return c.json({ success: true, data: list });
});

adminRouter.post("/categories", async (c) => {
  const body = await c.req.json();
  const parsed = categorySchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ success: false, message: "ข้อมูลหมวดหมู่ไม่ถูกต้อง", errors: parsed.error.errors }, 400);
  }

  // Check unique slug
  const [existingSlug] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, parsed.data.slug.trim().toLowerCase()))
    .limit(1);

  if (existingSlug) {
    return c.json({ success: false, message: "Slug นี้มีอยู่ในระบบแล้ว กรุณาใช้ slug อื่น" }, 400);
  }

  const [newCat] = await db
    .insert(categories)
    .values({
      name: parsed.data.name.trim(),
      slug: parsed.data.slug.trim().toLowerCase(),
      description: parsed.data.description?.trim() || null,
      sortOrder: parsed.data.sortOrder,
    })
    .returning();

  return c.json({ success: true, message: "สร้างหมวดหมู่ใหม่เรียบร้อยแล้ว", data: newCat }, 201);
});

adminRouter.put("/categories/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const body = await c.req.json();
  const parsed = categorySchema.partial().safeParse(body);

  if (!parsed.success) {
    return c.json({ success: false, message: "ข้อมูลหมวดหมู่ไม่ถูกต้อง", errors: parsed.error.errors }, 400);
  }

  const updateData: any = { ...parsed.data };
  if (parsed.data.slug) {
    updateData.slug = parsed.data.slug.trim().toLowerCase();
  }

  const [updated] = await db
    .update(categories)
    .set(updateData)
    .where(eq(categories.id, id))
    .returning();

  if (!updated) {
    return c.json({ success: false, message: "ไม่พบหมวดหมู่ที่ต้องการแก้ไข" }, 404);
  }

  return c.json({ success: true, message: "แก้ไขหมวดหมู่เรียบร้อยแล้ว", data: updated });
});

adminRouter.delete("/categories/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);

  // Check if any services are attached to this category
  const [serviceCheck] = await db
    .select({ value: count(services.id) })
    .from(services)
    .where(eq(services.categoryId, id));

  if (Number(serviceCheck?.value || 0) > 0) {
    return c.json(
      {
        success: false,
        message: "ไม่สามารถลบหมวดหมู่นี้ได้ เนื่องจากยังมีสินค้า/บริการผูกอยู่ กรุณาย้ายหรือลบสินค้าก่อน",
      },
      400
    );
  }

  const [deleted] = await db.delete(categories).where(eq(categories.id, id)).returning();

  if (!deleted) {
    return c.json({ success: false, message: "ไม่พบหมวดหมู่ที่ต้องการลบ" }, 404);
  }

  return c.json({ success: true, message: "ลบหมวดหมู่เรียบร้อยแล้ว" });
});

// -------------------------------------------------------------
// MESSAGES (/admin/messages)
// -------------------------------------------------------------
adminRouter.get("/messages", async (c) => {
  const list = await db.select().from(messages).orderBy(desc(messages.createdAt));
  return c.json({ success: true, data: list });
});

// View message & mark as read automatically
adminRouter.get("/messages/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);

  // Update isRead to true
  const [updated] = await db
    .update(messages)
    .set({ isRead: true })
    .where(eq(messages.id, id))
    .returning();

  if (!updated) {
    return c.json({ success: false, message: "ไม่พบข้อความติดต่อ" }, 404);
  }

  return c.json({ success: true, data: updated });
});

adminRouter.delete("/messages/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const [deleted] = await db.delete(messages).where(eq(messages.id, id)).returning();

  if (!deleted) {
    return c.json({ success: false, message: "ไม่พบข้อความที่ต้องการลบ" }, 404);
  }

  return c.json({ success: true, message: "ลบข้อความติดต่อเรียบร้อยแล้ว" });
});

// -------------------------------------------------------------
// CHANGE ADMIN PASSWORD (/admin/change-password)
// -------------------------------------------------------------
adminRouter.put("/change-password", async (c) => {
  const adminPayload = c.get("admin");
  const body = await c.req.json();
  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return c.json({ success: false, message: "รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร" }, 400);
  }

  const [adminRecord] = await db.select().from(admins).where(eq(admins.id, adminPayload.id)).limit(1);
  if (!adminRecord) {
    return c.json({ success: false, message: "ไม่พบบัญชีผู้ดูแลระบบ" }, 404);
  }

  const isMatch = await Bun.password.verify(currentPassword, adminRecord.password);
  if (!isMatch) {
    return c.json({ success: false, message: "รหัสผ่านปัจจุบันไม่ถูกต้อง" }, 400);
  }

  const hashedPassword = await Bun.password.hash(newPassword, { algorithm: "bcrypt", cost: 10 });
  await db.update(admins).set({ password: hashedPassword }).where(eq(admins.id, adminPayload.id));

  return c.json({ success: true, message: "เปลี่ยนรหัสผ่านแอดมินสำเร็จแล้ว กรุณาใช้รหัสผ่านใหม่ในการเข้าสู่ระบบครั้งถัดไป" });
});

export default adminRouter;
