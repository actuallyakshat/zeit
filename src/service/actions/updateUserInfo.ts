"use server";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { formatActionResponse } from "@/lib/formatActionResponse";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import {
  decryptMonthlyIncome,
  encryptMonthlyIncome,
  isEncrypted,
} from "@/lib/encryption";

interface UpdateUserInfoRequest {
  monthlyIncome: number;
  numberOfWorkingDays: number;
  useWorkingDaysForCalculation: boolean;
}

async function updateUserCalculationDetails(request: UpdateUserInfoRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      throw new Error("Unauthorized");
    }

    console.log("request", request);

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
      updatedUser[0].monthlyIncome &&
      isEncrypted(updatedUser[0].monthlyIncome)
    ) {
      updatedUser[0].monthlyIncome = decryptMonthlyIncome(
        updatedUser[0].monthlyIncome
      ).toString();
    }

    return formatActionResponse(updatedUser, true, 200);
  } catch (error) {
    console.error("Error updating user calculation details:", error);
    throw error;
  }
}

export { updateUserCalculationDetails };
