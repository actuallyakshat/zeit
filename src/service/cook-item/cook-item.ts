"use client";

import { FormattedResponse } from "@/lib/formatActionResponse";

export interface GetCookingItemRequest {
  userId: string;
}

import { CookItem, WishlistItem } from "@/types/schemaTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface CookItemResponse {
  cook_item: CookItem;
  wishlist_item: WishlistItem;
}

export async function getCookingItem({ userId }: GetCookingItemRequest) {
  try {
    const response = await fetch(`/api/cook-item?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseJson: FormattedResponse<CookItemResponse> =
      await response.json();
    if (!responseJson.success) {
      throw new Error("Failed to fetch cooking item");
    }

    return responseJson.data;
  } catch (error) {
    console.error("Error fetching cooking item:", error);
    return null;
  }
}

export interface CreateCookItemRequest {
  userId: string;
  wishlistItemId: string;
}

export async function postCookItem({
  userId,
  wishlistItemId,
}: CreateCookItemRequest) {
  try {
    const res = await fetch("/api/cook-item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, wishlistItemId }),
    });
    const data: FormattedResponse<CookItemResponse> = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to create cook item");
    }

    return data.data;
  } catch (error) {
    console.error("Error creating cook item:", error);
    throw error;
  }
}

export function useCookingItem(user: { id: string } | null) {
  const response = useQuery({
    queryKey: ["cooking-item"],
    queryFn: () => getCookingItem({ userId: user?.id as string }),
    enabled: !!user?.id,
  });

  return response;
}

export async function deleteCookItem(id: string) {
  try {
    const res = await fetch(`/api/cook-item/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data: FormattedResponse<null> = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to delete cook item");
    }

    return true;
  } catch (error) {
    console.error("Error deleting cook item:", error);
    throw error;
  }
}

export function useDeleteCookItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCookItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cooking-item"] }); // refresh the list after deletion
    },
  });
}

export function useCreateCookItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postCookItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cooking-item"] }); // refresh cache
    },
  });
}
