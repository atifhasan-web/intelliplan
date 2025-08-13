
"use client";

import { cn } from "@/lib/utils";

interface HamburgerIconProps {
  isOpen: boolean;
}

export function HamburgerIcon({ isOpen }: HamburgerIconProps) {
  return (
    <div className="relative w-5 h-5 flex flex-col items-center justify-center gap-1 transition-transform duration-300">
      <div
        className={cn(
          "w-full h-0.5 bg-foreground rounded-full transition-all duration-300",
          isOpen ? "rotate-45 translate-y-1.5" : "rotate-0"
        )}
      />
      <div
        className={cn(
          "w-full h-0.5 bg-foreground rounded-full transition-all duration-300",
          isOpen ? "opacity-0" : "opacity-100"
        )}
      />
      <div
        className={cn(
          "w-full h-0.5 bg-foreground rounded-full transition-all duration-300",
          isOpen ? "-rotate-45 -translate-y-1.5" : "rotate-0"
        )}
      />
    </div>
  );
}
