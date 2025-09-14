"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [onListPage, setOnListPage] = useState(false);

  useEffect(() => {
    setOnListPage(pathname.includes("/list"));
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
      <div>
        <Link href="/settings" className="hover:underline">
          Settings
        </Link>
      </div>
    </div>
  );
}
