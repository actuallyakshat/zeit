#!/usr/bin/env tsx

import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { user } from "../src/db/schema";
import { isNotNull } from "drizzle-orm";
import { encryptMonthlyIncome, isEncrypted } from "../src/lib/encryption";

config({ path: ".env.local" });

async function encryptExistingMonthlyIncomes() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  console.log("🔒 Starting encryption of existing monthly_income values...");

  const sql = neon(databaseUrl);
  const db = drizzle({ client: sql });

  try {
    // First, let's see what data we have
    const usersWithIncome = await db
      .select({
        id: user.id,
        monthlyIncome: user.monthlyIncome,
      })
      .from(user)
      .where(isNotNull(user.monthlyIncome));

    console.log(
      `📊 Found ${usersWithIncome.length} users with monthly_income values`
    );

    if (usersWithIncome.length === 0) {
      console.log("✅ No data to encrypt. Migration complete.");
      return;
    }

    // Process each user
    for (const userData of usersWithIncome) {
      const currentIncome = userData.monthlyIncome;

      if (!currentIncome) continue;

      // Check if it's a valid number (from the integer days)
      const incomeNumber = parseInt(currentIncome, 10);
      if (isNaN(incomeNumber)) {
        console.log(
          `⚠️  User ${userData.id}: Invalid income value '${currentIncome}', skipping`
        );
        continue;
      }

      // Encrypt the income
      const encryptedIncome = encryptMonthlyIncome(incomeNumber);

      console.log(
        `🔐 User ${
          userData.id
        }: Encrypting ${incomeNumber} -> ${encryptedIncome.substring(0, 20)}...`
      );

      // Update the database with raw SQL to handle the type change
      await sql`
        UPDATE "user" 
        SET monthly_income = ${encryptedIncome}
        WHERE id = ${userData.id}
      `;
    }

    console.log("✅ Successfully encrypted all monthly_income values!");

    // Verify the encryption worked
    const verifyUsers = await db
      .select({
        id: user.id,
        monthlyIncome: user.monthlyIncome,
      })
      .from(user)
      .where(isNotNull(user.monthlyIncome));

    console.log("\n🔍 Verification:");
    for (const userData of verifyUsers) {
      if (userData.monthlyIncome) {
        const isNowEncrypted = isEncrypted(userData.monthlyIncome);
        console.log(
          `  User ${userData.id}: ${
            isNowEncrypted ? "✅ Encrypted" : "❌ Not encrypted"
          }`
        );
      }
    }
  } catch (error) {
    console.error("❌ Error during encryption:", error);
    throw error;
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  encryptExistingMonthlyIncomes()
    .then(() => {
      console.log("🎉 Migration completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Migration failed:", error);
      process.exit(1);
    });
}

export { encryptExistingMonthlyIncomes };
