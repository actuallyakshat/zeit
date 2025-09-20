"use server";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import {
  decryptMonthlyIncome,
  encryptMonthlyIncome,
  isEncrypted,
} from "@/lib/encryption";
import { formatActionResponse } from "@/lib/formatActionResponse";
import { auth } from "@clerk/nextjs/server";
import { eq, InferSelectModel } from "drizzle-orm";

interface UpdateUserInfoRequest {
  monthlyIncome: number;
  numberOfWorkingDays: number;
  useWorkingDaysForCalculation: boolean;
}

type DbUser = InferSelectModel<typeof user>;

async function updateUserCalculationDetails(request: UpdateUserInfoRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      throw new Error("Unauthorized");
    }

    const { monthlyIncome, numberOfWorkingDays, useWorkingDaysForCalculation } =
      request;

    // Encrypt monthlyIncome before updating
    const encryptedMonthlyIncome = monthlyIncome
      ? encryptMonthlyIncome(monthlyIncome)
      : null;

    const updatedUser = await db
      .update(user)
      .set({
        monthlyIncome: encryptedMonthlyIncome,
        numberOfWorkingDays,
        useWorkingDaysForCalculation,
      })
      .where(eq(user.clerkId, clerkUserId))
      .returning();

    // Decrypt monthlyIncome for response
    if (
      updatedUser[0]?.monthlyIncome &&
      isEncrypted(updatedUser[0].monthlyIncome)
    ) {
      updatedUser[0].monthlyIncome =
        decryptMonthlyIncome(updatedUser[0].monthlyIncome)?.toString() ?? null;
    }

    return formatActionResponse(updatedUser as unknown as DbUser[], true, 200);
  } catch (error) {
    console.error("Error updating user calculation details:", error);
    throw error;
  }
}

async function updateSemanticStoreSyncStatus(status: boolean) {
  console.log("Updating semantic store sync status to:", status);

  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      throw new Error("Unauthorized");
    }

    const existingUser = await db
      .update(user)
      .set({
        isSynchronisedWithVectorStore: status,
        lastSyncedAt: new Date()
      })
      .where(eq(user.clerkId, clerkId))
      .returning();

    console.log("Updated semantic store sync status for user:", existingUser);

    return existingUser
  } catch (error) {
    console.error("Error updating the sync status of user: ", error);
  }
}


export { updateUserCalculationDetails, updateSemanticStoreSyncStatus };
