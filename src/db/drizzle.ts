import { config } from "dotenv";
import { drizzle as postgresDrizzle } from "drizzle-orm/node-postgres";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema"; // adjust path to your schema.ts

config({ path: ".env.local" });

const isProduction = process.env.NODE_ENV === "production";
const databaseUrl = process.env.DATABASE_URL!;

let db: ReturnType<typeof postgresDrizzle> | ReturnType<typeof neonDrizzle>;

if (isProduction) {
  // Use Neon HTTP adapter in production
  const sql = neon(databaseUrl);
  db = neonDrizzle({ client: sql, schema }); 
} else {
  // Use node-postgres adapter in development
  db = postgresDrizzle(databaseUrl, { schema });
}

export { db };
