import { SeparatorBorder } from "@/components/ui/seperator";
import {
  getWishlistItems,
  WishlistItem,
} from "@/service/wishlist-item/server/get-wishlist-items";
import { Suspense } from "react";
import Header from "../components/header";
import ItemsWrapper from "../components/items-wrapper";
import Stats from "../components/stats";
import { Loader } from "lucide-react";

export default async function DashboardPage() {
  const wishlistItems: Promise<WishlistItem[] | undefined> = getWishlistItems();

  return (
    <div className="h-full w-full flex flex-col flex-1">
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <Stats />
      <SeparatorBorder className="h-12" />
      <Suspense fallback={<LoadingItems />}>
        <ItemsWrapper dataPromise={wishlistItems} />
      </Suspense>
    </div>
  );
}

function LoadingItems() {
  return (
    <div>
      <h2 className="flex items-center gap-4 text-2xl tracking-tight p-8">
        Fetching your wishlist <Loader className="animate-spin size-7" />
      </h2>
    </div>
  );
}
