import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    throw new Error(
      "❌ DATABASE_URL is not defined! Please set DATABASE_URL in Vercel Environment Variables."
    );
  }
}

const dbUrl = connectionString || "postgres://postgres:1234@localhost:5432/starter_biz";

// Use max: 1 connection per serverless function instance on Vercel to protect Neon free tier pool limits
export const client = postgres(dbUrl, {
  max: process.env.VERCEL ? 1 : 10,
  ssl: dbUrl.includes("neon.tech") || process.env.VERCEL ? "require" : undefined,
});

export const db = drizzle(client, { schema });
