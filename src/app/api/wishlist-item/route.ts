import { db } from "@/db/drizzle";
import { user, wishlistItem } from "@/db/schema";
import { CreateWishlistItemRequest, WishlistItem } from "@/service/wishlist-item/wishlist-item";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

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

/**
 * Handles GET requests to /api/wishlist-item to fetch all wishlist items for the authenticated user.
 * @param req The incoming NextRequest.
 * @returns A NextResponse containing an array of wishlist items or an error.
 */
export async function GET(req: NextRequest) {
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

    // Fetch all wishlist items for the current user
    const items: WishlistItem[] = await db
      .select()
      .from(wishlistItem)
      .where(eq(wishlistItem.userId, dbUser.id));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist items" },
      { status: 500 }
    );
  }
}