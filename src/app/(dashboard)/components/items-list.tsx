// items-list.tsx
import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getTimeToAfford } from "@/lib/price-to-time-calculation";
import { WishlistItem } from "@/service/wishlist-item/server/get-wishlist-items";
import { ArrowRight, Ellipsis } from "lucide-react";
import Link from "next/link";
import AddItemDialog from "./add-item-dialog";
import React from "react";
import ConfirmDeleteDialog from "./confirm-delete-dialog";

export type ItemsListProps = {
  readonly purchased: boolean;
  readonly items: WishlistItem[];
};

export default function ItemsList({ purchased, items }: ItemsListProps) {
  // Filter items based on purchased status
  const filteredItems = items.filter((item) => item.purchased === purchased);

  return (
    <div className="border-x border-dashed flex-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {filteredItems.map((item, index) => (
          <ItemCard key={item.id} index={index} item={item} />
        ))}
      </div>
    </div>
  );
}

const MONTHLY_INCOME_FROM_DB = 70000; // Example monthly income, replace with actual data source

export function ItemCard({
  index,
  item,
  preview = false,
}: {
  readonly item: WishlistItem;
  readonly index: number;
  readonly preview?: boolean;
}) {
  // Format price as currency
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(item.price);

  let monthlyIncome;

  if (preview) {
    monthlyIncome = 70000;
  } else {
    monthlyIncome = MONTHLY_INCOME_FROM_DB;
  }

  return (
    <div className="p-4">
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
      <div className="mt-4">
        <div className="flex items-center gap-2 justify-between">
          <h2 className="text-xl mb-1">{item.title}</h2>
          <ItemActions item={item} />
        </div>
        <DescriptionWithToolTip
          description={item.description || "No description"}
        />
        <p className="mt-1 text-base font-light">{formattedPrice}</p>
        <h3 className="font-semibold text-lg mt-2">
          {getTimeToAfford(item.price, monthlyIncome)} of your time
        </h3>
        {item.url && (
          <Link
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex text-sky-700 items-center gap-2 group"
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
