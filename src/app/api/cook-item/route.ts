import { db } from "@/db/drizzle";
import { cookItem, wishlistItem } from "@/db/schema";
import { formatActionResponse } from "@/lib/formatActionResponse";
import { CreateCookItemRequest } from "@/service/cook-item/cook-item";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        formatActionResponse({ message: "User ID is required" }, false, 400),
        { status: 400 }
      );
    }

    const itemBeingCookedForUser = await db
      .select()
      .from(cookItem)
      .leftJoin(wishlistItem, eq(wishlistItem.id, cookItem.itemId))
      .where(eq(cookItem.userId, userId));

    console.log("Item being cooked for user:", itemBeingCookedForUser);

    // Return null if array is empty, otherwise return the data
    const response = formatActionResponse(
      itemBeingCookedForUser.length > 0 ? itemBeingCookedForUser[0] : null,
      true,
      200
    );
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error getting cook item:", error);
    return NextResponse.json(
      formatActionResponse({ message: "Failed to get cook item" }, false, 500),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, wishlistItemId }: CreateCookItemRequest =
      await request.json();

    if (!userId) {
      return NextResponse.json(
        formatActionResponse({ message: "User ID is required" }, false, 400),
        { status: 400 }
      );
    }

    const existingCookItem = await db
      .select()
      .from(cookItem)
      .where(eq(cookItem.userId, userId));

    if (existingCookItem.length > 0) {
      return NextResponse.json(
        formatActionResponse(
          { message: "You can only cook one item at a time" },
          false,
          400
        ),
        { status: 400 }
      );
    }

    const [newCookItem] = await db
      .insert(cookItem)
      .values({
        userId: userId,
        itemId: wishlistItemId,
      })
      .returning();

    return NextResponse.json(formatActionResponse(newCookItem, true, 200));
  } catch (error) {
    console.error("Error creating cook item:", error);
    return NextResponse.json(
      formatActionResponse(
        { message: "Failed to create cook item" },
        false,
        500
      ),
      { status: 500 }
    );
  }
}
