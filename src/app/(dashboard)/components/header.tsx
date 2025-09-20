"use client";

import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthProvider";
import useSemanticSearch from "@/hooks/useSemanticSearch";
import useToggleListType from "@/hooks/useToggleListType";
import { ArrowRight } from "lucide-react";
import AddItemDialog from "./add-item-dialog";
import { useSemanticSearchContext } from "@/context/SemanticSearchContext";

export default function Header() {
  const { purchased, setPurchased } = useToggleListType();
  const { user } = useAuth()

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
      <div className="flex items-center gap-2">
        <SearchItem userId={user?.id || ""} />
        <AddItemDialog />
      </div>
    </div>
  );
}

function SearchItem({ userId }: { userId: string }) {

  const { searchQuery, setSearchQuery } = useSemanticSearchContext()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearchQuery(value)
  }

  return (
    <Input
      className="max-w-sm"
      placeholder="Search"
      value={searchQuery || ""}
      onChange={handleChange}
    />
  )
}
