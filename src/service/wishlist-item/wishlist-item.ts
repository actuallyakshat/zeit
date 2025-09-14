"use client";

export type CreateWishlistItemRequest = {
  title: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  price: number;
};

/**
 * Create a new wishlist item for the current user
 * @param item The wishlist item data
 * @returns The created wishlist item
 */
export async function createWishlistItem(item: CreateWishlistItemRequest) {
  try {
    const response = await fetch("/api/wishlist-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error("Failed to create wishlist item");
    }

    const data = await response.json();
    return data.item;
  } catch (error) {
    console.error("Error creating wishlist item:", error);
    throw error;
  }
}
