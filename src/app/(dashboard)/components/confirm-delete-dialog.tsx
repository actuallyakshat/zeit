"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteWishlistItem } from "@/service/wishlist-item/wishlist-item"; // Correct import path
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useState } from "react";
import { toast } from "sonner";

/**
 * A dialog that confirms whether the user wants to delete a wishlist item.
 *
 * @param customTrigger - A custom trigger element to open the dialog.
 * @param itemId - The ID of the wishlist item to delete.
 * @returns A dialog element with a default trigger button and a confirmation message.
 */
export default function ConfirmDeleteDialog({
  customTrigger,
  itemId,
}: {
  customTrigger?: React.ReactNode;
  itemId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Initialize the mutation hook
  const { mutateAsync: deleteItem, isPending: isDeleting } =
    useDeleteWishlistItem();

  async function handleDeleteItem() {
    try {
      // Use the mutateAsync function from the hook
      await deleteItem(itemId);
      toast.success("Item deleted successfully!"); // Correct success message
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting wishlist item:", error);
      // Ensure the error message is correct, not a success message
      toast.error("Failed to delete item. Please try again.");
    }
    // No `finally` block needed for setting `loading` because `isDeleting` handles it.
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {customTrigger || <Button variant="destructive">Delete</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Delete item</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this item? This action is
          irreversible.
        </DialogDescription>
        <DialogFooter>
          <Button variant="default" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={isDeleting} // Use the `isDeleting` state from the hook
            variant="destructive"
            onClick={handleDeleteItem}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
