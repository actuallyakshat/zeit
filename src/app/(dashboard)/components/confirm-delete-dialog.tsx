"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteWishlistItem } from "@/service/wishlist-item/wishlist-item";
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
  const [loading, setLoading] = useState(false);
  async function handleDeleteItem() {
    try {
      setLoading(true);
      await deleteWishlistItem(itemId);
      toast.success("Item deleted successfully");
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting wishlist item:", error);
      toast.error("Item deleted successfully");
    } finally {
      setLoading(false);
    }
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
          <Button variant="default">Cancel</Button>
          <Button
            disabled={loading}
            variant="destructive"
            onClick={handleDeleteItem}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
