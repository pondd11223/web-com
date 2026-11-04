import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, client } from "./index";

async function runMigrate() {
  console.log("⏳ Running migrations to Neon DB...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✅ Migrations completed successfully!");
  await client.end();
  process.exit(0);
}

runMigrate().catch(async (err) => {
  console.error("❌ Migration failed:", err);
  await client.end();
  process.exit(1);
});

