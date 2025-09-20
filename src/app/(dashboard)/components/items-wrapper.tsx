"use client";

import { SemanticSearchProvider, useSemanticSearchContext } from "@/context/SemanticSearchContext";
import useToggleListType from "@/hooks/useToggleListType";
import { usePaginatedWishlistItems, WishlistItem } from "@/service/wishlist-item/wishlist-item";
import { useEffect, useState } from "react";
import ItemsList, { ItemCard } from "./items-list";
import PaginationControls from "./pagination-controls";

export default function ItemsWrapper() {
  return (<SemanticSearchProvider>
    <RenderItemsComponent />
  </SemanticSearchProvider>)
}

function RenderItemsComponent() {
  const { purchased } = useToggleListType();
  const [page, setPage] = useState(1);
  const limit = 12;

  const { searchPending, searchQuery, searchResults } = useSemanticSearchContext()

  // Reset to first page when purchased filter changes
  useEffect(() => {
    setPage(1);
  }, [purchased]);

  const { data, isLoading, isError, error } = usePaginatedWishlistItems({
    purchased: purchased !== null ? purchased : undefined,
    page,
    limit,
  });

  const itemsData = data || [];
  const hasNextPage = itemsData.length === limit;
  const totalPages = hasNextPage ? page + 1 : page;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (searchQuery) {
    console.log("searchResults => ", searchResults)
    return <SearchResults data={searchResults as WishlistItem[]} isLoading={searchPending} />
  }


  if (isLoading) {
    return (
      <div className="p-5">
        <div className="items-grid gap-4 mb-8">
          {[...Array(6)].map((_, index) => (
            <div key={index + 1} className="h-72 bg-accent rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-red-600">
        <h2>Error loading items:</h2>
        <p>{error?.message || "An unknown error occurred."}</p>
      </div>
    );
  }

  if (itemsData.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <p className="p-8 text-xl text-muted-foreground flex-1">
          {purchased
            ? "You haven't purchased any items yet."
            : "Your wishlist is empty. Add some items!"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col border-x border-dashed h-full">
      <ItemsList purchased={purchased ?? false} items={itemsData} />
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        hasNextPage={hasNextPage}
      />
    </div>
  );
}

function SearchResults({ data, isLoading }: { data: WishlistItem[], isLoading: boolean }) {

  if (isLoading) {
    return (
      <div className="p-5">
        <div className="items-grid gap-4 mb-8">
          {[...Array(6)].map((_, index) => (
            <div key={index + 1} className="h-72 bg-accent rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!isLoading && (!data || data.length === 0)) {
    return (
      <div className="p-5 flex flex-col gap-1">
        <h1 className="text-2xl tracking-tight">
          No results found
        </h1>
        <p className="text-lg">We couldn&apos;t really find what you are looking for. How about you give the search another spin?</p>
      </div>
    )
  }

  return (
    <div className="items-grid gap-4">
      {data.map((item, index) => (
        <ItemCard key={item.id} index={index} item={item} />
      ))}
    </div>
  )
}