import { db } from "@/db/drizzle";
import { user, wishlistItem } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { CreateWishlistItemRequest } from "@/service/wishlist-item/wishlist-item";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's UUID from the database using their Clerk ID
    const [dbUser] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.clerkId, clerkUserId));

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body: CreateWishlistItemRequest = await req.json();

    // Create new wishlist item
    const [newItem] = await db
      .insert(wishlistItem)
      .values({
        userId: dbUser.id,
        title: body.title,
        description: body.description,
        url: body.url,
        imageUrl: body.imageUrl,
        price: body.price,
        purchased: body.purchased,
      })
      .returning();

    revalidatePath("/(dashboard)/list");
    revalidatePath("/list");

    return NextResponse.json({ item: newItem });
  } catch (error) {
    console.error("Error creating wishlist item:", error);
    return NextResponse.json(
      { error: "Failed to create wishlist item" },
      { status: 500 }
    );
  }
}
