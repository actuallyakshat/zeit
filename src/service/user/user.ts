"use client";

import { UserResource } from "@clerk/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferSelectModel } from "drizzle-orm";
import { user } from "@/db/schema";

// Define the database user type using Drizzle's InferSelectModel
export type DbUser = InferSelectModel<typeof user>;

export interface SyncUserRequest {
  name: string;
  email: string;
  username: string;
  clerkId: string;
  // Optional fields for calculation details
  monthlyIncome?: string | null;
  numberOfWorkingDays?: number | null;
  useWorkingDaysForCalculation?: boolean | null;
}

/**
 * Upsert a user in the database based on their Clerk user data
 * This is the actual API call function, now isolated for useMutation.
 * @returns The database user record
 */
async function performUpsertUser(
  requestData: SyncUserRequest
): Promise<DbUser> {
  const response = await fetch("/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to upsert user");
  }

  const data = await response.json();
  return data.user;
}

/**
 * Tanstack Query hook to upsert a user.
 * @returns A mutation object with `mutate`, `mutateAsync`, `isPending`, `isError`, `data`, `error`, etc.
 */
export function useUpsertUser() {
  const queryClient = useQueryClient();

  return useMutation<DbUser, Error, UserResource>({
    mutationFn: async (clerkUser: UserResource) => {
      // Prepare the data to be sent to your API
      const requestData: SyncUserRequest = {
        name: clerkUser?.fullName || "",
        email: clerkUser?.primaryEmailAddress?.emailAddress || "",
        username: clerkUser?.username || "",
        clerkId: clerkUser?.id || "",
      };
      return performUpsertUser(requestData);
    },
    onSuccess: (data) => {
      // Invalidate relevant queries or update cache if needed
      // For example, if you have a query to fetch the current user:
      queryClient.invalidateQueries({
        queryKey: ["currentUser", data.clerkId],
      });
      queryClient.setQueryData(["currentUser", data.clerkId], data);
      console.log("User upserted successfully:", data);
      // You might also want to display a toast notification here
    },
    onError: (error) => {
      console.error("Error upserting user:", error);
      // Display a toast notification for error
    },
  });
}
