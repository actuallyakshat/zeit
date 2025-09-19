"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import React, { useEffect, useMemo } from "react";
import { AuthContextInterface } from "@/types/auth";
import { useUpsertUser } from "@/service/user/user";
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

  useEffect(() => {
    if (isClerkLoaded && isSignedIn && clerkUser) {
      upsertDbUser(clerkUser);
    } else if (isClerkLoaded && !isSignedIn) {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [isClerkLoaded, isSignedIn, clerkUser, upsertDbUser]);

  useEffect(() => {
    if (isUpsertSuccess && upsertedUser) {
      setUser(upsertedUser);
      setIsAuthenticated(true);
    } else if (isUpsertError) {
      console.error("Error upserting user in AuthProvider:", upsertError);
      toast.error("Failed to sync user profile. Some features may be limited.");
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [isUpsertSuccess, upsertedUser, isUpsertError, upsertError]);

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
    [user, clerkUser, isAuthenticated, handleSignOut, refetchUser, overallLoading],
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