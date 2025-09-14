"use server";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { formatActionResponse } from "@/lib/formatActionResponse";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

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

    const updatedUser = await db
      .update(user)
      .set({
        monthlyIncome,
        numberOfWorkingDays,
        useWorkingDaysForCalculation,
      })
      .where(eq(user.clerkId, clerkUserId))
      .returning();

    return formatActionResponse(updatedUser, true, 200);
  } catch (error) {
    console.error("Error updating user calculation details:", error);
    throw error;
  }
}

export { updateUserCalculationDetails };
