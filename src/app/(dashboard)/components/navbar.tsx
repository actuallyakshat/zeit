"use client";

import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import { useAuth } from "@/context/AuthProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { signOut } = useAuth();
  const pathname = usePathname();
  const [onListPage, setOnListPage] = useState(false);
  const [onSettingsPage, setOnSettingsPage] = useState(false);

  useEffect(() => {
    setOnListPage(pathname.includes("/list"));
    setOnSettingsPage(pathname.includes("/settings"));
  }, [pathname]);

  return (
    <div className="flex items-center justify-between border border-dashed h-10 px-5 text-sm">
      <div>
        <Link href="/" className="hover:underline mr-4">
          Zeit
        </Link>
        {!onListPage && (
          <Link href="/list" className="hover:underline">
            Back to List
          </Link>
        )}
      </div>
      <div className="space-x-4">
        {onSettingsPage && (
          <button onClick={signOut} className="hover:underline">
            Logout
          </button>
        )}
        <Link href={"/cook"} className="hover:underline cursor-pointer">
          Cook
        </Link>
        <Link href="/settings" className="hover:underline">
          Settings
        </Link>
        <AnimatedThemeToggler />
      </div>
    </div>
  );
}
