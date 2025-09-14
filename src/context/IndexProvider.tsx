import React from "react";
import { AuthProvider } from "./AuthProvider";
import { NuqsAdapter } from "nuqs/adapters/next";

interface IndexProviderProps {
  readonly children: React.ReactNode;
}
export default function IndexProvider({ children }: IndexProviderProps) {
  return (
    <AuthProvider>
      <NuqsAdapter>{children}</NuqsAdapter>
    </AuthProvider>
  );
}
