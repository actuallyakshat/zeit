import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { decryptMonthlyIncome, isEncrypted } from "@/lib/encryption";
import { SyncUserRequest } from "@/service/user/user";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: SyncUserRequest = await req.json();

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.clerkId, body.clerkId))
      .limit(1);

    if (existingUser.length > 0) {
      // Create a copy to avoid mutating the original object
      const userData = { ...existingUser[0] };

      if (userData.monthlyIncome && isEncrypted(userData.monthlyIncome)) {
        const decryptedIncome = decryptMonthlyIncome(userData.monthlyIncome);
        userData.monthlyIncome =
          decryptedIncome !== null ? decryptedIncome.toString() : null;
      }
      return NextResponse.json({ user: userData });
    }

    // Create new user
    const [newUser] = await db.insert(user).values(body).returning();

    // Decrypt monthlyIncome for response
    if (newUser.monthlyIncome && isEncrypted(newUser.monthlyIncome)) {
      const decryptedIncome = decryptMonthlyIncome(newUser.monthlyIncome);
      newUser.monthlyIncome =
        decryptedIncome !== null ? decryptedIncome.toString() : null;
    }

    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error("Error creating or reading user:", error);
    return NextResponse.json(
      { error: "Failed to create or read user" },
      { status: 500 }
    );
  }
}
