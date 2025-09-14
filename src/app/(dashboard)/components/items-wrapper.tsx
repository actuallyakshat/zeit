// items-wrapper.tsx
"use client";

import useToggleListType from "@/hooks/useToggleListType";
import ItemsList from "./items-list";
import { WishlistItem } from "@/service/wishlist-item/get-wishlist-items";

export default function ItemsWrapper({
  initialItems = [],
}: {
  initialItems?: WishlistItem[];
}) {
  const { purchased } = useToggleListType();

  return <ItemsList purchased={purchased ?? false} items={initialItems} />;
}
