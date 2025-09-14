import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

/**
 * Check if the current user needs onboarding
 * Returns true if any of the required fields are undefined/missing
 * @returns boolean indicating if user needs onboarding
 */
export async function needsOnboarding(): Promise<boolean> {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    // If user is not authenticated, we can't determine onboarding status
    // This should be handled by auth protection at a higher level
    return true;
  }

  // Get the user's data using their Clerk ID
  const [dbUser] = await db
    .select({
      monthlyIncome: user.monthlyIncome,
      numberOfWorkingDays: user.numberOfWorkingDays,
      useWorkingDaysForCalculation: user.useWorkingDaysForCalculation,
    })
    .from(user)
    .where(eq(user.clerkId, clerkUserId));

  // If user doesn't exist in our database, they need onboarding
  if (!dbUser) {
    return true;
  }

  // Check if any of the required fields are null/undefined
  return (
    dbUser.monthlyIncome === null ||
    dbUser.numberOfWorkingDays === null ||
    dbUser.useWorkingDaysForCalculation === null
  );
}