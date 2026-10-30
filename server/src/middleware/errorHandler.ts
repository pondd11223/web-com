import type { Context } from "hono";
import { ZodError } from "zod";

export function errorHandler(err: Error, c: Context) {
  console.error("Server Error:", err);

  if (err instanceof ZodError) {
    return c.json(
      {
        success: false,
        message: "ข้อมูลไม่ถูกต้องตามรูปแบบที่กำหนด",
        errors: err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      },
      400
    );
  }

  return c.json(
    {
      success: false,
      message: err.message || "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    },
    500
  );
}
