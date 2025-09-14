import React from "react";

const TIME_SPENT_STRING = "23 hours";
const TIME_REQUIRED_STRING = "7 months, 2 weeks, and 10 days";
const ITEMS_BOUGHT = 5;
const ITEMS_IN_WISHLIST = 18;

export default function Stats() {
  return (
    <div className="grid grid-cols-4 border border-dashed">
      <TimeSpentCard />
      <TimeRequiredCard />
      <ItemsInWishlistCard />
      <ItemsBoughtCard />
    </div>
  );
}

function TimeSpentCard() {
  return <Card title="Time Spent" content={TIME_SPENT_STRING}></Card>;
}
function TimeRequiredCard() {
  return <Card title="Time Required" content={TIME_REQUIRED_STRING}></Card>;
}
function ItemsInWishlistCard() {
  return (
    <Card title="Items in Wishlist" content={String(ITEMS_IN_WISHLIST)}></Card>
  );
}
function ItemsBoughtCard() {
  return (
    <Card
      title="Items Purchased"
      content={String(ITEMS_BOUGHT)}
      hideBorder
    ></Card>
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
