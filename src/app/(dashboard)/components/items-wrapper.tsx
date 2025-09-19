import useToggleListType from "@/hooks/useToggleListType";
import ItemsList from "./items-list";
import { WishlistItem } from "@/service/wishlist-item/wishlist-item";
import React from "react";

export default function ItemsWrapper({
  data,
}: {
  data: WishlistItem[];
}) {
  const { purchased } = useToggleListType();

  const itemsData = data.filter((item) =>
    purchased === true ? item.purchased : !item.purchased,
  );

  if (itemsData.length === 0) {
    return (
      <p className="p-8 text-xl text-muted-foreground">
        {purchased
          ? "You haven't purchased any items yet."
          : "Your wishlist is empty. Add some items!"}
      </p>
    );
  }

  return <ItemsList purchased={purchased ?? false} items={itemsData} />;
}