import { db } from "@/db/drizzle";
import { user, wishlistItem } from "@/db/schema";
import { CreateWishlistItemRequest, WishlistItem } from "@/service/wishlist-item/wishlist-item";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
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
 * Supports pagination and filtering by purchased status.
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

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const purchasedParam = searchParams.get("purchased");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    // Set defaults
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 12;
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [eq(wishlistItem.userId, dbUser.id)];

    // Add purchased filter if specified
    if (purchasedParam !== null) {
      const purchasedValue = purchasedParam === "true";
      conditions.push(eq(wishlistItem.purchased, purchasedValue));
    }

    // Build and execute query with filtering and pagination
    const items: WishlistItem[] = await db
      .select()
      .from(wishlistItem)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist items" },
      { status: 500 }
    );
  }
}