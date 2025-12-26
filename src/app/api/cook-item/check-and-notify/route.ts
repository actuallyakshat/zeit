import { db } from "@/db/drizzle";
import { cookItem, user, wishlistItem } from "@/db/schema";
import { createCookedItemEmail } from "@/lib/email-templates";
import { decryptMonthlyIncome } from "@/lib/encryption";
import { formatActionResponse } from "@/lib/formatActionResponse";
import { sendMail } from "@/lib/mail";
import { getRemainingTimeToCook } from "@/lib/time-left-to-cook-calculation";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        formatActionResponse({ message: "User ID is required" }, false, 400),
        { status: 400 }
      );
    }

    // Get the cooking item for this user
    const result = await db
      .select()
      .from(cookItem)
      .leftJoin(wishlistItem, eq(wishlistItem.id, cookItem.itemId))
      .where(eq(cookItem.userId, userId));

    if (!result || result.length === 0) {
      return NextResponse.json(
        formatActionResponse(
          { message: "No cooking item found for this user" },
          false,
          404
        ),
        { status: 404 }
      );
    }

    // Get user data separately
    const userResult = await db.select().from(user).where(eq(user.id, userId));

    if (!userResult || userResult.length === 0) {
      return NextResponse.json(
        formatActionResponse({ message: "User not found" }, false, 404),
        { status: 404 }
      );
    }

    const cookingData = result[0];
    const cookingItem = cookingData.cook_item;
    const item = cookingData.wishlist_item;
    const userData = userResult[0];

    if (!item || !userData) {
      return NextResponse.json(
        formatActionResponse({ message: "Invalid data" }, false, 500),
        { status: 500 }
      );
    }

    // Calculate if the item is ready
    // Decrypt the monthly income if it's encrypted
    const monthlyIncome = userData.monthlyIncome
      ? (decryptMonthlyIncome(userData.monthlyIncome) ?? 0)
      : 0;
    const createdAt = new Date(cookingItem.createdAt);
    const useWorkingDays = userData.useWorkingDaysForCalculation ?? false;
    const numberOfWorkingDays = userData.numberOfWorkingDays ?? undefined;

    const remainingTime = getRemainingTimeToCook(
      createdAt,
      item.price,
      monthlyIncome,
      useWorkingDays,
      numberOfWorkingDays
    );

    const isReady = remainingTime.includes("Ready!");

    // If not ready, return early
    if (!isReady) {
      return NextResponse.json(
        formatActionResponse(
          {
            message: "Item is still cooking",
            isReady: false,
            remainingTime,
          },
          true,
          200
        )
      );
    }

    // Update isCooked to true if not already
    if (!cookingItem.isCooked) {
      await db
        .update(cookItem)
        .set({ isCooked: true, updatedAt: new Date() })
        .where(eq(cookItem.id, cookingItem.id));
    }

    // Send email if not already sent
    if (!cookingItem.isEmailSent) {
      try {
        const emailHtml = createCookedItemEmail({
          itemTitle: item.title,
          itemPrice: item.price,
          itemImageUrl: item.imageUrl || undefined,
          itemUrl: item.url || undefined,
          userName: userData.name,
        });

        await sendMail(
          userData.email,
          `🎉 Your item is ready: ${item.title}`,
          emailHtml
        );

        // Mark email as sent
        await db
          .update(cookItem)
          .set({ isEmailSent: true, updatedAt: new Date() })
          .where(eq(cookItem.id, cookingItem.id));

        return NextResponse.json(
          formatActionResponse(
            {
              message: "Item is ready and email sent successfully",
              isReady: true,
              emailSent: true,
            },
            true,
            200
          )
        );
      } catch (emailError) {
        return NextResponse.json(
          formatActionResponse(
            {
              message: "Item is ready but email failed to send",
              isReady: true,
              emailSent: false,
              error:
                emailError instanceof Error
                  ? emailError.message
                  : String(emailError),
            },
            false,
            500
          ),
          { status: 500 }
        );
      }
    }

    // Email was already sent
    return NextResponse.json(
      formatActionResponse(
        {
          message: "Item is ready and email was already sent",
          isReady: true,
          emailSent: true,
        },
        true,
        200
      )
    );
  } catch (error) {
    return NextResponse.json(
      formatActionResponse(
        {
          message: "Failed to check and notify",
          error: error instanceof Error ? error.message : String(error),
        },
        false,
        500
      ),
      { status: 500 }
    );
  }
}
