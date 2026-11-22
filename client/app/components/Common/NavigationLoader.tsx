"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";

interface NavigationContextType {
  isNavigating: boolean;
  startNavigation: () => void;
  stopNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  startNavigation: () => {},
  stopNavigation: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const prevPathnameRef = React.useRef(pathname);

  // Synchronously dismiss loader in the very same render commit when pathname changes
  // to eliminate any post-navigation pause or visual lag
  if (prevPathnameRef.current !== pathname) {
    prevPathnameRef.current = pathname;
    if (isNavigating) {
      setIsNavigating(false);
    }
  }

  const startNavigation = useCallback(() => {
    setIsNavigating(true);
  }, []);

  const stopNavigation = useCallback(() => {
    setIsNavigating(false);
  }, []);

  // Ensure loader is closed when pathname updates
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  // Safety fallback: auto-unlock after 3.5s in case of an error or navigation cancellation
  useEffect(() => {
    if (!isNavigating) return;
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, [isNavigating]);

  // Global link click interceptor
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external, hash, javascript, download, or new-tab links
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        target.getAttribute("target") === "_blank" ||
        target.hasAttribute("download") ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if it's an internal link
      const isInternal =
        href.startsWith("/") ||
        href.startsWith(window.location.origin);

      if (isInternal) {
        try {
          const targetUrl = new URL(href, window.location.origin);
          const currentUrl = new URL(window.location.href);

          // If navigating to the exact same pathname and search, skip loader
          if (
            targetUrl.pathname === currentUrl.pathname &&
            targetUrl.search === currentUrl.search
          ) {
            return;
          }

          // Trigger loading state immediately on link click
          setIsNavigating(true);
        } catch (_) {}
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
    };
  }, []);

  return (
    <NavigationContext.Provider
      value={{ isNavigating, startNavigation, stopNavigation }}
    >
      {/* Visual loader and instant full-screen click blocker */}
      {isNavigating && (
        <>
          {/* Full-screen click blocker to disable all components and prevent double-clicks */}
          <div
            className="fixed inset-0 z-[999999] cursor-wait bg-black/5 dark:bg-black/10 pointer-events-auto select-none"
            aria-hidden="true"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          />

          {/* Top animated glowing progress bar */}
          <div className="fixed top-0 left-0 right-0 h-[3px] z-[1000000] overflow-hidden bg-transparent">
            <div className="w-full h-full bg-gradient-to-r from-[#2190ff] via-[#37a39a] to-[#2190ff] animate-top-progress shadow-[0_0_10px_#37a39a]" />
          </div>

          {/* Floating indicator badge */}
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000000] flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 shadow-xl border border-gray-200 dark:border-gray-800 text-black dark:text-white text-xs font-Poppins font-medium pointer-events-none">
            <div className="w-3 h-3 border-2 border-[#37a39a] border-t-transparent rounded-full animate-spin shrink-0" />
            <span>Loading page...</span>
          </div>
        </>
      )}

      {children}
    </NavigationContext.Provider>
  );
};
