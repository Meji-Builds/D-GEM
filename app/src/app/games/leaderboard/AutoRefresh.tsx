"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This is meant to run unattended on a projected/display screen for the
// whole event, not just in an actively-watched foreground tab. Browsers
// throttle setInterval heavily once a tab is backgrounded or the screen
// locks (sometimes to once a minute or less), so the plain interval alone
// can silently fall behind — refresh immediately whenever the tab/window
// regains visibility or focus, on top of the regular interval.
export function AutoRefresh({ intervalMs = 15000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), intervalMs);

    function refreshIfVisible() {
      if (document.visibilityState === "visible") router.refresh();
    }

    document.addEventListener("visibilitychange", refreshIfVisible);
    window.addEventListener("focus", refreshIfVisible);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", refreshIfVisible);
      window.removeEventListener("focus", refreshIfVisible);
    };
  }, [router, intervalMs]);

  return null;
}
