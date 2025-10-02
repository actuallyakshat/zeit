"use client";

import { SyncSemanticStoreRequest } from "@/app/api/semantic-search/sync/route";
import { updateSemanticStoreSyncStatus } from "@/service/actions/updateUserInfo";
import { useUpsertUser } from "@/service/user/user";
import { useWishlistItems } from "@/service/wishlist-item/wishlist-item";
import { AuthContextInterface } from "@/types/auth";
import { useClerk, useUser } from "@clerk/nextjs";
import React, { useEffect, useMemo } from "react";
import { toast } from "sonner";

const authContext = React.createContext<AuthContextInterface | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<AuthContextInterface["user"]>(null);
  const { user: clerkUser, isSignedIn, isLoaded: isClerkLoaded } = useUser();
  const { signOut } = useClerk();

  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const {
    mutateAsync: upsertDbUser,
    isPending: isUpsertingUser,
    isSuccess: isUpsertSuccess,
    isError: isUpsertError,
    error: upsertError,
    data: upsertedUser,
  } = useUpsertUser();

  // ✅ Load wishlist items inside the component with a hook
  const { data: wishlistItems, isSuccess: isWishlistSuccess } =
    useWishlistItems();

  // Sync user with DB
  useEffect(() => {
    if (isClerkLoaded && isSignedIn && clerkUser) {
      upsertDbUser(clerkUser);
    } else if (isClerkLoaded && !isSignedIn) {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [isClerkLoaded, isSignedIn, clerkUser, upsertDbUser]);

  // Handle post-upsert logic + sync wishlist
  useEffect(() => {
    if (isUpsertSuccess && upsertedUser) {
      setUser(upsertedUser);
      setIsAuthenticated(true);

      if (
        isWishlistSuccess &&
        wishlistItems &&
        user &&
        !user.isSynchronisedWithVectorStore
      ) {
        syncWishlistItemsWithSemanticStore(upsertedUser.id, wishlistItems)
          .then((response) => {
            updateSemanticStoreSyncStatus(true).catch((err) =>
              console.error("ERROR UPDATING SYNC STATUS => ", err)
            );
          })
          .catch((err) =>
            console.error(
              "Error Synchronising User Wishlist with Semantic Store => ",
              err
            )
          );
      }
    } else if (isUpsertError) {
      console.error("Error upserting user in AuthProvider:", upsertError);
      toast.error("Failed to sync user profile. Some features may be limited.");
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [
    user,
    isUpsertSuccess,
    upsertedUser,
    isUpsertError,
    upsertError,
    isWishlistSuccess,
    wishlistItems,
  ]);

  const handleSignOut = async () => {
    setUser(null);
    setIsAuthenticated(false);
    await signOut();
  };

  const refetchUser = async () => {
    if (!clerkUser) {
      console.warn("Cannot refetch user: Clerk user not available.");
      return;
    }
    try {
      await upsertDbUser(clerkUser);
      toast.success("User profile refreshed!");
    } catch (err) {
      console.error("Error refetching user:", err);
      toast.error("Failed to refresh user profile.");
    }
  };

  const overallLoading = !isClerkLoaded || isUpsertingUser;

  const value = useMemo(
    () => ({
      user,
      clerkUser,
      isAuthenticated,
      signOut: handleSignOut,
      refetchUser,
      isLoading: overallLoading,
    }),
    [user, clerkUser, isAuthenticated, overallLoading] // handleSignOut & refetchUser are stable
  );

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(authContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// --- plain async util (no hooks inside) ---
async function syncWishlistItemsWithSemanticStore(
  userId: string,
  wishlistItems: any[]
) {
  const requestBody: SyncSemanticStoreRequest = {
    userId,
    userWishlistItems: wishlistItems,
  };

  const response = await fetch("/api/semantic-search/sync", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();
  return result;
}
