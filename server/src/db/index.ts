import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgres://postgres:1234@localhost:5432/starter_biz";

// For queries
export const client = postgres(connectionString, { max: 10 });
export const db = drizzle(client, { schema });
