import { SeparatorBorder } from "@/components/ui/seperator";
import {
  getWishlistItems,
  WishlistItem,
} from "@/service/wishlist-item/server/get-wishlist-items";
import { Loader } from "lucide-react";
import { Suspense } from "react";
import Header from "../components/header";
import ItemsWrapper from "../components/items-wrapper";
import Stats from "../components/stats";
import { EnsureOnboarding } from "@/service/user/server/ensure-onboarding";

export default async function DashboardPage() {
  const wishlistItems: Promise<WishlistItem[] | undefined> = getWishlistItems();

  return (
    <div className="h-full w-full flex flex-col flex-1">
      <EnsureOnboarding>
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <Suspense fallback={null}>
          <Stats dataPromise={wishlistItems} />
        </Suspense>
        <SeparatorBorder className="h-12" />
        <Suspense fallback={<LoadingItems />}>
          <ItemsWrapper dataPromise={wishlistItems} />
        </Suspense>
      </EnsureOnboarding>
    </div>
  );
}

function LoadingItems() {
  return (
    <div className="flex-1 border border-dashed">
      <h2 className="flex items-center gap-4 text-2xl tracking-tight p-8">
        Fetching your wishlist <Loader className="animate-spin size-7" />
      </h2>
    </div>
  );
}

function StatsSkeleton() {
  return <div className="grid grid-cols-4 border border-dashed"></div>;
}
