import { db } from "@/db/drizzle";
import { user, wishlistItem } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export type WishlistItem = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  url: string | null;
  imageUrl: string | null;
  price: number;
  purchased: boolean;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Fetch all wishlist items for the current user
 * @returns Array of wishlist items
 */
export async function getWishlistItems(): Promise<WishlistItem[]> {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    throw new Error("Unauthorized");
  }

  // First get the user's database ID using their Clerk ID
  const [dbUser] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.clerkId, clerkUserId));

  if (!dbUser) {
    throw new Error("User not found");
  }

  // Fetch wishlist items for the current user
  const items = await db
    .select()
    .from(wishlistItem)
    .where(eq(wishlistItem.userId, dbUser.id));

  return items;
}
