// hooks/useToggleListType.ts
"use client";
import { parseAsBoolean, useQueryState } from "nuqs";

export default function useToggleListType() {
  // useQueryState<boolean> may return boolean | null
  const [purchased, setPurchased] = useQueryState<boolean>(
    "purchased",
    parseAsBoolean
  );

  return { purchased, setPurchased };
}