"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  useCreateWishlistItem,
  useUpdateWishlistItem,
  WishlistItem,
} from "@/service/wishlist-item/wishlist-item";
import React, { useEffect, useState } from "react";
import { ItemCard } from "./item-card";

export default function AddItemDialog({
  isEdit,
  item,
  customTrigger,
}: {
  readonly isEdit?: boolean;
  readonly item?: WishlistItem;
  readonly customTrigger?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [purchased, setPurchased] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize the mutation hooks
  const createWishlistItemMutation = useCreateWishlistItem();
  const updateWishlistItemMutation = useUpdateWishlistItem();

  const isLoading =
    createWishlistItemMutation.isPending ||
    updateWishlistItemMutation.isPending;

  useEffect(() => {
    if (isEdit && item) {
      setTitle(item.title || "");
      setDescription(item.description || "");
      setUrl(item.url || "");
      setImageUrl(item.imageUrl || "");
      setPrice(item.price?.toString() || "");
      setPurchased(item.purchased || false);
    } else {
      // Reset form fields when opening for "add"
      setTitle("");
      setDescription("");
      setUrl("");
      setImageUrl("");
      setPrice("");
      setPurchased(false);
    }
  }, [isEdit, item, isOpen]); // Added isOpen to reset when dialog opens for add

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setUrl("");
    setImageUrl("");
    setPrice("");
    setPurchased(false);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createWishlistItemMutation.mutateAsync({
        title,
        description: description || undefined,
        url: url || undefined,
        imageUrl: imageUrl || undefined,
        price: Number(price),
        purchased: purchased,
      });

      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating wishlist item:", error);
      // You can use a toast library here to show a user-friendly error message
      // E.g., toast.error("Failed to create item. Please try again.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    if (!item?.id) {
      console.error("No item ID provided for update.");
      // Potentially show an error to the user
      return;
    }

    try {
      await updateWishlistItemMutation.mutateAsync({
        id: item.id,
        title,
        description: description || undefined,
        url: url || undefined,
        imageUrl: imageUrl || undefined,
        price: Number(price),
        purchased,
      });

      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating wishlist item:", error);
      // E.g., toast.error("Failed to update item. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {customTrigger || (
          <Button variant="default">
            {isEdit ? "Edit Item" : "Add New Item"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl overflow-y-auto flex gap-6">
        <div className="flex-[3]">
          <form
            onSubmit={isEdit ? handleUpdate : handleSubmit}
            className="w-full"
          >
            <DialogHeader>
              <DialogTitle>{isEdit ? "Edit Item" : "Add New Item"}</DialogTitle>
              <DialogDescription>
                {isEdit
                  ? "Edit the details of your wishlist item."
                  : "Add a new item to your wishlist. Click save when you're done."}
              </DialogDescription>
            </DialogHeader>
            <div className="gap-4 py-4 flex flex-1  h-full flex-col justify-center">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title *
                </Label>
                <div className="col-span-3">
                  <input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="iPhone 15 Pro"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <div className="col-span-3">
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe the item..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL
                </Label>
                <div className="col-span-3">
                  <input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="https://example.com/item"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">
                  Image URL
                </Label>
                <div className="col-span-3">
                  <input
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price *
                </Label>
                <div className="col-span-3">
                  <input
                    id="price"
                    type="number" // Changed to type="number" for better input handling
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="999"
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                {" "}
                {/* Wrapped in a new grid div */}
                <Label htmlFor="purchased" className="text-right">
                  Purchased?
                </Label>
                <div className="col-span-3">
                  <Checkbox
                    className="size-5"
                    id="purchased"
                    checked={purchased}
                    onCheckedChange={(checked) =>
                      setPurchased(checked as boolean)
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : isEdit ? "Save Changes" : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </div>
        <div className="w-full flex-[2]">
          <h2>Preview</h2>
          <div className="w-full">
            <ItemCard
              index={0}
              item={{
                title: title || "Item Title",
                description:
                  description || "Item description will appear here.",
                url: url || "",
                imageUrl: imageUrl || "",
                price: price ? Number(price) : 0,
                purchased: purchased,
                id: item?.id || "preview-id",
                userId: item?.userId || "preview-user",
                createdAt: item?.createdAt || new Date().toISOString(),
                updatedAt: item?.updatedAt || new Date().toISOString(),
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
