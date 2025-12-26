"use client";

import { WishlistItem } from "@/service/wishlist-item/wishlist-item";
import { ItemCard } from "./item-card";

export type ItemsListProps = {
  readonly purchased: boolean;
  readonly items: WishlistItem[];
};

export default function ItemsList({ purchased, items }: ItemsListProps) {
  return (
    <div className="flex-1 px-2">
      <div className="items-grid mb-8">
        {items.map((item, index) => (
          <ItemCard key={item.id} index={index} item={item} />
        ))}
      </div>
    </div>
  );
}
