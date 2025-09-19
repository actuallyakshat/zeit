"use client"; // Explicitly mark as a Client Component

import { WishlistItem } from "@/service/wishlist-item/wishlist-item"; // Import client-side WishlistItem type
import React from "react";
import { useAuth } from "@/context/AuthProvider";
import { getTimeToAffordRouter } from "@/lib/price-to-time-calculation";

export default function Stats({
  data, // Now expects resolved data directly
}: {
  data: WishlistItem[]; // Changed from Promise to resolved array
}) {
  // `use(dataPromise)` is removed as data is already resolved
  const { user } = useAuth();

  const itemsInWishlist =
    data?.filter((item) => item.purchased === false) || [];

  const itemsBought = data?.filter((item) => item.purchased === true) || [];

  const totalSpent = itemsBought
    .map((item) => item.price || 0)
    .reduce((acc, price) => {
      return acc + price;
    }, 0);

  const timeRemaining = itemsInWishlist
    .map((item) => item.price || 0)
    .reduce((acc, price) => {
      return acc + price;
    }, 0);

  // Calculate time values based on user's income
  const timeSpentString = user?.monthlyIncome
    ? getTimeToAffordRouter(
        totalSpent,
        Number(user.monthlyIncome),
        user.numberOfWorkingDays || undefined,
      )
    : "Set your income in settings";

  const timeRequiredString = user?.monthlyIncome
    ? getTimeToAffordRouter(
        timeRemaining,
        Number(user.monthlyIncome),
        user.numberOfWorkingDays || undefined,
      )
    : "Set your income in settings";

  const itemsInWishlistCount = itemsInWishlist.length;
  const itemsBoughtCount = itemsBought.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-dashed rounded-lg text-center divide-x">
      <TimeSpentCard timeSpent={timeSpentString} />
      <TimeRequiredCard timeRequired={timeRequiredString} />
      <ItemsInWishlistCard count={itemsInWishlistCount} />
      <ItemsBoughtCard count={itemsBoughtCount} />
    </div>
  );
}

function TimeSpentCard({ timeSpent }: { timeSpent: string }) {
  return <Card title="Time Spent" content={timeSpent}></Card>;
}

function TimeRequiredCard({ timeRequired }: { timeRequired: string }) {
  return <Card title="Time Required" content={timeRequired}></Card>;
}

function ItemsInWishlistCard({ count }: { count: number }) {
  return <Card title="Items in Wishlist" content={String(count)}></Card>;
}

function ItemsBoughtCard({ count }: { count: number }) {
  return (
    <Card title="Items Purchased" content={String(count)} hideBorder></Card>
  );
}

/**
 * A basic card component, which renders its children within a
 * flexbox with centered content, padding, and dashed borders.
 *
 * @param {React.ReactNode} children - The children to be rendered within the card.
 */
function Card({
  title,
  content,
  hideBorder = false,
}: {
  readonly title: string;
  readonly content: string;
  readonly hideBorder?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-4 ${
        hideBorder ? "" : "border-r"
      } `}
    >
      <h2 className="text-xl font-medium tracking-tight">{title}</h2>
      <p className="text-muted-foreground">{content}</p>
    </div>
  );
}