"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import React, { useEffect, useMemo } from "react";
import { AuthContextInterface } from "@/types/auth";
import { upsertUser } from "@/service/user/user";

const authContext = React.createContext<AuthContextInterface | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<AuthContextInterface["user"]>(null);
  const { user: clerkUser, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  // Upsert user to database when they sign in
  useEffect(() => {
    const handleUserUpsert = async () => {
      if (!clerkUser) return;

      try {
        const dbUser = await upsertUser(clerkUser);
        setUser(dbUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error upserting user:", error);
      }
    };

    if (isSignedIn && clerkUser) {
      handleUserUpsert();
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [clerkUser, isSignedIn]);

  const handleSignOut = async () => {
    setUser(null);
    setIsAuthenticated(false);
    await signOut();
  };

  const value = useMemo(
    () => ({
      user,
      clerkUser,
      isAuthenticated,
      signOut: handleSignOut,
    }),
    [user, clerkUser, isAuthenticated]
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
