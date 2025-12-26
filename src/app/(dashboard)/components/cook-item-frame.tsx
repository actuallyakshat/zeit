"use client";

import { useAuth } from "@/context/AuthProvider";
import { getRemainingTimeToCook } from "@/lib/time-left-to-cook-calculation";
import {
  useCookingItem,
  useCreateCookItem,
  useDeleteCookItem,
} from "@/service/cook-item/cook-item";
import { useWishlistItems } from "@/service/wishlist-item/wishlist-item";

import { useEffect, useState } from "react";
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
import { Card } from "@/components/ui/card";
import { ArrowRight, Clock, Flame } from "lucide-react";
import Link from "next/link";

export default function CookItemFrame() {
  const { user } = useAuth();
  const { data, isLoading } = useCookingItem({ id: user?.id || "" });
  const { mutate: deleteCookItem } = useDeleteCookItem();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update countdown every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Check for completion and send email notification
  useEffect(() => {
    const checkAndNotify = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch("/api/cook-item/check-and-notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        });

        const result = await response.json();

        if (result.data?.isReady && result.data?.emailSent) {
          console.log("Item is ready and email notification sent!");
        }
      } catch (error) {
        console.error("Error checking cooking status:", error);
      }
    };

    // Check immediately on mount
    checkAndNotify();

    // Then check every 5 minutes
    const interval = setInterval(checkAndNotify, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user?.id]);

  if (isLoading)
    return (
      <div className="flex-1 flex py-8 text-muted-foreground">
        Loading your cooking item...
      </div>
    );

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

  const isReady = remainingTime.includes("Ready!");

  const handleDelete = () => {
    if (data) {
      deleteCookItem(data.cook_item.id);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col py-8">
      {/* Status Badge */}
      <div className="flex items-center gap-2 mb-6">
        <Flame
          className={`size-5 ${isReady ? "text-orange-500" : "text-muted-foreground"}`}
        />
        <span className="text-sm font-medium tracking-tight text-muted-foreground">
          {isReady ? "Cooking Complete" : "Currently Cooking"}
        </span>
      </div>

      {/* Main Card */}
      <Card className="w-full border-dashed border-2 py-0 overflow-hidden shadow-sm">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative aspect-square bg-accent/30">
            {data.wishlist_item.imageUrl ? (
              <img
                src={data.wishlist_item.imageUrl}
                alt={data.wishlist_item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground text-sm">No image</span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-normal tracking-tight mb-2">
                {data.wishlist_item.title}
              </h3>

              {data.wishlist_item.description && (
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {data.wishlist_item.description}
                </p>
              )}

              <p className="text-xl font-light mb-6">{formattedPrice}</p>

              {/* Countdown Display */}
              <div className="border border-dashed rounded-lg p-6 bg-accent/20 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    {isReady ? "Status" : "Time Remaining"}
                  </p>
                </div>
                <p
                  className={`text-3xl font-light tracking-tight ${isReady ? "text-green-600 dark:text-green-400" : ""}`}
                >
                  {remainingTime}
                </p>
              </div>

              <p className="text-xs text-muted-foreground">
                Cooking since{" "}
                {createdAt.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              {data.wishlist_item.url && (
                <Link
                  href={data.wishlist_item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm dark:text-sky-400 text-sky-700 group"
                >
                  View Item{" "}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              )}

              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full border-dashed"
                    size="sm"
                  >
                    Stop Cooking
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Stop Cooking This Item?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to stop cooking this item? You will
                      lose all progress and would have to restart the countdown
                      if you want to cook it again.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Yes, Stop Cooking
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function SelectAnItem({ userId }: { userId: string | undefined }) {
  const { data: wishlistItems, isLoading } = useWishlistItems();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { mutate: createCookItem } = useCreateCookItem();

  if (isLoading)
    return (
      <div className="flex-1 flex py-8 text-muted-foreground">
        Loading wishlist items...
      </div>
    );

  const selectedWishlistItem = wishlistItems?.find(
    (item) => item.id === selectedItem
  );

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col py-12">
        <Flame className="size-12 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-light tracking-tight mb-2">
          No Items to Cook
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Add items to your wishlist first before you can start cooking them.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col py-8">
      <div className="flex items-center gap-2 mb-6">
        <Flame className="size-5 text-muted-foreground" />
        <span className="text-sm font-medium tracking-tight text-muted-foreground">
          Start Cooking
        </span>
      </div>

      <Card className="w-full border-dashed border-2 p-8 shadow-sm">
        <h3 className="text-2xl font-light tracking-tight mb-6">
          Select an item to start cooking
        </h3>

        <div className="space-y-6">
          <Select
            onValueChange={(value) => setSelectedItem(value)}
            value={selectedItem || ""}
          >
            <SelectTrigger className="w-full border-dashed">
              <SelectValue placeholder="Choose from your wishlist" />
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
            <div className="border border-dashed rounded-lg p-6 bg-accent/20">
              <div className="grid md:grid-cols-[120px_1fr] gap-4 items-start">
                {selectedWishlistItem.imageUrl ? (
                  <img
                    src={selectedWishlistItem.imageUrl}
                    alt={selectedWishlistItem.title}
                    className="w-full aspect-square object-cover rounded"
                  />
                ) : (
                  <div className="w-full aspect-square bg-accent rounded flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">
                      No image
                    </span>
                  </div>
                )}

                <div>
                  <h4 className="text-xl font-normal tracking-tight mb-2">
                    {selectedWishlistItem.title}
                  </h4>
                  {selectedWishlistItem.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {selectedWishlistItem.description}
                    </p>
                  )}
                  <p className="text-lg font-light">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(selectedWishlistItem.price)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              createCookItem({
                userId: userId!,
                wishlistItemId: selectedItem!,
              });
            }}
            disabled={!selectedItem || !userId}
          >
            Start Cooking
          </Button>
        </div>
      </Card>
    </div>
  );
}
