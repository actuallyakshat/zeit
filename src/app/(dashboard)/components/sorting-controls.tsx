"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowUp, ArrowDown, X } from "lucide-react";

type SortOption = {
  value: string;
  label: string;
};

type SortOrder = "asc" | "desc";

interface SortingControlsProps {
  sortBy: string;
  sortOrder: SortOrder;
  onSortChange: (sortBy: string, sortOrder: SortOrder) => void;
  onClearSort?: () => void;
}

export default function SortingControls({
  sortBy,
  sortOrder,
  onSortChange,
  onClearSort,
}: SortingControlsProps) {
  const sortOptions: SortOption[] = [
    { value: "createdAt", label: "Date Added" },
    { value: "title", label: "Title" },
    { value: "price", label: "Price" },
    { value: "updatedAt", label: "Last Updated" },
  ];

  const handleSortByChange = (newSortBy: string) => {
    onSortChange(newSortBy, sortOrder);
  };

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    onSortChange(sortBy, newSortOrder);
  };

  const getSortIcon = () => {
    if (sortOrder === "asc") return <ArrowUp className="h-4 w-4" />;
    if (sortOrder === "desc") return <ArrowDown className="h-4 w-4" />;
    return <ArrowUp className="h-4 w-4 opacity-50" />;
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={sortBy} onValueChange={handleSortByChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortOrder}
            aria-label={
              sortOrder === "asc" ? "Sort descending" : "Sort ascending"
            }
          >
            {getSortIcon()}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {sortOrder === "asc" ? "Sorted ascending" : "Sorted descending"}
        </TooltipContent>
      </Tooltip>

      {onClearSort && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="link"
              size="sm"
              className="flex items-center gap-1"
              onClick={onClearSort}
            >
              Clear
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear sorting</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
