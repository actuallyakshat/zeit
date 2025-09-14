import { SeparatorBorder } from "@/components/ui/seperator";
import {
  getWishlistItems,
  WishlistItem,
} from "@/service/wishlist-item/get-wishlist-items";
import { auth } from "@clerk/nextjs/server";
import Header from "../components/header";
import ItemsWrapper from "../components/items-wrapper";
import Stats from "../components/stats";

export default async function DashboardPage() {
  const { userId } = await auth();
  let wishlistItems: WishlistItem[] | undefined = [];

  if (userId) {
    try {
      wishlistItems = await getWishlistItems();
    } catch (error) {
      console.error("Failed to fetch wishlist items:", error);
      //TODO: handle error gracefully
    }
  }

  return (
    <div className="h-full w-full flex flex-col flex-1">
      <Header />
      <Stats />
      <SeparatorBorder className="h-12" />
      <ItemsWrapper initialItems={wishlistItems} />
    </div>
  );
}
