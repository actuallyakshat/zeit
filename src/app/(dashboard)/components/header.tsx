"use client";

import useToggleListType from "@/hooks/useToggleListType";
import AddItemDialog from "./add-item-dialog";
import { ArrowRight } from "lucide-react";

export default function Header({
  onItemAdded,
}: {
  readonly onItemAdded?: () => void;
}) {
  const { purchased, setPurchased } = useToggleListType();

  return (
    <div className="flex p-8 items-center pb-5 border-x border-dashed justify-between w-full">
      <div className="space-y-2">
        <h1 className="text-5xl ">
          {`${purchased ? "Purchased List" : "Wishlist"}`}{" "}
        </h1>
        <button
          className="hover:underline underline-offset-8 decoration-1 flex items-center gap-2 cursor-pointer group"
          onClick={() => setPurchased(!purchased)}
        >
          {`See ${purchased ? "Wishlist" : "Purchased"} Items`}
          <ArrowRight className="size-4 stroke-1 group-hover:translate-x-1 transition-transform" />{" "}
        </button>
      </div>
      <AddItemDialog />
    </div>
  );
}
