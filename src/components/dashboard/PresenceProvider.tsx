"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PresenceProvider({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 5 minutes of inactivity before marking offline
  const INACTIVITY_LIMIT_MS = 5 * 60 * 1000;

  useEffect(() => {
    if (!userId) return;

    const updatePresence = (isOnline: boolean) => {
      // Use sendBeacon for reliable delivery when tab is closing/hidden
      const data = JSON.stringify({ userId, isOnline });
      navigator.sendBeacon("/api/presence", data);
    };

    // When the user leaves the tab/closes window
    const handlePageHide = () => {
      updatePresence(false);
    };

    // When visibility changes (tab switching)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // They switched tabs, 
        // let's give them 5 minutes of inactivity while hidden.
        inactivityTimerRef.current = setTimeout(() => {
          updatePresence(false);
        }, INACTIVITY_LIMIT_MS);
      } else {
        // They came back to the tab
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
          inactivityTimerRef.current = null;
        }
        // Ensure they are online again
        updatePresence(true);
      }
    };

    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial online presence when provider mounts
    updatePresence(true);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [userId, pathname]);

  return <>{children}</>;
}
