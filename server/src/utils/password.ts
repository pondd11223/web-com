import bcrypt from "bcryptjs";

/**
 * Universal password verification that works seamlessly across
 * Node.js (Vercel Serverless Functions) and Bun (local dev).
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    if (typeof Bun !== "undefined" && (Bun as any)?.password?.verify) {
      return await (Bun as any).password.verify(password, hash);
    }
    return false;
  }
}

/**
 * Universal password hashing that works in both Node.js and Bun.
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}
