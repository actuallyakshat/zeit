"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useRef, useState, useEffect } from "react";
import { flushSync } from "react-dom";

type props = {
  className?: string;
};

export const AnimatedThemeToggler = ({ className }: props) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const changeTheme = async () => {
    if (!buttonRef.current) return;

    const newTheme = theme === "dark" ? "light" : "dark";

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    }).ready;

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const y = top + height / 2;
    const x = left + width / 2;

    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRad}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  // Avoid rendering until mounted to prevent hydration mismatch
  if (!mounted) return null;

  return (
    <button
      ref={buttonRef}
      onClick={changeTheme}
      className={cn(className, "cursor-pointer hover:underline")}
    >
      {theme === "dark" ? <p>Light</p> : <p>Dark</p>}
    </button>
  );
};
