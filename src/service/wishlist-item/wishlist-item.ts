"use client";

export type CreateWishlistItemRequest = {
  title: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  price: number;
  purchased: boolean;
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

export type UpdateWishlistItemRequest = {
  id: string;
  title: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  price: number;
  purchased: boolean;
};

/**
 * Update an existing wishlist item
 * @param item The wishlist item data to update
 * @returns The updated wishlist item
 */
export async function updateWishlistItem(item: UpdateWishlistItemRequest) {
  try {
    const response = await fetch(`/api/wishlist-item/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error("Failed to update wishlist item");
    }

    const data = await response.json();
    return data.item;
  } catch (error) {
    console.error("Error updating wishlist item:", error);
    throw error;
  }
}

/**
 * Delete a wishlist item
 * @param id The ID of the wishlist item to delete
 * @returns A boolean indicating success
 */
export async function deleteWishlistItem(id: string) {
  try {
    const response = await fetch(`/api/wishlist-item/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete wishlist item");
    }

    return true;
  } catch (error) {
    console.error("Error deleting wishlist item:", error);
    throw error;
  }
}
