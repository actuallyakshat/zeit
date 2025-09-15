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
      // Decrypt monthlyIncome if it exists and is encrypted
      const userData = existingUser[0];
      if (userData.monthlyIncome && isEncrypted(userData.monthlyIncome)) {
        userData.monthlyIncome = decryptMonthlyIncome(
          userData.monthlyIncome
        ).toString();
      }
      return NextResponse.json({ user: userData });
    }

    // Encrypt monthlyIncome if provided

    // Create new user
    const [newUser] = await db.insert(user).values(body).returning();

    // Decrypt monthlyIncome for response
    if (newUser.monthlyIncome && isEncrypted(newUser.monthlyIncome)) {
      newUser.monthlyIncome = decryptMonthlyIncome(
        newUser.monthlyIncome
      ).toString();
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
