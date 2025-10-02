import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  hasNextPage: boolean;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <Button
        variant="link"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="text-xs"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>

      <div className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </div>

      <Button
        variant="link"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="text-xs"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}
