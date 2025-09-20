"use client";

import { SemanticSearchRequest } from "@/app/api/semantic-search/search/route";
import { useAuth } from "@/context/AuthProvider";
import { useWishlistItems, WishlistItem } from "@/service/wishlist-item/wishlist-item";
import { debounce } from "lodash";
import { parseAsString, useQueryState } from "nuqs";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function useSemanticSearch() {
    const { user } = useAuth();
    const wishlistItemsRequest = useWishlistItems();

    const [searchQuery, setSearchQuery] = useQueryState<string>("", parseAsString);
    const [searchResults, setSearchResults] = useState<WishlistItem[]>();
    const [searchPending, setSearchPending] = useState<boolean>(true);

    // Actual search logic
    const handleSemanticSearch = useCallback(async () => {
        setSearchPending(true);
        try {
            if (!user || !searchQuery) return;

            const requestBody: SemanticSearchRequest = {
                query: searchQuery,
                userId: user.id,
            };

            const response = await fetch("/api/semantic-search/search", {
                method: "POST",
                body: JSON.stringify(requestBody),
            });

            const result = await response.json();
            setSearchResults(result.data);
        } catch (error) {
            console.error("Something went wrong while making the semantic search", error);
            console.warn("USING FALLBACK SEARCH");
            fallbackSearch();
        } finally {
            setSearchPending(false);
        }
    }, [user, searchQuery]);

    // Debounced function (stable reference)
    const debouncedSearch = useMemo(
        () => debounce(handleSemanticSearch, 500),
        [handleSemanticSearch]
    );

    useEffect(() => {
        if (searchQuery?.trim()) {
            debouncedSearch();
        } else {
            setSearchResults(undefined);
        }

        return () => {
            debouncedSearch.cancel();
        };
    }, [searchQuery, debouncedSearch]);

    // Uses regular search using JS filter method
    function fallbackSearch() {
        if (wishlistItemsRequest.isSuccess && wishlistItemsRequest.data && searchQuery) {
            const results = wishlistItemsRequest.data.filter((item) =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(results);
        }
    }

    return { searchQuery, setSearchQuery, handleSemanticSearch, searchResults, searchPending };
}
