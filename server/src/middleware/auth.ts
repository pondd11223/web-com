import type { Context, Next } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "aura_coffee_starter_secret_key_2026_very_secure_string_here";
const secret = new TextEncoder().encode(JWT_SECRET_STRING);
const COOKIE_NAME = "auth_token";

export interface AdminPayload {
  id: number;
  email: string;
  name: string;
}

export async function createAuthToken(payload: AdminPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

export async function verifyAuthToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as AdminPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(c: Context, token: string) {
  setCookie(c, COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day in seconds
  });
}

export function clearAuthCookie(c: Context) {
  deleteCookie(c, COOKIE_NAME, {
    path: "/",
    sameSite: "Lax",
  });
}

export async function authGuard(c: Context, next: Next) {
  let token = getCookie(c, COOKIE_NAME);
  if (!token) {
    const authHeader = c.req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return c.json({ success: false, message: "Unauthorized: Please log in first" }, 401);
  }

  const payload = await verifyAuthToken(token);
  if (!payload) {
    clearAuthCookie(c);
    return c.json({ success: false, message: "Unauthorized: Session expired or invalid" }, 401);
  }

  c.set("admin", payload);
  await next();
}
