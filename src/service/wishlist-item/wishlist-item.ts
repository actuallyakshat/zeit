"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

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
async function createWishlistItem(
  item: CreateWishlistItemRequest,
): Promise<WishlistItem> {
  const response = await fetch("/api/wishlist-item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create wishlist item");
  }

  const data = await response.json();
  return data.item;
}

export function useCreateWishlistItem() {
  const queryClient = useQueryClient();
  return useMutation<WishlistItem, Error, CreateWishlistItemRequest>({
    mutationFn: createWishlistItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlistItems"] });
    },
    onError: (error) => {
      console.error("Error creating wishlist item:", error);
      // You might want to add a toast/notification here
    },
  });
}

export type UpdateWishlistItemRequest = {
  id: string;
  title?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  price?: number;
  purchased?: boolean;
};

/**
 * Update an existing wishlist item
 * @param item The wishlist item data to update
 * @returns The updated wishlist item
 */
async function updateWishlistItem(
  item: UpdateWishlistItemRequest,
): Promise<WishlistItem> {
  const response = await fetch(`/api/wishlist-item/${item.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update wishlist item");
  }

  const data = await response.json();
  return data.item;
}

export function useUpdateWishlistItem() {
  const queryClient = useQueryClient();
  return useMutation<WishlistItem, Error, UpdateWishlistItemRequest>({
    mutationFn: updateWishlistItem,
    onSuccess: (updatedItem) => {
      queryClient.invalidateQueries({ queryKey: ["wishlistItems"] });
      queryClient.setQueryData(
        ["wishlistItem", updatedItem.id],
        updatedItem,
      );
    },
    onError: (error) => {
      console.error("Error updating wishlist item:", error);
      // You might want to add a toast/notification here
    },
  });
}

/**
 * Delete a wishlist item
 * @param id The ID of the wishlist item to delete
 * @returns A boolean indicating success
 */
async function deleteWishlistItem(id: string): Promise<boolean> {
  const response = await fetch(`/api/wishlist-item/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete wishlist item");
  }

  return true;
}

export function useDeleteWishlistItem() {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: deleteWishlistItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlistItems"] });
    },
    onError: (error) => {
      console.error("Error deleting wishlist item:", error);
      // You might want to add a toast/notification here
    },
  });
}

// Example of how you might fetch all wishlist items (e.g., for a list page)
// This would typically go into a separate `queries.ts` file or similar.
import { useQuery } from "@tanstack/react-query";

async function getWishlistItems(): Promise<WishlistItem[]> {
  const response = await fetch("/api/wishlist-item");
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch wishlist items");
  }
  const data = await response.json();
  return data.items;
}

// Example of how you might fetch a single wishlist item
async function getWishlistItemById(id: string): Promise<WishlistItem> {
  const response = await fetch(`/api/wishlist-item/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch wishlist item");
  }
  const data = await response.json();
  return data.item;
}

export function useWishlistItem(id: string) {
  return useQuery<WishlistItem, Error>({
    queryKey: ["wishlistItem", id],
    queryFn: () => getWishlistItemById(id),
    enabled: !!id, // Only run the query if id is available
  });
}

export type WishlistItem = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  url: string | null;
  imageUrl: string | null;
  price: number;
  purchased: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type PaginatedWishlistItems = {
  items: WishlistItem[];
  page: number;
  limit: number;
  total: number;
};

// Client-side function to fetch wishlist items via an API endpoint
async function getWishlistItemsClient(): Promise<WishlistItem[]> {
  const response = await fetch("/api/wishlist-item"); // Assuming you have an API route for this
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch wishlist items");
  }
  const data = await response.json();
  return data.items;
}

/**
 * Client-side function to fetch paginated wishlist items
 * @param params Pagination and filter parameters
 * @returns Paginated wishlist items
 */
async function getPaginatedWishlistItemsClient(params: {
  purchased?: boolean;
  page: number;
  limit: number;
}): Promise<WishlistItem[]> {
  const { purchased, page, limit } = params;
  const searchParams = new URLSearchParams();
  
  if (purchased !== undefined) {
    searchParams.append("purchased", purchased.toString());
  }
  searchParams.append("page", page.toString());
  searchParams.append("limit", limit.toString());

  const response = await fetch(`/api/wishlist-item?${searchParams.toString()}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch wishlist items");
  }
  const data = await response.json();
  return data.items;
}

/**
 * Tanstack Query hook to fetch wishlist items.
 * This hook is intended for client-side usage.
 * It will call a client-side API endpoint, which in turn
 * can call the server-side `getWishlistItemsServer` function.
 */
export function useWishlistItems() {
  return useQuery<WishlistItem[], Error>({
    queryKey: ["wishlistItems"],
    queryFn: getWishlistItemsClient, // Use the client-side fetcher
  });
}

/**
 * Tanstack Query hook to fetch paginated wishlist items
 * @param params Pagination and filter parameters
 * @returns Paginated wishlist items query
 */
export function usePaginatedWishlistItems(params: {
  purchased?: boolean;
  page: number;
  limit: number;
}) {
  return useQuery<WishlistItem[], Error>({
    queryKey: ["wishlistItems", params],
    queryFn: () => getPaginatedWishlistItemsClient(params),
  });
}