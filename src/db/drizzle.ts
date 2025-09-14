import { config } from "dotenv";
import { drizzle as postgresDrizzle } from "drizzle-orm/node-postgres";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });

// Determine which adapter to use based on environment
const isProduction = process.env.NODE_ENV === "production";
const databaseUrl = process.env.DATABASE_URL!;

let db: ReturnType<typeof postgresDrizzle> | ReturnType<typeof neonDrizzle>;

if (isProduction) {
  // Use Neon HTTP adapter in production
  const sql = neon(databaseUrl);
  db = neonDrizzle({ client: sql });
} else {
  // Use node-postgres adapter in development
  db = postgresDrizzle(databaseUrl);
}

export { db };
