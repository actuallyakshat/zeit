"use client";

import {
  SemanticSearchProvider,
  useSemanticSearchContext,
} from "@/context/SemanticSearchContext";
import useToggleListType from "@/hooks/useToggleListType";
import {
  usePaginatedWishlistItems,
  WishlistItem,
} from "@/service/wishlist-item/wishlist-item";
import { useEffect, useState } from "react";
import PaginationControls from "./pagination-controls";
import SortingControls from "./sorting-controls";
import ItemsList from "./items-list";
import { ItemCard } from "./item-card";

export default function ItemsWrapper() {
  const { purchased } = useToggleListType();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<
    "title" | "price" | "createdAt" | "updatedAt"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const limit = 12;

  const { searchPending, searchQuery, searchResults } =
    useSemanticSearchContext();

  // Reset to first page when purchased filter changes
  useEffect(() => {
    setPage(1);
  }, [purchased]);

  const { data, isLoading, isError, error } = usePaginatedWishlistItems({
    purchased: purchased !== null ? purchased : undefined,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const itemsData = data || [];
  const hasNextPage = itemsData.length === limit;
  const totalPages = hasNextPage ? page + 1 : page;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (
    newSortBy: string,
    newSortOrder: "asc" | "desc"
  ) => {
    setSortBy(newSortBy as "createdAt" | "title" | "price" | "updatedAt");
    setSortOrder(newSortOrder);
    setPage(1); // Reset to first page when sorting changes
  };

  const handleSortClear = () => {
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1); // Reset page when clearing sort
  };

  if (searchQuery) {
    return (
      <SemanticSearchProvider>
        <SearchResults
          isLoading={searchPending}
          searchResults={searchResults as WishlistItem[]}
        />
      </SemanticSearchProvider>
    );
  }

  if (isLoading) {
    return (
      <div className="p-5 flex-1 border-x border-dashed">
        <div className="items-grid gap-4 mb-8">
          {[...Array(6)].map((_, index) => (
            <div
              key={index + 1}
              className="h-72 bg-accent rounded-xs animate-pulse"
            />
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
      <div className="flex flex-col flex-1 border-dashed border-x h-full">
        <p className="p-8 text-xl text-muted-foreground flex-1">
          {purchased
            ? "You haven't purchased any items yet."
            : "Your wishlist is empty. Add some items!"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 border-x border-dashed h-full">
      <div className="p-4 border-b">
        <SortingControls
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onClearSort={handleSortClear} // Pass the clear handler
        />
      </div>
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

function SearchResults({
  isLoading,
  searchResults,
}: {
  isLoading: boolean;
  searchResults: WishlistItem[];
}) {
  if (isLoading) {
    return (
      <div className="p-5">
        <div className="items-grid gap-4 mb-8">
          {[...Array(6)].map((_, index) => (
            <div
              key={index + 1}
              className="h-72 bg-accent rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!isLoading && (!searchResults || searchResults?.length === 0)) {
    return (
      <div className="p-5 flex flex-col gap-1">
        <h1 className="text-2xl tracking-tight">No results found</h1>
        <p className="text-lg">
          We couldn&apos;t really find what you are looking for. How about you
          give the search another spin?
        </p>
      </div>
    );
  }

  return (
    <div className="items-grid gap-4">
      {searchResults?.map((item: WishlistItem, index: number) => (
        <ItemCard key={item.id} index={index} item={item} />
      ))}
    </div>
  );
}
