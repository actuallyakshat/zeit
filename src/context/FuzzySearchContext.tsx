"use client";

import Fuse from "fuse.js";
import {
  usePaginatedWishlistItems,
  WishlistItem,
} from "@/service/wishlist-item/wishlist-item";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface FuzzySearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: WishlistItem[] | undefined;
  searchPending: boolean;
}

const FuzzySearchContext = createContext<FuzzySearchContextType | undefined>(
  undefined
);

export function FuzzySearchProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<WishlistItem[]>();
  const [searchPending, setSearchPending] = useState<boolean>(true);

  const { data, isLoading } = usePaginatedWishlistItems({
    purchased: false,
    page: 1,
    limit: 1000,
  });

  useEffect(() => {
    setSearchPending(isLoading);
  }, [isLoading]);

  useEffect(() => {
    const itemsData = data || [];

    if (!searchQuery || searchQuery.trim() === "") {
      setSearchResults(undefined);
      return;
    }

    const fuse = new Fuse(itemsData, {
      keys: ["title", "description"],
      threshold: 0.5,
      ignoreLocation: true,
    });

    const fuseResults = fuse.search(searchQuery.trim());
    setSearchResults(fuseResults.map((result) => result.item));
  }, [searchQuery, data]);

  return (
    <FuzzySearchContext.Provider
      value={{ searchQuery, setSearchQuery, searchResults, searchPending }}
    >
      {children}
    </FuzzySearchContext.Provider>
  );
}

export function useFuzzySearchContext() {
  const context = useContext(FuzzySearchContext);
  if (undefined === context)
    throw new Error(
      "useFuzzySearchContext must be used within FuzzySearchProvider"
    );
  return context;
}
