
"use client";

import { type ReactNode, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { SearchProvider } from "@/hooks/use-search";
import { TaskProvider } from "@/hooks/use-tasks";
import { PomodoroProvider } from "@/hooks/use-pomodoro";
import Loading from "./loading";
import { useSession } from "@/hooks/use-session";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const { loading: isSessionLoading } = useSession();
  const navClicked = useRef(false);

  useEffect(() => {
    if (navClicked.current) {
        setIsNavigating(false);
        navClicked.current = false;
    }
  }, [pathname]);

  const handleLinkClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor) {
      const href = anchor.getAttribute('href');
      // Show loader immediately if it's an internal navigation link
      // and not the current page
      if (href && href.startsWith('/') && href !== pathname) {
        navClicked.current = true;
        setIsNavigating(true);
      }
    }
  };
  
  // We only show the navigation loader if a navigation is happening AND the initial session isn't loading.
  const showNavLoader = isNavigating && !isSessionLoading;

  return (
    <SearchProvider>
      <TaskProvider>
        <PomodoroProvider>
          {showNavLoader && <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"><Loading /></div>}
          <div className="flex min-h-screen w-full flex-col bg-muted/40" onClickCapture={handleLinkClick}>
            <AppSidebar />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
              <AppHeader />
              <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                {children}
              </main>
            </div>
          </div>
        </PomodoroProvider>
      </TaskProvider>
    </SearchProvider>
  );
}
