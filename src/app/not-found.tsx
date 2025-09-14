import { Button } from "@/components/ui/button";
import { SeparatorBorder } from "@/components/ui/seperator";
import Link from "next/link";
import React from "react";

export default function NotFoundPage() {
  return (
    <div className="h-screen border-x border-dashed mx-auto max-w-screen-xl flex flex-col items-center justify-between">
      <SeparatorBorder className="h-[30%]" />
      <div className="flex items-center justify-center flex-col px-4">
        <h1 className="text-5xl text-center tracking-tight text-balance">
          Sorry Rodeo
        </h1>
        <p className="text-center text-2xl mt-3 text-muted-foreground">
          The page you are looking for does not exist.
        </p>
        <Button asChild variant={"outline"} className="mt-6">
          <Link href="/" className="mt-6 px-4 py-2.5 bg-accent shadow rounded">
            Let's get you home safely
          </Link>
        </Button>
      </div>
      <SeparatorBorder className="h-[30%]" />
    </div>
  );
}
