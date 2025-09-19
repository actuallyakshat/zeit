import { db } from "@/db/drizzle";
import { user, wishlistItem } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth();
    const { id } = await params;

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

    const body = await req.json();
    const { title, description, url, imageUrl, price, purchased } = body;

    // Update wishlist item
    const [updatedItem] = await db
      .update(wishlistItem)
      .set({
        title,
        description,
        url,
        imageUrl,
        price,
        purchased,
        updatedAt: new Date(),
      })
      .where(eq(wishlistItem.id, id))
      .returning();

    if (!updatedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ item: updatedItem });
  } catch (error) {
    console.error("Error updating wishlist item:", error);
    return NextResponse.json(
      { error: "Failed to update wishlist item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth();
    const { id } = await params;

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

    // Delete wishlist item
    const deletedItem = await db
      .delete(wishlistItem)
      .where(eq(wishlistItem.id, id))
      .returning();

    if (!deletedItem.length) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    revalidatePath("/(dashboard)/list");
    revalidatePath("/list");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting wishlist item:", error);
    return NextResponse.json(
      { error: "Failed to delete wishlist item" },
      { status: 500 }
    );
  }
}
