"use client";
import { NuqsAdapter } from "nuqs/adapters/next";
import React from "react";
import { AuthProvider } from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";

interface IndexProviderProps {
  readonly children: React.ReactNode;
}
export default function IndexProvider({ children }: IndexProviderProps) {
  return (
    <ClerkProvider>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <NuqsAdapter>{children}</NuqsAdapter>
        </ThemeProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}
