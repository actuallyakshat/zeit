"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthProvider";
import { getTimeToAffordRouter } from "@/lib/price-to-time-calculation";
import { ArrowRight, Ellipsis } from "lucide-react";
import Link from "next/link";
import React from "react";
import AddItemDialog from "./add-item-dialog";
import ConfirmDeleteDialog from "./confirm-delete-dialog";
import { WishlistItem } from "@/service/wishlist-item/wishlist-item";

export function ItemCard({
  index,
  item,
  preview = false,
}: {
  readonly item: WishlistItem;
  readonly index: number;
  readonly preview?: boolean;
}) {
  const { user } = useAuth();

  // Format price as currency
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(item.price);

  let monthlyIncome;
  const numberOfWorkingDays = user?.useWorkingDaysForCalculation
    ? user?.numberOfWorkingDays || undefined
    : undefined;

  if (preview) {
    monthlyIncome = 70000;
  } else {
    monthlyIncome = user?.monthlyIncome;
  }

  return (
    <div className="py-4 px-3">
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full aspect-square object-cover"
        />
      ) : (
        <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No image</span>
        </div>
      )}
      <div className="mt-2.5">
        <div className="flex items-center gap-2 justify-between">
          <h2 className="text-xl mb-1">{item.title}</h2>
          {!preview && <ItemActions item={item} />}
        </div>
        <DescriptionWithToolTip
          description={item.description || "No description"}
        />
        <p className="mt-1 text-base font-light">{formattedPrice}</p>
        <h3 className="font-medium mt-2">
          {getTimeToAffordRouter(
            item.price,
            Number(monthlyIncome) || 0,
            numberOfWorkingDays
          )}{" "}
          {`of your ${numberOfWorkingDays ? "working" : ""} time`}
        </h3>
        {item.url && (
          <Link
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex dark:text-sky-400 text-sky-700 items-center gap-2 group"
          >
            View Item{" "}
            <ArrowRight
              size={"14"}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        )}
      </div>
    </div>
  );
}

function DescriptionWithToolTip({
  description,
}: {
  readonly description?: string;
}) {
  const text = description || "No description";

  return (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <p className="text-muted-foreground text-sm min-h-[40px] line-clamp-2 cursor-default">
            {text}
          </p>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm break-words">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ItemActions({ item }: { readonly item: WishlistItem }) {
  return (
    <Popover>
      <PopoverTrigger>
        <Ellipsis className="stroke-1 size-5" />
      </PopoverTrigger>
      <PopoverContent className="p-0 w-40">
        <div className="flex flex-col gap-1">
          <AddItemDialog
            isEdit
            item={item}
            customTrigger={<EditItemDialogTrigger item={item} />}
          />
          <ConfirmDeleteDialog
            itemId={item.id}
            customTrigger={<DeleteItemDialogTrigger item={item} />}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

const ItemActionsButton = React.forwardRef<
  HTMLButtonElement,
  {
    item: WishlistItem;
    children: React.ReactNode;
    onClick?: () => void;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ item, children, onClick, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className="hover:bg-accent text-sm font-medium text-left py-1.5 px-3 w-full"
      onClick={onClick}
    >
      {children}
    </button>
  );
});

const EditItemDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  { item: WishlistItem }
>(({ item, ...props }, ref) => {
  return (
    <ItemActionsButton item={item} ref={ref} {...props}>
      Edit
    </ItemActionsButton>
  );
});

const DeleteItemDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  { item: WishlistItem }
>(({ item, ...props }, ref) => {
  return (
    <ItemActionsButton item={item} ref={ref} {...props}>
      Delete
    </ItemActionsButton>
  );
});

//display name
DeleteItemDialogTrigger.displayName = "DeleteItemDialogTrigger";
EditItemDialogTrigger.displayName = "EditItemDialogTrigger";
ItemActionsButton.displayName = "ItemActionsButton";
