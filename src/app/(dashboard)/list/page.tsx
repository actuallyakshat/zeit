"use client"; // This directive marks it as a Client Component

import { SeparatorBorder } from "@/components/ui/seperator";
import { EnsureOnboarding } from "@/service/user/ensure-onboarding";
import { useWishlistItems } from "@/service/wishlist-item/wishlist-item"; // Import the client-side hook
import { Loader } from "lucide-react";
import { Suspense } from "react";
import Header from "../components/header";
import ItemsWrapper from "../components/items-wrapper";
import Stats from "../components/stats";

export default function DashboardPage() {
  const {
    data: wishlistItems,
    isLoading,
    isError,
    error,
  } = useWishlistItems();

  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col flex-1">
        <Suspense fallback={<div className="p-8">Loading...</div>}>
          <Header />
        </Suspense>
        <StatsSkeleton />
        <SeparatorBorder className="h-12" />
        <LoadingItems />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full w-full flex flex-col flex-1 p-8 text-red-600">
        <Suspense fallback={<div className="p-8">Loading...</div>}>
          <Header />
        </Suspense>
        <h2>Error loading wishlist:</h2>
        <p>{error?.message || "An unknown error occurred."}</p>
      </div>
    );
  }

  const items = wishlistItems || [];

  return (
    <div className="h-full w-full flex flex-col flex-1">
      <EnsureOnboarding>
        <Suspense fallback={<div className="p-8">Loading...</div>}>
          <Header />
        </Suspense>
        <Suspense fallback={<StatsSkeleton />}>
          <Stats data={items} />
        </Suspense>
        <SeparatorBorder className="h-12" />
        <Suspense fallback={
          <div className="p-5">
            <div className="items-grid gap-4 mb-8">
              {[...Array(6)].map((_, index) => (
                <div key={index + 1} className="h-72 bg-accent rounded animate-pulse" />
              ))}
            </div>
          </div>
        }>
          <ItemsWrapper />
        </Suspense>
      </EnsureOnboarding>
    </div>
  );
}

function LoadingItems() {
  return (
    <div className="flex-1 border border-dashed flex items-center justify-center">
      <h2 className="flex items-center gap-4 text-2xl tracking-tight p-8">
        Fetching your wishlist <Loader className="animate-spin size-7" />
      </h2>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 h-20 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-dashed rounded-lg min-h-[150px] animate-pulse">
      <div className="h-full w-full bg-accent"></div>
      <div className="h-full w-full bg-accent"></div>
      <div className="h-full w-full bg-accent"></div>
      <div className="h-full w-full bg-accent"></div>
    </div>
  );
}