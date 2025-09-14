"use client";
import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export default function CTAButton() {
  const { isSignedIn } = useClerk();

  const path = isSignedIn ? "/list" : "/signin";

  return (
    <Button asChild>
      <Link href={path} className="flex items-center gap-2">
        Make your wishlist <ArrowRightIcon className="w-4 h-4" />
      </Link>
    </Button>
  );
}
