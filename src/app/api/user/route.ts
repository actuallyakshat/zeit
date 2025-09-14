import { SyncUserRequest } from "@/app/dto/user/sync-user";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
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
      // Return existing user
      return NextResponse.json({ user: existingUser[0] });
    }

    // Create new user
    const [newUser] = await db.insert(user).values(body).returning();

    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error("Error creating or reading user:", error);
    return NextResponse.json(
      { error: "Failed to create or read user" },
      { status: 500 }
    );
  }
}
