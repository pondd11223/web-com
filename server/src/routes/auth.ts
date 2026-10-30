import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { admins } from "../db/schema";
import { loginSchema } from "../validators";
import {
  createAuthToken,
  setAuthCookie,
  clearAuthCookie,
  authGuard,
  type AdminPayload,
} from "../middleware/auth";

const authRouter = new Hono<{ Variables: { admin: AdminPayload } }>();

// POST /api/auth/login
authRouter.post("/login", async (c) => {
  const body = await c.req.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ success: false, message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, 400);
  }

  const { email, password } = parsed.data;

  // Find admin by email
  const [admin] = await db.select().from(admins).where(eq(admins.email, email.toLowerCase().trim())).limit(1);

  if (!admin) {
    // Return generic message as required by spec
    return c.json({ success: false, message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, 401);
  }

  // Verify password with Bun.password
  const isMatch = await Bun.password.verify(password, admin.password);
  if (!isMatch) {
    return c.json({ success: false, message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, 401);
  }

  // Create JWT token (valid 24h)
  const token = await createAuthToken({
    id: admin.id,
    email: admin.email,
    name: admin.name,
  });

  setAuthCookie(c, token);

  return c.json({
    success: true,
    message: "เข้าสู่ระบบสำเร็จ",
    token,
    data: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    },
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    },
  });
});

// POST /api/auth/logout
authRouter.post("/logout", async (c) => {
  clearAuthCookie(c);
  return c.json({ success: true, message: "ออกจากระบบเรียบร้อยแล้ว" });
});

// GET /api/auth/me
authRouter.get("/me", authGuard, async (c) => {
  const adminPayload = c.get("admin");
  return c.json({
    success: true,
    data: adminPayload,
    admin: adminPayload,
  });
});

export default authRouter;
