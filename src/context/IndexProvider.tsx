"use client";
import { NuqsAdapter } from "nuqs/adapters/next";
import React from "react";
import { AuthProvider } from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface IndexProviderProps {
  readonly children: React.ReactNode;
}

const queryClient = new QueryClient();

export default function IndexProvider({ children }: IndexProviderProps) {
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </ClerkProvider>
  );
}
