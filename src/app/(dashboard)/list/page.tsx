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
import OnboardUser from "../components/onboard-user";
import { needsOnboarding } from "@/service/user/server/needs-onboarding";

export default async function DashboardPage() {
  const wishlistItems: Promise<WishlistItem[] | undefined> = getWishlistItems();
  const userNeedsOnboarding = await needsOnboarding();

  if (userNeedsOnboarding) {
    return <OnboardUser />;
  }

  return (
    <div className="h-full w-full flex flex-col flex-1">
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

function StatsSkeleton() {
  return <div className="grid grid-cols-4 border border-dashed"></div>;
}
