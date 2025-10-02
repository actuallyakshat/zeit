"use client";

import { useAuth } from "@/context/AuthProvider";
import { getRemainingTimeToCook } from "@/lib/time-left-to-cook-calculation";
import {
  useCookingItem,
  useCreateCookItem,
  useDeleteCookItem,
} from "@/service/cook-item/cook-item";
import { useWishlistItems } from "@/service/wishlist-item/wishlist-item";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CookItemFrame() {
  const { user } = useAuth();
  const { data, isLoading } = useCookingItem({ id: user?.id || "" });
  const { mutate: deleteCookItem } = useDeleteCookItem();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;

  if (!data) {
    return <SelectAnItem userId={user?.id} />;
  }

  const monthlyIncome = user?.monthlyIncome
    ? parseFloat(user.monthlyIncome)
    : 0;
  const price = data.wishlist_item.price;
  const createdAt = new Date(data.cook_item.createdAt);
  const useWorkingDays = user?.useWorkingDaysForCalculation ?? false;
  const numberOfWorkingDays = user?.numberOfWorkingDays ?? undefined;

  const remainingTime =
    monthlyIncome > 0
      ? getRemainingTimeToCook(
          createdAt,
          price,
          monthlyIncome,
          useWorkingDays,
          numberOfWorkingDays
        )
      : "Set your income to see the countdown.";

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(data.wishlist_item.price);

  const handleDelete = () => {
    if (data) {
      deleteCookItem(data.cook_item.id);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h3 className="text-4xl italic tracking-tight text-balance font-light">
        You are currently cooking:{" "}
      </h3>
      <div className="max-w-3xl mt-10 border-2 border-dashed rounded-xs p-6">
        {data.wishlist_item.imageUrl && (
          <img
            src={data.wishlist_item.imageUrl}
            alt="Item Image"
            className="max-w-sm"
          />
        )}
        <h3 className="text-xl tracking-tight">{data.wishlist_item.title}</h3>
        <p>{formattedPrice}</p>
        <p className="text-sm text-muted-foreground">
          Cooking since:{" "}
          {createdAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">Ready in</p>
          <p className="text-2xl font-bold tracking-tight">{remainingTime}</p>
        </div>
      </div>

      {/* AlertDialog for Delete */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="link" className="mt-6">
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to stop this item from being cooked? You
              will lose all the progress and would have to restart the wait all
              over agian
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SelectAnItem({ userId }: { userId: string | undefined }) {
  const { data: wishlistItems, isLoading } = useWishlistItems();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { mutate: createCookItem } = useCreateCookItem();

  if (isLoading) return <div>Loading...</div>;

  const selectedWishlistItem = wishlistItems?.find(
    (item) => item.id === selectedItem
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h3 className="text-4xl italic tracking-tight text-balance font-light">
        Select an item to cook it
      </h3>
      <div className="max-w-3xl mt-10 border-2 border-dashed rounded-xs p-6">
        <Select
          onValueChange={(value) => setSelectedItem(value)}
          value={selectedItem || ""}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a wishlist item" />
          </SelectTrigger>
          <SelectContent>
            {wishlistItems?.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedWishlistItem && (
          <div className="mt-6">
            {selectedWishlistItem.imageUrl && (
              <img
                src={selectedWishlistItem.imageUrl}
                alt="Item Image"
                className="max-w-sm"
              />
            )}
            <h3 className="text-xl tracking-tight mt-4">
              {selectedWishlistItem.title}
            </h3>
            <p>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(selectedWishlistItem.price)}
            </p>
          </div>
        )}

        <Button
          className="mt-6 w-full"
          onClick={() => {
            createCookItem({
              userId: userId!,
              wishlistItemId: selectedItem!,
            });
          }}
          disabled={!selectedItem || !userId}
        >
          Cook Selected Item
        </Button>
      </div>
    </div>
  );
}
