"use client";

import { UserResource } from "@clerk/types";

export interface SyncUserRequest {
  name: string;
  email: string;
  username: string;
  clerkId: string;
}

/**
 * Upsert a user in the database based on their Clerk user data
 * @returns The database user record
 */
export async function upsertUser(user: UserResource) {
  try {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        username: user?.username,
        clerkId: user?.id,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to upsert user");
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Error upserting user:", error);
    throw error;
  }
}
