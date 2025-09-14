"use client";

import useToggleListType from "@/hooks/useToggleListType";
import ItemsList from "./items-list";
import { WishlistItem } from "@/service/wishlist-item/server/get-wishlist-items";
import { use } from "react";

export default function ItemsWrapper({
  dataPromise,
}: {
  dataPromise: Promise<WishlistItem[] | undefined>;
}) {
  const { purchased } = useToggleListType();
  const initialItems = use(dataPromise);

  if (!initialItems)
    return (
      <p className="p-8 text-xl text-muted-foreground">
        Looks like something went wrong. Try again.
      </p>
    );

  const itemsData = initialItems.filter((item) =>
    purchased === true ? item.purchased : !item.purchased
  );

  return <ItemsList purchased={purchased ?? false} items={itemsData} />;
}
