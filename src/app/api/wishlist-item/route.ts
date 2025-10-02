import { db } from "@/db/drizzle";
import { user, wishlistItem } from "@/db/schema";
import {
  CreateWishlistItemRequest,
  WishlistItem,
} from "@/service/wishlist-item/wishlist-item";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
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
 * Supports pagination, filtering by purchased status, and sorting.
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
    const sortByParam = searchParams.get("sortBy");
    const sortOrderParam = searchParams.get("sortOrder");

    // Set defaults
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 12;
    const offset = (page - 1) * limit;
    const sortBy = sortByParam || "createdAt"; // Default sort by createdAt
    const sortOrder = sortOrderParam === "asc" ? "asc" : "desc"; // Default sort order is desc

    // Build where conditions
    const conditions = [eq(wishlistItem.userId, dbUser.id)];

    // Add purchased filter if specified
    if (purchasedParam !== null) {
      const purchasedValue = purchasedParam === "true";
      conditions.push(eq(wishlistItem.purchased, purchasedValue));
    }

    // Validate sortBy parameter
    const validSortFields = ["title", "price", "createdAt", "updatedAt"];
    const orderByField = validSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    // Build and execute query with filtering, pagination, and sorting
    const query = db
      .select()
      .from(wishlistItem)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);

    // Apply sorting
    if (orderByField === "title") {
      query.orderBy(
        sortOrder === "asc" ? wishlistItem.title : desc(wishlistItem.title)
      );
    } else if (orderByField === "price") {
      query.orderBy(
        sortOrder === "asc" ? wishlistItem.price : desc(wishlistItem.price)
      );
    } else if (orderByField === "createdAt") {
      query.orderBy(
        sortOrder === "asc"
          ? wishlistItem.createdAt
          : desc(wishlistItem.createdAt)
      );
    } else if (orderByField === "updatedAt") {
      query.orderBy(
        sortOrder === "asc"
          ? wishlistItem.updatedAt
          : desc(wishlistItem.updatedAt)
      );
    }

    const items: WishlistItem[] = await query;

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist items" },
      { status: 500 }
    );
  }
}
