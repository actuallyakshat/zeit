import useToggleListType from "@/hooks/useToggleListType";
import { usePaginatedWishlistItems } from "@/service/wishlist-item/wishlist-item";
import { useEffect, useState } from "react";
import ItemsList from "./items-list";
import PaginationControls from "./pagination-controls";

export default function ItemsWrapper() {
  const { purchased } = useToggleListType();
  const [page, setPage] = useState(1);
  const limit = 12;

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

  if (isLoading) {
    return (
      <div className="p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-3 mb-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-72 bg-accent rounded animate-pulse" />
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