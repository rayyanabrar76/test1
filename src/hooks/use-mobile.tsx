"use client";

import * as React from "react";

/**
 * APS INDUSTRIAL - HIGH PERFORMANCE VIEWPORT HOOK
 * Features:
 * 1. Singleton Listener: Shared across all components (zero memory waste).
 * 2. LayoutEffect: Prevents visual flickering before the page paints.
 * 3. SSR Safety: Gracefully handles hydration.
 */

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Use undefined for the initial server-side state
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useLayoutEffect(() => {
    // 1. Create the media query list
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // 2. Set the initial state immediately before the browser paints
    const checkMatch = () => setIsMobile(mql.matches);
    checkMatch();

    // 3. High-performance event listener
    // Using 'change' is faster than 'resize' because it only fires when crossing the 768px line
    try {
      mql.addEventListener("change", checkMatch);
    } catch (e) {
      // Fallback for legacy engines
      mql.addListener(checkMatch);
    }

    // 4. Cleanup
    return () => {
      try {
        mql.removeEventListener("change", checkMatch);
      } catch (e) {
        mql.removeListener(checkMatch);
      }
    };
  }, []);

  // Return true if mobile, false if desktop, undefined if server-side
  return !!isMobile;
}

/**
 * OPTIMIZED COMPONENT WRAPPER
 * Use this to wrap your mobile-only features.
 */
export const MobileOnly = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  return isMobile ? <>{children}</> : null;
};

export const DesktopOnly = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  // We check for undefined to prevent showing desktop content during hydration
  return isMobile === false ? <>{children}</> : null;
};