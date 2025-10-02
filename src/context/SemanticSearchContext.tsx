"use client";

import useSemanticSearch from "@/hooks/useSemanticSearch"; // Your original hook
import { createContext, ReactNode, useContext } from "react";

const SemanticSearchContext = createContext<
  ReturnType<typeof useSemanticSearch> | undefined
>(undefined);

export function SemanticSearchProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const searchValues = useSemanticSearch(); // Run logic once here
  return (
    <SemanticSearchContext.Provider value={searchValues}>
      {children}
    </SemanticSearchContext.Provider>
  );
}

export function useSemanticSearchContext() {
  const context = useContext(SemanticSearchContext);
  if (undefined === context)
    throw new Error(
      "useSemanticSearchContext must be used within SemanticSearchProvider"
    );
  return context;
}
